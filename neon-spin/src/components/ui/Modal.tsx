import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[101] p-4"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <h3 className="text-xl font-bold tracking-widest uppercase text-white">{title}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 -mr-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                   <X size={20} />
                </button>
              </div>
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
