import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/database/entities/User";
import { Player } from "@/database/entities/Player";
import { Team } from "@/database/entities/Team";
import { Game } from "@/database/entities/Game";
import { Civ } from "@/database/entities/Civ";
import { GamePlayer } from "@/database/entities/GamePlayer";
import { Map } from "@/database/entities/Map";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbPath,
  synchronize: true,
  logging: true,
  entities: [User, Player, Team, Game, Civ, GamePlayer, Map],
});

let dataSourceInstance: DataSource | null = null;

export async function getDataSource() {
  try {
    if (!dataSourceInstance) {
      dataSourceInstance = await AppDataSource.initialize();
      console.log("✅ Database connected successfully!");
    }
    return dataSourceInstance;
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw error;
  }
}
