"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DataTable from "../common/DataTable";
import ModalEdit from "../common/ModalEdit";

interface Team {
  id: number;
  name: string;
  createdAt: string;
}

export default function TeamManager() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // États pour l'édition
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch("/api/admin/teams");
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async () => {
    if (!newTeamName.trim()) return;
    setIsCreating(true);
    try {
      await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName }),
      });
      setNewTeamName("");
      fetchTeams();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setEditName(team.name);
  };

  const closeEditModal = () => {
    setEditingTeam(null);
    setEditName("");
  };

  const saveTeam = async () => {
    if (!editingTeam || !editName.trim()) return;
    setIsSaving(true);
    try {
      await fetch(`/api/admin/teams/${editingTeam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      closeEditModal();
      fetchTeams();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTeam = async (team: Team) => {
    if (!confirm(`Supprimer l'équipe "${team.name}" ?`)) return;
    try {
      await fetch(`/api/admin/teams/${team.id}`, { method: "DELETE" });
      fetchTeams();
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
      render: (team: Team) =>
        new Date(team.createdAt).toLocaleDateString("fr-FR"),
    },
  ];

  return (
    <div>
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Nouvelle équipe</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Nom de l'équipe"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && createTeam()}
            disabled={isCreating}
          />
          <button
            onClick={createTeam}
            disabled={isCreating || !newTeamName.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={20} />
            {isCreating ? "Création..." : "Ajouter"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Équipes ({teams.length})</h2>
        </div>
        <DataTable
          data={teams}
          columns={columns}
          onEdit={openEditModal}
          onDelete={deleteTeam}
          loading={loading}
          emptyMessage="Aucune équipe pour le moment"
        />
      </div>

      <ModalEdit
        isOpen={!!editingTeam}
        onClose={closeEditModal}
        title="Modifier l'équipe"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de léquipe
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === "Enter" && saveTeam()}
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
              onClick={saveTeam}
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
