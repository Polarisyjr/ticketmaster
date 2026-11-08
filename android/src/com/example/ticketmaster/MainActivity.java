package com.example.ticketmaster;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.setStatusBarColor(Color.parseColor("#0B0B0B"));
        window.setNavigationBarColor(Color.parseColor("#0B0B0B"));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            window.getDecorView().setSystemUiVisibility(0);
        }

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#0B0B0B"));
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString(settings.getUserAgentString() + " TicketmasterAndroid/1.0");

        webView.setWebViewClient(new AppWebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        setContentView(webView);
        webView.loadUrl("file:///android_asset/www/index.html#/home");
    }

    private static class AppWebViewClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return openExternal(request.getUrl(), view.getContext());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return openExternal(Uri.parse(url), view.getContext());
        }

        private boolean openExternal(Uri uri, Context context) {
            if (uri == null) {
                return true;
            }
            String scheme = uri.getScheme();
            if ("file".equals(scheme)) {
                return false;
            }
            if ("http".equals(scheme) || "https".equals(scheme)
                    || "mailto".equals(scheme) || "tel".equals(scheme)) {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                    context.startActivity(intent);
                } catch (Exception ignored) {
                    // No app is available to handle this link.
                }
                return true;
            }
            return true;
        }
    }


    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
