"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DataTable from "../common/DataTable";
import ModalEdit from "../common/ModalEdit";

interface Map {
  id: number;
  name: string;
  createdAt: string;
}

export default function MapManager() {
  const [maps, setMaps] = useState<Map[]>([]);
  const [loading, setLoading] = useState(true);

  const [newMapName, setNewMapName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingMap, setEditingMap] = useState<Map | null>(null);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const res = await fetch("/api/admin/maps");
      const data = await res.json();
      setMaps(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const createMap = async () => {
    if (!newMapName.trim()) return;
    setIsCreating(true);
    try {
      await fetch("/api/admin/maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMapName,
        }),
      });
      setNewMapName("");
      fetchMaps();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (map: Map) => {
    setEditingMap(map);
    setEditName(map.name);
  };

  const closeEditModal = () => {
    setEditingMap(null);
    setEditName("");
  };

  const saveMap = async () => {
    if (!editingMap || !editName.trim()) return;
    setIsSaving(true);
    try {
      await fetch(`/api/admin/maps/${editingMap.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
        }),
      });
      closeEditModal();
      fetchMaps();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMap = async (map: Map) => {
    if (!confirm(`Supprimer la carte "${map.name}" ?`)) return;
    try {
      await fetch(`/api/admin/maps/${map.id}`, { method: "DELETE" });
      fetchMaps();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nom" },
    {
      key: "createdAt",
      label: "Créé le",
      render: (map: Map) => new Date(map.createdAt).toLocaleDateString("fr-FR"),
    },
  ];

  return (
    <div>
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Nouvelle carte</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={newMapName}
              onChange={(e) => setNewMapName(e.target.value)}
              placeholder="Nom de la carte"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCreating}
            />
            <button
              onClick={createMap}
              disabled={isCreating || !newMapName.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={20} />
              {isCreating ? "Création..." : "Ajouter"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Cartes ({maps.length})</h2>
        </div>
        <DataTable
          data={maps}
          columns={columns}
          onEdit={openEditModal}
          onDelete={deleteMap}
          loading={loading}
          emptyMessage="Aucune carte pour le moment"
        />
      </div>

      <ModalEdit
        isOpen={!!editingMap}
        onClose={closeEditModal}
        title="Modifier la carte"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la carte
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={closeEditModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSaving}
            >
              Annuler
            </button>
            <button
              onClick={saveMap}
              disabled={isSaving || !editName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </ModalEdit>
    </div>
  );
}
