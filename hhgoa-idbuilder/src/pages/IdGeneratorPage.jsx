import { useState, useRef, useEffect, useCallback } from 'react';
import { ID_TEMPLATE } from '../assets/templates';

const BASE_W = 1024, BASE_H = 1536;
const PHOTO_BORDER = { left: 233, top: 452, right: 787, bottom: 1005 };
const PHOTO_CLIP = { left: 246, top: 465, right: 774, bottom: 992, chamfer: 40 };
const NAME_BOX = { left: 210, top: 1018, right: 820, bottom: 1117 };
const TEAM_BOX = { left: 262, top: 1140, right: 760, bottom: 1184 };

function chamferPath(c, box) {
  const { left, top, right, bottom, chamfer } = box;
  c.beginPath();
  c.moveTo(left + chamfer, top);
  c.lineTo(right - chamfer, top);
  c.lineTo(right, top + chamfer);
  c.lineTo(right, bottom - chamfer);
  c.lineTo(right - chamfer, bottom);
  c.lineTo(left + chamfer, bottom);
  c.lineTo(left, bottom - chamfer);
  c.lineTo(left, top + chamfer);
  c.closePath();
}

function fitCover(img, box, zoom) {
  const bw = box.right - box.left, bh = box.bottom - box.top;
  const ir = img.width / img.height, br = bw / bh;
  let dw, dh;
  if (ir > br) { dh = bh * zoom; dw = dh * ir; }
  else { dw = bw * zoom; dh = dw / ir; }
  const dx = box.left + (bw - dw) / 2;
  const dy = box.top + (bh - dh) / 2;
  return { dx, dy, dw, dh };
}

export default function IdGeneratorPage() {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [userImg, setUserImg] = useState(null);
  
  // AI Feature States
  const [selectedFile, setSelectedFile] = useState(null);
  const [presets] = useState([
    "ghibli", "indian_cinema", "jojo_anime", "cyberpunk", "watercolor", 
    "oil_painting", "pixel_art", "film_noir", "vintage_polaroid", "vaporwave"
  ]);
  const [selectedPreset, setSelectedPreset] = useState('original');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');


  const canvasRef = useRef(null);
  const tplImgRef = useRef(null);
  const shellRef = useRef(null);

  // Load template once
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      tplImgRef.current = img;
      drawCard();
    };
    img.src = ID_TEMPLATE;
  }, [drawCard]);

  // Load user image when photoUrl changes
  useEffect(() => {
    if (photoUrl) {
      const img = new Image();
      img.onload = () => {
        setUserImg(img);
      };
      img.src = photoUrl;
    } else {
      setUserImg(null);
    }
  }, [photoUrl]);

  // Redraw when any input changes
  const drawCard = useCallback(() => {
    if (!tplImgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = BASE_W;
    canvas.height = BASE_H;

    ctx.clearRect(0, 0, BASE_W, BASE_H);
    ctx.drawImage(tplImgRef.current, 0, 0, BASE_W, BASE_H);

    if (userImg) {
      ctx.save();
      chamferPath(ctx, PHOTO_CLIP);
      ctx.clip();
      const { dx, dy, dw, dh } = fitCover(userImg, PHOTO_CLIP, zoom / 100);
      ctx.drawImage(userImg, dx, dy, dw, dh);
      ctx.restore();
    }

    // Name text
    const cleanName = name.trim().toUpperCase();
    if (cleanName) {
      ctx.save();
      ctx.fillStyle = '#f6cf1f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let size = 46;
      ctx.font = `800 ${size}px 'JetBrains Mono', monospace`;
      const maxW = (NAME_BOX.right - NAME_BOX.left) - 40;
      while (ctx.measureText(cleanName).width > maxW && size > 18) {
        size -= 2;
        ctx.font = `800 ${size}px 'JetBrains Mono', monospace`;
      }
      const cx = (NAME_BOX.left + NAME_BOX.right) / 2;
      const cy = (NAME_BOX.top + NAME_BOX.bottom) / 2 - 4;
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 6;
      ctx.fillText(cleanName, cx, cy, maxW);
      ctx.restore();
    }

    // Team text
    const cleanTeam = team.trim().toUpperCase();
    if (cleanTeam) {
      ctx.save();
      ctx.fillStyle = '#e8226f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let size = 26;
      ctx.font = `700 ${size}px 'JetBrains Mono', monospace`;
      const maxW = (TEAM_BOX.right - TEAM_BOX.left) - 40;
      while (ctx.measureText(cleanTeam).width > maxW && size > 12) {
        size -= 1;
        ctx.font = `700 ${size}px 'JetBrains Mono', monospace`;
      }
      const cx = (TEAM_BOX.left + TEAM_BOX.right) / 2;
      const cy = (TEAM_BOX.top + TEAM_BOX.bottom) / 2;
      ctx.fillText(cleanTeam, cx, cy, maxW);
      ctx.restore();
    }
  }, [userImg, name, team, zoom]);

  useEffect(() => {
    drawCard();
  }, [drawCard]);

  // 3D Card Hover Effect
  useEffect(() => {
    const shell = shellRef.current;
    const cvs = canvasRef.current;
    if (!shell || !cvs) return;

    const handleMouseMove = (e) => {
      const rect = shell.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const x = (e.clientX - rect.left - width / 2) / 15;
      const y = (e.clientY - rect.top - height / 2) / 15;
      cvs.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
      cvs.style.transform = 'rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    };

    shell.addEventListener('mousemove', handleMouseMove);
    shell.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      shell.removeEventListener('mousemove', handleMouseMove);
      shell.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoUrl(ev.target.result);
      setFileName(file.name);
      setZoom(100);
      setSelectedPreset('original'); // reset preset on new photo
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setName('');
    setTeam('');
    setPhotoUrl('');
    setZoom(100);
    setFileName('');
    setSelectedFile(null);
    setSelectedPreset('original');
    setIsGenerating(false);
    setStatusMessage('');
  };

  const pollStatus = async (runId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/status/${runId}`);
      const data = await res.json();
      if (data.status === 'success' && data.image_url) {
        setPhotoUrl(data.image_url);
        setIsGenerating(false);
        setStatusMessage('Generation complete!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else if (data.status === 'failed') {
        setIsGenerating(false);
        setStatusMessage('Generation failed.');
      } else {
        setTimeout(() => pollStatus(runId), 3000);
      }
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
      setStatusMessage('Error checking status.');
    }
  };

  const handleGenerateStyle = async () => {
    if (!selectedFile || selectedPreset === 'original') return;
    
    setIsGenerating(true);
    setStatusMessage('Uploading image...');
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('preset', selectedPreset);
    
    try {
      const res = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok && data.run_id) {
        setStatusMessage('✨ Generating your style... Please wait...');
        pollStatus(data.run_id);
      } else {
        throw new Error(data.detail || 'Failed to start generation');
      }
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
      setStatusMessage('Failed to connect to AI server.');
    }
  };

  const handleDownload = () => {
    if (!userImg) { alert('Upload a photo first so it sits inside the frame.'); return; }
    if (!name.trim()) { alert('Add your name before downloading.'); return; }
    drawCard();
    const link = document.createElement('a');
    const fName = (name.trim() || 'hacker-house-goa').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `hhgoa26-id-${fName}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const isReady = !!(userImg && name.trim().length > 0);

  return (
    <div className="min-h-screen font-mono text-[#eaf5ee] bg-[#07130c]" style={{ background: 'radial-gradient(circle at 15% 10%, #0e2618 0%, transparent 45%), radial-gradient(circle at 85% 90%, #10281a 0%, transparent 40%), #07130c' }}>
      <div className="max-w-[1180px] mx-auto px-5 py-9 pb-20">
        <header className="flex items-baseline justify-between gap-5 flex-wrap mb-7 border-b border-dashed border-[#1e3a28] pb-[18px]">
          <div>
            <div className="text-xs tracking-[2px] text-[#7fae8d] uppercase">&gt;&gt;&gt; INIT: ID_GENERATOR</div>
            <div className="font-['Space_Grotesk'] font-bold text-[22px] tracking-[0.5px] text-[#f6cf1f]">
              HACKER HOUSE <span className="text-[#e8226f]">गोवा</span>
            </div>
          </div>
          <div className="text-xs tracking-[2px] text-[#7fae8d] uppercase">HHGOA'26 · BUILD YOUR PASS</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-7 items-start">
          <div className="bg-gradient-to-b from-[#0c1f14] to-[#0a1a11] border border-[#1e3a28] rounded-[14px] p-[22px]">
            <h2 className="font-['Space_Grotesk'] text-[14px] tracking-[2px] uppercase text-[#f6cf1f] m-0 mb-[18px] flex items-center gap-2 before:content-['›'] before:text-[#e8226f]">
              Your Details
            </h2>

            <div className="mb-5">
              <label className="block text-[11px] tracking-[1.5px] uppercase text-[#7fae8d] mb-1.5">Photo</label>
              <div 
                className={`relative border-[1.5px] border-dashed rounded-[10px] p-[22px_14px] text-center cursor-pointer transition-colors duration-150 ${isDragging ? 'border-[#f6cf1f] bg-[#0b2216]' : photoUrl ? 'border-[#f6cf1f] bg-[#081a10]' : 'border-[#1e3a28] bg-[#081a10] hover:border-[#f6cf1f] hover:bg-[#0b2216]'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  handleFile(file);
                }}
              >
                {photoUrl && <img src={photoUrl} className="w-14 h-14 rounded-md object-cover mx-auto mb-2.5 border border-[#1e3a28]" alt="" />}
                <div className={`text-[13px] mb-1 ${photoUrl ? 'text-[#f6cf1f]' : 'text-[#eaf5ee]'}`}>
                  {fileName ? (fileName.length > 28 ? fileName.slice(0, 25) + '…' : fileName) : 'Click or drop a photo'}
                </div>
                <div className="text-[11px] text-[#7fae8d]">JPG or PNG, square photos work best</div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
              
              {photoUrl && (
                <div className="flex items-center gap-2.5 mt-1">
                  <label className="m-0 whitespace-nowrap text-[11px] tracking-[1.5px] uppercase text-[#7fae8d]">Zoom</label>
                  <input 
                    type="range" 
                    min="100" 
                    max="220" 
                    value={zoom} 
                    onChange={(e) => setZoom(e.target.value)}
                    className="flex-1 accent-[#f6cf1f]" 
                  />
                  <span className="text-[11px] text-[#7fae8d] w-9 text-right">{zoom}%</span>
                </div>
              )}
            </div>

            {photoUrl && presets.length > 0 && (
              <div className="mb-5 bg-[#0a1a11] border border-[#1e3a28] rounded-[10px] p-4">
                <label className="block text-[11px] tracking-[1.5px] uppercase text-[#7fae8d] mb-2 flex items-center gap-2">
                  <span className="text-[#e8226f]">✦</span> AI Style
                </label>
                <div className="flex flex-col gap-3">
                  <select
                    value={selectedPreset}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                    disabled={isGenerating}
                    className="w-full bg-[#081a10] border border-[#1e3a28] rounded-md px-3 py-2 text-[#eaf5ee] font-mono text-[13px] outline-none transition-all focus:border-[#f6cf1f]"
                  >
                    <option value="original">Original Photo</option>
                    {presets.map(p => (
                      <option key={p} value={p}>{p.replace(/_/g, ' ').toUpperCase()}</option>
                    ))}
                  </select>
                  
                  {selectedPreset !== 'original' && (
                    <button
                      onClick={handleGenerateStyle}
                      disabled={isGenerating}
                      className={`w-full py-2 px-4 rounded-md border-none font-mono font-bold text-[12px] tracking-[1px] uppercase cursor-pointer transition-all duration-100 ${
                        isGenerating 
                          ? 'bg-[#1e3a28] text-[#7fae8d] cursor-not-allowed' 
                          : 'bg-[#e8226f] text-white hover:brightness-110 active:scale-95'
                      }`}
                    >
                      {isGenerating ? 'Generating...' : 'Apply AI Style'}
                    </button>
                  )}
                  {statusMessage && (
                    <div className="text-[11px] text-[#f6cf1f] animate-pulse text-center mt-1">
                      {statusMessage}
                    </div>
                  )}
                </div>
              </div>
            )}


            <div className="mb-5">
              <label className="block text-[11px] tracking-[1.5px] uppercase text-[#7fae8d] mb-1.5">Name</label>
              <input 
                type="text" 
                placeholder="e.g. ARJUN NAIR" 
                maxLength="26"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#081a10] border border-[#1e3a28] rounded-lg px-3 py-[11px] text-[#eaf5ee] font-mono text-[14px] tracking-[0.5px] outline-none transition-all duration-150 focus:border-[#f6cf1f] focus:ring-[3px] focus:ring-[#f6cf1f]/10 placeholder:text-[#4a6b57]"
              />
            </div>

            <div className="mb-5">
              <label className="block text-[11px] tracking-[1.5px] uppercase text-[#7fae8d] mb-1.5">Team Name</label>
              <input 
                type="text" 
                placeholder="e.g. TEAM SIGNAL" 
                maxLength="30"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full bg-[#081a10] border border-[#1e3a28] rounded-lg px-3 py-[11px] text-[#eaf5ee] font-mono text-[14px] tracking-[0.5px] outline-none transition-all duration-150 focus:border-[#f6cf1f] focus:ring-[3px] focus:ring-[#f6cf1f]/10 placeholder:text-[#4a6b57]"
              />
            </div>

            <button 
              onClick={handleDownload}
              className="w-full py-[13px] px-4 rounded-lg border-none font-mono font-bold text-[13px] tracking-[1.5px] uppercase cursor-pointer transition-all duration-100 active:scale-95 bg-[#f6cf1f] text-[#101a10] hover:brightness-110"
            >
              Download ID Card
            </button>
            <button 
              onClick={handleReset}
              className="w-full py-[13px] px-4 rounded-lg font-mono font-bold text-[13px] tracking-[1.5px] uppercase cursor-pointer transition-all duration-100 active:scale-95 bg-transparent text-[#e8226f] border border-[#e8226f] mt-2.5 hover:bg-[#e8226f]/10"
            >
              Reset
            </button>

            <div className="text-[11px] text-[#7fae8d] leading-relaxed mt-4 pt-3.5 border-t border-dashed border-[#1e3a28]">
              <b className="text-[#eaf5ee]">Tip:</b> use the zoom slider to reposition your photo once it's uploaded — drag isn't needed, the photo auto-centers and crops to fit the frame.
            </div>
          </div>

          <div className="flex flex-col items-center gap-[18px]">
            <div className="flex gap-2 items-center text-[11px] text-[#7fae8d] tracking-[1px] uppercase">
              <span className={`w-[7px] h-[7px] rounded-full transition-colors ${isReady ? 'bg-[#3ee089] shadow-[0_0_8px_#3ee089]' : 'bg-[#e8226f] shadow-[0_0_8px_#e8226f]'}`}></span>
              <span>{isReady ? 'Pass ready — download it below' : 'Waiting for photo & name'}</span>
            </div>
            <div 
              className="relative w-full flex justify-center [perspective:1000px]" 
              ref={shellRef}
            >
              <canvas 
                ref={canvasRef}
                className="w-full max-w-[440px] h-auto rounded-[18px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] block [transform-style:preserve-3d] transition-all duration-150 hover:shadow-[0_45px_80px_-20px_rgba(0,0,0,0.85),0_0_40px_rgba(246,207,31,0.15)]"
              ></canvas>
            </div>
          </div>
        </div>

        <footer className="text-center mt-10 text-[11px] text-[#7fae8d] tracking-[1px]">
          &gt; less noise. more signal. — Hacker House Goa · HHGOA'26
        </footer>
      </div>
    </div>
  );
}
