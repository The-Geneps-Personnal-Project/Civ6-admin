import Link from "next/link";
import { Users, Shield, Globe, Gamepad2 } from "lucide-react";

const cards = [
  {
    title: "Équipes",
    icon: Shield,
    href: "/admin/teams",
    description: "Gérer les équipes",
    color: "blue",
  },
  {
    title: "Joueurs",
    icon: Users,
    href: "/admin/players",
    description: "Gérer les joueurs",
    color: "green",
  },
  {
    title: "Civilisations",
    icon: Globe,
    href: "/admin/civs",
    description: "Gérer les civilisations",
    color: "purple",
  },
  {
    title: "Parties",
    icon: Gamepad2,
    href: "/admin/games",
    description: "Gérer les parties",
    color: "orange",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div
                className={`inline-flex p-3 rounded-lg bg-${card.color}-100 text-${card.color}-600 mb-4`}
              >
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500">{card.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
