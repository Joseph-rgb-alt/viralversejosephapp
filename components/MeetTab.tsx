
import React, { useState, useRef, useEffect } from 'react';
import { User, Chat, ChatMessage } from '../types';
import { USERS_POOL, COUNTRIES, generateChats } from '../constants';
import { Video, Phone, Mic, Image, Lock, Send, Camera, X, Download, RotateCcw } from 'lucide-react';

interface MeetTabProps {
  active: boolean;
  currentUser: User;
  onViewProfile: (user: User) => void;
}

export const MeetTab: React.FC<MeetTabProps> = ({ active, currentUser, onViewProfile }) => {
  // Generate initial chats dynamically based on the current user
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
      if (active && chats.length === 0) {
          setChats(generateChats(currentUser, 15));
      }
  }, [active, currentUser]);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [isCapturingVideo, setIsCapturingVideo] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<{type: 'photo' | 'video', url: string} | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const userCountry = COUNTRIES.find(c => c.code === currentUser.country);
  const legalAge = userCountry ? userCountry.legalAge : 18;
  const isAllowed = currentUser.age >= legalAge;

  const selectedChat = chats.find(c => c.id === selectedChatId);

  // Camera Stream Logic
  useEffect(() => {
    if (showCamera && !capturedMedia) {
        const startStream = async () => {
            try {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(t => t.stop());
                }
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: cameraFacing }, 
                    audio: cameraMode === 'video' 
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
            } catch (e) {
                console.error("Error accessing camera", e);
            }
        };
        startStream();
    } else {
        // Cleanup if camera hidden or media captured
        if (streamRef.current && !isCapturingVideo) {
             streamRef.current.getTracks().forEach(t => t.stop());
             streamRef.current = null;
        }
    }

    return () => {
         if (streamRef.current) {
             streamRef.current.getTracks().forEach(t => t.stop());
         }
    };
  }, [showCamera, cameraMode, cameraFacing, capturedMedia]);


  const openCamera = (mode: 'photo' | 'video') => {
    setShowMediaOptions(false);
    setCameraMode(mode);
    setCapturedMedia(null);
    setShowCamera(true);
  };

  const closeCamera = () => {
      setShowCamera(false);
      setCapturedMedia(null);
      setIsCapturingVideo(false);
  };

  const toggleCameraFacing = () => {
      setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleCapture = () => {
      if (cameraMode === 'photo') {
          if (videoRef.current && canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
              const ctx = canvasRef.current.getContext('2d');
              ctx?.drawImage(videoRef.current, 0, 0);
              const url = canvasRef.current.toDataURL('image/jpeg');
              setCapturedMedia({ type: 'photo', url });
          }
      } else {
          if (isCapturingVideo) {
              mediaRecorderRef.current?.stop();
              setIsCapturingVideo(false);
          } else {
              if (!streamRef.current) return;
              chunksRef.current = [];
              const recorder = new MediaRecorder(streamRef.current);
              mediaRecorderRef.current = recorder;
              recorder.ondataavailable = e => { if(e.data.size > 0) chunksRef.current.push(e.data); };
              recorder.onstop = () => {
                  const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                  const url = URL.createObjectURL(blob);
                  setCapturedMedia({ type: 'video', url });
              };
              recorder.start();
              setIsCapturingVideo(true);
          }
      }
  };

  const handleSaveToDevice = () => {
      if (!capturedMedia) return;
      const a = document.createElement('a');
      a.href = capturedMedia.url;
      a.download = `viralverse_${Date.now()}.${capturedMedia.type === 'photo' ? 'jpg' : 'webm'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      alert("Saved to device!");
  };

  const handleSendCaptured = () => {
      if (capturedMedia) {
          handleSendMessage(capturedMedia.type === 'photo' ? 'image' : 'video', capturedMedia.url);
          closeCamera();
      }
  };

  const handleRetake = () => {
      setCapturedMedia(null);
  };

  const handleSendMessage = (type: 'text' | 'audio' | 'image' | 'video' = 'text', content: string = messageInput) => {
      if (!content && type === 'text') return;
      
      const newMessage: ChatMessage = {
          id: Date.now().toString(),
          senderId: currentUser.id,
          text: type === 'text' ? content : type === 'audio' ? 'Audio Message 🎵' : `${type === 'image' ? 'Image' : 'Video'} Attachment`,
          timestamp: Date.now(),
          mediaType: type === 'text' ? undefined : type as any,
          mediaUrl: type !== 'text' ? content : undefined
      };

      const updatedChats = chats.map(chat => {
          if (chat.id === selectedChatId) {
              return {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  lastMessage: newMessage.text,
                  lastMessageTime: newMessage.timestamp
              };
          }
          return chat;
      });
      
      setChats(updatedChats);
      setMessageInput('');
      setShowMediaOptions(false);
      setIsRecording(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          handleSendMessage(file.type.startsWith('image') ? 'image' : 'video', url);
      }
  };

  const toggleRecord = () => {
      if (isRecording) {
          handleSendMessage('audio', 'mock_audio_url');
      } else {
          setIsRecording(true);
      }
  };

  const toggleFollow = (e: React.MouseEvent, userId: string) => {
      e.stopPropagation();
      const newSet = new Set(followedUsers);
      if (newSet.has(userId)) newSet.delete(userId);
      else newSet.add(userId);
      setFollowedUsers(newSet);
  };

  if (!active) return null;

  if (!isAllowed) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-dark-900">
        <Lock className="w-20 h-20 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-gray-400">
          Based on laws in {userCountry?.name}, you must be {legalAge} years old to access the Meet tab.
          You are currently registered as {currentUser.age}.
        </p>
      </div>
    );
  }

  // FULL SCREEN CAMERA MODAL
  if (showCamera) {
      return (
          <div className="fixed inset-0 z-[60] bg-black flex flex-col">
              <div className="relative flex-1 bg-dark-800 overflow-hidden">
                  {!capturedMedia ? (
                      <>
                         <video 
                            ref={videoRef} 
                            className={`w-full h-full object-cover ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`} 
                            muted 
                            playsInline 
                            autoPlay 
                         />
                         <canvas ref={canvasRef} className="hidden" />
                         
                         <div className="absolute top-4 right-4 flex flex-col gap-4">
                             <button onClick={closeCamera} className="p-2 bg-black/50 rounded-full text-white"><X /></button>
                             <button onClick={toggleCameraFacing} className="p-2 bg-black/50 rounded-full text-white"><RotateCcw /></button>
                         </div>
                         
                         <div className="absolute bottom-8 w-full flex flex-col items-center gap-4">
                             <div className="flex gap-4 bg-black/50 px-4 py-2 rounded-full">
                                 <button onClick={() => setCameraMode('photo')} className={`${cameraMode === 'photo' ? 'text-neon-blue font-bold' : 'text-gray-400'}`}>Photo</button>
                                 <button onClick={() => setCameraMode('video')} className={`${cameraMode === 'video' ? 'text-neon-blue font-bold' : 'text-gray-400'}`}>Video</button>
                             </div>
                             <button 
                                onClick={handleCapture}
                                className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center ${isCapturingVideo ? 'bg-red-500' : 'bg-white/20 hover:bg-white'}`}
                             >
                                 {isCapturingVideo && <div className="w-6 h-6 bg-white rounded-sm" />}
                             </button>
                         </div>
                      </>
                  ) : (
                      <>
                        {capturedMedia.type === 'photo' ? (
                            <img src={capturedMedia.url} className="w-full h-full object-contain" />
                        ) : (
                            <video src={capturedMedia.url} controls className="w-full h-full object-contain" />
                        )}

                        <div className="absolute top-4 left-4 flex gap-2">
                            <button onClick={handleRetake} className="p-2 bg-black/50 rounded-full text-white flex items-center gap-2"><RotateCcw size={16} /> Retake</button>
                        </div>

                        <div className="absolute bottom-8 w-full flex justify-center gap-6">
                            <button 
                                onClick={handleSaveToDevice}
                                className="flex flex-col items-center gap-1 text-white bg-dark-700/80 p-3 rounded-xl hover:bg-dark-600"
                            >
                                <Download className="w-6 h-6" />
                                <span className="text-xs font-bold">Save</span>
                            </button>
                            <button 
                                onClick={handleSendCaptured}
                                className="flex flex-col items-center gap-1 text-black bg-neon-blue p-3 rounded-xl hover:bg-white"
                            >
                                <Send className="w-6 h-6" />
                                <span className="text-xs font-bold">Send</span>
                            </button>
                        </div>
                      </>
                  )}
              </div>
          </div>
      );
  }

  if (selectedChat) {
    const otherParticipant = selectedChat.participants.find(p => p.id !== currentUser.id) || selectedChat.participants[0];
    const isFollowing = followedUsers.has(otherParticipant.id);

    return (
      <div className="h-full flex flex-col bg-dark-900 pb-16 relative">
        {/* Chat Header */}
        <div className="p-4 bg-dark-800 flex items-center justify-between border-b border-white/10 pt-10 shadow-lg z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedChatId(null)} className="text-white text-lg mr-2 hover:text-neon-blue">←</button>
            <div className="relative cursor-pointer" onClick={() => onViewProfile(otherParticipant)}>
                <img src={otherParticipant.avatar} className="w-10 h-10 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
            </div>
            <div>
              <h3 className="font-bold leading-tight cursor-pointer" onClick={() => onViewProfile(otherParticipant)}>{otherParticipant.username}</h3>
              <button 
                onClick={(e) => toggleFollow(e, otherParticipant.id)}
                className={`text-xs font-bold px-2 py-0.5 rounded-full border transition-all ${isFollowing ? 'bg-white text-black border-white' : 'text-neon-blue border-neon-blue'}`}
              >
                  {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
          <div className="flex gap-4 text-neon-blue">
            <Phone className="w-5 h-5 cursor-pointer hover:text-white" />
            <Video className="w-5 h-5 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900">
          {selectedChat.messages.map(msg => (
             <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[75%] p-3 rounded-2xl ${msg.senderId === currentUser.id ? 'bg-neon-purple text-white rounded-tr-none' : 'bg-dark-700 text-gray-200 rounded-tl-none'}`}>
                     {msg.mediaType === 'image' && (
                         <img src={msg.mediaUrl} alt="Attachment" className="w-full rounded-lg mb-2" />
                     )}
                     {msg.mediaType === 'video' && (
                         <video src={msg.mediaUrl} controls className="w-full rounded-lg mb-2" />
                     )}
                     {msg.mediaType === 'audio' && (
                         <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                             <div className="w-0 h-0 border-l-[8px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
                             <div className="h-1 flex-1 bg-white/30 rounded-full">
                                 <div className="h-full w-1/2 bg-white rounded-full"></div>
                             </div>
                             <span className="text-xs">0:15</span>
                         </div>
                     )}
                     {msg.text}
                 </div>
             </div>
          ))}
        </div>

        {/* Media Modal */}
        {showMediaOptions && (
            <div className="absolute bottom-20 left-4 bg-dark-800 p-4 rounded-xl border border-white/10 shadow-xl z-30 animate-slide-up flex flex-col gap-3 w-48">
                <button onClick={() => openCamera('photo')} className="flex items-center gap-3 text-sm hover:text-neon-blue">
                    <Camera className="w-5 h-5" /> Take Photo
                </button>
                <button onClick={() => openCamera('video')} className="flex items-center gap-3 text-sm hover:text-neon-blue">
                    <Video className="w-5 h-5" /> Record Video
                </button>
                <label className="flex items-center gap-3 text-sm hover:text-neon-blue cursor-pointer">
                    <Image className="w-5 h-5" /> Choose from Gallery
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>
        )}

        {/* Input Area */}
        <div className="p-3 bg-dark-800 border-t border-white/10 flex items-center gap-3 z-20">
            <div className="flex gap-3 text-gray-400">
                <button 
                    onClick={() => setShowMediaOptions(!showMediaOptions)}
                    className={`p-2 rounded-full hover:bg-white/10 transition-colors ${showMediaOptions ? 'text-neon-blue bg-white/10' : ''}`}
                >
                    <Camera className="w-6 h-6" />
                </button>
                <button 
                    onMouseDown={toggleRecord}
                    onMouseUp={toggleRecord}
                    onTouchStart={toggleRecord}
                    onTouchEnd={toggleRecord}
                    className={`p-2 rounded-full hover:bg-white/10 transition-all ${isRecording ? 'text-red-500 bg-red-500/20 scale-110 animate-pulse' : ''}`}
                >
                    <Mic className="w-6 h-6" />
                </button>
            </div>
            <input 
                type="text" 
                className="flex-1 bg-dark-900 rounded-full px-4 py-2 outline-none text-white border border-transparent focus:border-neon-blue/50 transition-colors"
                placeholder={isRecording ? "Recording..." : "Type a message..."}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isRecording}
            />
            <button 
                onClick={() => handleSendMessage()}
                className={`p-2 rounded-full transition-colors ${messageInput.trim() ? 'bg-neon-blue text-black' : 'bg-dark-700 text-gray-500'}`}
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-dark-900 pt-10 pb-20 overflow-y-auto">
      <div className="px-4 py-4">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Meet & Date</h1>
        <p className="text-gray-400 text-sm">Find your viral match.</p>
      </div>

      {/* Online Users Horizontal Scroll */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-bold mb-2 text-gray-300">Suggested Matches</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
             {USERS_POOL.slice(20, 40).map(user => (
                 <div key={user.id} className="flex-shrink-0 relative w-24 h-32 rounded-xl overflow-hidden cursor-pointer group" onClick={() => onViewProfile(user)}>
                     <img src={`https://picsum.photos/seed/meet${user.id}/200/300`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                         <span className="text-xs font-bold">{user.username}, {user.age}</span>
                         <button 
                            onClick={(e) => toggleFollow(e, user.id)}
                            className={`mt-1 text-[10px] py-1 rounded-full font-bold ${followedUsers.has(user.id) ? 'bg-white text-black' : 'bg-neon-blue text-black'}`}
                         >
                             {followedUsers.has(user.id) ? 'Following' : 'Follow'}
                         </button>
                     </div>
                 </div>
             ))}
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 bg-dark-800 rounded-t-3xl p-4 min-h-0">
         <h3 className="text-lg font-bold mb-4">Messages</h3>
         <div className="space-y-2 pb-16">
            {chats.map(chat => (
                <div 
                    key={chat.id} 
                    onClick={() => setSelectedChatId(chat.id)}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                >
                    <div className="relative">
                        <img src={chat.participants.find(p => p.id !== currentUser.id)?.avatar} className="w-12 h-12 rounded-full object-cover" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                             <h4 className="font-bold truncate">{chat.participants.filter(p => p.id !== currentUser.id).map(p => p.username).join(', ')}</h4>
                             <span className="text-xs text-gray-500">2m</span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">{chat.lastMessage || 'No messages yet'}</p>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};
