import User from "../../../entities/User";
import {
  EmailSignUpMutationArgs,
  EmailSignUpResponse
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../../utils/createJWT";
import Verification from "../../../entities/Verification";
import {sendVerificationEmail} from "../../../utils/sendEmail";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return {
            ok: false,
            error: "해당 이메일을 가진 유저가 존재합니다. 로그인 해주세요.",
            token: null
          };
        } else {
          const phoneVerification = await Verification.findOne({
            payload : args.phoneNumber,
            verified : true
          })
          if (phoneVerification) {
            const newUser = await User.create({ ...args }).save();
            console.log(newUser)
            if (newUser.email) {
              const emailVerfication = await Verification.create({
                payload : newUser.email,
                target : "EMAIL"
              }).save()
              console.log(emailVerfication)
              await sendVerificationEmail(
                  newUser.fullName,
                  emailVerfication.key
              )
            }
            const token = createJWT(newUser.id);
            return {
              ok: true,
              error: null,
              token
            };
          } else {
            return {
              ok: false,
              error: "휴대폰 번호를 먼저 인증해주세요.",
              token: null
            };
          }
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }
    }
  }
};

export default resolvers;
