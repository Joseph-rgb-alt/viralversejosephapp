import React, { useState, useRef, useEffect } from 'react';
import { Video, User, Gift, Comment } from '../types';
import { VIRTUAL_GIFTS, generateComments } from '../constants';
import { Search, Heart, MessageCircle, Share2, Volume2, Gift as GiftIcon, Lock, ExternalLink, X, Copy, Send, ChevronDown } from 'lucide-react';

interface VideoTabProps {
  active: boolean;
  currentUser: User;
  onUpdateUser: (user: User) => void;
  videos: Video[];
  onViewProfile: (user: User) => void;
}

export const VideoTab: React.FC<VideoTabProps> = ({ active, currentUser, onUpdateUser, videos, onViewProfile }) => {
  const [mode, setMode] = useState<'short' | 'long'>('short');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayVideos, setDisplayVideos] = useState<Video[]>([]);
  const [audioEnhanced, setAudioEnhanced] = useState(true);
  
  // Playback State for Long Videos
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Modal States
  const [commentsOpenFor, setCommentsOpenFor] = useState<string | null>(null);
  const [shareOpenFor, setShareOpenFor] = useState<Video | null>(null);

  useEffect(() => {
    // Filter from the passed videos prop
    const filtered = videos.filter(v => 
      (searchTerm === '' || v.description.toLowerCase().includes(searchTerm.toLowerCase()) || v.author.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
      v.type === mode
    ).slice(0, 50); // Limit render for performance
    setDisplayVideos(filtered);
  }, [searchTerm, mode, videos]);

  return (
    <div className={`h-full w-full flex flex-col ${active ? 'block' : 'hidden'}`}>
      {/* Top Bar */}
      <div className="absolute top-0 w-full z-20 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search 10,000+ creators..." 
            className="w-full bg-white/10 backdrop-blur-md rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:bg-white/20 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setAudioEnhanced(!audioEnhanced)}
          className={`p-2 rounded-full backdrop-blur-md ${audioEnhanced ? 'bg-neon-green/20 text-neon-green' : 'bg-white/10 text-white'}`}
          title="Sound Enhancer"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 flex gap-6 text-sm font-bold shadow-lg">
        <button 
          onClick={() => setMode('short')}
          className={`px-4 py-1 rounded-full transition-all ${mode === 'short' ? 'text-white bg-white/20 backdrop-blur-lg border border-white/20' : 'text-gray-400'}`}
        >
          Shorts
        </button>
        <button 
          onClick={() => setMode('long')}
          className={`px-4 py-1 rounded-full transition-all ${mode === 'long' ? 'text-white bg-white/20 backdrop-blur-lg border border-white/20' : 'text-gray-400'}`}
        >
          Videos
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-black overflow-y-auto no-scrollbar snap-y snap-mandatory pb-16">
        {displayVideos.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No videos found.
          </div>
        ) : (
          displayVideos.map((video) => (
            mode === 'short' ? (
              <ShortVideoCard 
                key={video.id} 
                video={video} 
                enhancedAudio={audioEnhanced} 
                currentUser={currentUser}
                onUpdateUser={onUpdateUser}
                isCommentOpen={commentsOpenFor === video.id}
                onOpenComments={() => setCommentsOpenFor(video.id)}
                onCloseComments={() => setCommentsOpenFor(null)}
                onOpenShare={() => setShareOpenFor(video)}
                onViewProfile={onViewProfile}
              />
            ) : (
              <LongVideoCard 
                key={video.id} 
                video={video} 
                enhancedAudio={audioEnhanced}
                currentUser={currentUser}
                onUpdateUser={onUpdateUser}
                isPlaying={activeVideoId === video.id}
                onInView={() => setActiveVideoId(video.id)}
                onOpenComments={() => setCommentsOpenFor(video.id)}
                onOpenShare={() => setShareOpenFor(video)}
                onViewProfile={onViewProfile}
              />
            )
          ))
        )}
        {mode === 'long' && <div className="h-20" />}
      </div>

      {/* Global Modals (Only for Long Videos or fallback) */}
      {commentsOpenFor && mode !== 'short' && (
        <CommentsModal 
          videoId={commentsOpenFor} 
          currentUser={currentUser} 
          onClose={() => setCommentsOpenFor(null)} 
        />
      )}
      {shareOpenFor && (
        <ShareModal 
          content={shareOpenFor} 
          onClose={() => setShareOpenFor(null)} 
        />
      )}
    </div>
  );
};

interface VideoCardProps {
  video: Video;
  enhancedAudio: boolean;
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  onViewProfile: (user: User) => void;
  isPlaying?: boolean;
  onInView?: () => void;
  // Shorts Specific
  isCommentOpen?: boolean;
  onCloseComments?: () => void;
}

export const ShortVideoCard: React.FC<VideoCardProps> = ({ video, enhancedAudio, currentUser, onUpdateUser, onOpenComments, onCloseComments, onOpenShare, isCommentOpen, onViewProfile }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false); 
  const [liked, setLiked] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showSubscribeOverlay, setShowSubscribeOverlay] = useState(false);

  const isExclusive = video.isExclusive;
  const canView = !isExclusive || false; 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (canView) {
                videoRef.current?.play().catch(() => {});
                setIsPlaying(true);
            } else {
                setShowSubscribeOverlay(true);
            }
          } else {
            videoRef.current?.pause();
            setIsPlaying(false);
            setShowGiftModal(false);
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [canView]);

  const togglePlay = () => {
    if (!canView) return;
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleTap = () => {
    if (!canView) return;
    setLiked(true);
  };

  const handleGift = (gift: Gift) => {
    if (currentUser.coins >= gift.cost) {
        const updatedUser = { ...currentUser, coins: currentUser.coins - gift.cost };
        onUpdateUser(updatedUser);
        setShowGiftModal(false);
        alert(`Sent ${gift.name} to @${video.author.username}!`);
    } else {
        alert("Insufficient coins!");
    }
  };

  return (
    <div className="h-full w-full relative snap-start bg-dark-900 border-b border-dark-800/50 flex flex-col overflow-hidden">
      {isExclusive && showSubscribeOverlay && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <Lock className="w-16 h-16 text-neon-purple mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Exclusive Content</h2>
              <p className="text-gray-300 mb-6">Subscribe to @{video.author.username} to unlock this video.</p>
              <button 
                onClick={() => alert('Subscribed! (Mock)')}
                className="bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold py-3 px-8 rounded-full shadow-lg"
              >
                  Subscribe for {video.author.subscriptionPrice} Coins/mo
              </button>
          </div>
      )}

      {video.isAd ? (
           <div className="w-full h-full relative">
               <video 
                ref={videoRef}
                src={video.url} 
                className="h-full w-full object-cover"
                loop
                muted={false}
                playsInline
                onClick={togglePlay}
              />
              <div className="absolute top-24 right-4 bg-white/90 text-black px-2 py-1 text-xs font-bold rounded">Sponsored</div>
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/60 to-transparent p-6 pb-24">
                  <h2 className="text-2xl font-bold mb-2" onClick={() => onViewProfile(video.author)}>{video.author.username}</h2>
                  <p className="mb-4">{video.description}</p>
                  <a href={video.adLink} target="_blank" rel="noreferrer" className="w-full block bg-neon-blue text-black font-bold text-center py-3 rounded-xl">
                      Shop Now <ExternalLink className="inline w-4 h-4 ml-1" />
                  </a>
              </div>
           </div>
      ) : (
          <>
            {/* Video Container - Shrinks when comments are open */}
            <div className={`${isCommentOpen ? 'h-[40%] bg-black' : 'h-full'} w-full relative transition-all duration-500 ease-in-out`}>
                <video 
                    ref={videoRef}
                    src={video.url} 
                    className={`w-full h-full ${isCommentOpen ? 'object-contain' : 'object-cover'} transition-all duration-500`}
                    loop
                    muted={false}
                    playsInline
                    onClick={togglePlay}
                    onDoubleClick={handleDoubleTap}
                    style={{ filter: enhancedAudio ? 'contrast(1.1) saturate(1.1)' : 'none' }} 
                />
                {isCommentOpen && (
                    <button onClick={onCloseComments} className="absolute top-20 left-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                        <ChevronDown className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Overlay Controls - Hidden when comments are open */}
            <div className={`absolute bottom-20 right-4 flex flex-col gap-6 items-center z-10 transition-opacity duration-300 ${isCommentOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex flex-col items-center gap-1">
                    <div className="relative cursor-pointer" onClick={() => onViewProfile(video.author)}>
                        <img src={video.author.avatar} className="w-12 h-12 rounded-full border-2 border-white" />
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-neon-purple w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">+</div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <button onClick={() => setLiked(!liked)} className={`p-3 rounded-full bg-black/40 backdrop-blur-sm transition-transform active:scale-90 ${liked ? 'text-neon-blue' : 'text-white'}`}>
                        <Heart className={`w-8 h-8 ${liked ? 'fill-neon-blue' : ''}`} />
                    </button>
                    <span className="text-xs font-bold">{liked ? video.likes + 1 : video.likes}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <button onClick={onOpenComments} className="p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-white/20">
                        <MessageCircle className="w-8 h-8" />
                    </button>
                    <span className="text-xs font-bold">{video.comments}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <button onClick={() => setShowGiftModal(true)} className="p-3 rounded-full bg-black/40 backdrop-blur-sm text-neon-purple hover:bg-white/20">
                        <GiftIcon className="w-8 h-8" />
                    </button>
                    <span className="text-xs font-bold">Gift</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <button onClick={onOpenShare} className="p-3 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-white/20">
                        <Share2 className="w-8 h-8" />
                    </button>
                    <span className="text-xs font-bold">Share</span>
                </div>
            </div>

            {/* Description Overlay - Hidden when comments are open */}
            <div className={`absolute bottom-20 left-4 max-w-[70%] z-10 pointer-events-none transition-opacity duration-300 ${isCommentOpen ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex items-center gap-2 mb-2 pointer-events-auto" onClick={() => onViewProfile(video.author)}>
                    <span className="font-bold text-lg drop-shadow-md cursor-pointer hover:underline">@{video.author.username}</span>
                </div>
                <p className="text-sm text-gray-200 line-clamp-2 drop-shadow-md">{video.description}</p>
                {enhancedAudio && <div className="flex items-center gap-1 text-xs text-neon-green mt-2"><Volume2 className="w-3 h-3" /> Enhanced Audio</div>}
            </div>
            
            {/* Inline Comments Section */}
            {isCommentOpen && (
                <div className="h-[60%] w-full bg-dark-900 animate-slide-up border-t border-white/10">
                    <CommentsView videoId={video.id} currentUser={currentUser} onClose={onCloseComments} inline={true} />
                </div>
            )}

            {/* Gift Modal */}
            {showGiftModal && (
                <div className="absolute bottom-0 w-full bg-dark-800 rounded-t-3xl p-6 z-50 animate-slide-up border-t border-white/10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Send a Gift</h3>
                        <button onClick={() => setShowGiftModal(false)}><X className="w-6 h-6" /></button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {VIRTUAL_GIFTS.map(gift => (
                            <button key={gift.id} onClick={() => handleGift(gift)} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5">
                                <span className="text-2xl">{gift.icon}</span>
                                <span className="text-xs font-bold text-gray-300">{gift.name}</span>
                                <span className="text-[10px] text-neon-blue">{gift.cost}c</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
          </>
      )}
    </div>
  );
};

export const LongVideoCard: React.FC<VideoCardProps> = ({ video, enhancedAudio, currentUser, isPlaying, onInView, onOpenComments, onOpenShare, onViewProfile }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    onInView && onInView();
                }
            },
            { threshold: 0.7 }
        );
        if (videoRef.current) observer.observe(videoRef.current);
        return () => observer.disconnect();
    }, [onInView]);

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(() => {});
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    return (
        <div className="w-full mb-4 bg-dark-800 snap-start relative pb-2">
            <div className="relative aspect-video">
                <video 
                    ref={videoRef}
                    src={video.url} 
                    controls={false} // Custom controls or click to play
                    className="w-full h-full object-cover" 
                    style={{ filter: enhancedAudio ? 'contrast(1.1) saturate(1.1)' : 'none' }} 
                    onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()}
                />
                {!isPlaying && <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none"><div className="w-12 h-12 bg-white/20 rounded-full backdrop-blur flex items-center justify-center">▶</div></div>}
            </div>
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => onViewProfile(video.author)}>
                    <img src={video.author.avatar} className="w-8 h-8 rounded-full" />
                    <span className="font-bold text-sm">@{video.author.username}</span>
                </div>
                <h3 className="text-lg font-bold line-clamp-2 mb-1">{video.description}</h3>
                <div className="flex justify-between items-center text-gray-400 text-sm mb-4">
                    <span>{video.likes} likes • {video.duration}</span>
                    <div className="flex gap-4">
                        <button onClick={onOpenComments} className="hover:text-white"><MessageCircle className="w-6 h-6" /></button>
                        <button onClick={onOpenShare} className="hover:text-white"><Share2 className="w-6 h-6" /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- REUSABLE COMMENTS VIEW ---

export const CommentsView: React.FC<{ videoId: string, currentUser: User, onClose?: () => void, inline?: boolean }> = ({ videoId, currentUser, onClose, inline }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
        // Generate initial comments and mock some replies for demonstration
        const initialComments = generateComments(10).map(c => ({
            ...c,
            replies: Math.random() > 0.7 ? generateComments(2) : [] 
        }));
        setComments(initialComments);
    }, [videoId]);
  
    const handleSend = () => {
        if (!newComment.trim()) return;
        
        // If replying, find the comment and add reply, else add to top
        // For simplification here, we just add to top but with "In reply to" text if needed, 
        // or strictly nested in a real backend.
        const comment: Comment = {
            id: Date.now().toString(),
            author: currentUser,
            text: newComment,
            timestamp: Date.now(),
            likes: 0,
            replies: [],
            isLiked: false
        };
        setComments([comment, ...comments]);
        setNewComment('');
        setReplyingTo(null);
    };
  
    const handleReply = (username: string) => {
        setReplyingTo(username);
        setNewComment(`@${username} `);
        inputRef.current?.focus();
    };
  
    const handleLike = (id: string) => {
        const toggleLike = (list: Comment[]): Comment[] => {
            return list.map(c => {
                if (c.id === id) {
                    return { ...c, likes: c.likes + (c.isLiked ? -1 : 1), isLiked: !c.isLiked };
                }
                if (c.replies && c.replies.length > 0) {
                    return { ...c, replies: toggleLike(c.replies) };
                }
                return c;
            });
        };
        setComments(prev => toggleLike(prev));
    };
  
    // Recursive component for rendering comments
    const CommentItem = ({ comment, isReply = false }: { comment: Comment, isReply?: boolean }) => (
        <div className={`flex gap-3 ${isReply ? 'ml-10 mt-3' : 'mt-4'}`}>
            <img src={comment.author.avatar} className="w-8 h-8 rounded-full object-cover border border-white/10" />
            <div className="flex-1">
                <div className="flex gap-2 items-baseline">
                    <span className="text-xs font-bold text-gray-300">@{comment.author.username}</span>
                    <span className="text-[10px] text-gray-500">Just now</span>
                </div>
                <p className="text-sm text-white leading-snug">{comment.text}</p>
                <div className="flex gap-4 mt-1 text-xs text-gray-500 font-bold">
                    <button onClick={() => handleReply(comment.author.username)} className="hover:text-white transition-colors">Reply</button>
                    <button onClick={() => handleLike(comment.id)} className={`transition-colors ${comment.isLiked ? 'text-red-500' : 'hover:text-white'}`}>
                        {comment.likes} Likes
                    </button>
                </div>
                {/* Render Nested Replies */}
                {!isReply && comment.replies && comment.replies.length > 0 && (
                    <div className="border-l-2 border-white/10 pl-0">
                        {comment.replies.map(reply => (
                            <CommentItem key={reply.id} comment={reply} isReply={true} />
                        ))}
                    </div>
                )}
            </div>
            <button onClick={() => handleLike(comment.id)} className="pt-1 self-start">
                <Heart className={`w-4 h-4 transition-all active:scale-125 ${comment.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
            </button>
        </div>
    );
  
    return (
        <div className="flex flex-col h-full w-full bg-dark-800">
             {/* Header */}
            {!inline && (
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-dark-800/95 backdrop-blur z-10 rounded-t-3xl">
                    <div className="font-bold text-center w-full text-lg">Comments</div>
                    {onClose && <button onClick={onClose} className="absolute right-4 p-1 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><X size={16} /></button>}
                </div>
            )}
            {inline && (
                <div className="p-2 border-b border-white/10 bg-dark-800 flex justify-center items-center">
                    <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
                    <span className="ml-2 text-xs font-bold text-gray-400">{comments.length} comments</span>
                </div>
            )}
            
            {/* List */}
            <div className="flex-1 overflow-y-auto p-4">
                {comments.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">No comments yet. Be the first!</div>
                ) : (
                    comments.map(c => <CommentItem key={c.id} comment={c} />)
                )}
                <div className="h-4"></div>
            </div>
  
            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-dark-900 pb-8">
                <div className="flex items-center gap-2 bg-dark-700 rounded-full px-4 py-2 border border-white/5 focus-within:border-neon-blue transition-colors shadow-inner">
                    <input 
                      ref={inputRef}
                      className="bg-transparent flex-1 outline-none text-sm text-white placeholder-gray-400" 
                      placeholder={replyingTo ? `Reply to @${replyingTo}...` : "Add a comment..."}
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSend()}
                      autoFocus={inline} // Auto focus if opened inline
                    />
                    <button 
                      onClick={handleSend} 
                      className={`font-bold transition-all p-1 ${newComment.trim() ? 'text-neon-blue scale-110' : 'text-gray-500'}`}
                      disabled={!newComment.trim()}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Wrapper for Modal use case (Long Video / Social)
export const CommentsModal: React.FC<{ videoId: string, currentUser: User, onClose: () => void }> = ({ videoId, currentUser, onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-dark-800 h-[70vh] w-full rounded-t-3xl flex flex-col animate-slide-up border-t border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                <CommentsView videoId={videoId} currentUser={currentUser} onClose={onClose} />
            </div>
        </div>
    )
}

export const ShareModal: React.FC<{ content: Video | any, onClose: () => void, isPost?: boolean, onReshare?: () => void }> = ({ content, onClose, isPost, onReshare }) => {
    const copyLink = () => {
        navigator.clipboard.writeText(`https://viralverse.app/${isPost ? 'post' : 'video'}/${content.id}`);
        alert("Link copied!");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
             <div className="bg-dark-800 p-6 rounded-t-3xl animate-slide-up space-y-6" onClick={e => e.stopPropagation()}>
                 <h3 className="font-bold text-center">Share to</h3>
                 
                 <div className="flex justify-between px-2">
                     <ShareButton label="WhatsApp" color="bg-green-500" onClick={() => alert("Shared to WhatsApp")} />
                     <ShareButton label="Facebook" color="bg-blue-600" onClick={() => alert("Shared to Facebook")} />
                     <ShareButton label="X" color="bg-black border border-white/20" onClick={() => alert("Shared to X")} />
                     <ShareButton label="Instagram" color="bg-gradient-to-tr from-yellow-400 to-purple-600" onClick={() => alert("Shared to Instagram")} />
                     <ShareButton label="Telegram" color="bg-blue-400" onClick={() => alert("Shared to Telegram")} />
                 </div>

                 <div className="flex gap-4 overflow-x-auto py-2">
                      <button onClick={copyLink} className="flex flex-col items-center gap-2 min-w-[70px]">
                          <div className="w-12 h-12 bg-dark-700 rounded-full flex items-center justify-center"><Copy className="w-5 h-5" /></div>
                          <span className="text-xs">Copy Link</span>
                      </button>
                      {isPost && onReshare && (
                          <button onClick={onReshare} className="flex flex-col items-center gap-2 min-w-[70px]">
                              <div className="w-12 h-12 bg-neon-purple rounded-full flex items-center justify-center text-black"><Share2 className="w-5 h-5" /></div>
                              <span className="text-xs">Repost</span>
                          </button>
                      )}
                 </div>

                 <button onClick={onClose} className="w-full py-3 bg-dark-700 rounded-xl font-bold text-sm">Cancel</button>
             </div>
        </div>
    );
};

const ShareButton = ({label, color, onClick}: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-white font-bold text-lg`}>
            {label[0]}
        </div>
        <span className="text-xs text-gray-400">{label}</span>
    </button>
);