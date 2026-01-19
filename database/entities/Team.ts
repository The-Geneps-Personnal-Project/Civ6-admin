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

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany("Player", "team")
  players!: Player[];

  @OneToMany("Game", "firstPick")
  firstPickGames!: Game[];

  @OneToMany("Game", "secondPick")
  secondPickGames!: Game[];

  @OneToMany("Game", "winner")
  winnerGames!: Game[];

  @OneToMany("GamePlayer", "team")
  gamePlayers!: GamePlayer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  deletedAt?: Date;
}
