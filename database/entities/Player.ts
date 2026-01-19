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

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne("Team", "players")
  @JoinColumn({ name: "teamId" })
  team!: Team;

  @Column()
  teamId!: number;

  @OneToMany("GamePlayer", "player")
  gamePlayers!: GamePlayer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  deletedAt?: Date;
}
