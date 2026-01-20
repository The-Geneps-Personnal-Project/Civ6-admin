"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DataTable from "../common/DataTable";
import ModalEdit from "../common/ModalEdit";

interface Player {
  id: number;
  name: string;
  teamId: number;
  team?: { name: string };
  createdAt: string;
}

interface Team {
  id: number;
  name: string;
}

export default function PlayerManager() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerTeamId, setNewPlayerTeamId] = useState<number | "">("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState("");
  const [editTeamId, setEditTeamId] = useState<number | "">("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playersRes, teamsRes] = await Promise.all([
        fetch("/api/admin/players"),
        fetch("/api/admin/teams"),
      ]);
      const [playersData, teamsData] = await Promise.all([
        playersRes.json(),
        teamsRes.json(),
      ]);
      setPlayers(playersData);
      setTeams(teamsData);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPlayer = async () => {
    if (!newPlayerName.trim() || !newPlayerTeamId) return;
    setIsCreating(true);
    try {
      await fetch("/api/admin/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPlayerName, teamId: newPlayerTeamId }),
      });
      setNewPlayerName("");
      setNewPlayerTeamId("");
      fetchData();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setEditName(player.name);
    setEditTeamId(player.teamId);
  };

  const closeEditModal = () => {
    setEditingPlayer(null);
    setEditName("");
    setEditTeamId("");
  };

  const savePlayer = async () => {
    if (!editingPlayer || !editName.trim() || !editTeamId) return;
    setIsSaving(true);
    try {
      await fetch(`/api/admin/players/${editingPlayer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, teamId: editTeamId }),
      });
      closeEditModal();
      fetchData();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deletePlayer = async (player: Player) => {
    if (!confirm(`Supprimer le joueur "${player.name}" ?`)) return;
    try {
      await fetch(`/api/admin/players/${player.id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nom" },
    {
      key: "team",
      label: "Équipe",
      render: (player: Player) => player.team?.name || "-",
    },
    {
      key: "createdAt",
      label: "Créé le",
      render: (player: Player) =>
        new Date(player.createdAt).toLocaleDateString("fr-FR"),
    },
  ];

  return (
    <div>
      <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Nouveau joueur</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nom du joueur"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isCreating}
          />
          <select
            value={newPlayerTeamId}
            onChange={(e) => setNewPlayerTeamId(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isCreating}
          >
            <option value="">Sélectionner une équipe</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <button
            onClick={createPlayer}
            disabled={isCreating || !newPlayerName.trim() || !newPlayerTeamId}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={20} />
            {isCreating ? "Création..." : "Ajouter"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Joueurs ({players.length})</h2>
        </div>
        <DataTable
          data={players}
          columns={columns}
          onEdit={openEditModal}
          onDelete={deletePlayer}
          loading={loading}
          emptyMessage="Aucun joueur pour le moment"
        />
      </div>

      <ModalEdit
        isOpen={!!editingPlayer}
        onClose={closeEditModal}
        title="Modifier le joueur"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du joueur
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
              Équipe
            </label>
            <select
              value={editTeamId}
              onChange={(e) => setEditTeamId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner une équipe</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
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
              onClick={savePlayer}
              disabled={isSaving || !editName.trim() || !editTeamId}
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
