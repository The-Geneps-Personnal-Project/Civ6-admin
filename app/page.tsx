import Link from "next/link";
import { Trophy, Users, Globe, MapPin } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            🎮 TamarLaPote Stats
          </h1>
          <p className="text-xl text-blue-200">
            Statistiques Civilization VI - Parties classées
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link
            href="/stats/overview"
            className="group bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <Trophy className="w-16 h-16 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Vue d'ensemble
              </h3>
              <p className="text-blue-200">Statistiques générales</p>
            </div>
          </Link>

          <Link
            href="/stats/players"
            className="group bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <Users className="w-16 h-16 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-2">Joueurs</h3>
              <p className="text-blue-200">Stats par joueur</p>
            </div>
          </Link>

          <Link
            href="/stats/civs"
            className="group bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <Globe className="w-16 h-16 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Civilisations
              </h3>
              <p className="text-blue-200">Stats par civ</p>
            </div>
          </Link>

          <Link
            href="/stats/maps"
            className="group bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <MapPin className="w-16 h-16 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-2">Cartes</h3>
              <p className="text-blue-200">Stats par carte</p>
            </div>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Accès rapide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/stats/overview#recent"
              className="text-center p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <p className="text-blue-200 mb-2">Dernières parties</p>
              <p className="text-3xl font-bold text-white">📊</p>
            </Link>
            <Link
              href="/stats/players#tamar"
              className="text-center p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <p className="text-blue-200 mb-2">TamarLaPote</p>
              <p className="text-3xl font-bold text-white">👑</p>
            </Link>
            <Link
              href="/stats/overview#winrate"
              className="text-center p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <p className="text-blue-200 mb-2">Taux de victoire</p>
              <p className="text-3xl font-bold text-white">🏆</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
