import { ResponseStatus } from "../../enums";
import { IPFSServices, SystemResponse } from "../../interfaces";
import dataUri from "../../lib/datauri";
import { triggerResponse, uInt8ArrayFromDataURI } from "../../utils";
import GamesRepo from "../../repos/games/GamesRepo";
import { authentication, AuthenticationType } from "../../middleware/authentication";

import { generateKey, createCipher as encrypt, createRandomIV, createDecipher as decrypt } from "../../utils/encryptor";
const fs = require("fs")

const algorithm = 'aes-256-cfb';

const iv: Buffer = createRandomIV(algorithm);

const secret = generateKey(algorithm, "test");

// TODO: Apply authentication to routes

// GET
const getRoutes = (router: any, GamesRepo: GamesRepo, ipfsServices: IPFSServices) => {

    router.get("/api/games/getGame/:game", async (req: any, res: any) => {
        const gameName = req.params.game
        console.log(gameName)
        try {
            const file = fs.readFileSync(`./gameFiles/${gameName}.wasm`)
            const encrypted = encrypt("test", algorithm, file, iv).data;

            res.status(200).send(encrypted);
        } catch (e) {
            console.log(e)
            res.status(500).send("Internal Server Error")
        }

    });

    router.get("/api/games/check", async (req: any, res: any) => {
        var response: SystemResponse = { status: ResponseStatus.SUCCESS, message: ""}
        

        // TODO: Fetch metadata file, fetch encrypted game and decrypt it

        triggerResponse(req, res, response)
    })
}

// POST
const postRoutes = (router: any, GamesRepo: GamesRepo, ipfsServices: IPFSServices) => {
    router.post("/api/games", [authentication(AuthenticationType.W3)], async (req: any, res: any) => {
        var response: SystemResponse


        try {
            const file = dataUri(req).content;
            // TODO: Pass along body data for author etc

            const wasmGameBuffer = Buffer.from(uInt8ArrayFromDataURI(file));

            const K1 = "k1"

            const encryptedWasmGameBuffer = encrypt(K1, algorithm, Buffer.from(wasmGameBuffer), iv).data;
            const encryptedWasmGameBufferKey = encrypt(secret, algorithm, Buffer.from(K1), iv).data.toString("hex");

            const addWASMFileResponse = await ipfsServices.pinata.addWASMFile(`test`, encryptedWasmGameBuffer)
            const uploadWASMPinataResponse = await ipfsServices.pinata.uploadWASMFileToPinata(`test`)

            const metadataFileData = {
                metadata: {
                    name: "",
                    author: "",
                    authorAddress: "",
                    respository: "",
                    gab: "",
                    icon: "",
                    description: ""
                },
                file: uploadWASMPinataResponse.data.ipfsHash,
                EK1: encryptedWasmGameBufferKey
            }

            const addJSONFileResponse = await ipfsServices.pinata.addJSONFile(`test`, metadataFileData)
            const uploadJSONPinataResponse = await ipfsServices.pinata.uploadJSONFileToPinata(`test`)

            response = {
                status: ResponseStatus.SUCCESS,
                message: "",
                data: {
                    ipfsHash: uploadJSONPinataResponse.data.ipfsHash,
                }
            }
        } catch (e) {
            console.log(e)
            response = { status: ResponseStatus.ERROR, message: "POST /api/games", error: e }
        }


        triggerResponse(req, res, response)
    });
}

// EXPORT
const initializeGamesRoutes = (router: any, GamesRepo: GamesRepo, ipfsServices: IPFSServices) => {
    console.log(' - games')
    getRoutes(router, GamesRepo, ipfsServices)
    postRoutes(router, GamesRepo, ipfsServices)
}

export default initializeGamesRoutes