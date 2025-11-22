
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { IntroSplash } from './components/IntroSplash';
import { VideoTab } from './components/VideoTab';
import { SocialTab } from './components/SocialTab';
import { AddTab } from './components/AddTab';
import { MeetTab } from './components/MeetTab';
import { ProfileTab } from './components/ProfileTab';
import { User, Video } from './types';
import { VIDEOS_POOL } from './constants';
import { Home, Users, PlusSquare, Heart, User as UserIcon } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'social' | 'add' | 'meet' | 'profile'>('video');
  
  // Intro logic: false by default, set to true only when we have a valid user (login success or auto-login)
  const [showIntro, setShowIntro] = useState(false);
  
  // Loading state for checking local storage
  const [authChecked, setAuthChecked] = useState(false);
  
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  
  // Global Video State to share between Add, Video, and Profile tabs
  const [allVideos, setAllVideos] = useState<Video[]>([]);

  // Simulate persistent login check and data init
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('viral_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setShowIntro(true); // Play welcome animation for returning users
      }
      // Initialize videos from pool
      setAllVideos(VIDEOS_POOL);
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('viral_user', JSON.stringify(newUser));
    // Trigger the welcome animation AFTER successful login/signup
    setShowIntro(true);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('viral_user');
    setActiveTab('video');
    setShowIntro(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
      setUser(updatedUser);
      localStorage.setItem('viral_user', JSON.stringify(updatedUser));
  };
  
  const handlePostVideo = (newVideo: Video) => {
      setAllVideos(prev => [newVideo, ...prev]);
      setActiveTab('profile');
  };

  const handleViewProfile = (profileUser: User) => {
    setViewingProfile(profileUser);
  };

  // 1. Wait for auth check
  if (!authChecked) return <div className="bg-black h-screen w-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div></div>;

  // 2. If User is logged in and Intro should show, show Intro
  if (user && showIntro) {
    return <IntroSplash onComplete={handleIntroComplete} />;
  }

  // 3. If No User, Show Auth (Sign Up / Login)
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // 4. Main App (User logged in & Intro complete)
  return (
    <div className="h-screen w-screen bg-black text-white relative flex flex-col overflow-hidden animate-fade-in">
      
      {/* Content Area - Tabs sit here */}
      <div className="flex-1 relative bg-dark-900 w-full h-full">
        <div className={`absolute inset-0 w-full h-full ${activeTab === 'video' ? 'z-10' : 'z-0 invisible'}`}>
             <VideoTab active={activeTab === 'video'} currentUser={user} onUpdateUser={handleUpdateUser} videos={allVideos} onViewProfile={handleViewProfile} />
        </div>
        
        <div className={`absolute inset-0 w-full h-full ${activeTab === 'social' ? 'z-10' : 'z-0 invisible'}`}>
            <SocialTab active={activeTab === 'social'} onViewProfile={handleViewProfile} />
        </div>

        <div className={`absolute inset-0 w-full h-full ${activeTab === 'add' ? 'z-10' : 'z-0 invisible'}`}>
            <AddTab active={activeTab === 'add'} currentUser={user} onPostVideo={handlePostVideo} />
        </div>

        <div className={`absolute inset-0 w-full h-full ${activeTab === 'meet' ? 'z-10' : 'z-0 invisible'}`}>
            <MeetTab active={activeTab === 'meet'} currentUser={user} onViewProfile={handleViewProfile} />
        </div>

        <div className={`absolute inset-0 w-full h-full ${activeTab === 'profile' ? 'z-10' : 'z-0 invisible'}`}>
            <ProfileTab 
                active={activeTab === 'profile'} 
                currentUser={user} 
                profileUser={user} 
                isVisitor={false}
                onLogout={handleLogout} 
                videos={allVideos} 
                onBack={() => {}} 
            />
        </div>
      </div>

      {/* GLOBAL PROFILE OVERLAY (Visitor Mode) */}
      {viewingProfile && viewingProfile.id !== user.id && (
          <div className="absolute inset-0 z-[60] bg-black animate-slide-up">
               <ProfileTab 
                  active={true} 
                  currentUser={user} 
                  profileUser={viewingProfile} 
                  isVisitor={true}
                  onLogout={() => {}} 
                  videos={allVideos} 
                  onBack={() => setViewingProfile(null)}
               />
          </div>
      )}
      {/* If viewing own profile via click, just close overlay if open, or switch tab */}
      {viewingProfile && viewingProfile.id === user.id && (
          (() => {
             if (activeTab !== 'profile') setActiveTab('profile');
             if (viewingProfile) setViewingProfile(null);
             return null;
          })()
      )}


      {/* Bottom Navigation - Always Visible (z-50) */}
      <div className="h-16 bg-black/90 backdrop-blur-lg border-t border-white/10 flex justify-around items-center absolute bottom-0 w-full z-50 px-2">
        <NavButton 
          active={activeTab === 'video'} 
          onClick={() => setActiveTab('video')} 
          icon={<Home />} 
          label="Home" 
        />
        <NavButton 
          active={activeTab === 'social'} 
          onClick={() => setActiveTab('social')} 
          icon={<Users />} 
          label="Social" 
        />
        
        {/* Add Button (Central Prominent) */}
        <button 
          onClick={() => setActiveTab('add')}
          className="relative -top-4 group"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === 'add' ? 'bg-white rotate-90' : 'bg-gradient-to-tr from-neon-blue to-neon-purple'}`}>
            <PlusSquare className={`w-8 h-8 ${activeTab === 'add' ? 'text-black' : 'text-white'}`} />
          </div>
        </button>

        <NavButton 
          active={activeTab === 'meet'} 
          onClick={() => setActiveTab('meet')} 
          icon={<Heart />} 
          label="Meet" 
        />
        <NavButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
          icon={<UserIcon />} 
          label="Profile" 
        />
      </div>
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-16 transition-colors ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { 
      className: `w-6 h-6 mb-1 transition-transform ${active ? 'scale-110' : ''}`,
      fill: active ? 'currentColor' : 'none'
    })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
