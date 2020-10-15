import {Resolvers} from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import {GetNearbyRidesResponse} from "../../../types/graph";
import User from "../../../entities/User";
import {Between, getRepository} from "typeorm";
import Ride from "../../../entities/Ride";

const resolvers : Resolvers = {
    Query : {
        GetNearbyRides : privateResolver(async (_, __, { req }) : Promise<GetNearbyRidesResponse> => {
            const user : User = req.user;
            if (user.isDriving) {
                const { lastLat, lastLng } = user;
                try {
                    const ride = await getRepository(Ride).findOne({
                        status : "REQUESTING",
                        pickUpLat : Between(lastLat - 0.05, lastLat + 0.05),
                        pickUpLng : Between(lastLng - 0.05, lastLng + 0.05)
                    },
                        {relations : ["passenger"]}
                        );
                    return {
                        ok : true,
                        error : null,
                        ride : ride || null
                    }
                } catch (error) {
                    return {
                        ok : false,
                        error : error.message,
                        ride : null
                    }
                }
            } else {
                return {
                    ok : false,
                    error : 'You are not a driver.',
                    ride : null
                }
            }
        })
    }
}

export default resolvers;