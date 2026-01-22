import "reflect-metadata";
import path from "path";
import { DataSource } from "typeorm";
import { User } from "@/database/entities/User";
import { Player } from "@/database/entities/Player";
import { Team } from "@/database/entities/Team";
import { Game } from "@/database/entities/Game";
import { Civ } from "@/database/entities/Civ";
import { GamePlayer } from "@/database/entities/GamePlayer";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: path.join(process.cwd(), "dev.db"),
  synchronize: true,
  logging: true,
  entities: [User, Player, Team, Game, Civ, GamePlayer],
});

let dataSourceInstance: DataSource | null = null;

export async function getDataSource() {
  if (!dataSourceInstance) {
    dataSourceInstance = await AppDataSource.initialize();
    console.log("✅ Database connected successfully!");
  }
  return dataSourceInstance;
}
