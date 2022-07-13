import AuthenticationRepo from "../../../repos/authentication/AuthenticationRepo"
import JWTAuthentication from "../jwt"
import { ResponseStatus } from "../../../enums";
import { SystemResponse } from "../../../interfaces";
import { triggerResponse } from "../../../utils";


const bcrypt = require("bcrypt");
const base64 = require("base-64");
const utf8 = require("utf8");

const middleware = (authenticationRepo: AuthenticationRepo) => {
    return async (req: any, res: any, next: any) => {

        const encodedAuth = req.header("Authorization")

        if (!encodedAuth) {
            console.log("here")
            await JWTAuthentication.middleware(authenticationRepo)(req, res, next)
            return
        }

        var response: SystemResponse

        if (!encodedAuth) {
            response = { status: ResponseStatus.UNABLE, message: "Access Denied: Authorization header empty" }
            triggerResponse(req, res, response)
            return
        }

        let bytes = base64.decode(encodedAuth.slice(6));
        let text = utf8.decode(bytes).split(":");

        const username = text[0];
        const password = text[1];

        if (!username || !password) {
            response = { status: ResponseStatus.UNABLE, message: "Access Denied: Invalid key" }
            triggerResponse(req, res, response)
            return
        }

        // TODO: !!! fetch users with same api_key
        /*
        const { rows: info } = await pool.query(
          `SELECT * FROM users WHERE api_key = $1`,
          [username]
        );
        */
        response = await authenticationRepo.getUsers({ username: username })

        const info: any[] = []

        if (info.length === 0) {
            response = { status: ResponseStatus.UNAUTHORIZED, message: "Access Denied: Key not found" }
            triggerResponse(req, res, response)
            return
        }

        const valid = bcrypt.compareSync(password, info[0].secret_key);

        if (!valid) {
            response = { status: ResponseStatus.UNAUTHORIZED, message: "Access Denied: Invalid key" }
            triggerResponse(req, res, response)
            return
        }

        next()

    }
}

const APIKeyAuthentication = {
    middleware
}

export default APIKeyAuthentication