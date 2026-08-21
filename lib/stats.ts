import { getDataSource } from "@/lib/db";
import { Game } from "@/database/entities/Game";
import { Team } from "@/database/entities/Team";
import { Player } from "@/database/entities/Player";
import { GamePlayer } from "@/database/entities/GamePlayer";
import { Civ } from "@/database/entities/Civ";
import { Map } from "@/database/entities/Map";

async function getTamarTeamOrThrow(teamRepo: ReturnType<typeof getTeamRepo>) {
  const tamarTeam = await teamRepo.findOne({
    where: { name: "TamarLaPote" },
  });
  if (!tamarTeam) {
    throw new Error("Équipe TamarLaPote non trouvée");
  }
  return tamarTeam;
}

function getTeamRepo(dataSource: Awaited<ReturnType<typeof getDataSource>>) {
  return dataSource.getRepository(Team);
}

export async function getOverviewStats() {
  const dataSource = await getDataSource();
  const gameRepo = dataSource.getRepository(Game);
  const teamRepo = getTeamRepo(dataSource);

  const tamarTeam = await getTamarTeamOrThrow(teamRepo);

  const totalGames = await gameRepo.count();

  const tamarWins = await gameRepo.count({
    where: { winnerId: tamarTeam.id },
  });

  const recentGames = await gameRepo.find({
    relations: [
      "firstPick",
      "secondPick",
      "winner",
      "map",
      "players",
      "players.player",
      "players.civ",
    ],
    order: { gameDate: "DESC" },
    take: 10,
  });

  const gamesWithTamar = await gameRepo.find({
    relations: ["firstPick", "secondPick", "winner"],
  });

  const opponentStats: Record<
    string,
    { played: number; won: number; lost: number; teamName: string }
  > = {};

  gamesWithTamar.forEach((game) => {
    let opponent: { id: number; name: string } | null = null;

    if (game.firstPickId === tamarTeam.id) {
      opponent = game.secondPick;
    } else if (game.secondPickId === tamarTeam.id) {
      opponent = game.firstPick;
    }

    if (opponent) {
      if (!opponentStats[opponent.id]) {
        opponentStats[opponent.id] = {
          played: 0,
          won: 0,
          lost: 0,
          teamName: opponent.name,
        };
      }

      opponentStats[opponent.id].played++;

      if (game.winnerId === tamarTeam.id) {
        opponentStats[opponent.id].won++;
      } else if (game.winnerId === opponent.id) {
        opponentStats[opponent.id].lost++;
      }
    }
  });

  const winRate =
    totalGames > 0 ? ((tamarWins / totalGames) * 100).toFixed(1) : "0";

  return {
    totalGames,
    tamarWins,
    tamarLosses: totalGames - tamarWins,
    winRate,
    recentGames,
    opponentStats: Object.entries(opponentStats).map(([id, stats]) => ({
      teamId: parseInt(id),
      ...stats,
      winRate:
        stats.played > 0 ? ((stats.won / stats.played) * 100).toFixed(1) : "0",
    })),
  };
}

export async function getPlayersStats() {
  const dataSource = await getDataSource();
  const playerRepo = dataSource.getRepository(Player);
  const gamePlayerRepo = dataSource.getRepository(GamePlayer);
  const teamRepo = getTeamRepo(dataSource);

  const tamarTeam = await getTamarTeamOrThrow(teamRepo);

  const tamarPlayers = await playerRepo.find({
    where: { teamId: tamarTeam.id },
    relations: ["team"],
  });

  const playerStats = await Promise.all(
    tamarPlayers.map(async (player) => {
      const gamePlayers = await gamePlayerRepo.find({
        where: { playerId: player.id },
        relations: ["game", "game.winner", "civ"],
      });

      const gamesPlayed = gamePlayers.length;
      const gamesWon = gamePlayers.filter(
        (gp) => gp.game.winnerId === tamarTeam.id,
      ).length;

      const civStats: Record<
        number,
        { civId: number; civName: string; played: number; won: number }
      > = {};

      gamePlayers.forEach((gp) => {
        if (!civStats[gp.civId]) {
          civStats[gp.civId] = {
            civId: gp.civId,
            civName: gp.civ.name,
            played: 0,
            won: 0,
          };
        }
        civStats[gp.civId].played++;
        if (gp.game.winnerId === tamarTeam.id) {
          civStats[gp.civId].won++;
        }
      });

      return {
        playerId: player.id,
        playerName: player.name,
        gamesPlayed,
        gamesWon,
        gamesLost: gamesPlayed - gamesWon,
        winRate:
          gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(1) : "0",
        civs: Object.values(civStats).map((civ) => ({
          ...civ,
          winRate:
            civ.played > 0 ? ((civ.won / civ.played) * 100).toFixed(1) : "0",
        })),
      };
    }),
  );

  playerStats.sort((a, b) => b.gamesPlayed - a.gamesPlayed);

  return { players: playerStats };
}

export async function getCivsStats() {
  const dataSource = await getDataSource();
  const civRepo = dataSource.getRepository(Civ);
  const gamePlayerRepo = dataSource.getRepository(GamePlayer);
  const teamRepo = getTeamRepo(dataSource);

  const tamarTeam = await getTamarTeamOrThrow(teamRepo);

  const allCivs = await civRepo.find();

  const civStats = await Promise.all(
    allCivs.map(async (civ) => {
      const gamePlayers = await gamePlayerRepo.find({
        where: { civId: civ.id, teamId: tamarTeam.id },
        relations: ["game", "game.winner", "player"],
      });

      const played = gamePlayers.length;
      const won = gamePlayers.filter(
        (gp) => gp.game.winnerId === tamarTeam.id,
      ).length;

      return {
        civId: civ.id,
        civName: civ.name,
        civDescription: civ.description,
        played,
        won,
        lost: played - won,
        winRate: played > 0 ? ((won / played) * 100).toFixed(1) : "0",
      };
    }),
  );

  const playedCivs = civStats
    .filter((c) => c.played > 0)
    .sort((a, b) => b.played - a.played);

  return { civs: playedCivs };
}

export async function getMapsStats() {
  const dataSource = await getDataSource();
  const mapRepo = dataSource.getRepository(Map);
  const gameRepo = dataSource.getRepository(Game);
  const teamRepo = getTeamRepo(dataSource);

  const tamarTeam = await getTamarTeamOrThrow(teamRepo);

  const allMaps = await mapRepo.find();

  const mapStats = await Promise.all(
    allMaps.map(async (map) => {
      const games = await gameRepo.find({
        where: { mapId: map.id },
        relations: ["winner", "firstPick", "secondPick"],
      });

      const tamarGames = games.filter(
        (g) =>
          g.firstPickId === tamarTeam.id || g.secondPickId === tamarTeam.id,
      );

      const played = tamarGames.length;
      const won = tamarGames.filter((g) => g.winnerId === tamarTeam.id).length;

      return {
        mapId: map.id,
        mapName: map.name,
        played,
        won,
        lost: played - won,
        winRate: played > 0 ? ((won / played) * 100).toFixed(1) : "0",
      };
    }),
  );

  const playedMaps = mapStats
    .filter((m) => m.played > 0)
    .sort((a, b) => b.played - a.played);

  return { maps: playedMaps };
}
