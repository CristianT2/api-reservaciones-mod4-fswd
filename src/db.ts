import { DataSource} from "typeorm";
import { User } from "./entities/User";
import { Event } from "./entities/Event";
import { Booking } from "./entities/Booking";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "admin",
  database: "ticket_system_db",
  synchronize: true,  
  entities: [User, Event, Booking]
});