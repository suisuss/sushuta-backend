import AuthenticationRepo from "../../../repos/authentication/AuthenticationRepo";

// Auth via API key for applications and particular users
const utils = require('./utils')

const middleware = (authenticationRepo: AuthenticationRepo) => {

  return async (req: any, res: any, next: any) => {

    // TODO

    console.log(req.route.path)

    next()
    return


  }
}


const JWTAuthentication = {
  utils,
  middleware
}



export default JWTAuthentication