# 文档截图工具

文档站里的截图都在这儿生成，产出直接落到 `public/screenshots/`，页面用 `<doc-shot>` 引用。

分三类：**网页面板**（mytv-panel 的界面）、**应用本体**（电视端 UI，走 adb 截图）、**手机竖屏**（同一个 App 的竖屏界面，也是 adb 截图）。

三类共用一个假数据服务 `doc-fixture-server.mjs`：给应用的「订阅源」「节目单」喂 75 个频道 + XMLTV，脱离它截图只能拍到空列表和「暂无节目单」。

## 假数据（应用本体 + 手机竖屏都要用）

```bash
node tools/screenshots/doc-fixture-server.mjs      # 默认 http://localhost:18770
```

在应用的「订阅源」里填 `http://10.0.2.2:18770/all.m3u`，「节目单」里填 `http://10.0.2.2:18770/epg.xml`。
`10.0.2.2` 是模拟器视角的宿主机。频道名与台标取自 gitee 上的 myTVlogo 仓库，直播地址用公开 HLS 测试流，
每个频道发 3 条线路（频道卡出「线路数」角标、线路抽屉有实测延迟），不涉及任何个人订阅源或令牌。

## 网页面板

面板是纯前端，脱离电视时 `/api/*` 全 404，页面会是空的，所以先用假数据把它跑起来：

```bash
# 1. 起假数据服务（默认 http://localhost:10592）
#    数据取自 mytv-panel 的 src/app/api.ts：枚举取第一个成员，其余按类型给默认值，
#    再叠加脚本里的 OVERRIDES（订阅源、节目单、服务等示例数据）
node tools/screenshots/panel-mock-server.mjs

# 2. 无头 Chrome 逐页截图（列表见 panel-pages.json）
node tools/screenshots/capture.mjs http://localhost:10592 \
     tools/screenshots/panel-pages.json /tmp/panel-raw

# 3. 裁剪 + 红框标注
python tools/screenshots/crop-mark.py panel /tmp/panel-raw public/screenshots
```

改了 `mytv-panel` 的界面之后重新 `npm run build`（脚本读的是 `dist/mytv-panel/browser`），再走一遍上面三步。

`panel-mock-server.mjs` 用环境变量指定路径：`PANEL_DIST`、`PANEL_API_SRC`、`PORT`。

## 应用本体（电视端）

不在本地编译应用，用 CI 产出的 APK 装进 TV 模拟器截图：

```bash
ADB=~/AppData/Local/Android/Sdk/platform-tools/adb.exe
EMU=~/AppData/Local/Android/Sdk/emulator/emulator.exe

# 1. 起模拟器（用 x86 的 AVD，对应 x86 包）
$EMU -avd Television_1080p -no-snapshot -no-boot-anim &
$ADB wait-for-device && $ADB shell getprop sys.boot_completed   # 等到输出 1

# 2. 装 CI 产出的包
$ADB install -r output/apk/mytv-android-tv-<版本>-x86-sdk23-original.apk

# 3. 启动
$ADB shell am start -n com.github.mytv.android/com.github.mytv.android.MainActivity

# 4. 截图（导航见下）
$ADB exec-out screencap -p > /tmp/app-raw/00-launch.png
```

电视端 activity 是 `.MainActivity`；手机端（同一个包，x86_64）也是 `.MainActivity`
（旧文档里的 `top.yogiczy.mytv.tv.MainActivity` 已经没有了）。

### 界面语言

模拟器系统语言默认是英文，而 App 的语言是**应用内设置**（设置 → 通用 → 语言 → 中文），
跟系统语言无关。截图前先改成中文，否则一半字符串是英文（只有翻过的才显示中文）。

### 导航方式

**首页「导航」九宫格只响应遥控器按键，`input tap` 无效**（Compose 的 `handleKeyEvents`）。
进首页时焦点默认在「直播」：

```bash
$ADB shell input keyevent KEYCODE_DPAD_RIGHT    # / DOWN / LEFT / UP
$ADB shell input keyevent KEYCODE_DPAD_CENTER   # OK
$ADB shell input keyevent --longpress KEYCODE_DPAD_CENTER   # 长按 OK
```

**设置页的分类网格 `input tap` 有效**，1920×1080 下的中心坐标：

```bash
# 首页导航（行1 直播/全部频道/收藏，行2 节目单/搜索/设置，行3 多屏同播/推送/关于）
# 设置分类：行1 y=310（通用 244 / 订阅源 530 / 服务 818 / 节目单 1105 / 界面 1391 / 主题 1677）
#            行2 y=550（控制 244 / 播放器 530 / 组件下载 817 / WebView 1105 / 更新 1391 / 网络 1677）
#            行3 y=790（云同步 243 / 权限 531 / 调试 818 / 日志 1105）
$ADB shell input tap 1391 310      # 例：打开「界面」
```

拿不准位置就用 `uiautomator dump`（Compose 的语义树能拿到 text 和 bounds）：

```bash
MSYS_NO_PATHCONV=1 $ADB shell uiautomator dump /sdcard/ui.xml
MSYS_NO_PATHCONV=1 $ADB pull /sdcard/ui.xml ./ui.xml
```

列表滚动（settings 之类的长列表）用从下往上滑：

```bash
$ADB shell input swipe 960 800 960 400 300
```

### 配数据不用手点

App 常驻一个 Web Panel（端口 10591），`adb forward` 之后可以直接从宿主机推订阅源/节目单，
比在电视上敲 URL 快得多，中文名也不会乱码：

```bash
$ADB -s emulator-5554 forward tcp:10591 tcp:10591
curl -X POST -H 'Content-Type: application/json' \
     -d '{"name":"文档测试源","type":"url","url":"http://10.0.2.2:18790/all.m3u","filePath":"","content":""}' \
     http://127.0.0.1:10591/api/iptv-source/push
curl -X POST -H 'Content-Type: application/json' \
     -d '{"name":"文档节目单","url":"http://10.0.2.2:18790/epg.xml"}' \
     http://127.0.0.1:10591/api/epg-source/push
```

注意 slirp 网络下宿主机够不到模拟器 IP，必须走 `adb forward`。`curl -d` 里带中文要先写进文件
再用 `--data-binary @文件`，否则 Git Bash 会插乱码。

### 出图

```bash
python tools/screenshots/crop-mark.py app /tmp/app-raw public/screenshots
```

## 手机竖屏

采集方式同上，只是 AVD 换成 `Phone_Portrait_Test`（x86_64，1080×2400），
操作用 `input tap`（触屏，坐标按 1080×2400）。界面语言同样在 设置 → 通用 → 语言 里改。

```bash
python tools/screenshots/crop-portrait.py /tmp/portrait-raw public/screenshots
```

`crop-portrait.py` 里两张表：`PORTRAIT_JOBS`（单屏，整张 1080×2400 缩到 540×1200）和
`PORTRAIT_PAIRS`（成对对比，左 540 + 12px 黑缝 + 右 540 = 1092×1200）。
成对图的两半就是两张单屏素材，一次拍好三处复用。

### 截图前先清场

模拟器里的应用数据可能是上次测试留下的，截图前检查并处理：

- 订阅源列表里如果有**个人地址 / 令牌**，改数据或裁掉那一行，别带进文档；
- 播放器上的调试浮层（帧率、解码信息）要在 设置 → 调试 里关掉；
- 收藏、最近观看这类列表会带真实频道名，一般没问题。

## 出图

三个脚本各管一类：`crop-mark.py panel`（网页面板）、`crop-mark.py app`（电视端）、
`crop-portrait.py`（手机竖屏）。`crop-mark.py` 里两张表：`PANEL_JOBS`、`APP_JOBS`，每项是
`输出名: (源图, 裁剪框, 标注框列表, 输出宽度)`：

- 裁剪框 `(x0, y0, x1, y1)` 用源图坐标，用来去掉两侧空白和无关行；
- 标注框 `(x, y, w, h)` 画红色圆角框；默认按源图坐标，第 5 项写 `'image'` 则按裁剪后坐标
  （面板对话框内部元素用源图坐标会偏，实测只能按裁剪后坐标标）；
- 应用截图（1920×1080）统一缩到 1280 宽再存。

## 页面里怎么用

```html
<doc-shot
  src="screenshots/panel-sources.png"
  alt="网页面板订阅源页"
  caption="面板 → 订阅源页：行尾 ⋮ 是上移 / 下移 / 编辑 / 删除。"
/>
```

路径不加前导斜杠（和 `app-icon.png` 一样，靠 base-href 解析，GitHub Pages 子路径下才对）。

**不要给 `<doc-shot>` 加 `loading="lazy"`**：文档站内容区是内层滚动容器，懒加载不触发，图会一直空着。
