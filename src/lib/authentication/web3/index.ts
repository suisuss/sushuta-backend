import { ResponseStatus } from "../../../enums"
import { SignatureI, SystemResponse } from "../../../interfaces"
import AuthenticationRepo from "../../../repos/authentication/AuthenticationRepo"
import { triggerResponse } from "../../../utils"
import { returnOriginalSigner } from "./utils"


const middleware = (authenticationRepo: AuthenticationRepo) => {

    return async (req: any, res: any, next: any) => {
        var response: SystemResponse | undefined

        const address = req.body.ethAddress
        const signedMessage: [string, SignatureI] = req.body.signedMessage
        const [message, signature]: [string, SignatureI] = signedMessage

        // Authorize requesting user
        if (!(address || signedMessage || message || signature)) {
            response = { status: ResponseStatus.UNABLE, message: `Bad Request` }
            triggerResponse(req, res, response)
        }

        if (Web3Authentication.utils.returnOriginalSigner(signedMessage) !== address) {
            throw Error('Address does not match the address of that signature')
        }

        response = await authenticationRepo.getUsers({ address: address })

        if (response.status !== ResponseStatus.SUCCESS) {
            triggerResponse(req, res, response)
        }


        next()

    }
}


const Web3Authentication = {
    utils: {
        returnOriginalSigner: returnOriginalSigner
    },
    middleware
}



export default Web3Authentication