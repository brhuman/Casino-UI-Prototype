import { motion } from 'framer-motion';
import { Roulette } from '../games/tables/Roulette';

export const TablesView = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full"
    >
      <Roulette />
    </motion.div>
  );
};
