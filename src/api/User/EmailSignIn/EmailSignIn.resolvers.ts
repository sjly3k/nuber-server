import {Resolvers} from "../../../types/resolvers";
import {EmailSignInMutationArgs, EmailSignInResponse} from "../../../types/graph";
import User from "../../../entities/User";

const resolvers : Resolvers = {
    Mutation : {
        EmailSignIn : async (
            _,
            args : EmailSignInMutationArgs
        ) : Promise<EmailSignInResponse> => {
            try {
                const { email, password } = args;
                const user = await User.findOne({ email });
                if (!user) {
                    return {
                        ok : false,
                        error : "해당 이메일을 가진 유저가 존재하지 않습니다.",
                        token : null
                    }
                } else {
                    const checkPassword = await user.comparePassword(password)
                    if(checkPassword) {
                        return {
                            ok : true,
                            error : null,
                            token : "Comming soon"
                        }
                    } else {
                        return {
                            ok: false,
                            error: "패스워드가 틀렸습니다.",
                            token: null
                        }
                    }
                }
            } catch (error) {
                return {
                    ok : false,
                    error : error.message,
                    token : null
                }
            }
        }
    }
}

export default resolvers;