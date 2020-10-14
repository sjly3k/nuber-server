import {Resolvers} from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import User from "../../../entities/User";

const resolvers : Resolvers = {
     Mutation : {
         ToggleDrivingMode : privateResolver(
         async (
             _,
             __,
             { req }
            ) => {
             const user : User = req.user;
             user.isDriving = !user.isDriving
             await user.save();
             return {
                 ok : true,
                 error : null
             }
         })
     }
}

export default resolvers;