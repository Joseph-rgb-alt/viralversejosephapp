
import React, { useState } from 'react';
import { COUNTRIES, MOCK_USER } from '../constants';
import { User } from '../types';
import { Smartphone, Mail, ArrowRight, ShieldCheck, Sparkles, Loader2, UserPlus, LogIn, ChevronLeft, Lock } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'landing' | 'signup' | 'login';
type AuthStep = 'method' | 'verify' | 'details' | 'success';

// --- GRAPHICAL COMPONENTS ---

const ViralVerseLogo = () => (
  <svg viewBox="0 0 400 120" className="w-full max-w-md filter drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00f3ff" />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#bc13fe" />
      </linearGradient>
      <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0aff0a" />
        <stop offset="100%" stopColor="#00f3ff" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Abstract Tech Shapes behind */}
    <path d="M20,60 Q100,10 200,60 T380,60" fill="none" stroke="url(#grad1)" strokeWidth="1" opacity="0.3" />
    <path d="M20,60 Q100,110 200,60 T380,60" fill="none" stroke="url(#grad2)" strokeWidth="1" opacity="0.3" />
    
    {/* Main Text */}
    <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" 
          fontSize="52" fontWeight="900" fill="url(#grad1)" letterSpacing="6"
          filter="url(#glow)" className="animate-pulse">
      VIRALVERSE
    </text>
    
    {/* Wireframe Overlay Effect */}
    <text x="50.3%" y="60.3%" dominantBaseline="middle" textAnchor="middle" 
          fontSize="52" fontWeight="900" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" letterSpacing="6" opacity="0.6">
      VIRALVERSE
    </text>

    {/* Accents */}
    <circle cx="30" cy="60" r="4" fill="#00f3ff" className="animate-ping" />
    <circle cx="370" cy="60" r="4" fill="#bc13fe" className="animate-ping" style={{animationDelay: '1s'}} />
    <rect x="100" y="90" width="200" height="2" fill="url(#grad1)" rx="1" opacity="0.5" />
  </svg>
);

const CosmicBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden bg-dark-900 z-0">
      {/* Deep Space Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-dark-800 via-black to-black"></div>
      
      {/* Grid Floor */}
      <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,243,255,0.1)_100%)]"
           style={{
               backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               perspective: '1000px',
               transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)'
           }}>
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-neon-blue/20 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-neon-purple/20 rounded-full blur-[120px] animate-float" style={{animationDelay: '-3s'}}></div>
      <div className="absolute top-[20%] right-[10%] w-[20vw] h-[20vw] bg-neon-green/10 rounded-full blur-[80px] animate-pulse"></div>

      {/* Star Particles (CSS only) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
  </div>
);

// --- MAIN COMPONENT ---

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('landing');
  const [step, setStep] = useState<AuthStep>('method');
  
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = () => {
    if (!contact) {
      setError('Please enter your contact info.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        setError('');
        setStep('verify');
    }, 1500);
  };

  const handleVerify = () => {
    if (otp !== '1234') { // Mock OTP logic
      setError('Invalid code.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        setError('');
        if (mode === 'signup') {
            setStep('details');
        } else {
            // Login Success - Mock retrieval of user
            handleLoginSuccess({ ...MOCK_USER, username: 'Returning_User', id: 'u_returned' });
        }
    }, 1500);
  };

  const handleFinalizeSignup = () => {
    if (!username || !birthYear) {
        setError('Please fill in all fields.');
        return;
    }
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(birthYear);
    
    if (isNaN(age) || age < 13) {
      setError('You must be at least 13 years old to use VIRALVERSE.');
      return;
    }

    const newUser: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      username: username,
      avatar: `https://picsum.photos/seed/${username}/200`,
      country: country.code,
      age: age,
      followers: 0,
      following: 0,
      bio: 'New to the Verse!',
      coins: 100, // Sign up bonus
      isCreator: false,
      earnings: 0,
      subscribers: 0
    };

    handleLoginSuccess(newUser);
  };

  const handleLoginSuccess = (user: User) => {
      setStep('success');
      setTimeout(() => {
        onLogin(user);
      }, 2000);
  };

  const reset = () => {
      setMode('landing');
      setStep('method');
      setError('');
      setContact('');
      setPassword('');
      setOtp('');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 relative overflow-hidden">
      <CosmicBackground />

      <div className="z-10 w-full max-w-md relative">
        
        {/* Header Logo */}
        <div className="text-center mb-8 transform transition-all hover:scale-105 duration-500">
          <ViralVerseLogo />
          <p className="text-neon-blue/70 text-sm tracking-[0.5em] uppercase font-bold mt-2 animate-fade-in">Enter The Universe</p>
        </div>

        <div className="bg-dark-800/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green animate-pulse"></div>

            {mode !== 'landing' && (
                <button onClick={reset} className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft />
                </button>
            )}

            {mode === 'landing' && (
                <div className="space-y-6 animate-slide-up">
                    <p className="text-center text-gray-300 mb-8 font-light">Join the social revolution. Be Viral.</p>
                    
                    <button 
                        onClick={() => setMode('login')}
                        className="w-full group relative bg-transparent border border-white/20 hover:border-neon-blue text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-neon-blue/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center justify-center gap-3">
                            <LogIn className="w-5 h-5" /> Log In
                        </span>
                    </button>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-widest">Or</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <button 
                        onClick={() => setMode('signup')}
                        className="w-full bg-gradient-to-r from-neon-blue to-neon-purple text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:shadow-[0_0_30px_rgba(188,19,254,0.6)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                        <UserPlus className="w-5 h-5" /> Sign Up
                    </button>
                </div>
            )}

            {mode !== 'landing' && step === 'method' && (
            <div className="space-y-4 animate-slide-up">
                <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                
                <div className="flex bg-dark-900/50 p-1 rounded-xl mb-6 border border-white/5">
                <button 
                    onClick={() => setMethod('phone')}
                    className={`flex-1 py-2 rounded-lg transition-all duration-300 text-sm font-bold ${method === 'phone' ? 'bg-dark-700 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Phone
                </button>
                <button 
                    onClick={() => setMethod('email')}
                    className={`flex-1 py-2 rounded-lg transition-all duration-300 text-sm font-bold ${method === 'email' ? 'bg-dark-700 text-white shadow-lg border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Email
                </button>
                </div>

                {method === 'phone' ? (
                <div className="flex gap-2">
                    <select 
                    className="bg-dark-700 rounded-xl px-3 outline-none border border-white/10 w-1/3 text-sm focus:border-neon-blue transition-colors appearance-none text-center text-gray-300"
                    value={country.code}
                    onChange={(e) => setCountry(COUNTRIES.find(c => c.code === e.target.value) || COUNTRIES[0])}
                    >
                    {COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{c.code} ({c.dialCode})</option>
                    ))}
                    </select>
                    <input 
                    type="tel" 
                    placeholder="Phone Number"
                    className="flex-1 bg-dark-700 rounded-xl px-4 py-3 outline-none border border-white/10 focus:border-neon-blue transition-colors placeholder-gray-500"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    />
                </div>
                ) : (
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input 
                        type="email" 
                        placeholder="Email Address"
                        className="w-full bg-dark-700 rounded-xl pl-12 pr-4 py-3 outline-none border border-white/10 focus:border-neon-purple transition-colors placeholder-gray-500"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    />
                </div>
                )}

                {/* Password Field */}
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input 
                        type="password" 
                        placeholder={mode === 'signup' ? "Create Password" : "Password"}
                        className="w-full bg-dark-700 rounded-xl pl-12 pr-4 py-3 outline-none border border-white/10 focus:border-neon-blue transition-colors placeholder-gray-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 rounded animate-pulse border border-red-500/20">{error}</p>}

                <button 
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full mt-4 bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
                </button>
            </div>
            )}

            {step === 'verify' && (
            <div className="space-y-6 animate-slide-up">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Verify Identity</h2>
                    <p className="text-gray-400 text-sm">
                        Enter the code sent to <br/><span className="text-neon-blue font-mono bg-neon-blue/10 px-2 py-1 rounded">{contact}</span>
                    </p>
                </div>

                <input 
                    type="text" 
                    placeholder="0 0 0 0"
                    className="w-full text-center text-4xl tracking-[1em] font-mono bg-dark-700 rounded-xl px-4 py-6 outline-none border-2 border-white/10 focus:border-neon-green focus:shadow-[0_0_15px_rgba(10,255,10,0.3)] transition-all"
                    value={otp}
                    maxLength={4}
                    onChange={(e) => setOtp(e.target.value)}
                />
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                <button 
                onClick={handleVerify}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-neon-green to-emerald-500 text-black py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-neon-green/20"
                >
                {isLoading ? <Loader2 className="animate-spin" /> : <>Verify <ShieldCheck className="w-5 h-5" /></>}
                </button>
            </div>
            )}

            {step === 'details' && (
            <div className="space-y-4 animate-slide-up">
                <h2 className="text-2xl font-bold text-center mb-6">Profile Setup</h2>
                
                <div className="space-y-3">
                    <input 
                        type="text" 
                        placeholder="Choose a Username"
                        className="w-full bg-dark-700 rounded-xl px-4 py-3 outline-none border border-white/10 focus:border-neon-blue transition-colors"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="number" 
                        placeholder="Birth Year (YYYY)"
                        className="w-full bg-dark-700 rounded-xl px-4 py-3 outline-none border border-white/10 focus:border-neon-blue transition-colors"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                    />
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                <button 
                onClick={handleFinalizeSignup}
                className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-xl"
                >
                Enter ViralVerse <Sparkles className="w-5 h-5 text-neon-purple" />
                </button>
            </div>
            )}

            {step === 'success' && (
            <div className="text-center space-y-6 py-8 animate-pulse">
                <div className="relative inline-block">
                    <Sparkles className="w-24 h-24 text-neon-blue mx-auto animate-spin-slow" />
                    <div className="absolute inset-0 bg-neon-blue blur-2xl opacity-50"></div>
                </div>
                <div>
                    <h2 className="text-3xl font-black text-white">Success!</h2>
                    <p className="text-gray-400 mt-2">Launching experience...</p>
                </div>
            </div>
            )}
        </div>
        
        {/* Footer Loader */}
        {(isLoading || step === 'success') && (
            <div className="absolute -bottom-24 left-0 w-full flex justify-center animate-fade-in">
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-t-neon-blue border-r-neon-purple border-b-neon-green border-l-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
