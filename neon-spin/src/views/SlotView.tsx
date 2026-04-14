import { PixiBridge } from '@/components/game/PixiBridge';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';


export const SlotView = () => {
  const { highQualityFx } = useSettingsStore();

  return (
    <div className="relative flex-1 flex w-full flex-col items-center justify-center p-4 sm:p-12">
      <title>Neon Slots | Spin to Win in the Cybercity</title>
      <meta name="description" content="Experience the thrill of the Neon Slots. High volatility, massive payouts, and stunning visual effects. Your jackpot awaits." />
      <meta property="og:title" content="Neon Slots | Spin to Win in the Cybercity" />
      <meta property="og:description" content="Experience the thrill of the Neon Slots. High volatility, massive payouts, and stunning visual effects. Your jackpot awaits." />
      <meta property="og:image" content="https://neonspin.vercel.app/assets/slots_thumb.png" />
      <meta name="twitter:title" content="Neon Slots | Spin to Win in the Cybercity" />
      <meta name="twitter:description" content="Experience the thrill of the Neon Slots. High volatility, massive payouts, and stunning visual effects. Your jackpot awaits." />
      <meta name="twitter:image" content="https://neonspin.vercel.app/assets/slots_thumb.png" />
      {/* Scalable Ambient Background Graphic */}
      {highQualityFx && (
        <div 
          className="pointer-events-none fixed inset-0 z-0 opacity-30 mix-blend-screen bg-[url('/assets/neon_slot_background.png')] bg-cover bg-center bg-no-repeat"
        />
      )}

      <div className="relative z-10 flex flex-col gap-8 w-full max-w-4xl pb-12">
        <div
          className="relative z-10 mx-auto flex flex-col w-full max-h-[1200px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,16,24,0.95),rgba(5,6,10,0.98))] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] gap-4"
          style={{
            width: 'min(96%, 768px)',
          }}
        >
          {highQualityFx && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,_rgba(64,224,208,0.15),_transparent_60%)] blur-3xl" />
          )}
          <ErrorBoundary fallbackMessage="The Slot Engine encountered a rendering fault.">
            <PixiBridge />
          </ErrorBoundary>
        </div>

      </div>
    </div>
  );
};
