import { motion } from 'framer-motion';
import { PixiBridge } from '../components/game/PixiBridge';

const SLOT_CABINET_WIDTH = 768;

export const SlotView = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full min-h-0 w-full items-center justify-center overflow-auto p-4"
    >
      <div
        className="relative mx-auto flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,16,24,0.95),rgba(5,6,10,0.98))] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] gap-4"
        style={{
          width: SLOT_CABINET_WIDTH,
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(64,224,208,0.15),_transparent_60%)] blur-3xl" />
        <PixiBridge />
      </div>
    </motion.div>
  );
};
