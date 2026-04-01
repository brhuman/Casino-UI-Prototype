import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useUserStore } from '../../store/useUserStore';

export const ProfileStatsChart = () => {
  const data = useUserStore((state) => state.balanceHistory);

  if (!data || data.length < 2) {
    return (
      <div className="h-[200px] flex items-center justify-center bg-white/5 rounded-[2rem] border border-white/5">
        <span className="text-white/20 text-xs font-black uppercase tracking-widest italic">
          Play a few rounds to see your balance history
        </span>
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00ffff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.2)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.2)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#00ffff', fontWeight: 'bold' }}
            cursor={{ stroke: 'rgba(0,255,255,0.2)', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#00ffff" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorBalance)" 
            animationDuration={1500}
            dot={{ fill: '#00ffff', strokeWidth: 2, r: 4, stroke: '#000' }}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
