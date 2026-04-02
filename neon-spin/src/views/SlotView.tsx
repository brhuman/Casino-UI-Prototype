import { PixiBridge } from '../components/game/PixiBridge';


export const SlotView = () => {
  return (
    <div className="relative flex-1 flex w-full items-center justify-center p-4 sm:p-12">
      {/* Scalable Ambient Background Graphic */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-30 mix-blend-screen bg-[url('/assets/neon_slot_background.png')] bg-cover bg-center bg-no-repeat"
      />

      <div
        className="relative z-10 mx-auto flex flex-col w-full max-w-4xl max-h-[1200px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,16,24,0.95),rgba(5,6,10,0.98))] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] gap-4"
        style={{
          width: 'min(96%, 768px)',
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(64,224,208,0.15),_transparent_60%)] blur-3xl" />
        <PixiBridge />
      </div>
    </div>
  );
};
