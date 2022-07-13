import { PoolConfig } from "pg";
import { IPFSServices } from "../../interfaces";
import { Pool } from "../../lib/pool"
import GamesRepo from "../../repos/games/GamesRepo"
import GamesRoutes from "./games"


export const GAMESRoutes = (router: any, poolConfig: PoolConfig, ipfsServices: IPFSServices) => {

  const pool = new Pool(poolConfig)

  const gamesRepo = new GamesRepo(pool)


  console.log("Initializing games routes:")
  GamesRoutes(router, gamesRepo, ipfsServices)
}