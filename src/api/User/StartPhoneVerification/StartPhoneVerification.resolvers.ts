import {Resolvers} from "../../../types/resolvers";
import {StartPhoneVerificationMutationArgs, StartPhoneVerificationResponse} from "../../../types/graph";
import Verification from "../../../entities/Verification";
import {sendVerificationSMS} from "../../../utils/sendSMS";

const resolvers : Resolvers = {
    Mutation : {
        StartPhoneVerification : async (
            _,
            args : StartPhoneVerificationMutationArgs
        ) : Promise<StartPhoneVerificationResponse> => {
            const { phoneNumber } = args;
            try {
                const exisitingVerification = await Verification.findOne({ payload : phoneNumber })
                if (exisitingVerification) {
                    exisitingVerification.remove()
                }
                const newVerification = await Verification.create({
                    payload : phoneNumber,
                    target : "PHONE"
                }).save()
                sendVerificationSMS(phoneNumber, newVerification.key)
                console.log(newVerification)

                return {
                    ok: true,
                    error : null
                }
            } catch (error) {
                return {
                    ok : false,
                    error : error.message
                }
            }
        }
    }
}

export default resolvers;