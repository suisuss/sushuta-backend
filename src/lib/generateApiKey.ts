const bcrypt = require("bcrypt");
import randomstring from "randomstring";
//@ts-ignore
import basic from "basic-authorization-header";

const generate = (username: string) => {
  const saltRounds = 10;
  let apiKey = username;
  let password = randomstring.generate({
    charset: "alphanumeric",
  });
  let basicToken = basic(apiKey, password);

  const hash = bcrypt.hashSync(password, saltRounds);
  console.log(basicToken);
  console.log(password);
  console.log(hash);
};

//generate("jack_dcl_wearable_minter");
