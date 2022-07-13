import { AuthRequest } from "../interfaces";
import Web3Authentication from "../web3";



const jwt = require('jsonwebtoken');

export function generateJWT(authRequest: AuthRequest, expire: number) {

    if (authRequest.ethAddress === Web3Authentication.utils.returnOriginalSigner(authRequest.signedMessage)) {
        return jwt.sign(authRequest, process.env.PINATA_SECRET, { expiresIn: `${expire}s` });
    }
    return null
}

export const isJWTVerified = (token: string) => {
    try {
        jwt.verify(token, process.env.PINATA_SECRET as string)
        return true
    } catch (e) {
        return false
    }
}


export function authenticateJWT(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}