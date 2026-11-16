"""把原始截图裁掉空白、在关键项上画红框，输出到文档站的 public/screenshots/。

    python tools/screenshots/crop-mark.py panel  <raw_dir> <out_dir>
    python tools/screenshots/crop-mark.py app    <raw_dir> <out_dir>

每项：输出名 -> (源图名, 裁剪框(x0,y0,x1,y1), 标注框列表, 输出宽度)。
标注框格式 (x, y, w, h)：
  space='source'（默认）用原图坐标，脚本自动减去裁剪偏移；
  space='image' 用裁剪后的图片坐标——面板对话框内部元素的原图坐标会随内容长度浮动，
  实测按原图坐标画会偏，这类图直接按裁剪后坐标标。

应用截图（1920×1080）默认缩到 1280 宽再存，减小体积；面板截图本来就是列宽，保持原样。
"""

import os
import sys

from PIL import Image, ImageDraw

MARK = (255, 82, 82)

# —— 网页面板（1400 宽）——
# 裁剪框按 2026-11-16 的面板重新量过：侧边栏收窄成 4 组 13 项，内容卡片从
# x≈429..1218（789 宽）变成 x≈394..1250（856 宽），页名也从 /sources、/ui、
# /services 等改成了 /source、/channels、/cast（旧的都做了重定向）。
PANEL_JOBS = {
    # 首页：关于应用 + 订阅源两张卡片
    'panel-home': ('panel-home', (394, 60, 1250, 700), [], 1400),
    # 订阅源与节目单页：页头 + 「订阅源」卡片
    'panel-sources': ('panel-sources', (394, 60, 1250, 640), [], 1400),
    # 编辑订阅源对话框（整张只截对话框，四周留 10px）
    'panel-source-dialog': ('panel-source-dialog', (440, 20, 960, 800),
                            [(35, 77, 228, 68), (47, 601, 183, 35), (311, 601, 194, 35)], 1400, 'image'),
    'panel-source-dialog-plain': ('panel-source-dialog', (440, 20, 960, 800), [], 1400),
    # 播放页：页头 + 「常用」卡片（画面滤镜之前）
    'panel-player-basic': ('panel-player-basic', (394, 55, 1250, 445), [], 1400),
    # 播放页往下：「播不了或卡顿时」整张卡片
    'panel-player-startup': ('panel-player-basic', (394, 685, 1250, 965),
                             [(30, 30, 500, 62), (30, 160, 500, 96)], 1400),
    'panel-player-network': ('panel-player-network', (394, 60, 1250, 680), [], 1400),
    'panel-player-translation': ('panel-player-translation', (394, 60, 1250, 1090), [], 1400),
    'panel-services': ('panel-services', (394, 60, 1250, 670), [], 1400),
    'panel-ui': ('panel-ui', (394, 60, 1250, 620), [], 1400),
    'panel-sync': ('panel-sync', (394, 60, 1250, 745), [], 1400),
    # 节目单已并入「订阅源与节目单」页，取「订阅源」卡片下面那段
    'panel-epg': ('panel-sources', (394, 480, 1250, 1120), [], 1400),
}

# —— 应用本体（1920×1080）——
APP_JOBS = {
    'app-dashboard': ('00-launch', (0, 0, 1920, 1080), [], 1280),
    'app-channels': ('07-allch', (0, 0, 1920, 1080), [], 1280),
    'app-settings': ('08-settings', (0, 0, 1920, 1080), [], 1280),
    'app-player-top': ('14-player-key', (0, 0, 1920, 1080), [], 1280),
    # 同一页往下滚：起播相关的项在「播不了或卡顿时」小节里，裁掉上面的「常用」卡片
    'app-player-startup': ('31-player-scroll1', (0, 225, 1920, 752), [], 1280),
    'app-sources': ('15-source-list', (0, 0, 1920, 890), [], 1280),
    # 列表往下是空的，裁到「添加聚合配置」为止；这张只取页头 + 第一条，用来看单行的字段
    'app-sources-custom': ('16-source-custom', (0, 0, 1920, 400), [], 1280),
    'app-ui': ('17-ui', (0, 0, 1920, 1080), [], 1280),
    'app-control': ('22-control', (0, 0, 1920, 1080), [], 1280),
    'app-components': ('23-components', (0, 0, 1920, 1080), [], 1280),
    # —— 以下为后补的图，都是全幅不裁 ——
    'app-epg-guide': ('24-epg-guide', (0, 0, 1920, 1080), [], 1280),
    'app-multiview': ('25-multiview', (0, 0, 1920, 1080), [], 1280),
    'app-multiview-menu': ('26-multiview-menu', (0, 0, 1920, 1080), [], 1280),
    'app-channel-temp': ('27-channel-temp', (0, 0, 1920, 1080), [], 1280),
    'app-channel-classic': ('28-classic-panel', (0, 0, 1920, 1080), [], 1280),
    'app-search': ('29-search', (0, 0, 1920, 1080), [], 1280),
    # 按钮排是横向滚动的 LazyRow，一屏放不下全部按钮；裁到「自动解码」之后，
    # 让最后一根分隔线暗示右侧还有，比把某个按钮切成半截干净
    'app-quick-op': ('30-quick-op', (0, 0, 1740, 1080), [], 1280),
}


def mark(im, boxes, origin):
    overlay = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    ox, oy = origin
    for (x, y, w, h) in boxes:
        box = (x - ox - 6, y - oy - 6, x - ox + w + 6, y - oy + h + 6)
        d.rounded_rectangle(box, radius=10, fill=MARK + (38,), outline=MARK + (235,), width=3)
    return Image.alpha_composite(im.convert('RGBA'), overlay).convert('RGB')


def main():
    which = sys.argv[1] if len(sys.argv) > 1 else 'panel'
    raw = sys.argv[2] if len(sys.argv) > 2 else 'raw'
    out_dir = sys.argv[3] if len(sys.argv) > 3 else 'out'
    jobs = PANEL_JOBS if which == 'panel' else APP_JOBS
    os.makedirs(out_dir, exist_ok=True)

    for name, spec in jobs.items():
        src, crop, boxes, width = spec[0], spec[1], spec[2], spec[3]
        space = spec[4] if len(spec) > 4 else 'source'
        path = f'{raw}/{src}.png'
        if not os.path.exists(path):
            print('skip (缺失)', name)
            continue
        im = Image.open(path).convert('RGB').crop(crop)
        if boxes:
            im = mark(im, boxes, (0, 0) if space == 'image' else (crop[0], crop[1]))
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        dst = f'{out_dir}/{name}.png'
        im.save(dst, optimize=True)
        print(name, im.size, round(os.path.getsize(dst) / 1024), 'KB')


if __name__ == '__main__':
    main()
