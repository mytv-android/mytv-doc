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
PANEL_JOBS = {
    'panel-home': ('panel-home', (60, 0, 1340, 1330), [], 1400),
    'panel-sources': ('panel-sources', (290, 150, 1110, 700), [], 1400),
    'panel-source-dialog': ('panel-source-dialog', (430, 70, 970, 830),
                            [(83, 345, 355, 78), (85, 597, 145, 52), (228, 597, 258, 52)], 1400, 'image'),
    'panel-source-dialog-plain': ('panel-source-dialog', (430, 70, 970, 830), [], 1400),
    'panel-player-basic': ('panel-player', (380, 120, 995, 900), [], 1400),
    'panel-player-startup': ('panel-player', (380, 1420, 995, 2110),
                             [(395, 1468, 585, 92), (395, 1924, 585, 92)], 1400),
    'panel-player-network': ('panel-player', (380, 2740, 995, 3260),
                             [(395, 3052, 585, 68)], 1400),
    'panel-epg': ('panel-epg', (400, 60, 1000, 580), [], 1400),
    'panel-services': ('panel-services', (300, 60, 1110, 800), [], 1400),
    'panel-ui': ('panel-ui', (290, 60, 1110, 580), [], 1400),
    'panel-sync': ('panel-sync', (400, 60, 1110, 890), [], 1400),
}

# —— 应用本体（1920×1080）——
APP_JOBS = {
    'app-dashboard': ('00-launch', (0, 0, 1920, 1080), [], 1280),
    'app-channels': ('07-allch', (0, 0, 1920, 1080), [], 1280),
    'app-settings': ('08-settings', (0, 0, 1920, 1080), [], 1280),
    'app-player-top': ('09-player', (0, 0, 1920, 1080), [], 1280),
    'app-player-startup': ('14-player-key', (0, 0, 1920, 1080),
                           [(40, 106, 1840, 236)], 1280),
    'app-sources': ('15-source-list', (0, 0, 1920, 1080), [], 1280),
    # 裁掉最后一行的个人源地址，只保留通用内容
    'app-sources-custom': ('16-source-custom', (0, 40, 1920, 600), [], 1280),
    'app-ui': ('17-ui', (0, 0, 1920, 1080),
               [(40, 780, 1840, 96), (40, 898, 1840, 166)], 1280),
    'app-control': ('22-control', (0, 0, 1920, 1080), [], 1280),
    'app-components': ('23-components', (0, 0, 1920, 1080), [], 1280),
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
