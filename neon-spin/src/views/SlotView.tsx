import { motion } from 'framer-motion';
import { PixiBridge } from '../components/game/PixiBridge';

const SLOT_CABINET_WIDTH = 785;
const SLOT_CABINET_HEIGHT = 624;

export const SlotView = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full min-h-0 w-full items-center justify-center overflow-auto p-2"
    >
      <div
        className="relative mx-auto flex flex-none overflow-hidden rounded-[2.5rem] border border-white/8 bg-[radial-gradient(circle_at_top,_rgba(64,224,208,0.09),_transparent_24%),radial-gradient(circle_at_bottom,_rgba(255,0,153,0.12),_transparent_30%),linear-gradient(180deg,_rgba(10,10,16,0.98),_rgba(3,3,7,1))] p-[8px] shadow-[0_28px_90px_rgba(0,0,0,0.75),0_0_90px_rgba(0,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.08)]"
        style={{
          width: SLOT_CABINET_WIDTH,
          minWidth: SLOT_CABINET_WIDTH,
          maxWidth: SLOT_CABINET_WIDTH,
          height: SLOT_CABINET_HEIGHT,
          minHeight: SLOT_CABINET_HEIGHT,
          maxHeight: SLOT_CABINET_HEIGHT,
        }}
      >
        <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

        <div className="relative flex h-full min-h-0 w-full overflow-hidden rounded-[2.1rem] border border-white/6 bg-[linear-gradient(180deg,rgba(21,21,31,0.96),rgba(8,8,14,0.98)_24%,rgba(5,5,9,1))] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-18px_40px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute inset-x-[8%] top-4 h-24 rounded-[2rem] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent_60%)] blur-3xl" />
          <PixiBridge />
        </div>
      </div>
    </motion.div>
  );
};
