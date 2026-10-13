// 文档截图用的假数据服务：给电视端 / 手机端应用喂订阅源与节目单。
//
//   node tools/screenshots/doc-fixture-server.mjs        # 默认 http://localhost:18770
//   PORT=18770 node tools/screenshots/doc-fixture-server.mjs
//
// 提供两个地址，在应用的「订阅源」「节目单」里直接填：
//   http://10.0.2.2:18770/all.m3u     订阅源（频道 + 台标 + 分组）
//   http://10.0.2.2:18770/epg.xml     节目单（按本机时钟生成，覆盖前后各若干小时）
//
// 频道名与台标取自 gitee 上的 myTVlogo 仓库，直播地址用公开测试流，
// 不涉及任何个人订阅源或令牌，可以放心截图。

import http from 'node:http';

const PORT = Number(process.env.PORT ?? 18770);
const LOGO_BASE = 'https://gitee.com/mytv-android/myTVlogo/raw/main/img';

// 直播地址：公开 HLS 测试流。每个频道发 3 条，应用会合并成 3 条线路，
// 频道卡上出「线路数」角标、线路抽屉里也有实测延迟可看。
const STREAMS = [
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
  'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8',
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
];

// [分组, 显示名, tvg-id, 台标文件名（不含 .png）]
const CHANNELS = [
  ['央视', 'CCTV-1 综合', 'CCTV1', '-CCTV1'],
  ['央视', 'CCTV-2 财经', 'CCTV2', '-CCTV2'],
  ['央视', 'CCTV-3 综艺', 'CCTV3', '-CCTV3'],
  ['央视', 'CCTV-4 中文国际', 'CCTV4', '-CCTV4'],
  ['央视', 'CCTV-5 体育', 'CCTV5', '-CCTV5'],
  ['央视', 'CCTV-5+ 体育赛事', 'CCTV5plus', '-CCTV5+'],
  ['央视', 'CCTV-6 电影', 'CCTV6', '-CCTV6'],
  ['央视', 'CCTV-7 国防军事', 'CCTV7', '-CCTV7'],
  ['央视', 'CCTV-8 电视剧', 'CCTV8', '-CCTV8'],
  ['央视', 'CCTV-9 纪录', 'CCTV9', '-CCTV9'],
  ['央视', 'CCTV-10 科教', 'CCTV10', '-CCTV10'],
  ['央视', 'CCTV-11 戏曲', 'CCTV11', '-CCTV11'],
  ['央视', 'CCTV-12 社会与法', 'CCTV12', '-CCTV12'],
  ['央视', 'CCTV-13 新闻', 'CCTV13', '-CCTV13'],
  ['央视', 'CCTV-14 少儿', 'CCTV14', '-CCTV14'],
  ['央视', 'CCTV-15 音乐', 'CCTV15', '-CCTV15'],
  ['央视', 'CCTV-16 奥林匹克', 'CCTV16', '-CCTV16'],
  ['央视', 'CCTV-17 农业农村', 'CCTV17', '-CCTV17'],

  ['影视', 'CHC高清电影', 'CHC高清电影', 'CHC高清电影'],
  ['影视', 'CHC动作电影', 'CHC动作电影', 'CHC动作电影'],
  ['影视', 'CHC家庭影院', 'CHC家庭影院', 'CHC家庭影院'],
  ['影视', 'CHC影迷电影', 'CHC影迷电影', 'CHC影迷电影'],
  ['影视', 'DOX剧场', 'DOX剧场', 'DOX剧场'],
  ['影视', 'DOX美剧', 'DOX美剧', 'DOX美剧'],
  ['影视', 'DOX院线', 'DOX院线', 'DOX院线'],
  ['影视', 'DOX新知', 'DOX新知', 'DOX新知'],
  ['影视', 'DOX怡家', 'DOX怡家', 'DOX怡家'],
  ['影视', 'DOX映画', 'DOX映画', 'DOX映画'],
  ['影视', 'DOX新艺', 'DOX新艺', 'DOX新艺'],
  ['影视', 'CIBN好莱坞', 'CIBN好莱坞', 'CIBN好莱坞'],
  ['影视', 'CIBN动作影院', 'CIBN动作影院', 'CIBN动作影院'],
  ['影视', 'CIBN喜剧影院', 'CIBN喜剧影院', 'CIBN喜剧影院'],
  ['影视', 'CBN每日影院', 'CBN每日影院', 'CBN每日影院'],
  ['影视', 'CBN幸福剧场', 'CBN幸福剧场', 'CBN幸福剧场'],
  ['影视', 'CatchPlay电影', 'CatchPlay电影', 'CatchPlay电影'],
  ['影视', '1905电影', '1905电影', '1905电影'],
  ['影视', '1905极限反转', '1905极限反转', '1905极限反转'],

  ['少儿', 'CCTV-14 少儿', 'CCTV14', '-CCTV14'],
  ['少儿', 'CN卡通', 'CN卡通', 'CN卡通'],
  ['少儿', 'Disney Junior', 'DisneyJunior', 'DisneyJunior'],
  ['少儿', 'Disney XD', 'DisneyXD', 'Disney_XD'],
  ['少儿', 'Babyfirst', 'Babyfirst', 'Babyfirst'],
  ['少儿', 'Cartoon Network', 'CartoonNetwork', 'CartoonNetwork'],
  ['少儿', 'Boomerang', 'Boomerang', 'Boomerang'],
  ['少儿', 'CIBN动画乐园', 'CIBN动画乐园', 'CIBN动画乐园'],

  ['体育', 'CCTV-5 体育', 'CCTV5', '-CCTV5'],
  ['体育', 'CCTV-5+ 体育赛事', 'CCTV5plus', '-CCTV5+'],
  ['体育', 'CCTV-16 奥林匹克', 'CCTV16', '-CCTV16'],
  ['体育', 'ELTA体育1', 'ELTA体育1', 'ELTA体育1'],
  ['体育', 'ELTA体育2', 'ELTA体育2', 'ELTA体育2'],
  ['体育', 'ELTA体育3', 'ELTA体育3', 'ELTA体育3'],
  ['体育', 'ELEVEN体育一', 'ELEVEN体育一', 'ELEVEN体育一'],
  ['体育', 'BesTV超级体育', 'BesTV超级体育', 'BesTV超级体育'],
  ['体育', 'BRTV体育休闲', 'BRTV体育休闲', 'BRTV体育休闲'],

  ['新闻', 'CCTV-13 新闻', 'CCTV13', '-CCTV13'],
  ['新闻', 'CGTN', 'CGTN', 'CGTN'],
  ['新闻', 'CGTN英语', 'CGTN英语', 'CGTN英语'],
  ['新闻', 'CGTN纪录', 'CGTN纪录', 'CGTN纪录'],
  ['新闻', 'CNN国际新闻', 'CNN国际新闻', 'CNN国际新闻'],
  ['新闻', 'BBC NEWS', 'BBCNEWS', 'BBCNEWS'],
  ['新闻', 'Bloomberg', 'Bloomberg', 'Bloomberg'],
  ['新闻', 'CNBC Asia', 'CNBCAsia', 'CNBCAsia'],
  ['新闻', 'Euronews', 'Euronews', 'Euronews'],
  ['新闻', 'ARIRANG', 'ARIRANG', 'ARIRANG'],

  ['北京', 'BRTV北京卫视', 'BRTV北京卫视', 'BRTV北京卫视'],
  ['北京', 'BRTV文艺', 'BRTV文艺', 'BRTV文艺'],
  ['北京', 'BRTV影视', 'BRTV影视', 'BRTV影视'],
  ['北京', 'BRTV新闻', 'BRTV新闻', 'BRTV新闻'],
  ['北京', 'BRTV财经', 'BRTV财经', 'BRTV财经'],
  ['北京', 'BRTV生活', 'BRTV生活', 'BRTV生活'],
  ['北京', 'BRTV青年', 'BRTV青年', 'BRTV青年'],
  ['北京', 'BRTV纪实', 'BRTV纪实', 'BRTV纪实'],
  ['北京', 'BRTV卡酷少儿', 'BRTV卡酷少儿', 'BRTV卡酷少儿'],
  ['北京', 'BTV科教', 'BTV科教', 'BTV科教'],
  ['北京', 'BTV体育', 'BTV体育', 'BTV体育'],
];

// 每个分组一套节目名，节目单按 30~90 分钟一档铺满前后各若干小时。
const PROGRAMS = {
  央视: ['新闻联播', '朝闻天下', '焦点访谈', '人与自然', '精彩一刻', '感动中国', '第一动画乐园', '天网', '见证', '探索发现'],
  影视: ['佳片有约', '光影星播客', '电影放映室', '动作影院', '黄金剧场', '深夜影院', '新片首发', '导演访谈'],
  少儿: ['动画大放映', '大风车', '动漫世界', '智慧树', '小小智慧树', '英雄出少年', '动画乐翻天'],
  体育: ['体育新闻', '赛事集锦', '实况录像', '体坛晨报', '冠军面对面', '健身动起来', '英超精华'],
  新闻: ['整点新闻', '环球视线', '世界报道', '深度国际', '新闻直播间', '今日关注', '英语新闻'],
  北京: ['北京新闻', '每日文艺播报', '法治进行时', '养生堂', '这里是北京', '档案', '四海漫游', '北京您早'],
};

const GROUP_FALLBACK = ['精选节目', '精彩继续', '夜航西方', '生活观察', '纪录时刻'];

function buildM3u() {
  const lines = [
    '#EXTM3U x-tvg-url="http://127.0.0.1:' + PORT + '/epg.xml"',
  ];
  CHANNELS.forEach(([group, name, id, logo]) => {
    const attrs =
      'tvg-id="' + id + '" tvg-name="' + name + '" ' +
      'tvg-logo="' + LOGO_BASE + '/' + encodeURIComponent(logo) + '.png" ' +
      'group-title="' + group + '"';
    // 同名频道发多条，应用合并为一个频道的多条线路
    STREAMS.forEach((url) => {
      lines.push('#EXTINF:-1 ' + attrs + ',' + name);
      lines.push(url);
    });
  });
  return lines.join('\n') + '\n';
}

const pad = (n) => String(n).padStart(2, '0');

function xmltvTime(d) {
  // XMLTV 用本地时间 + 偏移，和设备时钟一致（模拟器时钟已对齐宿主机）
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? '+' : '-';
  const abs = Math.abs(off);
  return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
    pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()) +
    ' ' + sign + pad(Math.floor(abs / 60)) + pad(abs % 60);
}

function slotLength(seed) {
  return [30, 45, 60, 60, 90][seed % 5];
}

function buildEpg() {
  const now = Date.now();
  const from = now - 6 * 3600e3;
  const to = now + 24 * 3600e3;
  const out = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<tv generator-info-name="mytv-doc-fixture">',
  ];
  for (const [group, name, id] of CHANNELS) {
    out.push('<channel id="' + id + '"><display-name lang="zh">' + name + '</display-name></channel>');
  }
  CHANNELS.forEach(([group, name, id], ci) => {
    const pool = PROGRAMS[group] ?? GROUP_FALLBACK;
    let t = from;
    let i = 0;
    while (t < to) {
      const dur = slotLength(ci + i) * 60e3;
      const e = t + dur;
      const title = pool[(ci * 3 + i) % pool.length];
      // desc 只放频道名与节目名：不写「已播/正在播出/未播」（应用按设备时钟自己算，
      // 节目单有缓存，写死了过一会儿就和画面对不上），也不写起止时间
      // （节目单里带时区偏移，应用按设备时区显示，两边对不上）。
      out.push(
        '<programme start="' + xmltvTime(new Date(t)) + '" stop="' + xmltvTime(new Date(e)) +
        '" channel="' + id + '"><title lang="zh">' + title + '</title>' +
        '<desc lang="zh">' + name + ' · ' + title + '</desc></programme>'
      );
      t = e;
      i++;
    }
  });
  out.push('</tv>');
  return out.join('\n') + '\n';
}

const server = http.createServer((req, res) => {
  const path = req.url.split('?')[0];
  const send = (code, body, type) => {
    res.writeHead(code, { 'Content-Type': type, 'Content-Length': Buffer.byteLength(body) });
    res.end(body);
  };
  if (path === '/all.m3u') send(200, buildM3u(), 'audio/x-mpegurl');
  else if (path === '/epg.xml') send(200, buildEpg(), 'application/xml');
  else if (path === '/') {
    send(200, [
      '文档截图假数据服务',
      '  订阅源  http://10.0.2.2:' + PORT + '/all.m3u',
      '  节目单  http://10.0.2.2:' + PORT + '/epg.xml',
      '  频道数  ' + CHANNELS.length,
    ].join('\n') + '\n', 'text/plain; charset=utf-8');
  } else send(404, 'not found\n', 'text/plain; charset=utf-8');
});

server.listen(PORT, () => {
  console.log('doc-fixture: listening on ' + PORT);
  console.log('doc-fixture: ' + CHANNELS.length + ' channels');
});
