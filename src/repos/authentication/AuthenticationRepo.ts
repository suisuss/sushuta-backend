import { DateTime } from "luxon";
import { ResponseStatus } from "../../enums";
import { SystemResponse } from "../../interfaces";
import AbstractRepo from "../AbstractRepo";

interface getUsersOptions {
  username?: string
  password?: string
  address?: string
}

class AuthenticationRepo extends AbstractRepo {

  async getUsers(options: getUsersOptions | undefined = undefined): Promise<SystemResponse> {

    var response: SystemResponse

    var query: string = 'SELECT * FROM users'

    if (options) {
      const optionKeys = Object.keys(options)
      query += ` WHERE ${optionKeys.map((option: string) => { return `${option} = '${(options as any)[option]}'` }).join(' AND ')}`

    }
    console.log(this.pool)

    try {
      const { rows } = await this.pool.query(query);

      console.log('users')
      if (rows.length > 0) { response = { status: ResponseStatus.SUCCESS, message: 'AuthenticationRepo - getAutheticatedUsers() was successful', data: { users: rows[0] } } }
      else { response = { status: ResponseStatus.FAIL, message: 'AuthenticationRepo - getAutheticatedUsers() failed' } }
    } catch (e) {
      response = { status: ResponseStatus.ERROR, message: 'AuthenticationRepo - getAutheticatedUsers() errored', error: e }
    }


    return response;
  }

  async createUser(address: string, username: string, password: string, permissons = {}, apiKey: string, expiresAt: DateTime): Promise<SystemResponse> {
    var response: SystemResponse

    try {
      const { rows } = await this.pool.query(`INSERT INTO users(address, username, password, permission, api_key, expires_at) VALUES ($1, $2, $3, $4, $5, to_timestamp($6 / 1000.0));`, [address, username, password, permissons, apiKey, expiresAt.toMillis()]);
      response = { status: ResponseStatus.SUCCESS, message: 'AuthenticationRepo - createUser() was successful', data: { users: rows } }
    } catch (e) {
      response = { status: ResponseStatus.ERROR, message: 'AuthenticationRepo - createUser() errored', error: e }
    }


    return response;
  }

}

export default AuthenticationRepo;
