import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from './Event';
import { User } from './User';

@Entity()
export class Booking extends BaseEntity{
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idEvent: number;

  @Column()
  idUser: number;

  @Column()
  precio: number;

  @CreateDateColumn()
  fechaHora: Date;

  @Column()
  lugar: string;

  @Column()
  gps: string;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @ManyToOne(() => Event, (event) => event.bookings)
  event: Event;
};