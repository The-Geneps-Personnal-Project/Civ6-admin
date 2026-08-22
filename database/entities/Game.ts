import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import type { Team } from "./Team";
import type { GamePlayer } from "./GamePlayer";
import type { Map } from "./Map";

@Entity("game")
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne("team", "firstPickGames")
  @JoinColumn({ name: "firstPickId" })
  firstPick!: Team;

  @Column()
  firstPickId!: number;

  @ManyToOne("team", "secondPickGames")
  @JoinColumn({ name: "secondPickId" })
  secondPick!: Team;

  @Column()
  secondPickId!: number;

  @ManyToOne("team", "winnerGames")
  @JoinColumn({ name: "winnerId" })
  winner!: Team;

  @Column()
  winnerId!: number;

  @ManyToOne("map", "games")
  @JoinColumn({ name: "mapId" })
  map?: Map;

  @Column({ nullable: true })
  mapId?: number;

  @Column({ nullable: true })
  draftLink?: string;

  @Column()
  gameDate!: Date;

  @OneToMany("game_player", "game")
  players!: GamePlayer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  deletedAt?: Date;
}
