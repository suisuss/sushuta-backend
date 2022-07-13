import APIKeyAuthentication from "../lib/authentication/apiKey";
import JWTAuthentication from "../lib/authentication/jwt";
import Web3Authentication from "../lib/authentication/web3";
import Pool from "../lib/pool";
import AuthenticationRepo from "../repos/authentication/AuthenticationRepo";

require('dotenv').config


const pool = {
  host: process.env.API_KEYS_DB_HOST,
  port: process.env.API_KEYS_DB_PORT
    ? parseInt(process.env.API_KEYS_DB_PORT)
    : 5432,
  database: process.env.API_KEYS_DB_NAME,
  user: process.env.API_KEYS_DB_USERNAME,
  password: process.env.API_KEYS_DB_PASSWORD,
}

const authenticationRepo = new AuthenticationRepo(new Pool(pool))

export enum AuthenticationType {
  JWT,
  W3,
  API_KEY
}



export const authentication = (type: AuthenticationType) => {
  return async (req: any, res: any, next: any) => { next() }
  switch (type) {
    case AuthenticationType.JWT:
      return JWTAuthentication.middleware(authenticationRepo)
    case AuthenticationType.W3:
      return Web3Authentication.middleware(authenticationRepo)
    case AuthenticationType.API_KEY:
      return APIKeyAuthentication.middleware(authenticationRepo)
    default:
      throw Error(`AuthenticationType ${type}: unknown`)
  }

  return
};
