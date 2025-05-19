import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  frequency: string;

  @Column()
  city: string;

  @Column({ default: false })
  confirmed: boolean

  @Column()
  confirmationToken: string;
}
