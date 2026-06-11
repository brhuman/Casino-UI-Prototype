import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ChangeEventHandler, RefObject } from 'react';

interface AvatarPickerModalProps {
  isOpen: boolean;
  avatars: string[];
  selectedAvatar: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onSelect: (url: string) => void;
  onUpload: ChangeEventHandler<HTMLInputElement>;
}

export const AvatarPickerModal = ({
  isOpen,
  avatars,
  selectedAvatar,
  fileInputRef,
  onClose,
  onSelect,
  onUpload,
}: AvatarPickerModalProps) => {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-xl bg-black border border-white/10 rounded-[3rem] p-8 shadow-2xl backdrop-blur-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-neon-pink" /> {t('profile.choose_persona')}
              </h3>
              <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Plus size={20} className="rotate-45 text-white/40" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {avatars.map((url, index) => (
                <button
                  key={url}
                  onClick={() => onSelect(url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 group ${selectedAvatar === url ? 'border-neon-cyan shadow-[0_0_20px_rgba(0,255,255,0.3)] scale-105' : 'border-white/5 hover:border-white/20'}`}
                >
                  <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-square rounded-2xl border-4 border-dashed border-white/10 hover:border-white/40 hover:bg-white/5 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 group"
              >
                <Camera size={24} className="text-white/20 group-hover:text-white/60" />
                <span className="text-[8px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/60">Upload</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={onUpload} accept="image/*" className="hidden" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
