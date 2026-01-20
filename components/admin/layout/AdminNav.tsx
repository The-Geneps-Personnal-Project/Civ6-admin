"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Shield, Globe, Gamepad2 } from "lucide-react";

const navItems = [
  { href: "/admin/teams", label: "Équipes", icon: Shield },
  { href: "/admin/players", label: "Joueurs", icon: Users },
  { href: "/admin/civs", label: "Civilisations", icon: Globe },
  { href: "/admin/games", label: "Parties", icon: Gamepad2 },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
