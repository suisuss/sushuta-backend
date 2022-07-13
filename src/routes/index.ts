import { IPFSServices } from "../interfaces";
import { GAMESRoutes } from "./games";

export const initializeRoutes = (
    router: any,
    poolConfigs: any,
    ipfsServices: IPFSServices,
    isProduction: boolean
  ) => {
    if (!isProduction) {
      GAMESRoutes(router, poolConfigs.dev, ipfsServices);
      return;
    }
  
    GAMESRoutes(router, poolConfigs.dcl, ipfsServices);

  };