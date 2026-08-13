import { useState, useRef, useEffect, useCallback } from 'react';
import { TEAM_TEMPLATE } from '../assets/templates';

const BASE_W = 1448, BASE_H = 1086;

const TEAM_BOX = { left: 253, top: 182, right: 1173, bottom: 322 };

const SLOTS = [
  {
    photo: { left: 246, top: 352, right: 536, bottom: 692, chamfer: 15 },
    name: { left: 246, top: 690, right: 536, bottom: 740 },
    role: { left: 246, top: 755, right: 536, bottom: 805 }
  },
  {
    photo: { left: 561, top: 352, right: 846, bottom: 692, chamfer: 15 },
    name: { left: 561, top: 690, right: 846, bottom: 740 },
    role: { left: 561, top: 755, right: 846, bottom: 805 }
  },
  {
    photo: { left: 872, top: 352, right: 1154, bottom: 692, chamfer: 15 },
    name: { left: 872, top: 690, right: 1154, bottom: 740 },
    role: { left: 872, top: 755, right: 1154, bottom: 805 }
  }
];

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

export default function TeamFramePage() {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([
    { photoUrl: '', fileName: '', zoom: 100, name: '', role: '', img: null, isDragging: false },
    { photoUrl: '', fileName: '', zoom: 100, name: '', role: '', img: null, isDragging: false },
    { photoUrl: '', fileName: '', zoom: 100, name: '', role: '', img: null, isDragging: false }
  ]);

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
    img.src = TEAM_TEMPLATE;
  }, []);

  const drawText = useCallback((ctx, box, text, color, weight, baseSize) => {
    if (!text) return;
    ctx.save();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let size = baseSize;
    ctx.font = `${weight} ${size}px 'JetBrains Mono', monospace`;
    const maxW = (box.right - box.left) - 20;
    const upper = text.trim().toUpperCase();
    while (ctx.measureText(upper).width > maxW && size > 10) {
      size -= 1;
      ctx.font = `${weight} ${size}px 'JetBrains Mono', monospace`;
    }
    const cx = (box.left + box.right) / 2;
    const cy = (box.top + box.bottom) / 2;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 4;
    ctx.fillText(upper, cx, cy, maxW);
    ctx.restore();
  }, []);

  const drawCard = useCallback(() => {
    if (!tplImgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = BASE_W;
    canvas.height = BASE_H;
    ctx.clearRect(0, 0, BASE_W, BASE_H);
    ctx.drawImage(tplImgRef.current, 0, 0, BASE_W, BASE_H);

    // Team name
    if (teamName.trim()) {
      ctx.save();
      ctx.fillStyle = '#d7e02b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let size = 54;
      ctx.font = `800 ${size}px 'JetBrains Mono', monospace`;
      const maxW = (TEAM_BOX.right - TEAM_BOX.left) - 50;
      const upper = teamName.trim().toUpperCase();
      while (ctx.measureText(upper).width > maxW && size > 20) {
        size -= 2;
        ctx.font = `800 ${size}px 'JetBrains Mono', monospace`;
      }
      const cx = (TEAM_BOX.left + TEAM_BOX.right) / 2;
      const cy = (TEAM_BOX.top + TEAM_BOX.bottom) / 2;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 8;
      ctx.fillText(upper, cx, cy, maxW);
      ctx.restore();
    }

    SLOTS.forEach((slot, i) => {
      const m = members[i];
      if (m.img) {
        ctx.save();
        chamferPath(ctx, slot.photo);
        ctx.clip();
        const { dx, dy, dw, dh } = fitCover(m.img, slot.photo, m.zoom / 100);
        ctx.drawImage(m.img, dx, dy, dw, dh);
        ctx.restore();
      }
      drawText(ctx, slot.name, m.name, '#d7e02b', 800, 22);
      drawText(ctx, slot.role, m.role, '#e8226f', 700, 16);
    });
  }, [teamName, members, drawText]);

  useEffect(() => {
    drawCard();
  }, [drawCard]);

  // 3D Hover Effect
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

  const updateMember = (i, field, value) => {
    const newMembers = [...members];
    newMembers[i][field] = value;
    setMembers(newMembers);
  };

  const handleFile = (i, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const newMembers = [...members];
        newMembers[i].img = img;
        newMembers[i].photoUrl = ev.target.result;
        newMembers[i].fileName = file.name;
        newMembers[i].zoom = 100;
        setMembers(newMembers);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setTeamName('');
    setMembers([
      { photoUrl: '', fileName: '', zoom: 100, name: '', role: '', img: null, isDragging: false },
      { photoUrl: '', fileName: '', zoom: 100, name: '', role: '', img: null, isDragging: false },
      { photoUrl: '', fileName: '', zoom: 100, name: '', role: '', img: null, isDragging: false }
    ]);
  };

  const handleDownload = () => {
    const anyPhoto = members.some(m => m.img);
    if (!anyPhoto) { alert('Upload at least one photo first.'); return; }
    drawCard();
    const link = document.createElement('a');
    const fname = (teamName.trim() || 'hhgoa26-team').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    link.download = `${fname}-frame.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const isReady = teamName.trim().length > 0 && members.some(m => m.img && m.name.trim().length > 0);

  return (
    <div className="min-h-screen font-mono text-[#eaf5ee] bg-[#07130c]" style={{ background: 'radial-gradient(circle at 15% 10%, #0e2618 0%, transparent 45%), radial-gradient(circle at 85% 90%, #10281a 0%, transparent 40%), #07130c' }}>
      <div className="max-w-[1280px] mx-auto px-5 py-9 pb-20">
        <header className="flex items-baseline justify-between gap-5 flex-wrap mb-7 border-b border-dashed border-[#1e3a28] pb-[18px]">
          <div>
            <div className="text-xs tracking-[2px] text-[#7fae8d] uppercase">&gt;&gt;&gt; INIT: TEAM_GENERATOR</div>
            <div className="font-['Space_Grotesk'] font-bold text-[22px] tracking-[0.5px] text-[#d7e02b]">
              HACKER HOUSE <span className="text-[#e8226f]">गोवा</span>
            </div>
          </div>
          <div className="text-xs tracking-[2px] text-[#7fae8d] uppercase">HHGOA'26 · BUILD YOUR PASS</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-7 items-start">
          <div className="bg-gradient-to-b from-[#0c1f14] to-[#0a1a11] border border-[#1e3a28] rounded-[14px] p-[22px]">
            <h2 className="font-['Space_Grotesk'] text-[14px] tracking-[2px] uppercase text-[#d7e02b] m-0 mb-1.5 flex items-center gap-2 before:content-['›'] before:text-[#e8226f]">
              Team Builder
            </h2>
            <div className="text-[11px] text-[#7fae8d] mb-[18px]">Add 3 members to complete the frame</div>

            <div className="border border-[#1e3a28] rounded-xl p-4 mb-4 bg-[#d7e02b]/5">
              <label className="block text-[11px] tracking-[1.5px] uppercase text-[#7fae8d] mb-1.5">Team Name</label>
              <input 
                type="text" 
                placeholder="e.g. THE SIGNAL BUILDERS" 
                maxLength="40"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-[#081a10] border border-[#1e3a28] rounded-lg px-3 py-2.5 text-[#eaf5ee] font-mono text-[13px] tracking-[0.5px] outline-none transition-all duration-150 focus:border-[#d7e02b] focus:ring-[3px] focus:ring-[#d7e02b]/10 placeholder:text-[#4a6b57]"
              />
            </div>

            <div id="membersWrap">
              {members.map((m, i) => (
                <div key={i} className="border border-[#1e3a28] rounded-xl p-4 mb-4 bg-white/5">
                  <div className="font-['Space_Grotesk'] text-[12px] tracking-[1.5px] uppercase text-[#eaf5ee] mb-3 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#e8226f] text-[#0c1f14] text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                    Member
                  </div>
                  <div className="mb-3.5">
                    <label className="block text-[11px] tracking-[1.5px] uppercase text-[#7fae8d] mb-1.5">Photo</label>
                    <div 
                      className={`relative border-[1.5px] border-dashed rounded-[10px] p-[16px_12px] text-center cursor-pointer transition-colors duration-150 mb-3 ${m.isDragging ? 'border-[#d7e02b] bg-[#0b2216]' : m.photoUrl ? 'border-[#d7e02b] bg-[#081a10]' : 'border-[#1e3a28] bg-[#081a10] hover:border-[#d7e02b] hover:bg-[#0b2216]'}`}
                      onDragOver={(e) => { e.preventDefault(); updateMember(i, 'isDragging', true); }}
                      onDragLeave={() => updateMember(i, 'isDragging', false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        updateMember(i, 'isDragging', false);
                        const file = e.dataTransfer.files?.[0];
                        handleFile(i, file);
                      }}
                    >
                      {m.photoUrl && <img src={m.photoUrl} className="w-11 h-11 rounded-lg object-cover mx-auto mb-2 border border-[#1e3a28]" alt="" />}
                      <div className={`text-[12px] mb-0.5 ${m.photoUrl ? 'text-[#d7e02b]' : 'text-[#eaf5ee]'}`}>
                        {m.fileName ? (m.fileName.length > 22 ? m.fileName.slice(0, 19) + '…' : m.fileName) : 'Click or drop a photo'}
                      </div>
                      <div className="text-[10px] text-[#7fae8d]">JPG or PNG</div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleFile(i, e.target.files?.[0])}
                      />
                    </div>
                    {m.photoUrl && (
                      <div className="flex items-center gap-2 mb-3">
                        <label className="m-0 whitespace-nowrap text-[11px] tracking-[1.5px] uppercase text-[#7fae8d]">Zoom</label>
                        <input 
                          type="range" 
                          min="100" 
                          max="220" 
                          value={m.zoom} 
                          onChange={(e) => updateMember(i, 'zoom', e.target.value)}
                          className="flex-1 accent-[#d7e02b]" 
                        />
                        <span className="text-[10px] text-[#7fae8d] w-[34px] text-right">{m.zoom}%</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-3.5">
                    <label className="block text-[11px] tracking-[1.5px] uppercase text-[#7fae8d] mb-1.5">Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ARJUN NAIR" 
                      maxLength="20"
                      value={m.name}
                      onChange={(e) => updateMember(i, 'name', e.target.value)}
                      className="w-full bg-[#081a10] border border-[#1e3a28] rounded-lg px-3 py-2.5 text-[#eaf5ee] font-mono text-[13px] tracking-[0.5px] outline-none transition-all duration-150 focus:border-[#d7e02b] focus:ring-[3px] focus:ring-[#d7e02b]/10 placeholder:text-[#4a6b57]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[1.5px] uppercase text-[#7fae8d] mb-1.5">Role</label>
                    <input 
                      type="text" 
                      placeholder="e.g. BACKEND" 
                      maxLength="18"
                      value={m.role}
                      onChange={(e) => updateMember(i, 'role', e.target.value)}
                      className="w-full bg-[#081a10] border border-[#1e3a28] rounded-lg px-3 py-2.5 text-[#eaf5ee] font-mono text-[13px] tracking-[0.5px] outline-none transition-all duration-150 focus:border-[#d7e02b] focus:ring-[3px] focus:ring-[#d7e02b]/10 placeholder:text-[#4a6b57]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleDownload}
              className="w-full py-[13px] px-4 rounded-lg border-none font-mono font-bold text-[13px] tracking-[1.5px] uppercase cursor-pointer transition-all duration-100 active:scale-95 bg-[#d7e02b] text-[#101a10] hover:brightness-110"
            >
              Download Team Frame
            </button>
            <button 
              onClick={handleReset}
              className="w-full py-[13px] px-4 rounded-lg font-mono font-bold text-[13px] tracking-[1.5px] uppercase cursor-pointer transition-all duration-100 active:scale-95 bg-transparent text-[#e8226f] border border-[#e8226f] mt-2.5 hover:bg-[#e8226f]/10"
            >
              Reset
            </button>

            <div className="text-[11px] text-[#7fae8d] leading-relaxed mt-4 pt-3.5 border-t border-dashed border-[#1e3a28]">
              <b className="text-[#eaf5ee]">Tip:</b> you don't need to fill all 3 members. If you have fewer, just leave the rest empty!
            </div>
          </div>

          <div className="flex flex-col items-center gap-[18px]">
            <div className="flex gap-2 items-center text-[11px] text-[#7fae8d] tracking-[1px] uppercase">
              <span className={`w-[7px] h-[7px] rounded-full transition-colors ${isReady ? 'bg-[#3ee089] shadow-[0_0_8px_#3ee089]' : 'bg-[#e8226f] shadow-[0_0_8px_#e8226f]'}`}></span>
              <span>{isReady ? 'Frame ready — download it below' : 'Waiting for team name & photos'}</span>
            </div>
            <div 
              className="relative w-full flex justify-center [perspective:1000px]" 
              ref={shellRef}
            >
              <canvas 
                ref={canvasRef}
                className="w-full max-w-[800px] h-auto rounded-[18px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] block [transform-style:preserve-3d] transition-all duration-150 hover:shadow-[0_45px_80px_-20px_rgba(0,0,0,0.85),0_0_40px_rgba(215,224,43,0.15)]"
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
