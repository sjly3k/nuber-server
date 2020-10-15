import {Resolvers} from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";
import { RequestRideMutationArgs, RequestRideResponse } from "src/types/graph";

const resolvers : Resolvers = {
    Mutation : {
        RequestRide : privateResolver(async (_, args : RequestRideMutationArgs, { req, pubSub }) : Promise<RequestRideResponse> => {
            const user : User = req.user;
            if (!user.isRiding && !user.isDriving) {
                try {
                    const ride = await Ride.create({
                        ...args, passenger: user
                    }).save()
                    pubSub.publish('rideRequest', {NearbyRideSubscription: ride})
                    user.isRiding = true;
                    await user.save();
                    return {
                        ok: true,
                        error: null,
                        ride
                    }
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message,
                        ride: null
                    }
                }
            } else {
                return {
                    ok: false,
                    error: "You can't request two rides or request a ride with driving",
                    ride: null
                }
            }
        })
    }
}

export default resolvers;