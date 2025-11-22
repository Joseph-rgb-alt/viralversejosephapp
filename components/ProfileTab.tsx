import React, { useState, useRef, useEffect } from 'react';
import { User, Video, Notification } from '../types';
import { COMMUNITY_GUIDELINES, HELP_CENTER, MOCK_ANALYTICS, NOTIFICATIONS_POOL, PURCHASE_HISTORY } from '../constants';
import { Settings, Camera, Grid, LogOut, HelpCircle, FileText, CreditCard, Wallet, TrendingUp, DollarSign, Star, Lock, Film, Bell, ChevronLeft, ArrowRight, MessageCircle, Heart, Share2, Eye, Shield, Info, Gift, X } from 'lucide-react';
import { ShortVideoCard, LongVideoCard, CommentsModal, ShareModal } from './VideoTab';

interface ProfileTabProps {
  active: boolean;
  currentUser: User;
  profileUser: User; // The user whose profile is being viewed
  isVisitor: boolean; // True if currentUser != profileUser
  onLogout: () => void;
  videos: Video[];
  onBack: () => void;
}

type SubPage = 'main' | 'analytics' | 'notifications' | 'guidelines' | 'help' | 'wallet' | 'subscription';

export const ProfileTab: React.FC<ProfileTabProps> = ({ active, currentUser, profileUser, isVisitor, onLogout, videos, onBack }) => {
  const [avatar, setAvatar] = useState(profileUser.avatar);
  const [username, setUsername] = useState(profileUser.username);
  const [editing, setEditing] = useState(false);
  const [videoFilter, setVideoFilter] = useState<'short' | 'long'>('short');
  const [currentView, setCurrentView] = useState<SubPage>('main');
  const [isFollowing, setIsFollowing] = useState(false); 
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Video Viewer State
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const [commentsOpenFor, setCommentsOpenFor] = useState<string | null>(null);
  const [shareOpenFor, setShareOpenFor] = useState<Video | null>(null);

  // Filter videos belonging to this user and current category
  const myVideos = videos.filter(v => v.author.id === profileUser.id && v.type === videoFilter);

  if (!active) return null;

  const handleAvatarChange = () => {
      if (isVisitor) return;
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
          if (e.target.files[0]) {
              const url = URL.createObjectURL(e.target.files[0]);
              setAvatar(url);
          }
      };
      input.click();
  };

  const handleVideoClick = (index: number) => {
      setSelectedVideoIndex(index);
  };

  const handleCloseVideoViewer = () => {
      setSelectedVideoIndex(null);
  };

  const handleProcessPayment = (method: string) => {
      alert(`Processing payment via ${method}... \n(Mock Integration Successful!)`);
      setShowPaymentModal(false);
  };

  // --- SUB PAGE RENDERERS ---

  const renderAnalytics = () => (
      <div className="p-4 space-y-6 animate-slide-up pb-20">
          <Header title="Analytics & Earnings" onBack={() => setCurrentView('main')} />
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-800 p-4 rounded-xl border border-white/10">
                  <div className="text-gray-400 text-xs uppercase font-bold">Total Revenue</div>
                  <div className="text-3xl font-black text-neon-green mt-1">${profileUser.earnings}</div>
              </div>
              <div className="bg-dark-800 p-4 rounded-xl border border-white/10">
                  <div className="text-gray-400 text-xs uppercase font-bold">Profile Views</div>
                  <div className="text-3xl font-black text-white mt-1">12.5K</div>
              </div>
          </div>

          {/* Views Chart (CSS Bar Chart) */}
          <div className="bg-dark-800 p-4 rounded-xl border border-white/10">
              <h3 className="font-bold mb-4">Video Views (Last 7 Days)</h3>
              <div className="flex items-end gap-2 h-32">
                  {MOCK_ANALYTICS.views.map((v, i) => (
                      <div key={i} className="flex-1 bg-neon-blue/30 hover:bg-neon-blue rounded-t transition-all relative group" style={{height: `${(v / 3000) * 100}%`}}>
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-black px-1 rounded opacity-0 group-hover:opacity-100">{v}</div>
                      </div>
                  ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-gray-500 uppercase">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
          </div>

          {/* Revenue Chart */}
           <div className="bg-dark-800 p-4 rounded-xl border border-white/10">
              <h3 className="font-bold mb-4">Ad Revenue</h3>
              <div className="flex items-end gap-2 h-32">
                  {MOCK_ANALYTICS.revenue.map((v, i) => (
                      <div key={i} className="flex-1 bg-neon-green/30 hover:bg-neon-green rounded-t transition-all relative group" style={{height: `${(v / 30) * 100}%`}}>
                           <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-black px-1 rounded opacity-0 group-hover:opacity-100">${v}</div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Demographics */}
          <div className="bg-dark-800 p-4 rounded-xl border border-white/10">
              <h3 className="font-bold mb-4">Audience Age</h3>
              <div className="space-y-3">
                  {MOCK_ANALYTICS.demographics.map(d => (
                      <div key={d.ageGroup}>
                          <div className="flex justify-between text-xs mb-1">
                              <span>{d.ageGroup}</span>
                              <span>{d.percentage}%</span>
                          </div>
                          <div className="h-2 bg-black rounded-full overflow-hidden">
                              <div className="h-full bg-neon-purple" style={{width: `${d.percentage}%`}}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderNotifications = () => (
      <div className="p-4 pb-20 animate-slide-up">
          <Header title="Notifications" onBack={() => setCurrentView('main')} />
          <div className="space-y-2 mt-4">
              {NOTIFICATIONS_POOL.map(n => (
                  <div key={n.id} className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 ${n.read ? 'bg-dark-800' : 'bg-dark-700 border-neon-blue/30'}`}>
                      <div className="relative">
                          <img src={n.user.avatar} className="w-10 h-10 rounded-full" />
                          <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-black border border-black flex items-center justify-center
                              ${n.type === 'like' ? 'text-red-500' : 
                                n.type === 'comment' ? 'text-blue-500' : 
                                n.type === 'gift' ? 'text-yellow-500' : 'text-neon-purple'}`
                          }>
                              {n.type === 'like' && <Heart size={10} fill="currentColor" />}
                              {n.type === 'comment' && <MessageCircle size={10} />}
                              {n.type === 'gift' && <Gift size={10} />}
                              {n.type === 'follow' && <Star size={10} fill="currentColor" />}
                          </div>
                      </div>
                      <div className="flex-1">
                          <div className="text-sm">
                              <span className="font-bold">{n.user.username}</span> {n.text}
                          </div>
                          <div className="text-xs text-gray-500">{new Date(n.timestamp).toLocaleDateString()}</div>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-neon-blue rounded-full"></div>}
                  </div>
              ))}
          </div>
      </div>
  );

  const renderWallet = () => (
      <div className="p-4 pb-20 animate-slide-up">
          <Header title="Purchases & Gifts" onBack={() => setCurrentView('main')} />
          
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 p-6 rounded-2xl mb-6 shadow-lg">
              <div className="text-black/70 font-bold uppercase text-xs">Current Balance</div>
              <div className="text-4xl font-black text-white drop-shadow-md flex items-center gap-2">
                  {currentUser.coins} <span className="text-2xl">🪙</span>
              </div>
              <button 
                onClick={() => setShowPaymentModal(true)} 
                className="mt-4 bg-white text-black font-bold py-2 px-6 rounded-full hover:scale-105 transition-transform shadow-xl"
              >
                  Buy Coins
              </button>
          </div>

          <h3 className="font-bold mb-4 px-2">Transaction History</h3>
          <div className="space-y-3">
              {PURCHASE_HISTORY.map(t => (
                  <div key={t.id} className="bg-dark-800 p-4 rounded-xl flex justify-between items-center">
                      <div>
                          <div className="font-bold text-sm">{t.description}</div>
                          <div className="text-xs text-gray-500">{t.date}</div>
                      </div>
                      <div className={`font-bold ${t.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {t.amount > 0 ? '+' : ''}{t.amount}
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderTextPage = (title: string, content: string) => (
      <div className="p-4 pb-20 animate-slide-up">
          <Header title={title} onBack={() => setCurrentView('main')} />
          <div className="bg-dark-800 p-6 rounded-xl mt-4 whitespace-pre-line text-sm text-gray-300 leading-relaxed">
              {content}
          </div>
      </div>
  );

  // --- MAIN PROFILE VIEW ---

  if (currentView !== 'main') {
      if (currentView === 'analytics') return renderAnalytics();
      if (currentView === 'notifications') return renderNotifications();
      if (currentView === 'wallet') return renderWallet();
      if (currentView === 'guidelines') return renderTextPage('Community Guidelines', COMMUNITY_GUIDELINES);
      if (currentView === 'help') return renderTextPage('Help Center', HELP_CENTER);
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-dark-900 pt-10 pb-20">
      {/* Top Bar */}
      <div className="px-4 py-2 flex justify-between items-center">
          {isVisitor ? (
              <button onClick={onBack} className="p-2 bg-white/10 rounded-full"><ChevronLeft /></button>
          ) : (
              <div className="w-8"></div>
          )}
          
          <div className="font-bold text-lg">@{username}</div>

          {!isVisitor ? (
               <div className="flex gap-2">
                   <button onClick={() => setCurrentView('notifications')} className="p-2 relative">
                       <Bell />
                       <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                   </button>
                   <button className="p-2 hover:rotate-90 transition-transform"><Settings /></button>
               </div>
          ) : (
              <button className="p-2"><Share2 /></button>
          )}
      </div>

      <div className="flex flex-col items-center px-6 mt-4">
          <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
              <img src={avatar} className="w-24 h-24 rounded-full border-4 border-neon-purple object-cover" />
              {!isVisitor && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" />
                </div>
              )}
          </div>
          
          <div className="mt-4 text-center">
            {!isVisitor && editing ? (
                <div className="flex gap-2 justify-center">
                    <input value={username} onChange={e => setUsername(e.target.value)} className="bg-dark-700 text-white p-1 rounded" />
                    <button onClick={() => setEditing(false)} className="bg-neon-green text-black px-3 rounded font-bold">Save</button>
                </div>
            ) : (
                <h2 className="text-xl font-bold flex items-center gap-2 justify-center">
                    {profileUser.username} 
                    {!isVisitor && <span onClick={() => setEditing(true)} className="text-xs text-gray-500 cursor-pointer border border-gray-600 px-2 rounded">Edit</span>}
                </h2>
            )}
            
            {/* Meet Tab Specific Details if Visitor */}
            {isVisitor && (
                 <div className="flex flex-wrap justify-center gap-2 my-2 text-xs text-gray-400">
                     <span className="bg-dark-800 px-2 py-1 rounded">{profileUser.country}</span>
                     <span className="bg-dark-800 px-2 py-1 rounded">{profileUser.age} y/o</span>
                     <span className="bg-dark-800 px-2 py-1 rounded">{profileUser.relationshipStatus || 'Single'}</span>
                 </div>
            )}

            <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">{profileUser.bio}</p>
            
            {profileUser.isCreator && (
                <span className="inline-block mt-2 bg-neon-blue/20 text-neon-blue px-3 py-1 rounded-full text-xs font-bold border border-neon-blue/30">
                    Verified Creator
                </span>
            )}

            {/* Action Buttons (Visitor Mode) */}
            {isVisitor && (
                <div className="flex gap-4 justify-center mt-6">
                    <button 
                        onClick={() => setIsFollowing(!isFollowing)} 
                        className={`px-8 py-2 rounded-full font-bold transition-all ${isFollowing ? 'bg-dark-700 border border-white/20' : 'bg-neon-blue text-black hover:scale-105'}`}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="px-8 py-2 rounded-full font-bold border border-white/20 hover:bg-white/10">
                        Message
                    </button>
                    <button className="p-2 rounded-full bg-dark-700 border border-white/20 text-neon-purple">
                        <Gift size={20} />
                    </button>
                </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex w-full justify-around mt-6 py-4 border-y border-white/5">
             <div className="text-center">
                 <div className="font-bold text-lg">{profileUser.following}</div>
                 <div className="text-xs text-gray-500">Following</div>
             </div>
             <div className="text-center">
                 <div className="font-bold text-lg">{profileUser.followers}</div>
                 <div className="text-xs text-gray-500">Followers</div>
             </div>
             <div className="text-center">
                 <div className="font-bold text-lg">{myVideos.reduce((acc, v) => acc + v.likes, 0)}</div>
                 <div className="text-xs text-gray-500">Likes</div>
             </div>
          </div>
      </div>

      {/* Content Filters */}
      <div className="flex justify-center gap-2 mt-4 border-b border-white/5 pb-2 px-4">
          <button 
            onClick={() => setVideoFilter('short')}
            className={`flex-1 py-2 flex justify-center items-center gap-2 rounded-lg transition-colors ${videoFilter === 'short' ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
          >
              <Grid className="w-5 h-5" />
              Shorts
          </button>
          <button 
            onClick={() => setVideoFilter('long')}
            className={`flex-1 py-2 flex justify-center items-center gap-2 rounded-lg transition-colors ${videoFilter === 'long' ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:text-white'}`}
          >
              <Film className="w-5 h-5" />
              Videos
          </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-3 gap-1 mt-1 pb-4 min-h-[100px]">
          {myVideos.length > 0 ? myVideos.map((v, index) => (
              <div key={v.id} className="aspect-[3/4] bg-gray-800 relative group cursor-pointer" onClick={() => handleVideoClick(index)}>
                   <video src={v.url} className="w-full h-full object-cover" />
                   {v.isExclusive && <div className="absolute top-1 right-1 bg-black/60 p-1 rounded-full"><Lock className="w-3 h-3 text-neon-purple" /></div>}
                   {v.type === 'long' && <div className="absolute top-1 left-1 bg-black/60 px-1 rounded text-[10px] font-bold text-white">{v.duration}</div>}
                   <div className="absolute bottom-1 left-1 text-xs font-bold flex items-center gap-1 text-white drop-shadow-md">
                       <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent"></div>
                       {v.likes}
                   </div>
              </div>
          )) : (
              <div className="col-span-3 py-10 text-center text-gray-500 text-sm">
                  No {videoFilter}s yet.
              </div>
          )}
      </div>

      {/* Menu Items - Only visible for OWN profile */}
      {!isVisitor && (
          <div className="mt-4 px-4 space-y-1 pb-8">
             {/* Analytics Entry Point */}
             <button onClick={() => setCurrentView('analytics')} className="w-full bg-gradient-to-r from-dark-800 to-dark-700 p-4 rounded-xl flex justify-between items-center mb-4 border border-white/5 group hover:border-neon-blue/50">
                 <div className="flex items-center gap-3">
                     <div className="bg-neon-blue/20 p-2 rounded-full text-neon-blue"><TrendingUp size={20} /></div>
                     <div className="text-left">
                         <div className="font-bold text-sm">Statistics & Analytics</div>
                         <div className="text-[10px] text-gray-400">Earnings, Views, Demographics</div>
                     </div>
                 </div>
                 <ArrowRight size={16} className="text-gray-500 group-hover:text-white" />
             </button>

              {profileUser.isCreator && (
                <>
                    <h3 className="text-xs font-bold text-gray-500 px-4 py-2 uppercase">Creator Tools</h3>
                    <MenuItem icon={<Star className="text-neon-purple" />} text="Subscription Settings" onClick={() => alert("Subscription Settings")} />
                </>
              )}
              
              <h3 className="text-xs font-bold text-gray-500 px-4 py-2 mt-4 uppercase">General</h3>
              <MenuItem icon={<CreditCard />} text="Purchases & Gifts" onClick={() => setCurrentView('wallet')} />
              <MenuItem icon={<Shield />} text="Community Guidelines" onClick={() => setCurrentView('guidelines')} />
              <MenuItem icon={<HelpCircle />} text="Help Center" onClick={() => setCurrentView('help')} />
              <button onClick={onLogout} className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-white/5 rounded-lg">
                  <LogOut className="w-6 h-6" />
                  <span className="font-medium">Log Out</span>
              </button>
          </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
          <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPaymentModal(false)}>
              <div className="bg-dark-800 rounded-2xl w-full max-w-sm overflow-hidden border border-white/10 animate-slide-up" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                      <h3 className="font-bold">Select Payment Method</h3>
                      <button onClick={() => setShowPaymentModal(false)}><X /></button>
                  </div>
                  <div className="p-6 space-y-4">
                       <button 
                          onClick={() => handleProcessPayment('PayPal')}
                          className="w-full bg-white text-blue-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                        >
                           <span className="font-black text-2xl italic">PayPal</span>
                       </button>
                       <button 
                          onClick={() => handleProcessPayment('M-Pesa')}
                          className="w-full bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                        >
                           <span className="font-black text-xl">M-PESA</span>
                       </button>
                  </div>
                  <div className="p-4 bg-dark-900 text-center text-xs text-gray-500">
                      Secure payment processed by ViralVerse
                  </div>
              </div>
          </div>
      )}

      {/* FULL SCREEN VIDEO VIEWER OVERLAY */}
      {selectedVideoIndex !== null && (
          <div className="fixed inset-0 z-[80] bg-black flex flex-col">
              <div className="absolute top-4 left-4 z-50">
                  <button onClick={handleCloseVideoViewer} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                      <ChevronLeft className="w-6 h-6" />
                  </button>
              </div>
              
              {/* Scrollable Container for Profile Videos */}
              <div className="flex-1 overflow-y-auto no-scrollbar snap-y snap-mandatory">
                  <ProfileVideoFeed 
                      initialIndex={selectedVideoIndex}
                      videos={myVideos}
                      currentUser={currentUser}
                      onUpdateUser={() => {}} 
                      onViewProfile={() => {}}
                      onOpenComments={(id) => setCommentsOpenFor(id)}
                      onOpenShare={(v) => setShareOpenFor(v)}
                  />
              </div>
          </div>
      )}

       {/* Reused Modals for Profile Video Viewer */}
       {commentsOpenFor && (
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

const MenuItem = ({icon, text, onClick}: {icon: any, text: string, onClick?: () => void}) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 p-4 text-white hover:bg-white/5 rounded-lg transition-colors">
        {React.cloneElement(icon, { className: `w-6 h-6 ${icon.props.className || 'text-gray-400'}` })}
        <span className="font-medium">{text}</span>
    </button>
);

const Header = ({title, onBack}: {title: string, onBack: () => void}) => (
    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><ChevronLeft /></button>
        <h2 className="font-bold text-lg">{title}</h2>
    </div>
);

// Helper Component for Profile Video Feed to handle initial scroll
const ProfileVideoFeed: React.FC<any> = ({ initialIndex, videos, currentUser, onUpdateUser, onViewProfile, onOpenComments, onOpenShare }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (containerRef.current) {
            const child = containerRef.current.children[initialIndex] as HTMLElement;
            if (child) {
                child.scrollIntoView();
            }
        }
    }, []); // Run once on mount

    return (
        <div ref={containerRef}>
            {videos.map((video: Video) => (
                video.type === 'short' ? (
                    <ShortVideoCard 
                        key={video.id}
                        video={video}
                        enhancedAudio={true}
                        currentUser={currentUser}
                        onUpdateUser={onUpdateUser}
                        onOpenComments={() => onOpenComments(video.id)}
                        onCloseComments={() => {}}
                        onOpenShare={() => onOpenShare(video)}
                        onViewProfile={onViewProfile}
                        isCommentOpen={false}
                    />
                ) : (
                    <div className="h-full w-full snap-start flex items-center bg-black">
                        <LongVideoCard
                            video={video}
                            enhancedAudio={true}
                            currentUser={currentUser}
                            onUpdateUser={onUpdateUser}
                            isPlaying={false}
                            onInView={() => {}}
                            onOpenComments={() => onOpenComments(video.id)}
                            onOpenShare={() => onOpenShare(video)}
                            onViewProfile={onViewProfile}
                        />
                    </div>
                )
            ))}
        </div>
    )
}