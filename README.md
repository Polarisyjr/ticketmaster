# Ticketmaster Mobile — 前端复刻

一个可直接在浏览器打开、也可以安装/下载到 Android 的 Ticketmaster 前端 Demo。

## 页面

| 页面 | 实现 |
| --- | --- |
| Home | 使用你提供的首页截图直接铺满屏幕，底部四个 tab 全部可点击 |
| Watchlist | 使用你提供的 Watchlist 截图直接铺满屏幕，底部四个 tab 全部可点击 |
| My Tickets | 按参考图实现的票卡页面，可上下滚动；Upcoming 里包含 SEMIS 1 / SEMIS 2 两张同款票卡，含 Upcoming / Past、Help 与日历按钮 |
| Account | 原生 HTML/CSS 实现的账户页，含会员卡、安装 PWA、APK 下载、账户菜单 |

主页和 Watchlist 的截图已经去掉 iOS 状态栏，并把底部导航保留在画面中。正常比例的手机上直接点击图中导航即可跳转；在较矮的屏幕（例如 375×667）会自动切换成可点击的实时导航栏，避免截图顶部被裁切。

## 在线运行

```bash
cd /home/yjrcs/ticketmaster
python3 -m http.server 4173 --bind 0.0.0.0
```

打开：<http://127.0.0.1:4173/>（Windows 浏览器可直接访问）。

## 下载 Android APK

- APK：`download/Ticketmaster.apk`（约 800 KB，Android 6.0+，WebView 套壳）
- 在网页的 **Account → Install → Download Android APK** 也可以下载。
- 这是 debug 签名的演示包；安装时需允许“安装未知来源应用”。
- My Tickets 页面可向下滚动查看第二张 SEMIS 2 票卡。
- 点击任一张票卡的 **View Tickets** 进入可滚动的票务详情页：顶部活动图、订单、两张 Verified Resale Ticket、地图、Get Directions，以及固定底部 Upgrade / Transfer / Sell 操作条。

APK 内嵌了同一套页面和图片，首次打开无需联网。

## 安装为 PWA

用 Chrome / Edge 打开网页：

1. 点击地址栏右侧的安装图标，或打开浏览器菜单。
2. 选择 **Install app** / **安装应用**（Android 上为“添加到主屏幕”）。
3. 安装后可全屏运行，Service Worker 会缓存页面，支持离线打开。

## 目录

```
index.html              入口
styles.css              视觉与响应式布局
app.js                  路由、四个 tab、票务/账户页、二维码、安装逻辑
manifest.webmanifest    PWA 配置
sw.js                   Service Worker 离线缓存
assets/screens/         Home / Watchlist 截图
assets/img/             票卡与活动图片
assets/fonts/           Inter 字体
icons/                  PWA 图标
download/Ticketmaster.apk
android/                Android WebView 工程与打包脚本
```

## 说明

- 纯前端，无后端、无真实购票/支付/转票接口。
- 二维码为前端生成的演示图案，不能用于入场。
- 仅用于界面复刻与学习，Ticketmaster 名称及原始截图/活动素材版权归其权利人所有。

## 重新打包 APK

需要 JDK 17+、Android SDK `platforms;android-34` 与 `build-tools;34.0.0`：

```bash
export ANDROID_SDK_ROOT=/path/to/android-sdk
./android/build-apk.sh
```

输出会覆盖 `download/Ticketmaster.apk`。
