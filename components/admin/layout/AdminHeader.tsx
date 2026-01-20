export default function AdminHeader() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">🎮 Civ6 Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">Admin Panel</span>
          </div>
        </div>
      </div>
    </header>
  );
}
