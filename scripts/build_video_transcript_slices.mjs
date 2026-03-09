#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const VIDEO_ID = 'rl0jkP9kOMw';
const VIDEO_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
const SEGMENT_SECONDS = 20 * 60;
const TOTAL_SECONDS = 11 * 60 * 60;
const OUT_DIR = '/home/node/.openclaw/workspace/memory/video-transcripts';
const OUT_FILE = path.join(OUT_DIR, `${VIDEO_ID}-20min.json`);

function decodeHtml(str) {
  return str
    .replace(/\\u0026/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function hms(sec) {
  const s = Math.max(0, Math.floor(sec));
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

async function fetchWatchHtml() {
  const res = await fetch(VIDEO_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  if (!res.ok) throw new Error(`watch fetch failed: ${res.status}`);
  return res.text();
}

function extractPlayerResponse(html) {
  const marker = 'ytInitialPlayerResponse = ';
  const start = html.indexOf(marker);
  if (start === -1) throw new Error('ytInitialPlayerResponse marker not found');

  let i = start + marker.length;
  while (i < html.length && /\s/.test(html[i])) i++;
  if (html[i] !== '{') throw new Error('player response JSON does not start with {');

  let depth = 0;
  let inStr = false;
  let esc = false;
  let end = -1;
  for (let j = i; j < html.length; j++) {
    const ch = html[j];
    if (inStr) {
      if (esc) {
        esc = false;
      } else if (ch === '\\') {
        esc = true;
      } else if (ch === '"') {
        inStr = false;
      }
      continue;
    }
    if (ch === '"') {
      inStr = true;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        end = j;
        break;
      }
    }
  }

  if (end === -1) throw new Error('Could not locate end of ytInitialPlayerResponse JSON');
  return JSON.parse(html.slice(i, end + 1));
}

function pickCaptionTrack(playerResponse) {
  const tracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
  if (!tracks.length) throw new Error('No caption tracks found');

  const preferred = tracks.find(t => (t.languageCode || '').startsWith('en') && t.kind === 'asr')
    || tracks.find(t => (t.languageCode || '').startsWith('en'))
    || tracks[0];

  return preferred;
}

async function fetchTranscriptEvents(baseUrl) {
  const url = `${decodeHtml(baseUrl)}&fmt=json3`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  if (!res.ok) throw new Error(`transcript fetch failed: ${res.status}`);
  const raw = await res.text();

  try {
    const json = JSON.parse(raw);
    return json.events || [];
  } catch {
    // Fallback: sometimes timedtext returns XML even when fmt=json3 is requested.
    const texts = [...raw.matchAll(/<text\s+start="([0-9.]+)"\s+dur="([0-9.]+)"[^>]*>([\s\S]*?)<\/text>/g)];
    return texts.map(m => ({
      tStartMs: Math.round(parseFloat(m[1]) * 1000),
      dDurationMs: Math.round(parseFloat(m[2]) * 1000),
      segs: [{ utf8: decodeHtml(m[3]).replace(/<[^>]+>/g, '') }]
    }));
  }
}

function flattenEvents(events) {
  const entries = [];
  for (const ev of events) {
    if (!ev || !Array.isArray(ev.segs) || typeof ev.tStartMs !== 'number') continue;
    const text = ev.segs.map(s => s.utf8 || '').join('').replace(/\s+/g, ' ').trim();
    if (!text) continue;
    const start = ev.tStartMs / 1000;
    const dur = (ev.dDurationMs || 0) / 1000;
    const end = dur > 0 ? start + dur : start + 2;
    entries.push({ start, end, text });
  }
  return entries;
}

function extractChaptersFromDescription(desc = '') {
  const lines = String(desc).split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    const m = line.match(/^(\d{2}):(\d{2}):(\d{2})\s*-\s*(.+)$/);
    if (!m) continue;
    const start = Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
    out.push({ start, startHms: `${m[1]}:${m[2]}:${m[3]}`, title: m[4].trim() });
  }
  return out;
}

function buildSegments(entries) {
  const segmentCount = Math.ceil(TOTAL_SECONDS / SEGMENT_SECONDS);
  const segments = [];
  for (let i = 0; i < segmentCount; i++) {
    const start = i * SEGMENT_SECONDS;
    const end = Math.min(start + SEGMENT_SECONDS, TOTAL_SECONDS);
    const slice = entries.filter(e => e.end > start && e.start < end);
    const text = slice.map(e => e.text).join(' ').replace(/\s+/g, ' ').trim();
    segments.push({
      index: i,
      start,
      end,
      startHms: hms(start),
      endHms: hms(end),
      url: `https://m.youtube.com/watch?v=${VIDEO_ID}&t=${start}s`,
      text
    });
  }
  return segments;
}

async function main() {
  const html = await fetchWatchHtml();
  const player = extractPlayerResponse(html);
  const track = pickCaptionTrack(player);
  const events = await fetchTranscriptEvents(track.baseUrl);
  const entries = flattenEvents(events);
  const segments = buildSegments(entries);
  const chapters = extractChaptersFromDescription(player?.videoDetails?.shortDescription || '');

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify({
    videoId: VIDEO_ID,
    fetchedAt: new Date().toISOString(),
    totalSeconds: TOTAL_SECONDS,
    segmentSeconds: SEGMENT_SECONDS,
    sourceTrack: {
      languageCode: track.languageCode,
      name: track.name?.simpleText || '',
      kind: track.kind || ''
    },
    chapters,
    segments
  }, null, 2));

  console.log(`Wrote ${segments.length} segments to ${OUT_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
