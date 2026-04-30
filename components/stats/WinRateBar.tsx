interface WinRateBarProps {
  winRate: number;
  won: number;
  lost: number;
}

export default function WinRateBar({ winRate, won, lost }: WinRateBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-green-600 font-medium">{won} V</span>
        <span className="text-gray-600 font-medium">{winRate}%</span>
        <span className="text-red-600 font-medium">{lost} D</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${winRate}%` }}
        />
      </div>
    </div>
  );
}
