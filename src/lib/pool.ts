const pg = require("pg");

export class Pool {
  pool: any
  config: any

  constructor(config: any) {
    this.config = config;

    this.pool = new pg.Pool(config);
  }

  close() {
    return this.pool.end();
  }

  query(sql: any, params: any) {
    return this.pool.query(sql, params);
  }
}

export default Pool
