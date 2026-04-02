import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mail, Shield, Zap, X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SETTINGS_GROUPS = [
  {
    id: 'email',
    icon: Mail,
    color: 'text-neon-cyan',
    title: 'Email Communications',
    items: [
      { id: 'marketing', label: 'Promotional Offers', desc: 'Get notified about exclusive bonuses and free spins.' },
      { id: 'weekly', label: 'Weekly Performance', desc: 'Summary of your wins and career progress.' },
    ]
  },
  {
    id: 'security',
    icon: Shield,
    color: 'text-yellow-400',
    title: 'Identity & Security',
    items: [
      { id: 'login_alerts', label: 'Login Alerts', desc: 'Instant notification on new device logins.' },
      { id: 'verification', label: 'Verification Status', desc: 'Updates on your KYC and withdrawal status.' },
    ]
  },
  {
    id: 'news',
    icon: Zap,
    color: 'text-neon-purple',
    title: 'News & Updates',
    items: [
      { id: 'new_games', label: 'New Game Releases', desc: 'Be the first to try our latest slot engines.' },
      { id: 'maintenance', label: 'System Announcements', desc: 'Updates on network status and maintenance.' },
    ]
  }
];

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [activeSettings, setActiveSettings] = React.useState<string[]>(['marketing', 'login_alerts', 'new_games']);

  const toggleSetting = (id: string) => {
    setActiveSettings(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-xl bg-gray-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Bell size={24} className="text-neon-cyan" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Notification Settings</h3>
                  <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Configure your digital experience</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-white/40" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {SETTINGS_GROUPS.map((group) => (
                <div key={group.id} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <group.icon size={18} className={group.color} />
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">{group.title}</h4>
                  </div>

                  <div className="grid gap-3">
                    {group.items.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => toggleSetting(item.id)}
                        className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.06] transition-all group"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-white group-hover:text-neon-cyan transition-colors">{item.label}</span>
                          <span className="text-[10px] text-white/20 font-medium">{item.desc}</span>
                        </div>
                        
                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                          activeSettings.includes(item.id)
                            ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
                            : 'bg-white/5 border-white/10 text-transparent'
                        }`}>
                          <Check size={14} strokeWidth={4} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 bg-white/[0.02]">
              <button 
                onClick={onClose}
                className="w-full py-5 rounded-2xl bg-neon-cyan text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
