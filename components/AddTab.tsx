import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Zap, Filter, X, Send, Check, Music, Wand2, Gauge, Timer, Video as VideoIcon, Heart, Users } from 'lucide-react';
import { FILTERS, MUSIC_TRACKS, USERS_POOL, VIRTUAL_GIFTS } from '../constants';
import { LiveComment, MusicTrack, Gift, User, Video } from '../types';

interface AddTabProps {
    active: boolean;
    currentUser: User;
    onPostVideo: (video: Video) => void;
}

export const AddTab: React.FC<AddTabProps> = ({ active, currentUser, onPostVideo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Modes
  const [mode, setMode] = useState<'photo' | 'video' | 'live'>('photo');
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  
  // Tools State
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [speed, setSpeed] = useState(1);
  const [beautyLevel, setBeautyLevel] = useState(0);
  const [timer, setTimer] = useState(0);
  const [flash, setFlash] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<MusicTrack | null>(null);
  
  // UI Toggles
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [showTimerSelect, setShowTimerSelect] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<{type: 'photo' | 'video', url: string} | null>(null);
  const [lastThumbnail, setLastThumbnail] = useState<{type: 'photo' | 'video', url: string} | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');

  // Live Stream State
  const [liveState, setLiveState] = useState<'setup' | 'broadcasting' | 'ended'>('setup');
  const [liveTitle, setLiveTitle] = useState('');
  const [liveTopic, setLiveTopic] = useState('Just Chatting');
  const [liveViewers, setLiveViewers] = useState(0);
  const [liveComments, setLiveComments] = useState<LiveComment[]>([]);
  const [liveGifts, setLiveGifts] = useState<{gift: Gift, user: string, id: string}[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<{id: number, left: string}[]>([]);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const liveIntervalRef = useRef<any>(null);

  // Initialize Camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (active && !isEditing) {
      navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: cameraFacing }, 
          audio: mode !== 'photo' 
      })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
          }
        })
        .catch(err => console.error("Camera access denied", err));
    } else {
        // Stop stream
        if (videoRef.current && videoRef.current.srcObject) {
             const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
             tracks.forEach(t => t.stop());
             videoRef.current.srcObject = null;
        }
    }

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      clearInterval(recordingTimerRef.current);
      clearInterval(liveIntervalRef.current);
    };
  }, [active, mode, isEditing, cameraFacing]);

  // Livestream Simulation
  useEffect(() => {
      if (mode === 'live' && liveState === 'broadcasting') {
          setLiveViewers(200);
          
          liveIntervalRef.current = setInterval(() => {
              // Random viewers
              setLiveViewers(prev => prev + Math.floor(Math.random() * 10) - 4);

              // Random Comments
              if (Math.random() > 0.6) {
                  const user = USERS_POOL[Math.floor(Math.random() * USERS_POOL.length)];
                  const comments = ["Cool!", "Wow", "Nice view", "Hello!", "Notice me", "ViralVerse OP", "❤️", "Where are you?"];
                  const newComment: LiveComment = {
                      id: Date.now().toString(),
                      userId: user.id,
                      username: user.username,
                      avatar: user.avatar,
                      text: comments[Math.floor(Math.random() * comments.length)]
                  };
                  setLiveComments(prev => [newComment, ...prev].slice(0, 20));
              }

              // Random Gifts
              if (Math.random() > 0.9) {
                  const user = USERS_POOL[Math.floor(Math.random() * USERS_POOL.length)];
                  const gift = VIRTUAL_GIFTS[Math.floor(Math.random() * VIRTUAL_GIFTS.length)];
                  const giftId = Date.now().toString();
                  setLiveGifts(prev => [...prev, { gift, user: user.username, id: giftId }]);
                  setTimeout(() => {
                      setLiveGifts(prev => prev.filter(g => g.id !== giftId));
                  }, 3000);
              }

              // Floating Hearts
              if (Math.random() > 0.5) {
                  const id = Date.now();
                  setFloatingHearts(prev => [...prev, { id, left: Math.random() * 80 + 10 + '%' }]);
                  setTimeout(() => {
                      setFloatingHearts(prev => prev.filter(h => h.id !== id));
                  }, 2000);
              }

          }, 800);
      } else {
          clearInterval(liveIntervalRef.current);
      }
      return () => clearInterval(liveIntervalRef.current);
  }, [mode, liveState]);


  // --- HANDLERS ---

  const toggleCamera = () => setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');

  const startCountdown = () => {
      if (timer > 0) {
          let count = timer;
          setCountdown(count);
          const int = setInterval(() => {
              count--;
              setCountdown(count);
              if (count === 0) {
                  clearInterval(int);
                  setCountdown(null);
                  startRecording();
              }
          }, 1000);
      } else {
          startRecording();
      }
  };

  const startRecording = () => {
      if (!videoRef.current?.srcObject) return;
      
      setIsRecording(true);
      setRecordingTime(0);
      chunksRef.current = [];
      
      const stream = videoRef.current.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const media = { type: 'video' as const, url };
          setCapturedMedia(media);
          setLastThumbnail(media);
          setIsEditing(true);
      };

      mediaRecorder.start();
      
      // Max duration updated to 3 hours for long videos simulation
      const MAX_DURATION = 3 * 60 * 60; 
      
      recordingTimerRef.current = setInterval(() => {
          setRecordingTime(prev => {
              if (prev >= MAX_DURATION) { 
                  stopRecording();
                  return prev;
              }
              return prev + 1;
          });
      }, 1000);
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          clearInterval(recordingTimerRef.current);
      }
  };

  const capturePhoto = () => {
      if (videoRef.current && canvasRef.current) {
           const context = canvasRef.current.getContext('2d');
           if (context) {
               canvasRef.current.width = videoRef.current.videoWidth;
               canvasRef.current.height = videoRef.current.videoHeight;
               context.drawImage(videoRef.current, 0, 0);
               const dataUrl = canvasRef.current.toDataURL('image/png');
               const media = { type: 'photo' as const, url: dataUrl };
               setCapturedMedia(media);
               setLastThumbnail(media);
               setIsEditing(true);
           }
       }
  };

  const formatDuration = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePost = () => {
      if (!capturedMedia) return;

      if (capturedMedia.type === 'video') {
          // Determine Shorts (< 10 mins) vs Long Video (>= 10 mins)
          const durationInSeconds = recordingTime;
          // 10 minutes = 600 seconds
          const isShort = durationInSeconds < 600;

          const newVideo: Video = {
              id: `v_${Date.now()}`,
              url: capturedMedia.url,
              thumbnail: capturedMedia.url, // Use video as thumb for now
              author: currentUser,
              description: description || (isShort ? 'New Short' : 'New Video'),
              likes: 0,
              comments: 0,
              shares: 0,
              type: isShort ? 'short' : 'long',
              duration: formatDuration(durationInSeconds),
              isExclusive: false,
              isAd: false
          };

          onPostVideo(newVideo);
          alert(isShort ? "Posted to Shorts!" : "Posted to Long Videos!");
      } else {
          alert("Photo posting is currently only supported for Status in Social Tab.");
      }

      setCapturedMedia(null);
      setIsEditing(false);
      setDescription('');
      setSelectedMusic(null);
  };

  const goLive = () => {
      if (!liveTitle) return alert("Please enter a title!");
      setLiveState('broadcasting');
  };

  const endLive = () => {
      setLiveState('ended');
      setTimeout(() => {
          setLiveState('setup');
          setMode('video');
      }, 3000);
  };

  const cycleFilter = () => {
    const currentIndex = FILTERS.indexOf(activeFilter);
    const nextIndex = (currentIndex + 1) % FILTERS.length;
    setActiveFilter(FILTERS[nextIndex]);
  };

  if (!active) return null;

  // --- EDIT SCREEN ---
  if (isEditing && capturedMedia) {
      return (
          <div className="absolute inset-0 bg-black z-50 flex flex-col pb-16 overflow-y-auto animate-fade-in">
               <div className="relative h-[60vh] bg-dark-800">
                  {capturedMedia.type === 'photo' ? (
                      <img src={capturedMedia.url} className={`w-full h-full object-contain transition-all duration-300 ${activeFilter.class}`} style={{filter: `brightness(${1 + beautyLevel/200})`}} />
                  ) : (
                      <video src={capturedMedia.url} autoPlay loop className={`w-full h-full object-contain transition-all duration-300 ${activeFilter.class}`} style={{filter: `brightness(${1 + beautyLevel/200})`}} />
                  )}
                  <button onClick={() => { setIsEditing(false); setCapturedMedia(null); }} className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white"><X /></button>
                  {selectedMusic && (
                      <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full flex items-center gap-2 text-white text-xs">
                          <Music size={12} /> {selectedMusic.title}
                      </div>
                  )}
               </div>
               
               <div className="p-6 bg-dark-900 flex-1 space-y-4">
                   {/* Filter Selector in Edit Mode */}
                  <div className="space-y-2">
                      <h3 className="text-xs font-bold text-gray-400 uppercase">Add Filter</h3>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                          {FILTERS.map(f => (
                              <button 
                                key={f.name}
                                onClick={() => setActiveFilter(f)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${activeFilter.name === f.name ? 'bg-neon-blue text-black border-neon-blue' : 'bg-transparent text-white border-gray-600'}`}
                              >
                                  {f.name}
                              </button>
                          ))}
                      </div>
                  </div>

                  <textarea 
                      className="w-full bg-dark-800 p-4 rounded-xl text-white outline-none h-24 resize-none border border-white/10 focus:border-neon-blue"
                      placeholder="Describe your creation... #viral"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                  />
                  <button onClick={handlePost} className="w-full py-4 bg-neon-blue rounded-xl font-bold text-black flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                      Post <Send size={18} />
                  </button>
               </div>
          </div>
      );
  }

  // --- LIVE STREAM BROADCAST UI ---
  if (mode === 'live' && liveState === 'broadcasting') {
      return (
          <div className="absolute inset-0 bg-black z-50">
              {/* Video with active filter applied */}
              <video 
                ref={videoRef} 
                autoPlay 
                className={`w-full h-full object-cover opacity-80 transition-all duration-300 ${activeFilter.class} ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`} 
              />
              
              {/* Header */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                  <div className="flex gap-2">
                      <div className="bg-black/40 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 text-white">
                          <img src={USERS_POOL[0].avatar} className="w-8 h-8 rounded-full" />
                          <div>
                              <h3 className="text-xs font-bold">{liveTitle}</h3>
                              <span className="text-[10px] text-neon-green">LIVE • {liveTopic}</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                      <button onClick={endLive} className="bg-red-600 p-2 rounded-full text-white font-bold text-xs">END</button>
                      <div className="bg-black/40 px-2 py-1 rounded flex items-center gap-1 text-white text-xs">
                          <Users size={12} /> {liveViewers}
                      </div>
                  </div>
              </div>

              {/* Host Controls */}
              <div className="absolute right-4 top-24 flex flex-col gap-4 z-20">
                  <ToolButton icon={<RotateCcw />} label="Flip" onClick={toggleCamera} />
                  <ToolButton icon={<Wand2 />} label="Effects" onClick={cycleFilter} />
                  <ToolButton icon={<Zap />} label="Flash" onClick={() => setFlash(!flash)} active={flash} />
              </div>

              {/* Floating Hearts Animation */}
              {floatingHearts.map(h => (
                  <div key={h.id} className="absolute bottom-20 text-neon-blue animate-float" style={{left: h.left, fontSize: '24px'}}>
                      <Heart fill="currentColor" />
                  </div>
              ))}

              {/* Gift Animations */}
              <div className="absolute top-1/2 left-0 w-full flex flex-col items-center gap-2 pointer-events-none">
                  {liveGifts.map(g => (
                      <div key={g.id} className="bg-gradient-to-r from-neon-purple to-neon-blue p-2 rounded-full flex items-center gap-2 text-white animate-pulse z-20">
                          <span className="font-bold text-xs">{g.user} sent {g.gift.name}</span>
                          <span className="text-2xl">{g.gift.icon}</span>
                      </div>
                  ))}
              </div>

              {/* Chat Overlay */}
              <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/50 to-transparent p-4 flex flex-col justify-end">
                  <div className="overflow-y-auto h-40 space-y-2 no-scrollbar flex flex-col-reverse">
                      {liveComments.map(c => (
                          <div key={c.id} className="flex items-start gap-2 text-sm text-white">
                              <img src={c.avatar} className="w-6 h-6 rounded-full" />
                              <div>
                                  <span className="font-bold text-gray-300 mr-2">{c.username}</span>
                                  <span>{c.text}</span>
                              </div>
                          </div>
                      ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                      <input placeholder="Say something..." className="flex-1 bg-white/10 rounded-full px-4 py-2 text-white outline-none" />
                      <button className="p-2 bg-neon-blue rounded-full text-black"><Send size={16} /></button>
                  </div>
              </div>
          </div>
      );
  }

  // --- LIVE SETUP UI ---
  if (mode === 'live' && liveState === 'setup') {
      return (
          <div className="absolute inset-0 bg-black z-50 flex flex-col">
              <div className="flex-1 relative">
                 <video 
                    ref={videoRef} 
                    autoPlay 
                    className={`w-full h-full object-cover opacity-50 ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`} 
                 />
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-6">
                     <h2 className="text-2xl font-bold text-white">Go LIVE</h2>
                     <input 
                        value={liveTitle} 
                        onChange={e => setLiveTitle(e.target.value)}
                        placeholder="Add a title to chat..." 
                        className="bg-transparent border-b border-white text-center text-white text-xl outline-none placeholder-gray-400 w-full"
                    />
                    <div className="flex gap-2 overflow-x-auto w-full justify-center">
                        {['Just Chatting', 'Gaming', 'Music', 'Dance', 'Fitness'].map(t => (
                            <button key={t} onClick={() => setLiveTopic(t)} className={`px-4 py-2 rounded-full text-sm ${liveTopic === t ? 'bg-neon-green text-black' : 'bg-white/20 text-white'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <button onClick={goLive} className="w-full py-4 bg-red-600 rounded-full font-bold text-white text-lg shadow-lg shadow-red-600/50">
                        Start Live Video
                    </button>
                 </div>
                 <button onClick={() => setMode('video')} className="absolute top-4 left-4 text-white"><X /></button>
                 <button onClick={toggleCamera} className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full"><RotateCcw /></button>
              </div>
          </div>
      );
  }

  // --- MAIN CAMERA UI (Shorts/Photo) ---
  return (
    <div className="absolute inset-0 bg-black z-40 flex flex-col pb-20">
      <div className="relative flex-1 overflow-hidden rounded-b-3xl bg-dark-800">
        {countdown !== null && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
                <span className="text-9xl font-bold text-white animate-ping">{countdown}</span>
            </div>
        )}

        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover transition-all duration-300 ${activeFilter.class} ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`} 
          style={{filter: `brightness(${1 + beautyLevel/100})`}}
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Top Center Music */}
        {mode !== 'photo' && (
            <button onClick={() => setShowMusicPicker(true)} className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-2">
                <Music size={14} /> {selectedMusic ? selectedMusic.title : 'Add Sound'}
            </button>
        )}
        
        {/* Recording Time Indicator */}
        {isRecording && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-red-500 px-2 py-1 rounded text-xs font-bold animate-pulse">
                {formatDuration(recordingTime)}
            </div>
        )}

        {/* Right Sidebar Tools */}
        <div className="absolute top-16 right-4 flex flex-col gap-4 z-20">
            <ToolButton icon={<RotateCcw />} label="Flip" onClick={toggleCamera} />
            {mode !== 'photo' && <ToolButton icon={<Gauge />} label="Speed" onClick={() => setShowSpeedControl(!showSpeedControl)} active={showSpeedControl} />}
            <ToolButton icon={<Wand2 />} label="Beauty" onClick={() => setBeautyLevel(prev => (prev + 20) % 120)} active={beautyLevel > 0} />
            <ToolButton icon={<Filter />} label="Filters" onClick={() => setActiveFilter(FILTERS[(FILTERS.indexOf(activeFilter) + 1) % FILTERS.length])} />
            <ToolButton icon={<Timer />} label="Timer" onClick={() => setShowTimerSelect(!showTimerSelect)} active={timer > 0} />
            <ToolButton icon={<Zap />} label="Flash" onClick={() => setFlash(!flash)} active={flash} />
        </div>

        {/* Popups */}
        {showSpeedControl && (
            <div className="absolute bottom-32 w-full flex justify-center z-20">
                <div className="bg-black/60 backdrop-blur rounded-lg p-1 flex gap-2">
                    {[0.3, 0.5, 1, 2, 3].map(s => (
                        <button key={s} onClick={() => { setSpeed(s); setShowSpeedControl(false); }} className={`px-3 py-1 rounded text-sm font-bold ${speed === s ? 'bg-white text-black' : 'text-white'}`}>
                            {s}x
                        </button>
                    ))}
                </div>
            </div>
        )}

        {showTimerSelect && (
             <div className="absolute top-16 right-16 bg-black/80 rounded p-2 flex flex-col gap-2 text-white z-30">
                 <button onClick={() => { setTimer(3); setShowTimerSelect(false); }} className="text-sm font-bold hover:text-neon-blue">3s</button>
                 <button onClick={() => { setTimer(10); setShowTimerSelect(false); }} className="text-sm font-bold hover:text-neon-blue">10s</button>
                 <button onClick={() => { setTimer(0); setShowTimerSelect(false); }} className="text-sm hover:text-red-500">Off</button>
             </div>
        )}

        {/* Music Picker Overlay */}
        {showMusicPicker && (
            <div className="absolute inset-0 bg-dark-900 z-50 flex flex-col">
                <div className="p-4 flex justify-between items-center border-b border-white/10">
                    <h3 className="font-bold text-white">Select Sound</h3>
                    <button onClick={() => setShowMusicPicker(false)}><X className="text-white" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {MUSIC_TRACKS.map(track => (
                        <div key={track.id} onClick={() => { setSelectedMusic(track); setShowMusicPicker(false); }} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer">
                            <img src={track.cover} className="w-10 h-10 rounded" />
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-white">{track.title}</h4>
                                <p className="text-xs text-gray-400">{track.artist} • {track.duration}</p>
                            </div>
                            {selectedMusic?.id === track.id && <Check className="text-neon-green" />}
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-black h-32 pt-2 pb-4 flex flex-col items-center justify-between">
         {/* Mode Switcher */}
         <div className="flex gap-6 text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">
            <button onClick={() => setMode('photo')} className={mode === 'photo' ? 'text-white scale-110' : ''}>Photo</button>
            <button onClick={() => setMode('video')} className={mode === 'video' ? 'text-white scale-110' : ''}>Video</button>
            <button onClick={() => setMode('live')} className={mode === 'live' ? 'text-white scale-110' : ''}>Live</button>
         </div>

         <div className="flex items-center gap-10">
            <div className="w-10 h-10 rounded-lg bg-gray-800 border border-white/20 overflow-hidden">
                {lastThumbnail && (
                    lastThumbnail.type === 'video' 
                    ? <video src={lastThumbnail.url} className="w-full h-full object-cover" /> 
                    : <img src={lastThumbnail.url} className="w-full h-full object-cover" />
                )}
            </div>
            
            <button 
              onClick={mode === 'photo' ? capturePhoto : (isRecording ? stopRecording : startCountdown)}
              className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all ${isRecording ? 'bg-red-600 scale-110 border-red-400' : 'bg-white hover:scale-105'}`}
            >
                {mode === 'video' && isRecording && <div className="w-6 h-6 bg-white rounded-sm"></div>}
            </button>

             <div className="w-10"></div> {/* Spacer for layout balance */}
         </div>
      </div>
    </div>
  );
};

const ToolButton: React.FC<{ icon: any, label: string, onClick: () => void, active?: boolean }> = ({ icon, label, onClick, active }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group">
        <div className={`p-2 rounded-full bg-black/40 backdrop-blur transition-colors ${active ? 'bg-neon-blue text-black' : 'text-white group-hover:bg-white/20'}`}>
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <span className="text-[10px] font-bold text-white drop-shadow">{label}</span>
    </button>
);