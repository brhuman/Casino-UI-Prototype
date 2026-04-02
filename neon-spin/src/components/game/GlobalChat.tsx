import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DUMMY_USERS = [
  { name: 'CyberPunk', color: 'text-neon-cyan', avatar: 'C' },
  { name: 'NeonQueen', color: 'text-neon-purple', avatar: 'N' },
  { name: 'JackpotMaster', color: 'text-yellow-400', avatar: 'J' },
  { name: 'LuckyStar', color: 'text-green-400', avatar: 'L' },
  { name: 'GlitchArt', color: 'text-orange-400', avatar: 'G' },
  { name: 'MetaWhale', color: 'text-neon-fuchsia', avatar: 'M' }
];

const PRESET_MESSAGES = [
  "Just hit a 50x on Slots! 🎰",
  "Mines is so intense today. 💣",
  "Who's ready for the weekend tournament?",
  "Roulette is paying out big time! 🎡",
  "Anyone tried the new VIP features yet?",
  "Good luck everyone!",
  "Finally cleared level 25! 🚀",
  "That last spin was insane...",
  "Crypto Mines is the best game here IMO.",
  "Just joined the elite club! 👑"
];

interface Message {
  id: string;
  user: typeof DUMMY_USERS[0];
  text: string;
  timestamp: Date;
}

export const GlobalChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial messages
  useEffect(() => {
    const initial = Array.from({ length: 5 }, (_, i) => ({
      id: `init-${i}`,
      user: DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)],
      text: PRESET_MESSAGES[Math.floor(Math.random() * PRESET_MESSAGES.length)],
      timestamp: new Date(Date.now() - (5 - i) * 60000)
    }));
    setMessages(initial);
  }, []);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        user: DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)],
        text: PRESET_MESSAGES[Math.floor(Math.random() * PRESET_MESSAGES.length)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev.slice(-19), newMessage]);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const myMessage: Message = {
      id: Date.now().toString(),
      user: { name: 'You', color: 'text-white', avatar: 'U' },
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev.slice(-19), myMessage]);
    setInputValue('');
  };

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
          <div className="w-2 h-8 bg-neon-cyan rounded-full shadow-[0_0_15px_#00ffff]" /> 
          Global Chat
        </h2>
      </div>

      <div className="relative w-full h-[600px] border border-white/10 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        {/* Messages area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar"
        >
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 group"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0`}>
                   <span className={`text-xs font-black ${msg.user.color}`}>{msg.user.avatar}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${msg.user.color}`}>
                      {msg.user.name}
                    </span>
                    <span className="text-[8px] text-white/50 font-bold uppercase tracking-widest">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 font-medium leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <form 
          onSubmit={handleSend}
          className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center gap-4"
        >
          <div className="flex-1 relative">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-neon-cyan/40 transition-all font-medium"
            />
          </div>
          <button 
            type="submit"
            className="w-14 h-14 rounded-2xl bg-neon-cyan text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)]"
          >
            <Send size={20} fill="currentColor" strokeWidth={2.5} />
          </button>
        </form>

        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};
