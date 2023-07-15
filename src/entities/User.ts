import { 
  BaseEntity, 
  Column, 
  Entity, 
  JoinTable, 
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './Event';
import { Booking } from './Booking';

@Entity()
export class User extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: number;  

  @Column()
  username: string;

  @Column()
  password: string;
  
  @ManyToMany(() => Event)
  @JoinTable()
  events: Event[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}