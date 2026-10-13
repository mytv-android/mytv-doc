"""把手机竖屏原始截图转成文档站用的图。

    python tools/screenshots/crop-portrait.py <raw_dir> <out_dir>

手机模拟器物理分辨率 1080x2400，直接缩到 540x1200（2:1）就是单屏图；
成对对比图是「左 540 + 12px 黑缝 + 右 540」= 1092x1200。

两张表：
  PORTRAIT_JOBS  输出名 -> 单个源图名（缩到 540x1200）
  PORTRAIT_PAIRS 输出名 -> (左源图名, 右源图名)（拼成 1092x1200）

和 crop-mark.py 的关系：那张管网页面板和电视端，这张管手机竖屏。
"""

import os
import sys

from PIL import Image

SINGLE_W = 540
GAP = 12
GAP_COLOR = (0, 0, 0)

# 输出名 -> 源图名（不含 .png）
PORTRAIT_JOBS = {
    'portrait-dashboard': '00-dashboard',
    'portrait-player': '20-player',
    'portrait-player-more': '21-player-more',
    'portrait-sheet-lines': '22-sheet-lines',
    'portrait-sheet-aspect': '23-sheet-aspect',
    'portrait-channels': '30-channels',
    'portrait-epg': '31-epg',
    'portrait-search': '32-search',
    'portrait-settings': '33-settings',
    'portrait-orientation': '34-orientation',
}

# 输出名 -> (左源图名, 右源图名)
PORTRAIT_PAIRS = {
    'portrait-pair-main': ('00-dashboard', '20-player'),
    'portrait-pair-player-more': ('20-player', '21-player-more'),
    'portrait-pair-sheets': ('22-sheet-lines', '23-sheet-aspect'),
    'portrait-pair-channels-epg': ('30-channels', '31-epg'),
    'portrait-pair-search': ('32-search-empty', '32-search'),
    'portrait-pair-settings': ('33-settings', '34-orientation'),
}


def fit(src, height=1200):
    """整张手机截图按高度缩到 1200，宽度随之定为 540。"""
    im = Image.open(src).convert('RGB')
    w = round(im.width * height / im.height)
    return im.resize((w, height), Image.LANCZOS)


def save(im, out_dir, name):
    dst = os.path.join(out_dir, name + '.png')
    im.save(dst, optimize=True)
    print(name, im.size, round(os.path.getsize(dst) / 1024), 'KB')


def main():
    raw = sys.argv[1] if len(sys.argv) > 1 else 'raw'
    out_dir = sys.argv[2] if len(sys.argv) > 2 else 'out'
    os.makedirs(out_dir, exist_ok=True)

    for name, src in PORTRAIT_JOBS.items():
        path = os.path.join(raw, src + '.png')
        if not os.path.exists(path):
            print('skip (缺失)', name, '<-', src)
            continue
        save(fit(path), out_dir, name)

    for name, (left, right) in PORTRAIT_PAIRS.items():
        lp, rp = os.path.join(raw, left + '.png'), os.path.join(raw, right + '.png')
        if not (os.path.exists(lp) and os.path.exists(rp)):
            print('skip (缺失)', name, '<-', left, right)
            continue
        a, b = fit(lp), fit(rp)
        canvas = Image.new('RGB', (a.width + GAP + b.width, 1200), GAP_COLOR)
        canvas.paste(a, (0, 0))
        canvas.paste(b, (a.width + GAP, 0))
        save(canvas, out_dir, name)


if __name__ == '__main__':
    main()
