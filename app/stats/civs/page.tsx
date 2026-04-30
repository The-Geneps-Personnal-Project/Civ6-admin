import { Globe, Trophy, Target } from "lucide-react";
import StatsCard from "@/components/stats/StatsCard";
import WinRateBar from "@/components/stats/WinRateBar";
import StatLayout from "@/components/stats/StatLayout";

async function getCivsStats() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/api/stats/civs`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default async function CivsPage() {
  const data = await getCivsStats();

  const totalGames = data.civs.reduce(
    (sum: number, c: any) => sum + c.played,
    0,
  );
  const totalWins = data.civs.reduce((sum: number, c: any) => sum + c.won, 0);
  const avgWinRate =
    data.civs.length > 0
      ? (
          data.civs.reduce(
            (sum: number, c: any) => sum + parseFloat(c.winRate),
            0,
          ) / data.civs.length
        ).toFixed(1)
      : "0";

  return (
    <StatLayout
      title="Statistiques par civilisation"
      subtitle="Performance de TamarLaPote avec chaque civilisation"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Civilisations jouées"
          value={data.civs.length}
          icon={<Globe size={24} />}
          color="purple"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.civs.map((civ: any, index: number) => (
          <div
            key={civ.civId}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-purple-100 text-purple-600 font-bold text-sm px-3 py-1 rounded-full">
                    #{index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">
                    {civ.civName}
                  </h3>
                </div>
                {civ.civDescription && (
                  <p className="text-sm text-gray-600 mb-3">
                    {civ.civDescription}
                  </p>
                )}
                <p className="text-gray-600">
                  {civ.played} partie{civ.played > 1 ? "s" : ""} jouée
                  {civ.played > 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-3xl font-bold ${
                    parseFloat(civ.winRate) >= 50
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {civ.winRate}%
                </p>
                <p className="text-sm text-gray-500">Winrate</p>
              </div>
            </div>

            <WinRateBar
              winRate={parseFloat(civ.winRate)}
              won={civ.won}
              lost={civ.lost}
            />

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{civ.played}</p>
                <p className="text-xs text-gray-500">Parties</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{civ.won}</p>
                <p className="text-xs text-gray-500">Victoires</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{civ.lost}</p>
                <p className="text-xs text-gray-500">Défaites</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.civs.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Aucune civilisation jouée pour le moment
          </p>
        </div>
      )}
    </StatLayout>
  );
}
