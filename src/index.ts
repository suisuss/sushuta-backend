import { PoolConfigs, IPFSConfigs, IPFSServices } from "./interfaces";
import PinataAPI from "./lib/ipfs/pinata";
import multer from "./lib/multer";
import { initializeRoutes } from "./routes";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const isProduction = process.env.PROD === "true";

const REQUIRED_ENV = {
    PINATA_API: process.env.PINATA_API,
    PINATA_SECRET: process.env.PINATA_SECRET,

    GAMES_DB_HOST: process.env.GAMES_DB_HOST,
    GAMES_DB_PORT: process.env.GAMES_DB_PORT,
    GAMES_DB_NAME: process.env.GAMES_DB_NAME,
    GAMES_DB_USERNAME: process.env.GAMES_DB_USERNAME,
    GAMES_DB_PASSWORD: process.env.GAMES_DB_PASSWORD,

    API_KEYS_DB_HOST: process.env.API_KEYS_DB_HOST,
    API_KEYS_DB_PORT: process.env.API_KEYS_DB_PORT,
    API_KEYS_DB_NAME: process.env.API_KEYS_DB_NAME,
    API_KEYS_DB_USERNAME: process.env.API_KEYS_DB_USERNAME,
    API_KEYS_DB_PASSWORD: process.env.API_KEYS_DB_PASSWORD
    
}

const ipfsConfigs: IPFSConfigs = {
    pinata: {
        key: process.env.PINATA_API ? process.env.PINATA_API : '',
        secret: process.env.PINATA_SECRET ? process.env.PINATA_SECRET : ''
    },
    infura: {
        key: '',
        secret: ''
    }
}

const poolConfigs: PoolConfigs = isProduction
    ? // Fetch production config
    {
        games: {
            host: process.env.GAMES_DB_HOST,
            port: process.env.GAMES_DB_PORT
                ? parseInt(process.env.GAMES_DB_PORT)
                : 5432,
            database: process.env.GAMES_DB_NAME,
            user: process.env.GAMES_DB_USERNAME,
            password: process.env.GAMES_DB_PASSWORD,
        },
        api_keys: {
            host: process.env.API_KEYS_DB_HOST,
            port: process.env.API_KEYS_DB_PORT
                ? parseInt(process.env.API_KEYS_DB_PORT)
                : 5432,
            database: process.env.API_KEYS_DB_NAME,
            user: process.env.API_KEYS_DB_USERNAME,
            password: process.env.API_KEYS_DB_PASSWORD,
        },
    }
    : // Fetch development config
    {
        dev: {
            host: process.env.DEV_DB_HOST,
            port: process.env.DEV_DB_PORT
                ? parseInt(process.env.DEV_DB_PORT)
                : 5432,
            database: process.env.DEV_DB_NAME,
            user: process.env.DEV_DB_USERNAME,
            password: process.env.DEV_DB_PASSWORD,
        },
    };


    
const main = async (isProduction: boolean, poolConfigs: PoolConfigs, ipfsConfigs: IPFSConfigs) => {

    /*
    if (Object.values(REQUIRED_ENV).some((value) => { return value === undefined })) {
        console.log("Unable to start program ENV value is missing.", REQUIRED_ENV)
        process.exit()
    }*/


    // Setup

    const app = express();

    app.use(express.json({ extended: false }));
    app.use(express.text({ extended: false }));
    app.use(cors());
    app.use(multer.multerMiddleware.single('file'))

    const router = express.Router();

    router.get("/", async (req: any, res: any) => {
        res.send("RUNNING");
    });

    const ipfsServices: IPFSServices = {
        pinata: new PinataAPI(ipfsConfigs.pinata.key, ipfsConfigs.pinata.secret)
    }

    // Routes
    initializeRoutes(router, poolConfigs, ipfsServices, isProduction);

    app.use(router);


    app.listen(4001, () => {
        console.log(`Listening on port 4001`);
    });

    return app;

};

main(isProduction, poolConfigs, ipfsConfigs);

