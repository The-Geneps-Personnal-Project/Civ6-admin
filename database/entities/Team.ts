import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import type { Player } from "./Player";
import type { Game } from "./Game";
import type { GamePlayer } from "./GamePlayer";

@Entity("team")
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany("player", "team")
  players!: Player[];

  @OneToMany("game", "firstPick")
  firstPickGames!: Game[];

  @OneToMany("game", "secondPick")
  secondPickGames!: Game[];

  @OneToMany("game", "winner")
  winnerGames!: Game[];

  @OneToMany("game_player", "team")
  gamePlayers!: GamePlayer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  deletedAt?: Date;
}
