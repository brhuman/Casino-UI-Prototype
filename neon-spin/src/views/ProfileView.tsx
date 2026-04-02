import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, Camera, Edit3, Check, X } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useUiStore } from '../store/useUiStore';
import { Card } from '../components/ui/Card';
import { useState, useRef } from 'react';
import { AchievementGallery } from '../components/ui/AchievementGallery';
import { useTranslation } from 'react-i18next';

import { PRESET_AVATARS } from '../constants/dummyData';

export const ProfileView = () => {
  const username = useUserStore(state => state.username);
  const balance = useUserStore(state => state.balance);
  const totalBets = useUserStore(state => state.totalBets);
  const totalWinAmount = useUserStore(state => state.totalWinAmount);
  const biggestWin = useUserStore(state => state.biggestWin);
  const selectedAvatar = useUserStore(state => state.selectedAvatar);
  const customAvatars = useUserStore(state => state.customAvatars);
  const isVip = useUserStore(state => state.isVip);
  const xp = useUserStore(state => state.xp);
  const maxXp = useUserStore(state => state.maxXp);
  const level = useUserStore(state => state.level);
  
  const { t } = useTranslation();
  
  const setAvatar = useUserStore(state => state.actions.setAvatar);
  const addCustomAvatar = useUserStore(state => state.actions.addCustomAvatar);
  const updateBalance = useUserStore(state => state.actions.updateBalance);
  const setVip = useUserStore(state => state.actions.setVip);
  const setUsername = useUserStore(state => state.actions.setUsername);

  const setShowAboutModal = useUiStore(state => state.setShowAboutModal);

  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allAvatars = [...PRESET_AVATARS, ...customAvatars];

  const handleNameSave = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        addCustomAvatar(base64String);
        setIsSelectingAvatar(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 pb-24 pt-4 sm:pt-10 px-2 sm:px-4 relative">
      {/* Dynamic Background */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-10 bg-[url('/assets/neon_profile_background.png')] bg-cover bg-center bg-no-repeat" />
      
      <Card className="relative z-10 flex flex-col p-0 bg-white/5 border-white/10 backdrop-blur-3xl overflow-hidden rounded-[2.5rem] sm:rounded-[3.rem]">
        {/* 1. IDENTITY SECTION (Top) */}
        <div className="relative p-6 sm:p-8 flex flex-col items-center text-center gap-6 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
          <div 
            className="relative group cursor-pointer"
            onClick={() => setIsSelectingAvatar(!isSelectingAvatar)}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-neon-cyan via-white/50 to-neon-purple rounded-full blur-xl opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-black flex items-center justify-center border-4 border-white/10 overflow-hidden shadow-2xl">
               {selectedAvatar ? (
                 <img src={selectedAvatar} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User size={64} className="text-white/20" />
               )}
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                 <Camera className="text-white mb-2" size={32} />
                 <span className="text-[10px] font-black uppercase text-white tracking-widest">{t('common.change')}</span>
               </div>
            </div>
            {/* Level Badge */}
            <div className={`absolute -bottom-2 right-2 w-12 h-12 rounded-full border-4 border-black flex flex-col items-center justify-center text-black font-black shadow-lg transition-transform group-hover:scale-110 ${isVip ? 'bg-yellow-400' : 'bg-neon-cyan'}`}>
              <span className="text-[8px] leading-none uppercase -mb-0.5 opacity-60">{t('common.level')}</span>
              <span className="text-base leading-none">{level}</span>
            </div>
          </div>

          <div className="w-full max-w-sm flex flex-col items-center gap-4">
            <AnimatePresence mode="wait">
              {isEditingName ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <input 
                    autoFocus
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                    className="w-full bg-white/5 border-2 border-neon-cyan rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-2xl sm:text-4xl font-black italic text-center text-white uppercase tracking-tighter outline-none shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                    maxLength={16}
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={handleNameSave}
                      className="px-6 py-3 bg-neon-cyan text-black rounded-xl font-black uppercase text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                      <Check size={16} strokeWidth={4} /> {t('common.save')}
                    </button>
                    <button 
                      onClick={() => { setIsEditingName(false); setTempName(username); }}
                      className="px-6 py-3 bg-white/10 text-white/60 rounded-xl font-black uppercase text-xs flex items-center gap-2 hover:bg-white/20 transition-all"
                    >
                      <X size={16} strokeWidth={4} /> {t('common.cancel')}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => { setIsEditingName(true); setTempName(username); }}
                  className="group/name cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="relative">
                    <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white uppercase drop-shadow-lg group-hover/name:text-neon-cyan transition-colors">
                      {username}
                    </h2>
                    <div className="absolute -right-8 sm:-right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover/name:opacity-100 transition-opacity">
                      <Edit3 size={20} className="text-neon-cyan animate-pulse sm:w-6 sm:h-6" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] border transition-all ${isVip ? 'bg-yellow-400/20 text-yellow-500 border-yellow-500/30 shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'bg-white/10 text-white/80 border-white/20'}`}>
                {isVip ? t('common.vip_elite') : t('common.standard_member')}
              </span>
              <button 
                onClick={() => setVip(!isVip)}
                className={`text-[9px] font-black uppercase tracking-widest transition-all px-3 py-1.5 rounded-lg ${isVip ? 'text-white/60 hover:text-red-400 border border-white/10' : 'text-neon-cyan hover:text-white border border-neon-cyan/40 cursor-pointer'}`}
              >
                {isVip ? t('common.disable_vip') : t('common.become_vip')}
              </button>
              <button 
                onClick={() => setShowAboutModal(true)}
                className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-all"
              >
                {t('common.about.title') || 'Info'}
              </button>
            </div>
          </div>
        </div>

        {/* 2. RESOURCES SECTION (Center) */}
        <div className="p-6 sm:p-8 flex flex-col gap-8 sm:gap-10">
          {/* XP Bar */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{t('common.level')} {level} {t('common.progress')}</span>
              </div>
              <span className="text-xs font-mono font-black text-white/80 tabular-nums text-[10px] sm:text-xs">
                {Math.floor(xp).toLocaleString()} / {Math.floor(maxXp).toLocaleString()} XP
              </span>
            </div>
            <div className="h-2.5 sm:h-3 w-full bg-black/40 rounded-full border border-white/5 p-0.5 overflow-hidden shadow-inner translate-z-0">
              <div 
                style={{ width: `${(xp / maxXp) * 100}%` }}
                className={`h-full rounded-full relative z-10 transition-all duration-300 ${isVip ? 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple'}`}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>

          {/* Balance Block */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-white/[0.08] transition-all group shadow-xl backdrop-blur-2xl">
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] mb-2 px-1">{t('profile.available_credits')}</p>
                <h3 className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  ${balance.toLocaleString()}
                </h3>
              </div>
              <button 
                onClick={() => updateBalance(1000)}
                className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 active:bg-cyan-400"
              >
                <Plus size={16} strokeWidth={4} /> {t('profile.add_credits')}
              </button>
          </div>

          {/* Milestones (Achievements) Section */}
          <div className="mt-2">
            <div className="flex items-center justify-between px-1 mb-4">
              <h4 className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em]">{t('profile.milestones')}</h4>
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">{t('profile.showcase')}</span>
            </div>
            <AchievementGallery />
          </div>
        </div>

        {/* 3. PERFORMANCE STATS (Grid) */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
           <div className="grid grid-cols-3 gap-1 bg-white/5 rounded-2xl p-1 border border-white/10 overflow-hidden">
              <div className="flex flex-col items-center justify-center py-6 px-2 hover:bg-white/5 transition-colors group/stat">
                <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em] mb-2 group-hover/stat:text-white/80 transition-colors">{t('profile.wagers')}</span>
                <span className="text-sm font-black text-white font-mono tracking-tighter">${totalBets.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center justify-center py-6 px-2 hover:bg-white/5 transition-colors group/stat border-x border-white/10">
                <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em] mb-2 group-hover/stat:text-neon-pink transition-colors">{t('profile.max_payout')}</span>
                <span className="text-sm font-black text-neon-pink font-mono tracking-tighter">${biggestWin.toLocaleString()}</span>
              </div>
              <div className="flex flex-col items-center justify-center py-6 px-2 hover:bg-white/5 transition-colors group/stat">
                <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em] mb-2 group-hover/stat:text-neon-purple transition-colors">{t('profile.profit')}</span>
                <span className="text-sm font-black text-neon-purple font-mono tracking-tighter">${totalWinAmount.toLocaleString()}</span>
              </div>
          </div>
        </div>
      </Card>


      {/* Avatar Selection Modal Overlay */}
      <AnimatePresence>
        {isSelectingAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsSelectingAvatar(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-xl bg-black border border-white/10 rounded-[3rem] p-8 shadow-2xl backdrop-blur-3xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-base font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-neon-pink" /> {t('profile.choose_persona')}
                </h3>
                <button 
                  onClick={() => setIsSelectingAvatar(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Plus size={20} className="rotate-45 text-white/40" />
                </button>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
                {allAvatars.map((url: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAvatar(url);
                      setIsSelectingAvatar(false);
                    }}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 group ${
                      selectedAvatar === url ? 'border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)] Scale-105' : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-square rounded-2xl border-4 border-dashed border-white/10 hover:border-white/40 hover:bg-white/5 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 group"
                >
                  <Camera size={24} className="text-white/20 group-hover:text-white/60" />
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/60">Upload</span>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
