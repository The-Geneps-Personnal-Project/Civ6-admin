import { Trophy, Target, TrendingUp, Users } from "lucide-react";
import StatsCard from "@/components/stats/StatsCard";
import WinRateBar from "@/components/stats/WinRateBar";
import StatLayout from "@/components/stats/StatLayout";
import Link from "next/link";

async function getOverviewStats() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/stats/overview`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default async function OverviewPage() {
  const stats = await getOverviewStats();

  return (
    <StatLayout
      title="Vue d'ensemble"
      subtitle="Statistiques globales de TamarLaPote"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Parties jouées"
          value={stats.totalGames}
          icon={<Target size={24} />}
          color="blue"
        />
        <StatsCard
          title="Victoires"
          value={stats.tamarWins}
          subtitle={`${stats.winRate}% de winrate`}
          icon={<Trophy size={24} />}
          color="green"
        />
        <StatsCard
          title="Défaites"
          value={stats.tamarLosses}
          icon={<TrendingUp size={24} />}
          color="red"
        />
        <StatsCard
          title="Winrate global"
          value={`${stats.winRate}%`}
          icon={<Users size={24} />}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Performance globale</h2>
        <WinRateBar
          winRate={parseFloat(stats.winRate)}
          won={stats.tamarWins}
          lost={stats.tamarLosses}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">Performance par adversaire</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Équipe adverse
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Parties
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Victoires
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Défaites
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Winrate
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.opponentStats
                .sort((a: any, b: any) => b.played - a.played)
                .map((opponent: any) => (
                  <tr
                    key={opponent.teamId}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium">
                      {opponent.teamName}
                    </td>
                    <td className="py-3 px-4 text-center">{opponent.played}</td>
                    <td className="py-3 px-4 text-center text-green-600 font-medium">
                      {opponent.won}
                    </td>
                    <td className="py-3 px-4 text-center text-red-600 font-medium">
                      {opponent.lost}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold ${
                          parseFloat(opponent.winRate) >= 50
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {opponent.winRate}%
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Dernières parties</h2>
        <div className="space-y-4">
          {stats.recentGames.map((game: any) => {
            const isTamarWinner = game.winner.name === "TamarLaPote";
            const tamarTeam =
              game.firstPick.name === "TamarLaPote"
                ? game.firstPick
                : game.secondPick;
            const opponentTeam =
              game.firstPick.name === "TamarLaPote"
                ? game.secondPick
                : game.firstPick;

            return (
              <div
                key={game.id}
                className={`p-4 rounded-lg border-2 ${
                  isTamarWinner
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-lg">TamarLaPote</span>
                      <span className="text-gray-500">vs</span>
                      <span className="font-bold text-lg">
                        {opponentTeam.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>
                        📅 {new Date(game.gameDate).toLocaleDateString("fr-FR")}
                      </span>
                      {game.map && <span>🗺️ {game.map.name}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-2xl font-bold ${
                        isTamarWinner ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isTamarWinner ? "Victoire" : "Défaite"}
                    </span>
                  </div>
                </div>

                {/* Joueurs de la partie */}
                {game.players && game.players.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      {game.players.map((gp: any) => (
                        <div
                          key={gp.id}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="font-medium">{gp.player.name}</span>
                          <span className="text-gray-500">→</span>
                          <span className="text-purple-600">{gp.civ.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/stats/players"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold mb-2">📊 Stats par joueur</h3>
          <p className="text-green-100">Voir les performances individuelles</p>
        </Link>
        <Link
          href="/stats/civs"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold mb-2">🌍 Stats par civilisation</h3>
          <p className="text-purple-100">Winrate par civ jouée</p>
        </Link>
        <Link
          href="/stats/maps"
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-bold mb-2">🗺️ Stats par carte</h3>
          <p className="text-orange-100">Performance par map</p>
        </Link>
      </div>
    </StatLayout>
  );
}
