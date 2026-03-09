#!/usr/bin/env node
import fs from 'node:fs/promises';

const VIDEO_ID = 'rl0jkP9kOMw';
const VTT = `/home/node/.openclaw/workspace/memory/video-transcripts/${VIDEO_ID}.en.vtt`;
const OUT = `/home/node/.openclaw/workspace/memory/video-transcripts/${VIDEO_ID}-20min.json`;
const SEG = 1200;
const TOTAL = 39600;

function toSec(ts){
  const [h,m,sms]=ts.split(':');
  const [s,ms='0']=sms.split('.');
  return (+h)*3600 + (+m)*60 + (+s) + (+ms)/1000;
}
function hms(sec){
  sec=Math.floor(sec);
  const h=String(Math.floor(sec/3600)).padStart(2,'0');
  const m=String(Math.floor((sec%3600)/60)).padStart(2,'0');
  const s=String(sec%60).padStart(2,'0');
  return `${h}:${m}:${s}`;
}

function parseVtt(vtt){
  const lines=vtt.split(/\r?\n/);
  const cues=[];
  for(let i=0;i<lines.length;i++){
    if(!lines[i].includes('-->')) continue;
    const m=lines[i].match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}\.\d{3})/);
    if(!m) continue;
    let j=i+1; const txt=[];
    while(j<lines.length && lines[j].trim()!==''){ txt.push(lines[j]); j++; }
    const text=txt.join(' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
    if(text) cues.push({start:toSec(m[1]), end:toSec(m[2]), text});
  }
  return cues;
}

function chapterFromDescription(desc){
  return String(desc||'').split(/\r?\n/).map(l=>{
    const m=l.match(/^(\d{2}):(\d{2}):(\d{2})\s*-\s*(.+)$/);
    if(!m) return null;
    const start=+m[1]*3600 + +m[2]*60 + +m[3];
    return {start,startHms:`${m[1]}:${m[2]}:${m[3]}`,title:m[4].trim()};
  }).filter(Boolean);
}

async function main(){
  const vtt=await fs.readFile(VTT,'utf8');
  const cues=parseVtt(vtt);

  // pull chapters from existing builder output if present
  let chapters=[];
  try{
    const cur=JSON.parse(await fs.readFile(OUT,'utf8'));
    chapters=cur.chapters||[];
  }catch{}

  const segments=[];
  const count=Math.ceil(TOTAL/SEG);
  for(let i=0;i<count;i++){
    const start=i*SEG;
    const end=Math.min(start+SEG,TOTAL);
    const slice=cues.filter(c=>c.end>start && c.start<end);
    const text=slice.map(c=>c.text).join(' ').replace(/\s+/g,' ').trim();
    segments.push({
      index:i,start,end,startHms:hms(start),endHms:hms(end),
      url:`https://m.youtube.com/watch?v=${VIDEO_ID}&t=${start}s`,
      text
    });
  }

  const out={videoId:VIDEO_ID,fetchedAt:new Date().toISOString(),totalSeconds:TOTAL,segmentSeconds:SEG,source:'yt-dlp auto subtitles (en)',chapters,segments};
  await fs.writeFile(OUT,JSON.stringify(out,null,2)+'\n');
  console.log('wrote',OUT,'segments',segments.length,'nonEmpty',segments.filter(s=>s.text).length);
}

main().catch(e=>{console.error(e);process.exit(1)});
