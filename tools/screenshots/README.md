# 文档截图工具

文档站里的截图都在这儿生成，产出直接落到 `public/screenshots/`，页面用 `<doc-shot>` 引用。

分两类：**网页面板**（mytv-panel 的界面）和**应用本体**（电视端 UI，走 adb 截图）。

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
$ADB shell am start -n com.github.mytv.android/top.yogiczy.mytv.tv.MainActivity

# 4. 截图（导航见下）
$ADB exec-out screencap -p > /tmp/app-raw/00-launch.png
```

导航方式（电视 UI，`input tap` 的坐标按 1920×1080 屏幕）：

```bash
# 直接点某个图标：先截一张，量出目标图标的中心坐标
$ADB shell input tap <x> <y>

# 列表滚动：从下往上滑（settings 之类的长列表）
$ADB shell input swipe 960 800 960 400 300

# 方向键 / 返回
$ADB shell input keyevent KEYCODE_DPAD_DOWN
$ADB shell input keyevent KEYCODE_BACK
```

首页「导航」网格 1920×1080 下的图标中心：直播 (1280,300)、全部频道 (1480,290)、收藏 (1686,290)、
节目单 (1280,443)、搜索 (1480,440)、设置 (1686,440)、多屏同播 (1280,607)、推送 (1480,605)、关于 (1686,607)。
设置页二级分类（y 坐标按行）：第 1 行 y≈264、第 2 行 y≈495、第 3 行 y≈735；
列坐标：x≈240 / 534 / 831 / 1128 / 1425 / 1719。

### 截图前先清场

模拟器里的应用数据可能是上次测试留下的，截图前检查并处理：

- 订阅源列表里如果有**个人地址 / 令牌**，改数据或裁掉那一行，别带进文档；
- 播放器上的调试浮层（帧率、解码信息）要在 设置 → 调试 里关掉；
- 收藏、最近观看这类列表会带真实频道名，一般没问题。

## 出图

`crop-mark.py` 里两张表：`PANEL_JOBS`、`APP_JOBS`。每项是
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
