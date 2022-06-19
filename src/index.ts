/*
import * as crypto from "crypto";
import axios from "axios";

const algorithm = 'aes-256-gcm';
const password = crypto.randomBytes(32);


function encrypt(buffer: any) {

    const iv = crypto.randomBytes(16);
    
    var cipher = crypto.createCipheriv(algorithm, password, iv)
    var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return crypted;
}


const main = async () => {

    const res = await axios.get('https://fetch-progress.anthum.com/images/sunrise-baseline.jpg', {
        responseType: 'arraybuffer',
        headers: {
            Accept: 'accept',
            Authorization: 'authorize'
        },
    })

    const buffer = Buffer.from(res.data.buffer)

    console.log(encrypt(buffer))
}

main()
*/

import { generateKey, createCipher as encrypt, createRandomIV } from "./utils/encryptor";
const express = require("express");
const cors = require("cors");
const fs = require("fs")

const algorithm = 'aes-256-cfb';

const iv: Buffer = createRandomIV(algorithm);

const password = generateKey(algorithm, "test")
const main = async () => {
    // Setup

    const app = express();

    app.use(express.json({ extended: false }));
    app.use(express.text({ extended: false }));
    app.use(cors());

    const router = express.Router();

    router.get("/password", async (req: any, res: any) => {
        res.status(200).send(password)
    })

    router.get("/game/:game", async (req: any, res: any) => {
        const gameName = req.params.game
        console.log(gameName)
        try {
            const file = fs.readFileSync(`./games/${gameName}.wasm`)
            const encrypted = encrypt("test", algorithm, file, iv).data;

            res.status(200).send(encrypted);
        } catch (e) {
            console.log(e)
            res.status(500).send("Internal Server Error")
        }

    });



    app.use(router);

    app.use('/static', express.static('public'))

    app.listen(4001, () => {
        console.log(`Listening on port 4001`);
    });

    return app;

};

main();

