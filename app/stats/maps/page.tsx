import { MapPin, Trophy, Target } from "lucide-react";
import StatsCard from "@/components/stats/StatsCard";
import WinRateBar from "@/components/stats/WinRateBar";
import StatLayout from "@/components/stats/StatLayout";

async function getMapsStats() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/stats/maps`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default async function MapsPage() {
  const data = await getMapsStats();

  const totalGames = data.maps.reduce(
    (sum: number, m: any) => sum + m.played,
    0,
  );
  const totalWins = data.maps.reduce((sum: number, m: any) => sum + m.won, 0);
  const avgWinRate =
    data.maps.length > 0
      ? (
          data.maps.reduce(
            (sum: number, m: any) => sum + parseFloat(m.winRate),
            0,
          ) / data.maps.length
        ).toFixed(1)
      : "0";

  return (
    <StatLayout
      title="Statistiques par carte"
      subtitle="Performance de TamarLaPote sur chaque carte"
    >
      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Cartes jouées"
          value={data.maps.length}
          icon={<MapPin size={24} />}
          color="orange"
        />
        <StatsCard
          title="Total de parties"
          value={totalGames}
          icon={<Target size={24} />}
          color="blue"
        />
        <StatsCard
          title="Winrate moyen"
          value={`${avgWinRate}%`}
          icon={<Trophy size={24} />}
          color="green"
        />
      </div>

      <div className="space-y-6">
        {data.maps.map((map: any, index: number) => (
          <div
            key={map.mapId}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="bg-orange-100 text-orange-600 font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {map.mapName}
                  </h3>
                  {map.mapDescription && (
                    <p className="text-gray-600 mt-1">{map.mapDescription}</p>
                  )}
                  <p className="text-gray-500 mt-1">
                    {map.played} partie{map.played > 1 ? "s" : ""} jouée
                    {map.played > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="text-right ml-4">
                <p
                  className={`text-4xl font-bold ${
                    parseFloat(map.winRate) >= 50
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {map.winRate}%
                </p>
                <p className="text-sm text-gray-500">Winrate</p>
              </div>
            </div>

            <WinRateBar
              winRate={parseFloat(map.winRate)}
              won={map.won}
              lost={map.lost}
            />

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-gray-900">{map.played}</p>
                <p className="text-sm text-gray-500">Parties</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{map.won}</p>
                <p className="text-sm text-gray-500">Victoires</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{map.lost}</p>
                <p className="text-sm text-gray-500">Défaites</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.maps.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Aucune carte jouée pour le moment
          </p>
        </div>
      )}
    </StatLayout>
  );
}
