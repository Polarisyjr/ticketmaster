#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SDK="${ANDROID_SDK_ROOT:-/tmp/android-sdk}"
BUILD_TOOLS="$SDK/build-tools/34.0.0"
PLATFORM="$SDK/platforms/android-34/android.jar"
WORK="/tmp/ticketmaster-apk-build"
KEYSTORE="/tmp/ticketmaster-debug.keystore"

if [[ ! -x "$BUILD_TOOLS/aapt2" || ! -f "$PLATFORM" ]]; then
  echo "Android SDK not found at $SDK (need platforms;android-34 and build-tools;34.0.0)" >&2
  exit 1
fi

rm -rf "$WORK"
mkdir -p "$WORK/compiled" "$WORK/gen" "$WORK/classes" "$WORK/dex" "$WORK/assets/www" "$ROOT/download"

# Package the mobile web experience as the WebView's local site.
cp -r "$ROOT/index.html" "$ROOT/styles.css" "$ROOT/app.js" "$ROOT/sw.js" \
  "$ROOT/manifest.webmanifest" "$ROOT/icons" "$ROOT/assets" "$WORK/assets/www/"

"$BUILD_TOOLS/aapt2" compile --dir "$ROOT/android/res" -o "$WORK/compiled/res.zip"
"$BUILD_TOOLS/aapt2" link \
  -o "$WORK/app-unsigned.apk" \
  -I "$PLATFORM" \
  --manifest "$ROOT/android/AndroidManifest.xml" \
  "$WORK/compiled/res.zip" \
  --java "$WORK/gen" \
  -A "$WORK/assets" \
  --min-sdk-version 23 \
  --target-sdk-version 34 \
  --version-code 1 \
  --version-name 1.0.0

javac -source 8 -target 8 -Xlint:-options \
  -bootclasspath "$PLATFORM" \
  -classpath "$PLATFORM" \
  -d "$WORK/classes" \
  $(find "$ROOT/android/src" "$WORK/gen" -name '*.java')

"$BUILD_TOOLS/d8" --lib "$PLATFORM" --min-api 23 --output "$WORK/dex" \
  $(find "$WORK/classes" -name '*.class')

(
  cd "$WORK/dex"
  zip -q -j "$WORK/app-unsigned.apk" classes.dex
)

"$BUILD_TOOLS/zipalign" -f 4 "$WORK/app-unsigned.apk" "$WORK/app-aligned.apk"

if [[ ! -f "$KEYSTORE" ]]; then
  keytool -genkeypair -v \
    -keystore "$KEYSTORE" \
    -alias ticketmaster \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass android -keypass android \
    -dname "CN=Ticketmaster Demo, O=Demo, C=US" >/dev/null 2>&1
fi

"$BUILD_TOOLS/apksigner" sign \
  --ks "$KEYSTORE" \
  --ks-pass pass:android \
  --key-pass pass:android \
  --out "$ROOT/download/Ticketmaster.apk" \
  "$WORK/app-aligned.apk"

"$BUILD_TOOLS/apksigner" verify --verbose "$ROOT/download/Ticketmaster.apk"
ls -lh "$ROOT/download/Ticketmaster.apk"
