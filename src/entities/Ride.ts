import {rideStatus} from "../types/types"
import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    Column,
    ManyToOne
} from "typeorm";
import User from "./User";

@Entity()
class Ride extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type:"text", enum : ["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"]})
    status: rideStatus;
    @Column({type:"text"})
    pickUpAddress: string;
    @Column({type : "double precision", default:0})
    pickUpLat: number;
    @Column({type : "double precision", default:0})
    pickUpLng: number;
    @Column({type:"text"})
    dropOffAddress: string;
    @Column({type : "double precision", default:0})
    dropOffLat: number;
    @Column({type : "double precision", default:0})
    dropOffLng: number;
    @Column({type : "double precision"})
    price: number;
    @Column({type:"text"})
    distance: string;
    @Column({type:"text"})
    duration: string;
    @CreateDateColumn()
    createdAt: string;
    @UpdateDateColumn()
    updatedAt: string;

    @ManyToOne(type => User, user => user.ridesAsDriver)
    driver: User
    @ManyToOne(type => User, user => user.ridesAsPassenger)
    passenger: User
}

export default Ride