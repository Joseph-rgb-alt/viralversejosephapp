
import React, { useState, useRef, useEffect } from 'react';
import { NEWS_POOL, MOCK_USER, USERS_POOL, STATUS_POOL, INITIAL_POSTS } from '../constants';
import { Heart, MessageSquare, Eye, Globe, Share2, Plus, X, Camera, Video, Image, Check, Send, Edit3, RotateCcw } from 'lucide-react';
import { Post, Status, User } from '../types';
import { CommentsModal, ShareModal } from './VideoTab'; // Reuse modals

export const SocialTab: React.FC<{ active: boolean, onViewProfile: (user: User) => void }> = ({ active, onViewProfile }) => {
  const [section, setSection] = useState<'status' | 'posts' | 'news'>('posts');
  const [activeArticle, setActiveArticle] = useState<string | null>(null);
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  
  // Feed State
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);

  // Interaction State
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [sharingPost, setSharingPost] = useState<Post | null>(null);
  const [reshareText, setReshareText] = useState('');

  // Status State
  const [viewingStatus, setViewingStatus] = useState<Status | null>(null);
  const [creatingStatus, setCreatingStatus] = useState(false);
  const [otherStatuses, setOtherStatuses] = useState<Status[]>(STATUS_POOL);
  const [myStatus, setMyStatus] = useState<Status | null>(null);

  const toggleFollow = (userId: string) => {
      const newSet = new Set(followedUsers);
      if (newSet.has(userId)) newSet.delete(userId);
      else newSet.add(userId);
      setFollowedUsers(newSet);
  }

  const toggleLikePost = (postId: string) => {
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleReshare = () => {
      if (!sharingPost) return;
      const newPost: Post = {
          id: `p_${Date.now()}`,
          author: MOCK_USER,
          content: reshareText || `Shared a post by @${sharingPost.author.username}`,
          timestamp: 'Just now',
          likes: 0,
          comments: 0,
          isReshare: true,
          originalPost: sharingPost,
          mediaType: sharingPost.mediaType,
          mediaUrl: sharingPost.mediaUrl
      };
      setPosts([newPost, ...posts]);
      setSharingPost(null);
      setReshareText('');
      alert("Reposted to your feed!");
  };

  const handlePostStatus = (status: Status) => {
      setMyStatus(status);
      setCreatingStatus(false);
      // Optionally force view to 'status' section if not there
      setSection('status');
  };

  if (!active) return null;

  return (
    <div className="h-full w-full flex flex-col bg-dark-900 pt-16 pb-20 overflow-hidden">
      {/* Nav */}
      <div className="fixed top-0 w-full bg-dark-800/90 backdrop-blur z-10 border-b border-white/10 pt-10 pb-2 px-4 flex justify-between items-center">
         <h1 className="text-xl font-bold text-neon-blue">Social</h1>
         <div className="flex bg-dark-700 rounded-lg p-1">
             {['status', 'posts', 'news'].map((s) => (
                 <button 
                    key={s}
                    onClick={() => setSection(s as any)}
                    className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${section === s ? 'bg-dark-600 text-white font-bold' : 'text-gray-400'}`}
                 >
                     {s}
                 </button>
             ))}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
          
          {/* STATUS SECTION */}
          {section === 'status' && (
              <div className="space-y-4">
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                      {/* MY STATUS */}
                      <div 
                        className="flex-shrink-0 w-24 flex flex-col items-center gap-2 cursor-pointer" 
                        onClick={() => myStatus ? setViewingStatus(myStatus) : setCreatingStatus(true)}
                      >
                          <div className={`w-20 h-20 rounded-full p-1 relative flex items-center justify-center bg-dark-800 ${myStatus ? 'border-2 border-neon-blue' : 'border-2 border-dashed border-gray-600'}`}>
                              <img src={MOCK_USER.avatar} className="w-full h-full rounded-full object-cover" alt="My Status" />
                              
                              {!myStatus && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <Plus className="text-white w-8 h-8 opacity-50" />
                                  </div>
                              )}
                              
                              <div className="absolute bottom-0 right-0 bg-neon-blue text-black rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                  {myStatus ? <Eye size={14}/> : '+'}
                              </div>
                          </div>
                          <span className="text-xs text-gray-300">You</span>
                      </div>

                      {/* OTHER STATUSES */}
                      {otherStatuses.map(status => (
                           <div key={status.id} className="flex-shrink-0 w-24 flex flex-col items-center gap-2 cursor-pointer" onClick={() => setViewingStatus(status)}>
                            <div className={`w-20 h-20 rounded-full border-2 p-1 ${status.viewed ? 'border-gray-600' : 'border-neon-purple'}`}>
                                <img src={status.author.avatar} className="w-full h-full rounded-full object-cover" alt="Status" />
                            </div>
                            <span className="text-xs text-gray-300 truncate w-full text-center">{status.author.username}</span>
                        </div>
                      ))}
                  </div>
              </div>
          )}

          {/* POSTS SECTION */}
          {section === 'posts' && (
              <div className="space-y-6">
                  {/* Create Post Mock */}
                  <div className="bg-dark-800 p-4 rounded-xl border border-white/5">
                      <div className="flex gap-3 mb-3">
                          <img src={MOCK_USER.avatar} className="w-10 h-10 rounded-full" />
                          <input type="text" placeholder="What's on your mind?" className="bg-transparent w-full outline-none text-white placeholder-gray-500" />
                      </div>
                  </div>

                  {/* Feed */}
                  {posts.map(post => (
                      <div key={post.id} className="bg-dark-800 rounded-xl overflow-hidden border border-white/5">
                        <div className="p-4 flex items-center gap-3">
                            <img src={post.author.avatar} className="w-10 h-10 rounded-full cursor-pointer" onClick={() => onViewProfile(post.author)} />
                            <div>
                                <h4 className="font-bold text-sm flex items-center gap-2 cursor-pointer hover:underline" onClick={() => onViewProfile(post.author)}>
                                    {post.author.username}
                                    {post.isReshare && <span className="text-xs text-gray-500 font-normal">reshared</span>}
                                </h4>
                                <p className="text-xs text-gray-400">{post.timestamp}</p>
                            </div>
                            {post.author.id !== MOCK_USER.id && (
                                <button 
                                    onClick={() => toggleFollow(post.author.id)}
                                    className={`ml-auto text-xs font-bold px-3 py-1 rounded-full border transition-all ${followedUsers.has(post.author.id) ? 'bg-white text-black border-white' : 'text-neon-blue border-neon-blue'}`}
                                >
                                    {followedUsers.has(post.author.id) ? 'Following' : 'Follow'}
                                </button>
                            )}
                        </div>
                        <div className="px-4 pb-2">
                            <p className="text-sm mb-2">{post.content}</p>
                        </div>
                        
                        {post.isReshare && post.originalPost && (
                            <div className="mx-4 mb-4 border border-white/10 rounded-lg overflow-hidden">
                                <div className="bg-dark-900 p-2 text-xs text-gray-400 cursor-pointer" onClick={() => onViewProfile(post.originalPost!.author)}>
                                    @{post.originalPost.author.username} originally posted:
                                </div>
                                {post.originalPost.mediaUrl && (
                                     <img src={post.originalPost.mediaUrl} className="w-full h-48 object-cover" />
                                )}
                                <div className="p-2 text-sm text-gray-300 italic">{post.originalPost.content}</div>
                            </div>
                        )}

                        {!post.isReshare && post.mediaUrl && (
                            <img src={post.mediaUrl} className="w-full h-64 object-cover" />
                        )}

                        <div className="p-4 flex justify-between border-t border-white/5 text-gray-400">
                            <button onClick={() => toggleLikePost(post.id)} className="flex items-center gap-2 hover:text-red-500"><Heart className="w-5 h-5" /> {post.likes}</button>
                            <button onClick={() => setCommentingPostId(post.id)} className="flex items-center gap-2 hover:text-blue-500"><MessageSquare className="w-5 h-5" /> {post.comments}</button>
                            <button onClick={() => setSharingPost(post)} className="flex items-center gap-2 hover:text-green-500"><Share2 className="w-5 h-5" /> Share</button>
                        </div>
                    </div>
                  ))}
              </div>
          )}

          {/* NEWS SECTION */}
          {section === 'news' && (
              <div className="space-y-4">
                  {NEWS_POOL.map(news => (
                      <div key={news.id} className="bg-dark-800 rounded-xl overflow-hidden border border-white/5 hover:border-neon-purple/50 transition-colors cursor-pointer" onClick={() => setActiveArticle(activeArticle === news.id ? null : news.id)}>
                          <div className="relative h-48">
                              <img src={news.imageUrl} className="w-full h-full object-cover" />
                              <span className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs font-bold text-white">{news.category}</span>
                          </div>
                          <div className="p-4">
                              <h3 className="text-lg font-bold mb-2">{news.title}</h3>
                              <p className="text-gray-400 text-sm">{news.summary}</p>
                              
                              {activeArticle === news.id && (
                                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-300 animate-fade-in">
                                      {news.content}
                                  </div>
                              )}

                              <div className="flex gap-4 mt-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {news.likes}</span>
                                  <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {news.comments}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>

      {/* MODALS */}
      {commentingPostId && (
          <CommentsModal videoId={commentingPostId} currentUser={MOCK_USER} onClose={() => setCommentingPostId(null)} />
      )}

      {sharingPost && (
          <>
            {reshareText !== '' ? null : (
                 <ShareModal 
                    content={sharingPost} 
                    isPost={true}
                    onClose={() => setSharingPost(null)} 
                    onReshare={() => setReshareText(' ')} // Trigger reshare UI
                />
            )}
             {/* Reshare UI Overlay */}
             {reshareText !== '' && (
                 <div className="fixed inset-0 z-[70] bg-black/80 flex flex-col justify-center px-4">
                     <div className="bg-dark-800 p-4 rounded-xl space-y-4">
                         <div className="flex justify-between">
                             <h3 className="font-bold">Repost</h3>
                             <button onClick={() => { setReshareText(''); setSharingPost(null); }}><X /></button>
                         </div>
                         <textarea 
                            className="w-full bg-dark-900 p-3 rounded-lg text-white outline-none h-24"
                            placeholder="Add your thoughts..."
                            value={reshareText === ' ' ? '' : reshareText}
                            onChange={e => setReshareText(e.target.value)}
                         />
                         <div className="border border-white/10 rounded p-2 flex gap-2 opacity-70">
                             {sharingPost.mediaUrl && <img src={sharingPost.mediaUrl} className="w-10 h-10 object-cover rounded" />}
                             <div className="text-xs overflow-hidden">
                                 <div className="font-bold">@{sharingPost.author.username}</div>
                                 <div className="truncate">{sharingPost.content}</div>
                             </div>
                         </div>
                         <button onClick={handleReshare} className="w-full bg-neon-purple py-3 rounded-lg font-bold text-white">Post to Feed</button>
                     </div>
                 </div>
             )}
          </>
      )}

      {/* STATUS VIEWER */}
      {viewingStatus && (
          <div className="fixed inset-0 z-[80] bg-black flex flex-col">
              <div className="h-1 w-full flex gap-1 px-1 pt-1">
                  {/* Progress Bar Mock */}
                  <div className="h-full bg-white flex-1 rounded-full animate-pulse"></div>
              </div>
              <div className="p-4 flex items-center gap-3 z-10">
                  <img src={viewingStatus.author.avatar} className="w-10 h-10 rounded-full border border-white cursor-pointer" onClick={() => { setViewingStatus(null); onViewProfile(viewingStatus.author); }} />
                  <div>
                      <h4 className="font-bold text-sm shadow-black drop-shadow-md cursor-pointer" onClick={() => { setViewingStatus(null); onViewProfile(viewingStatus.author); }}>{viewingStatus.author.username}</h4>
                      <p className="text-xs text-gray-300 shadow-black drop-shadow-md">Just now</p>
                  </div>
                  <button onClick={() => setViewingStatus(null)} className="ml-auto"><X className="drop-shadow-md" /></button>
              </div>
              
              <div className="flex-1 relative flex items-center justify-center bg-dark-900">
                  {viewingStatus.mediaType === 'image' ? (
                      <img src={viewingStatus.mediaUrl} className="w-full h-full object-contain" />
                  ) : (
                      <video src={viewingStatus.mediaUrl} autoPlay className="w-full h-full object-contain" />
                  )}
              </div>

              <div className="p-4 bg-black/20 backdrop-blur-sm flex gap-2">
                  <input className="flex-1 bg-transparent border border-white/30 rounded-full px-4 py-2 text-white placeholder-gray-300 outline-none" placeholder="Reply..." />
                  <button><Heart className="w-6 h-6" /></button>
              </div>
          </div>
      )}

      {/* STATUS CREATOR */}
      {creatingStatus && <StatusCreator onClose={() => setCreatingStatus(false)} onPost={handlePostStatus} />}
    </div>
  );
};

// Mini Component for Creating Status (Simplified AddTab Logic)
const StatusCreator: React.FC<{ onClose: () => void, onPost: (s: Status) => void }> = ({ onClose, onPost }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [media, setMedia] = useState<{url: string, type: 'image' | 'video'} | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 mins max
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; });
        return () => { if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop()); }
    }, []);

    const startRecording = () => {
        setIsRecording(true);
        if (videoRef.current?.srcObject) {
            const mr = new MediaRecorder(videoRef.current.srcObject as MediaStream);
            mediaRecorderRef.current = mr;
            mr.ondataavailable = e => chunksRef.current.push(e.data);
            mr.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                setMedia({ url: URL.createObjectURL(blob), type: 'video' });
            };
            mr.start();
            // Timer logic would go here
        }
    };

    const stopRecording = () => {
        setIsRecording(false);
        mediaRecorderRef.current?.stop();
    };

    const takePhoto = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current?.videoWidth || 0;
        canvas.height = videoRef.current?.videoHeight || 0;
        canvas.getContext('2d')?.drawImage(videoRef.current!, 0, 0);
        setMedia({ url: canvas.toDataURL('image/jpeg'), type: 'image' });
    };

    const handlePost = () => {
        if (!media) return;
        onPost({
            id: Date.now().toString(),
            author: MOCK_USER,
            mediaUrl: media.url,
            mediaType: media.type,
            timestamp: Date.now(),
            viewed: false
        });
    };

    return (
        <div className="fixed inset-0 z-[90] bg-black flex flex-col">
            {!media ? (
                <>
                    <video ref={videoRef} autoPlay muted className="flex-1 object-cover" />
                    <button onClick={onClose} className="absolute top-4 left-4 bg-black/40 p-2 rounded-full"><X className="text-white" /></button>
                    <div className="absolute bottom-10 w-full flex justify-center items-center gap-8">
                        <button className="p-4 bg-white/10 rounded-full"><Image className="text-white" /></button>
                        <button 
                            onClick={isRecording ? stopRecording : takePhoto}
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onTouchStart={startRecording}
                            onTouchEnd={stopRecording}
                            className={`w-20 h-20 border-4 border-white rounded-full ${isRecording ? 'bg-red-500 scale-110' : 'bg-white/20'}`}
                        />
                        <div className="w-14"></div>
                    </div>
                    <div className="absolute bottom-32 w-full text-center text-sm font-bold text-white shadow-black drop-shadow-md">
                        Hold for Video (Max 2m) • Tap for Photo
                    </div>
                </>
            ) : (
                <>
                    {media.type === 'image' ? <img src={media.url} className="flex-1 object-contain bg-dark-900" /> : <video src={media.url} controls className="flex-1 object-contain bg-dark-900" />}
                     <div className="absolute top-4 left-4 right-4 flex justify-between">
                         <button onClick={() => { setMedia(null); chunksRef.current = []; }} className="bg-black/40 p-2 rounded-full"><X className="text-white" /></button>
                         <button className="bg-black/40 p-2 rounded-full"><Edit3 className="text-white" /></button>
                     </div>
                     <div className="p-6 bg-dark-900">
                         <button onClick={handlePost} className="w-full bg-neon-blue py-3 rounded-xl font-bold flex justify-center gap-2">Post Status <Send /></button>
                     </div>
                </>
            )}
        </div>
    );
};
