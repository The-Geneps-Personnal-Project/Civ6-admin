"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DataTable from "../common/DataTable";
import ModalEdit from "../common/ModalEdit";

interface Civ {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export default function CivManager() {
  const [civs, setCivs] = useState<Civ[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCivName, setNewCivName] = useState("");
  const [newCivDescription, setNewCivDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingCiv, setEditingCiv] = useState<Civ | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCivs();
  }, []);

  const fetchCivs = async () => {
    try {
      const res = await fetch("/api/admin/civs");
      const data = await res.json();
      setCivs(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCiv = async () => {
    if (!newCivName.trim()) return;
    setIsCreating(true);
    try {
      await fetch("/api/admin/civs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCivName,
          description: newCivDescription || undefined,
        }),
      });
      setNewCivName("");
      setNewCivDescription("");
      fetchCivs();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (civ: Civ) => {
    setEditingCiv(civ);
    setEditName(civ.name);
    setEditDescription(civ.description || "");
  };

  const closeEditModal = () => {
    setEditingCiv(null);
    setEditName("");
    setEditDescription("");
  };

  const saveCiv = async () => {
    if (!editingCiv || !editName.trim()) return;
    setIsSaving(true);
    try {
      await fetch(`/api/admin/civs/${editingCiv.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription || undefined,
        }),
      });
      closeEditModal();
      fetchCivs();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCiv = async (civ: Civ) => {
    if (!confirm(`Supprimer la civilisation "${civ.name}" ?`)) return;
    try {
      await fetch(`/api/admin/civs/${civ.id}`, { method: "DELETE" });
      fetchCivs();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nom" },
    { key: "description", label: "Description" },
    {
      key: "createdAt",
      label: "Créé le",
      render: (civ: Civ) => new Date(civ.createdAt).toLocaleDateString("fr-FR"),
    },
  ];

  return (
    <div>
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Nouvelle civilisation</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={newCivName}
              onChange={(e) => setNewCivName(e.target.value)}
              placeholder="Nom de la civilisation"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCreating}
            />
            <button
              onClick={createCiv}
              disabled={isCreating || !newCivName.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={20} />
              {isCreating ? "Création..." : "Ajouter"}
            </button>
          </div>
          <input
            type="text"
            value={newCivDescription}
            onChange={(e) => setNewCivDescription(e.target.value)}
            placeholder="Description (optionnel)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isCreating}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            Civilisations ({civs.length})
          </h2>
        </div>
        <DataTable
          data={civs}
          columns={columns}
          onEdit={openEditModal}
          onDelete={deleteCiv}
          loading={loading}
          emptyMessage="Aucune civilisation pour le moment"
        />
      </div>

      <ModalEdit
        isOpen={!!editingCiv}
        onClose={closeEditModal}
        title="Modifier la civilisation"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la civilisation
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
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
              onClick={saveCiv}
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
