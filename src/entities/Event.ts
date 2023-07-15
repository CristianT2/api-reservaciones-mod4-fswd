import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Booking } from './Booking';

@Entity()
export class Event extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;
  
  @Column()
  descripcion: string;

  @Column()
  lugar: string;

  @Column({ nullable: true })
  fechaHora: Date;

  @Column()
  gps: string;

  @Column()
  precio: number;

  @Column()
  limite: number;

  @Column()
  tipoEvento: string;

  @OneToMany(() => Booking ,(booking) => booking.event)
  bookings: Booking[];
};