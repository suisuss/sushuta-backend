
import { ethers } from "ethers";


export function returnOriginalSigner(payload: any) {
  const verification = ethers.utils.verifyMessage(
    ethers.utils.arrayify(payload[0]),
    payload[1]
  );

  return verification;
}


const utils = {
  returnOriginalSigner: returnOriginalSigner
}

export default utils