import { Users, Trophy, TrendingUp } from "lucide-react";
import StatsCard from "@/components/stats/StatsCard";
import WinRateBar from "@/components/stats/WinRateBar";
import StatLayout from "@/components/stats/StatLayout";

async function getPlayersStats() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/stats/players`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default async function PlayersPage() {
  const data = await getPlayersStats();

  const totalGames = data.players.reduce(
    (sum: number, p: any) => sum + p.gamesPlayed,
    0,
  );
  const totalWins = data.players.reduce(
    (sum: number, p: any) => sum + p.gamesWon,
    0,
  );
  const avgWinRate =
    data.players.length > 0
      ? (
          data.players.reduce(
            (sum: number, p: any) => sum + parseFloat(p.winRate),
            0,
          ) / data.players.length
        ).toFixed(1)
      : "0";

  return (
    <StatLayout
      title="Statistiques par joueur"
      subtitle="Performance individuelle des joueurs de TamarLaPote"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Joueurs actifs"
          value={data.players.length}
          icon={<Users size={24} />}
          color="blue"
        />
        <StatsCard
          title="Total de parties"
          value={totalGames}
          icon={<Trophy size={24} />}
          color="purple"
        />
        <StatsCard
          title="Winrate moyen"
          value={`${avgWinRate}%`}
          icon={<TrendingUp size={24} />}
          color="green"
        />
      </div>

      <div className="space-y-6">
        {data.players.map((player: any, index: number) => (
          <div
            key={player.playerId}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-600 font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center">
                  #{index + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {player.playerName}
                  </h3>
                  <p className="text-gray-600">
                    {player.gamesPlayed} parties jouées
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  {player.winRate}%
                </p>
                <p className="text-sm text-gray-500">Winrate</p>
              </div>
            </div>

            <div className="mb-6">
              <WinRateBar
                winRate={parseFloat(player.winRate)}
                won={player.gamesWon}
                lost={player.gamesLost}
              />
            </div>

            {player.civs.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Civilisations jouées ({player.civs.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {player.civs
                    .sort((a: any, b: any) => b.played - a.played)
                    .map((civ: any) => (
                      <div
                        key={civ.civId}
                        className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {civ.civName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {civ.played} parties
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600">{civ.won} V</span>
                          <span
                            className={`font-bold ${
                              parseFloat(civ.winRate) >= 50
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {civ.winRate}%
                          </span>
                          <span className="text-red-600">
                            {civ.played - civ.won} D
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {data.players.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">
            Aucune donnée disponible pour le moment
          </p>
        </div>
      )}
    </StatLayout>
  );
}
