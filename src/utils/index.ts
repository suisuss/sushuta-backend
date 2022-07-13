import { ResponseStatus } from "../enums";
import { SystemResponse } from "../interfaces";
const { DateTime } = require("luxon");


export const paginateArray = (array: any, page_size: any, page_number: any) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};

export function filterIt(arr: any, searchKey: any) {
  const searchKeyLowerCase = searchKey.toLowerCase()
  return arr.filter((test: any) => {
    if (test.title.toLowerCase().includes(searchKeyLowerCase) || test.snippet.toLowerCase().includes(searchKeyLowerCase) || test.source.toLowerCase().includes(searchKeyLowerCase)) {
      return test
    }
  })
}


export function uInt8ArrayFromDataURI(dataURI: string) {
  const [split0, split1] = dataURI.split(',');

  const inputMIME = split0.split(':')[1].split(';')[0];
  console.log(inputMIME);
  let binaryVal;
  if (split0.indexOf('base64') >= 0)
      binaryVal = atob(split1);
  else
      binaryVal = unescape(dataURI.split(',')[1]);

  const bytes: any = Array.prototype.map.call(binaryVal, function (character) {
      return character.charCodeAt(0) & 0xff;
  });

  return new Uint8Array(bytes)
}

export const sanitize = (name: string) => {
  return name.toLowerCase().replace(/[;]/g, "");
};


export const HTTPStatusFromSystemResponse = (response: SystemResponse) => {
  var status: number
  switch (response.status) {
    case ResponseStatus.SUCCESS:
      status = 200
      break;
    case ResponseStatus.FAIL:
      status = 500
      break;
    case ResponseStatus.ERROR:
      status = 500
      break;
    case ResponseStatus.UNABLE:
      status = 400
      break;
    case ResponseStatus.UNAUTHORIZED:
      status = 401
      break;
    default:
      status = 500
      break;
  }

  return status
}

export const triggerResponse = (req: any, res: any, response: SystemResponse) => {

  if (response.status !== ResponseStatus.SUCCESS) {
    const now = DateTime.now().setZone('Australia/Melbourne')
    const log = JSON.stringify({ time: now, route: req.originalUrl, response: response, error: response.error })
    console.log(log)
  }


  res.status(HTTPStatusFromSystemResponse(response)).json(response.data);
  return


}