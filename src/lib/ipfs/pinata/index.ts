
import fs from "fs";
import { ResponseStatus } from "../../../enums";
import { SystemResponse } from "../../../interfaces";

const axios = require("axios");
const path = require("path");
const FormData = require("form-data");
require('dotenv').config()

class PinataAPI {
  key: string
  secret: string
  localFiles: string[]

  constructor(key: string, secret: string) {
    this.key = key
    this.secret = secret
    this.localFiles = []
  }

  async addJSONFile(fileName: string, data: any): Promise<SystemResponse> {
    var response: SystemResponse
    const filePath = path.join('/tmp', 'ipfsFiles', `${fileName}.json`);
    // TODO: ERROR CHECKING
    try {
      await fs.writeFileSync(filePath, JSON.stringify(data))

      response = {
        status: ResponseStatus.SUCCESS,
        message: `File addition '${fileName}.json' for IPFS service PinataAPI was successful`
      }

    } catch (e) {

      response = {
        status: ResponseStatus.ERROR,
        message: `PinataAPI - addJSONFile errored`, error: e
      }
    }

    return response
  }

  async addWASMFile(fileName: string, data: any): Promise<SystemResponse> {
    var response: SystemResponse
    const filePath = path.join('/tmp', 'ipfsFiles', `${fileName}.wasm.e`);
    // TODO: ERROR CHECKING
    try {
      await fs.writeFileSync(filePath, data)

      response = {
        status: ResponseStatus.SUCCESS,
        message: `File addition '${fileName}.json' for IPFS service PinataAPI was successful`
      }

    } catch (e) {

      response = {
        status: ResponseStatus.ERROR,
        message: `PinataAPI - addWASMFile errored`, error: e
      }
    }

    return response
  }

  async uploadWASMFileToPinata(fileName: string): Promise<SystemResponse> {
    var response: SystemResponse
    const pinFileToIPFSURI = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    try {

      const filePath = path.join('/tmp', 'ipfsFiles', `${fileName}.wasm.e`);

      let data = new FormData();
      data.append("file", fs.createReadStream(filePath));


      const res = await axios.post(pinFileToIPFSURI, data, {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: this.key,
          pinata_secret_api_key: this.secret,
        },
      });

      if (res.status !== 200) {
        throw Error('Filed to pin file to pinata')
      }

      await fs.unlinkSync(filePath);
      response = { status: ResponseStatus.SUCCESS, message: `PinataAPI - uploadJSONFileToPinata(${fileName}) was successful`, data: { ipfsHash: res.data.IpfsHash } }
    } catch (err) {
      console.log(err)
      response = { status: ResponseStatus.FAIL, message: `PinataAPI - uploadJSONFileToPinata errored`, error: err }
    }
    return response
  }



  async uploadJSONFileToPinata(fileName: string): Promise<SystemResponse> {
    var response: SystemResponse
    const pinFileToIPFSURI = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    try {

      const filePath = path.join('/tmp', 'ipfsFiles', `/${fileName}.json`);

      let data = new FormData();
      data.append("file", fs.createReadStream(filePath));


      const res = await axios.post(pinFileToIPFSURI, data, {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: this.key,
          pinata_secret_api_key: this.secret,
        },
      });

      if (res.status !== 200) {
        throw Error('Filed to pin file to pinata')
      }

      await fs.unlinkSync(filePath);
      response = { status: ResponseStatus.SUCCESS, message: `PinataAPI - uploadJSONFileToPinata(${fileName}) was successful`, data: { ipfsHash: res.data.IpfsHash } }
    } catch (err) {
      response = { status: ResponseStatus.FAIL, message: `PinataAPI - uploadJSONFileToPinata errored`, error: err }
    }
    return response
  }

  async checkPinataUpload(name: string) {
    var response: SystemResponse
    let url = `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${name}`;

    try {
      let res = await axios.get(url, {
        headers: {
          pinata_api_key: this.key,
          pinata_secret_api_key: this.secret,
        },
      });

      if (res.data.count !== 0) {
        response = {
          status: ResponseStatus.SUCCESS, message: ``, data: {
            hash: res.data.rows[0].ipfs_pin_hash
          }
        }
      } else {
        response = { status: ResponseStatus.SUCCESS, message: ``, data: false };
      }
    } catch (err) {
      response = { status: ResponseStatus.FAIL, message: ``, error: err }
    }
    return response
  }
}

export default PinataAPI