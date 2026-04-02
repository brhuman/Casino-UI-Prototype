import { Volume2, VolumeX, Shield, Bell, Monitor, Info, Languages } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useUiStore } from '../store/useUiStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Card } from '../components/ui/Card';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const SettingsView = () => {
  const { t, i18n } = useTranslation();
  const globalVolume = useUserStore(state => state.globalVolume);
  const setGlobalVolume = useUserStore(state => state.actions.setGlobalVolume);
  const { isMuted, setMuted, setShowAboutModal } = useUiStore();
  const { language, highQualityFx, neonGlow, actions: settingsActions } = useSettingsStore();

  const handleLanguageChange = (lang: 'en' | 'uk' | 'ru' | 'pl') => {
    settingsActions.setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 pb-24 pt-4 sm:pt-10 px-4 relative">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-2 h-8 bg-neon-cyan rounded-full shadow-[0_0_15px_#00ffff]" />
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{t('settings.title')}</h2>
      </div>

      <Card className="p-8 bg-gray-900/40 border-white/5 backdrop-blur-3xl rounded-[2rem] flex flex-col gap-10">
        {/* Language Selection Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Languages size={20} className="text-white" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{t('settings.language.title')}</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['en', 'uk', 'ru', 'pl'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all border ${
                  language === lang 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'bg-white/10 text-white/40 border-white/20 hover:bg-white/20 hover:text-white'
                }`}
              >
                {t(`settings.language.${lang}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Volume2 size={20} className="text-neon-cyan" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{t('settings.audio.title')}</h3>
          </div>
          
          <div className="space-y-8">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t('settings.audio.master_volume')}</span>
                <span className="font-mono text-xs font-bold text-neon-cyan">{Math.round(globalVolume * 100)}%</span>
              </div>
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setMuted(!isMuted)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/40' : 'bg-white/10 text-white/40 border border-white/20 hover:bg-white/20'}`}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <div className="flex-1 relative flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={isMuted ? 0 : globalVolume}
                    onChange={(e) => setGlobalVolume(parseFloat(e.target.value))}
                    disabled={isMuted}
                    className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-neon-cyan hover:accent-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-neon-purple" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{t('settings.visual.title')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => settingsActions.setHighQualityFx(!highQualityFx)}
              className="flex items-center justify-between p-4 bg-white/[0.08] border border-white/10 rounded-2xl cursor-pointer hover:bg-white/[0.12] transition-all group"
            >
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">{t('settings.visual.quality_fx')}</span>
              <div className={`w-10 h-5 rounded-full relative p-1 transition-all duration-300 ${highQualityFx ? 'bg-neon-purple/40 border-neon-purple/60' : 'bg-white/10 border-white/20'}`}>
                <motion.div 
                  animate={{ x: highQualityFx ? 20 : 0 }}
                  className={`w-3 h-3 rounded-full ${highQualityFx ? 'bg-neon-purple shadow-[0_0_10px_#9333ea]' : 'bg-white/40'}`} 
                />
              </div>
            </div>

            <div 
              onClick={() => settingsActions.setNeonGlow(!neonGlow)}
              className="flex items-center justify-between p-4 bg-white/[0.08] border border-white/10 rounded-2xl cursor-pointer hover:bg-white/[0.12] transition-all group"
            >
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">{t('settings.visual.neon_glow')}</span>
              <div className={`w-10 h-5 rounded-full relative p-1 transition-all duration-300 ${neonGlow ? 'bg-neon-purple/40 border-neon-purple/60' : 'bg-white/10 border-white/20'}`}>
                <motion.div 
                  animate={{ x: neonGlow ? 20 : 0 }}
                  className={`w-3 h-3 rounded-full ${neonGlow ? 'bg-neon-purple shadow-[0_0_10px_#9333ea]' : 'bg-white/40'}`} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security & Notifications (Dummy) */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-yellow-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">{t('settings.security.title')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button className="flex items-center gap-4 p-4 bg-white/[0.08] border border-white/10 rounded-2xl hover:bg-white/[0.15] transition-all text-left">
                <Bell size={16} className="text-white/20" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t('settings.security.notifications')}</span>
             </button>
             <button 
               onClick={() => setShowAboutModal(true)}
               className="flex items-center gap-4 p-4 bg-white/[0.08] border border-white/10 rounded-2xl hover:bg-white/[0.15] transition-all text-left"
             >
                <Info size={16} className="text-white/20" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t('settings.security.system_info')}</span>
             </button>
          </div>
        </div>
      </Card>

      <div className="flex justify-center mt-4">
        <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">Neon Spin v1.2.4 Build 8823</span>
      </div>
    </div>
  );
};

