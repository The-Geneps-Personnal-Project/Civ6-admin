import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import type { Game } from "./Game";
import type { Player } from "./Player";
import type { Civ } from "./Civ";
import type { Team } from "./Team";

@Entity()
export class GamePlayer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne("Game", "players")
  @JoinColumn({ name: "gameId" })
  game!: Game;

  @Column()
  gameId!: number;

  @ManyToOne("Player", "gamePlayers")
  @JoinColumn({ name: "playerId" })
  player!: Player;

  @Column()
  playerId!: number;

  @ManyToOne("Civ", "gamePlayers")
  @JoinColumn({ name: "civId" })
  civ!: Civ;

  @Column()
  civId!: number;

  @ManyToOne("Team", "gamePlayers")
  @JoinColumn({ name: "teamId" })
  team!: Team;

  @Column()
  teamId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
