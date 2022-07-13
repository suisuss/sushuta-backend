class AbstractRepo {
  pool: any

  constructor(pool: any) {
    this.pool = pool
  }
}

export default AbstractRepo