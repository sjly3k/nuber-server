import cors from "cors"
import {NextFunction, Response} from "express"
import {GraphQLServer, PubSub} from "graphql-yoga";
import helmet from "helmet";
import logger from "morgan"
import schema from "./schema";
import decodeJWT from "./utils/decodeJWT";

const MaxListeners : number = 99

class App {
    public app : GraphQLServer;
    public pubSub : any;

    constructor() {
        this.pubSub = new PubSub();
        this.pubSub.ee.setMaxListeners(MaxListeners);
        this.app = new GraphQLServer({
            schema,
            // 이 부분 이해가 안돼네요..
            context : req => {
                const { connection : { context = null } = {} } = req;
                return {
                    req : req.request,
                    pubSub : this.pubSub,
                    ...context
                }
            }
        })
        this.middlewares()
    }

    private middlewares = () : void => {
        this.app.express.use(cors());
        this.app.express.use(logger("dev"))
        // https://github.com/graphql/graphql-playground/issues/1283 문제 해결
        this.app.express.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));
        this.app.express.use(this.jwt)
    };

    private jwt = async (req, res : Response, next : NextFunction) : Promise<void> => {
        const token = req.get("X-JWT");
        if (token) {
            const user = await decodeJWT(token);
            req.user = user;
        }
        next();
    }
}

export default new App().app;