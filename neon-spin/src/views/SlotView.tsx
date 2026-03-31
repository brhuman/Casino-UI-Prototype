import { motion } from 'framer-motion';
import { PixiBridge } from '../components/game/PixiBridge';

export const SlotView = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full flex items-center justify-center"
    >
      <div className="w-full h-full max-w-7xl relative mx-auto">
        <PixiBridge />
      </div>
    </motion.div>
  );
};
