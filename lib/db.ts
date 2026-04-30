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

const globalForDb = global as unknown as { dataSource: DataSource | null };

if (!globalForDb.dataSource) {
  globalForDb.dataSource = new DataSource({
    type: "better-sqlite3",
    database: dbPath,
    synchronize: true,
    logging: true,
    entities: [User, Player, Team, Game, Civ, GamePlayer, Map],
  });
}

export const AppDataSource = globalForDb.dataSource!;

export async function getDataSource() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database connected successfully!");
    }
    return AppDataSource;
  } catch (error) {
    console.error("❌ Database connection error:", error);
    throw error;
  }
}
