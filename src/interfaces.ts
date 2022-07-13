import { PoolConfig } from "pg";
import { ResponseStatus } from "./enums";
import PinataAPI from "./lib/ipfs/pinata";

export interface VettingStatus {
  vetted: boolean
  approved: boolean
}

export interface PoolConfigs {
  dev?: PoolConfig;
  games?: PoolConfig;
  api_keys?: PoolConfig;
}

export interface NFTBuzzRepos {
  rssLinksRepo: any;
  articlesRepo: any;
}


export interface IPFSConfigs {
  pinata: {
    key: string
    secret: string
  }
  infura: {
    key: string
    secret: string
  }
}

export interface IPFSServices {
  pinata: PinataAPI
}


export interface SystemResponse {
  status: ResponseStatus
  message: string
  error?: any
  data?: any
}

export interface SignatureI {
  r: string
  s: string
  _vs: string
  recoveryParam: number
  v: number,
  yParityAndS: string
  compact: string

}