/**
 * Extract YouTube 11-character Video ID from various link formats
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  let clean = url.trim();

  // If user pasted iframe HTML tag e.g. <iframe src="https://...">
  const iframeMatch = clean.match(/src=["'](.*?)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    clean = iframeMatch[1];
  }

  // If already bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }

  // 1. Check youtu.be/ID
  const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortMatch) return shortMatch[1];

  // 2. Check /shorts/ID
  const shortsMatch = clean.match(/\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch) return shortsMatch[1];

  // 3. Check /live/ID
  const liveMatch = clean.match(/\/live\/([a-zA-Z0-9_-]{11})/i);
  if (liveMatch) return liveMatch[1];

  // 4. Check /embed/ID
  const embedMatch = clean.match(/\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch) return embedMatch[1];

  // 5. Try URL search params (?v=ID)
  try {
    const fullUrl = clean.startsWith('http') ? clean : `https://${clean}`;
    const urlObj = new URL(fullUrl);
    const vParam = urlObj.searchParams.get('v');
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
      return vParam;
    }
  } catch (e) {}

  // 6. Generic regex match for any 11-char string following v= or similar
  const generalMatch = clean.match(/(?:[?&]v=|\/embed\/|\/shorts\/|\/live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (generalMatch && generalMatch[1]) {
    return generalMatch[1];
  }

  return null;
}

/**
 * Extract Google Drive File ID
 */
export function extractGoogleDriveId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i) ||
                url.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

/**
 * Utility to parse YouTube, Google Drive, and direct media URLs
 */
export function parseMediaUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // 1. YouTube detection
  const ytId = extractYouTubeId(cleanUrl);
  if (ytId) {
    return {
      type: 'youtube',
      // Using standard youtube-nocookie embed with origin-friendly parameters
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&enablejsapi=1`,
      directWatchUrl: `https://www.youtube.com/watch?v=${ytId}`,
      originalUrl: cleanUrl,
      videoId: ytId
    };
  }

  // 2. Google Drive detection
  const gdriveId = extractGoogleDriveId(cleanUrl);
  if (gdriveId) {
    return {
      type: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${gdriveId}/preview`,
      directWatchUrl: `https://drive.google.com/file/d/${gdriveId}/view`,
      originalUrl: cleanUrl,
      fileId: gdriveId
    };
  }

  // 3. Blob or local audio recording
  if (cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:audio')) {
    return {
      type: 'audio',
      embedUrl: cleanUrl,
      originalUrl: cleanUrl
    };
  }

  // 4. Direct video file (.mp4, .webm, .ogg)
  if (/\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(cleanUrl)) {
    return {
      type: 'direct_video',
      embedUrl: cleanUrl,
      originalUrl: cleanUrl
    };
  }

  // 5. Direct audio file (.mp3, .wav, .m4a, .aac)
  if (/\.(mp3|wav|m4a|aac|ogg)(\?.*)?$/i.test(cleanUrl)) {
    return {
      type: 'audio',
      embedUrl: cleanUrl,
      originalUrl: cleanUrl
    };
  }

  return {
    type: 'generic',
    embedUrl: cleanUrl,
    originalUrl: cleanUrl
  };
}
