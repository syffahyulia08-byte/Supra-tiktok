// Endpoint Downloader TikTok - DAPP
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: false,
      message: "Mana url-nya? Contoh: /api/download?url=https://vt.tiktok.com/xxx"
    });
  }

  try {
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const data = await response.json();

    if (data.code !== 0 || !data.data) {
      return res.status(500).json({
        status: false,
        message: "Gagal ambil video, link mungkin salah / video private",
        raw: data
      });
    }

    const d = data.data;

    return res.status(200).json({
      status: true,
      creator: "DAPP",
      result: {
        judul: d.title,
        author: d.author?.nickname || d.author?.unique_id,
        username: d.author?.unique_id,
        avatar: d.author?.avatar,
        cover: d.cover,
        video_no_watermark: d.play,
        video_watermark: d.wmplay,
        video_hd: d.hdplay,
        audio: d.music,
        durasi: d.duration,
        like: d.digg_count,
        komentar: d.comment_count,
        share: d.share_count
      }
    });

  } catch (e) {
    return res.status(500).json({
      status: false,
      message: "Server error: " + e.message
    });
  }
}
