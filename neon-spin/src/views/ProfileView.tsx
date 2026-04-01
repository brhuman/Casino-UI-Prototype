import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, Clock, Plus, TrendingUp, History, Award, Info, Volume2, Camera } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useUiStore } from '../store/useUiStore';
import { Card } from '../components/ui/Card';
import { useState, useRef } from 'react';

const AVATARS = [
  '/avatars/avatar_1.png',
  '/avatars/avatar_2.png',
  '/avatars/avatar_3.png',
  '/avatars/avatar_4.png',
  '/avatars/avatar_5.png',
  '/avatars/avatar_6.png',
];

export const ProfileView = () => {
  const balance = useUserStore(state => state.balance);
  const totalBets = useUserStore(state => state.totalBets);
  const totalWinAmount = useUserStore(state => state.totalWinAmount);
  const biggestWin = useUserStore(state => state.biggestWin);
  const globalVolume = useUserStore(state => state.globalVolume);
  const selectedAvatar = useUserStore(state => state.selectedAvatar);
  
  const setGlobalVolume = useUserStore(state => state.actions.setGlobalVolume);
  const setAvatar = useUserStore(state => state.actions.setAvatar);
  const updateBalance = useUserStore(state => state.actions.updateBalance);
  const setShowAboutModal = useUiStore(state => state.setShowAboutModal);

  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        setIsSelectingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-4xl mx-auto h-full flex flex-col gap-6 sm:gap-8 pb-12 pt-4 sm:pt-8 px-4"
    >
      <Card className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-6 sm:p-8 bg-gradient-to-r from-gray-900/80 to-gray-800/40 border-neon-purple/30">
        <div 
          className="relative group shrink-0 cursor-pointer"
          onClick={() => setIsSelectingAvatar(!isSelectingAvatar)}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-black flex items-center justify-center border-2 border-neon-purple overflow-hidden">
             {selectedAvatar ? (
               <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               <User size={48} className="text-white sm:size-56" />
             )}
             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <Camera className="text-white" size={24} />
             </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neon-blue border-4 border-black flex items-center justify-center text-black font-bold text-xs sm:text-sm">
            1
          </div>
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 uppercase">
            VIP_PLAYER_777
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mt-3">
            <p className="text-neon-blue font-mono flex items-center gap-2 text-[10px] sm:text-sm bg-neon-blue/10 px-3 py-1 rounded-full border border-neon-blue/30">
              <Activity size={14} /> VIP LEVEL 1
            </p>
            <span className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 font-mono">
              <Clock size={14}/> JOINED: OCT 2026
            </span>
          </div>
        </div>

        <div className="text-center sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
          <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Total Balance</p>
          <p className="text-3xl sm:text-4xl font-black text-white font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            ${balance.toLocaleString()}
          </p>
          <button 
            onClick={() => setShowAboutModal(true)}
            className="mt-3 sm:mt-4 flex items-center justify-center sm:justify-end gap-2 text-cyan-400 hover:text-cyan-300 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors mx-auto sm:ml-auto group"
          >
            <Info size={14} className="group-hover:rotate-12 transition-transform" />
            About Project
          </button>
        </div>
      </Card>

      <AnimatePresence>
        {isSelectingAvatar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <Card className="p-4 sm:p-6 bg-gray-900/60 border-neon-pink/30 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Camera size={16} className="text-neon-pink" /> 1. Select Your Avatar
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-4 pb-2">
                {AVATARS.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAvatar(url);
                      setIsSelectingAvatar(false);
                    }}
                    className={`relative w-full rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                      selectedAvatar === url ? 'border-neon-pink shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ aspectRatio: '1/1' }}
                  >
                    <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-white/20 hover:border-neon-blue hover:bg-neon-blue/5 flex flex-col items-center justify-center gap-1 transition-all group"
                  style={{ aspectRatio: '1/1' }}
                >
                  <Plus size={20} className="text-gray-500 group-hover:text-neon-blue transition-colors" />
                  <span className="text-[7px] sm:text-[9px] font-bold text-gray-500 uppercase group-hover:text-neon-blue">Upload</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        <button 
          onClick={() => updateBalance(1000)}
          className="group relative w-full py-5 sm:py-6 rounded-2xl overflow-hidden active:scale-[0.98] transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-teal-400 to-neon-blue bg-[length:200%_100%] animate-gradient-x opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.4)]" />
          <div className="relative flex items-center justify-center gap-4 text-black font-black text-xl sm:text-2xl uppercase tracking-[0.2em]">
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            Add $1.000 Credits
          </div>
        </button>

        <Card glass={false} className="p-6 sm:p-8 border-gray-800 bg-black/40">
           <div className="flex items-center gap-3 mb-6 sm:mb-8">
             <TrendingUp className="text-neon-pink" size={20} />
             <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-widest">Performance Statistics</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
             <div className="p-4 sm:p-6 rounded-xl bg-gray-900/50 border border-gray-800 flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <History size={64} />
               </div>
               <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Total Bets Made</span>
               <span className="text-2xl sm:text-3xl font-black text-white font-mono">${totalBets.toLocaleString()}</span>
               <div className="h-1 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-neon-blue w-1/3 shadow-[0_0_10px_#00ffff]" />
               </div>
             </div>

             <div className="p-4 sm:p-6 rounded-xl bg-gray-900/50 border border-gray-800 flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Award size={64} />
               </div>
               <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Biggest Win</span>
               <span className="text-2xl sm:text-3xl font-black text-neon-pink font-mono">${biggestWin.toLocaleString()}</span>
               <div className="h-1 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-neon-pink w-1/2 shadow-[0_0_10px_#ff00ff]" />
               </div>
             </div>

             <div className="p-4 sm:p-6 rounded-xl bg-gray-900/50 border border-gray-800 flex flex-col gap-2 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <TrendingUp size={64} />
               </div>
               <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Total Returned</span>
               <span className="text-2xl sm:text-3xl font-black text-neon-purple font-mono">${totalWinAmount.toLocaleString()}</span>
               <div className="h-1 w-full bg-gray-800 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-neon-purple w-2/3 shadow-[0_0_10px_#bf00ff]" />
               </div>
             </div>
           </div>
         </Card>

        {/* Global Settings Card */}
        <Card className="p-6 bg-gray-900/60 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan">
              <Volume2 size={20} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Global Settings</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Site Volume</span>
              <span className="font-mono text-sm font-bold text-neon-cyan">{Math.round(globalVolume * 100)}%</span>
            </div>
            <div className="relative group/slider">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={globalVolume}
                onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-cyan hover:accent-cyan-300 transition-all"
              />
              <div className="absolute -inset-1 rounded-lg bg-neon-cyan/20 blur opacity-0 group-hover/slider:opacity-100 transition duration-500 -z-10" />
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};
