import {Resolvers} from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";
import {
    UpdateRideStatusMutationArgs,
    UpdateRideStatusResponse
} from "../../../types/graph";
import Chat from "../../../entities/Chat";

const resolvers : Resolvers = {
    Mutation : {
        UpdateRideStatus : privateResolver(
            async (
                _,
                args : UpdateRideStatusMutationArgs,
                { req, pubSub }) : Promise<UpdateRideStatusResponse> => {
            const user : User = req.user;
            if (user.isDriving) {
                try {
                    let ride : Ride | undefined;
                    if (args.status === "ACCEPTED") {
                        ride = await Ride.findOne({
                            id : args.rideId,
                            status : "REQUESTING"
                        }, {relations : ["passenger", "driver"]});
                        if (ride) {
                            ride.driver = user;
                            user.isTaken = true;
                            await user.save();
                            const chat = await Chat.create({
                                driver: user,
                                passenger: ride.passenger
                            }).save();
                            ride.chat = chat;
                            ride.chatId = chat.id
                            await ride.save()
                        } else {
                            ride = await Ride.findOne({
                                id : args.rideId,
                                driver : user
                            });
                        }
                    }
                    if (ride) {
                        ride.status = args.status;
                        await ride.save()
                        pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
                        if (args.status === "FINISHED") {
                            await User.update({id : ride.driverId}, { isTaken : false });
                            await User.update({id : ride.passengerId}, { isRiding : false })
                        }
                        return {
                            ok : true,
                            error : null,
                        }
                    } else {
                        return {
                            ok : false,
                            error : 'Cannot Update ride.'
                        }
                    }
                } catch (error) {
                    return {
                        ok : false,
                        error : error.message
                    }
                }
            } else {
                return {
                    ok : false,
                    error : "You're not driving."
                }
            }
        })
    }
}

export default resolvers;