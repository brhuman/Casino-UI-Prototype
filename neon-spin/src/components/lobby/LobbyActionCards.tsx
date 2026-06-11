import { Crown, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUserStore } from '@/store/useUserStore';

export const LobbyActionCards = () => {
  const { t } = useTranslation();
  const neonGlow = useSettingsStore((state) => state.neonGlow);
  const isVip = useUserStore((state) => state.isVip);
  const setVip = useUserStore((state) => state.actions.setVip);
  const creditBonus = useUserStore((state) => state.actions.creditBonus);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-2">
      <div
        className={`relative p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border transition-all cursor-pointer group flex flex-col gap-6 sm:gap-8 ${isVip ? 'border-yellow-500/30 bg-yellow-400/5' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'}`}
        onClick={() => setVip(!isVip)}
      >
        <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-yellow-600 via-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-all">
            <Crown size={32} className="text-black sm:scale-125" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="text-2xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">
              {isVip ? t('lobby.cta.vip_title_active') : t('lobby.cta.vip_title_inactive')}
            </h4>
            <p className="text-[10px] sm:text-sm font-black text-white/80 uppercase tracking-[0.2em] leading-relaxed max-w-[280px]">
              {isVip ? t('lobby.cta.vip_desc_active') : t('lobby.cta.vip_desc_inactive')}
            </p>
          </div>
          <button className={`w-fit px-8 py-4 sm:px-12 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase transition-all shadow-xl tracking-widest ${isVip ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white hover:bg-white hover:text-black hover:scale-105 active:scale-95'}`}>
            {isVip ? t('lobby.cta.vip_button_active') : t('lobby.cta.vip_button_inactive')}
          </button>
        </div>
        {neonGlow && <div className="absolute -inset-20 bg-yellow-400/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity" />}
        <Crown size={320} className="absolute -bottom-24 -right-24 text-white/[0.03] -rotate-12 pointer-events-none group-hover:text-white/[0.05] transition-colors" />
      </div>

      <div
        className="relative p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl hover:bg-white/[0.08] transition-all cursor-pointer group flex flex-col gap-6 sm:gap-8"
        onClick={() => creditBonus(5000)}
      >
        <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-neon-cyan via-[#00ccff] to-neon-cyan flex items-center justify-center shadow-2xl transform group-hover:-rotate-12 transition-all">
            <Plus size={32} className="text-black sm:scale-125" strokeWidth={3} />
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="text-2xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">{t('lobby.cta.recharge_title')}</h4>
            <p className="text-[10px] sm:text-sm font-black text-white/80 uppercase tracking-[0.2em] leading-relaxed max-w-[280px]">{t('lobby.cta.recharge_desc')}</p>
          </div>
          <button className="w-fit px-8 py-4 sm:px-12 sm:py-5 rounded-xl sm:rounded-2xl bg-neon-cyan text-black text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_15px_40px_rgba(0,255,255,0.25)] hover:scale-105 active:scale-95">
            {t('lobby.cta.recharge_button')}
          </button>
        </div>
        {neonGlow && <div className="absolute -inset-20 bg-neon-cyan/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity" />}
        <Plus size={320} className="absolute -bottom-24 -right-24 text-white/[0.03] rotate-12 pointer-events-none group-hover:text-white/[0.05] transition-colors" />
      </div>
    </section>
  );
};
