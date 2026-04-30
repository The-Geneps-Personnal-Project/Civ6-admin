import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

interface StatLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function StatLayout({
  children,
  title,
  subtitle,
}: StatLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Retour à laccueil
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
            >
              <Home size={20} />
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          {subtitle && <p className="text-blue-200 text-lg">{subtitle}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
