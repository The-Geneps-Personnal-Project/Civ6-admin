"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import DataTable from "../common/DataTable";
import ModalEdit from "../common/ModalEdit";

interface Team {
  id: number;
  name: string;
}

interface Player {
  id: number;
  name: string;
  teamId: number;
}

interface Civ {
  id: number;
  name: string;
}

interface Game {
  id: number;
  firstPickId: number;
  secondPickId: number;
  winnerId: number;
  gameDate: string;
  firstPick?: { name: string };
  secondPick?: { name: string };
  winner?: { name: string };
  players?: GamePlayerData[];
  createdAt: string;
}

interface GamePlayerData {
  id: number;
  playerId: number;
  civId: number;
  teamId: number;
  player?: { name: string };
  civ?: { name: string };
  team?: { name: string };
}

interface GamePlayerForm {
  id?: number;
  playerId: number | "";
  civId: number | "";
  teamId: number | "";
}

export default function GameManager() {
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [civs, setCivs] = useState<Civ[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGame, setNewGame] = useState({
    firstPickId: "" as number | "",
    secondPickId: "" as number | "",
    winnerId: "" as number | "",
    gameDate: new Date().toISOString().split("T")[0],
  });
  const [newGamePlayers, setNewGamePlayers] = useState<GamePlayerForm[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [editGame, setEditGame] = useState({
    firstPickId: "" as number | "",
    secondPickId: "" as number | "",
    winnerId: "" as number | "",
    gameDate: "",
  });
  const [editGamePlayers, setEditGamePlayers] = useState<GamePlayerForm[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gamesRes, teamsRes, playersRes, civsRes] = await Promise.all([
        fetch("/api/admin/games"),
        fetch("/api/admin/teams"),
        fetch("/api/admin/players"),
        fetch("/api/admin/civs"),
      ]);
      const [gamesData, teamsData, playersData, civsData] = await Promise.all([
        gamesRes.json(),
        teamsRes.json(),
        playersRes.json(),
        civsRes.json(),
      ]);
      setGames(gamesData);
      setTeams(teamsData);
      setPlayers(playersData);
      setCivs(civsData);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    setNewGame({
      firstPickId: "",
      secondPickId: "",
      winnerId: "",
      gameDate: new Date().toISOString().split("T")[0],
    });
    setNewGamePlayers([]);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  const addGamePlayer = (isEdit = false) => {
    const newPlayer: GamePlayerForm = {
      playerId: "",
      civId: "",
      teamId: "",
    };

    if (isEdit) {
      setEditGamePlayers([...editGamePlayers, newPlayer]);
    } else {
      setNewGamePlayers([...newGamePlayers, newPlayer]);
    }
  };

  const updateGamePlayer = (
    index: number,
    field: keyof GamePlayerForm,
    value: number,
    isEdit = false,
  ) => {
    if (isEdit) {
      const updated = [...editGamePlayers];
      updated[index][field] = value as any;
      setEditGamePlayers(updated);
    } else {
      const updated = [...newGamePlayers];
      updated[index][field] = value as any;
      setNewGamePlayers(updated);
    }
  };

  const removeGamePlayer = (index: number, isEdit = false) => {
    if (isEdit) {
      setEditGamePlayers(editGamePlayers.filter((_, i) => i !== index));
    } else {
      setNewGamePlayers(newGamePlayers.filter((_, i) => i !== index));
    }
  };

  const createGame = async () => {
    if (!newGame.firstPickId || !newGame.secondPickId || !newGame.winnerId) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsCreating(true);
    try {
      await fetch("/api/admin/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newGame,
          players: newGamePlayers.filter(
            (p) => p.playerId && p.civId && p.teamId,
          ),
        }),
      });
      closeCreateModal();
      fetchData();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création de la partie");
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = async (game: Game) => {
    try {
      const res = await fetch(`/api/admin/games/${game.id}`);
      const fullGame = await res.json();

      setEditingGame(fullGame);
      setEditGame({
        firstPickId: fullGame.firstPickId,
        secondPickId: fullGame.secondPickId,
        winnerId: fullGame.winnerId,
        gameDate: fullGame.gameDate
          ? typeof fullGame.gameDate === "string"
            ? fullGame.gameDate.split("T")[0]
            : new Date(fullGame.gameDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });

      setEditGamePlayers(
        fullGame.players?.map((p: GamePlayerData) => ({
          id: p.id,
          playerId: p.playerId,
          civId: p.civId,
          teamId: p.teamId,
        })) || [],
      );
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const closeEditModal = () => {
    setEditingGame(null);
    setEditGamePlayers([]);
  };

  const saveGame = async () => {
    if (
      !editingGame ||
      !editGame.firstPickId ||
      !editGame.secondPickId ||
      !editGame.winnerId
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSaving(true);
    try {
      await fetch(`/api/admin/games/${editingGame.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editGame,
          players: editGamePlayers.filter(
            (p) => p.playerId && p.civId && p.teamId,
          ),
        }),
      });
      closeEditModal();
      fetchData();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la modification");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteGame = async (game: Game) => {
    if (!confirm(`Supprimer cette partie ?`)) return;
    try {
      await fetch(`/api/admin/games/${game.id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    {
      key: "firstPick",
      label: "First Pick",
      render: (game: Game) => game.firstPick?.name || "-",
    },
    {
      key: "secondPick",
      label: "Second Pick",
      render: (game: Game) => game.secondPick?.name || "-",
    },
    {
      key: "winner",
      label: "Gagnant",
      render: (game: Game) => game.winner?.name || "-",
    },
    {
      key: "gameDate",
      label: "Date",
      render: (game: Game) =>
        new Date(game.gameDate).toLocaleDateString("fr-FR"),
    },
  ];

  const renderGamePlayersForm = (isEdit = false) => {
    const gamePlayers = isEdit ? editGamePlayers : newGamePlayers;

    return (
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Joueurs de la partie ({gamePlayers.length})
          </label>
          <button
            type="button"
            onClick={() => addGamePlayer(isEdit)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus size={16} />
            Ajouter un joueur
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {gamePlayers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun joueur ajouté
            </p>
          ) : (
            gamePlayers.map((gp, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="grid grid-cols-1 gap-2">
                  <select
                    value={gp.playerId}
                    onChange={(e) =>
                      updateGamePlayer(
                        index,
                        "playerId",
                        Number(e.target.value),
                        isEdit,
                      )
                    }
                    className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un joueur</option>
                    {players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={gp.civId}
                    onChange={(e) =>
                      updateGamePlayer(
                        index,
                        "civId",
                        Number(e.target.value),
                        isEdit,
                      )
                    }
                    className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une civilisation</option>
                    {civs.map((civ) => (
                      <option key={civ.id} value={civ.id}>
                        {civ.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={gp.teamId}
                    onChange={(e) =>
                      updateGamePlayer(
                        index,
                        "teamId",
                        Number(e.target.value),
                        isEdit,
                      )
                    }
                    className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une équipe</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => removeGamePlayer(index, isEdit)}
                  className="mt-2 text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Retirer ce joueur
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nouvelle partie
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Parties ({games.length})</h2>
        </div>
        <DataTable
          data={games}
          columns={columns}
          onEdit={openEditModal}
          onDelete={deleteGame}
          loading={loading}
          emptyMessage="Aucune partie pour le moment"
        />
      </div>

      <ModalEdit
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        title="Nouvelle partie"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de la partie
            </label>
            <input
              type="date"
              value={newGame.gameDate}
              onChange={(e) =>
                setNewGame({ ...newGame, gameDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Pick (Équipe qui choisit en premier)
            </label>
            <select
              value={newGame.firstPickId}
              onChange={(e) =>
                setNewGame({ ...newGame, firstPickId: Number(e.target.value) })
              }
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Pick (Équipe qui choisit en second)
            </label>
            <select
              value={newGame.secondPickId}
              onChange={(e) =>
                setNewGame({
                  ...newGame,
                  secondPickId: Number(e.target.value),
                })
              }
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipe gagnante
            </label>
            <select
              value={newGame.winnerId}
              onChange={(e) =>
                setNewGame({ ...newGame, winnerId: Number(e.target.value) })
              }
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

          {renderGamePlayersForm(false)}
        </div>

        <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
          <button
            onClick={closeCreateModal}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isCreating}
          >
            Annuler
          </button>
          <button
            onClick={createGame}
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isCreating ? "Création..." : "Créer la partie"}
          </button>
        </div>
      </ModalEdit>

      <ModalEdit
        isOpen={!!editingGame}
        onClose={closeEditModal}
        title="Modifier la partie"
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de la partie
            </label>
            <input
              type="date"
              value={editGame.gameDate}
              onChange={(e) =>
                setEditGame({ ...editGame, gameDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Pick
            </label>
            <select
              value={editGame.firstPickId}
              onChange={(e) =>
                setEditGame({
                  ...editGame,
                  firstPickId: Number(e.target.value),
                })
              }
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Pick
            </label>
            <select
              value={editGame.secondPickId}
              onChange={(e) =>
                setEditGame({
                  ...editGame,
                  secondPickId: Number(e.target.value),
                })
              }
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipe gagnante
            </label>
            <select
              value={editGame.winnerId}
              onChange={(e) =>
                setEditGame({ ...editGame, winnerId: Number(e.target.value) })
              }
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

          {renderGamePlayersForm(true)}
        </div>

        <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
          <button
            onClick={closeEditModal}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSaving}
          >
            Annuler
          </button>
          <button
            onClick={saveGame}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </ModalEdit>
    </div>
  );
}
