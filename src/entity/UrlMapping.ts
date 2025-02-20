import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class UrlMapping {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  shortId!: string;

  @Column()
  fullUrl!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  expiresAt!: Date;
}
