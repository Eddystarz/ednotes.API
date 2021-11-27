import totp from "totp-generator";
import config from "../helper/config";
const { TOTP_KEY } = config;
const token = totp(TOTP_KEY, { digits: 6 });
const createOneTitmeToken = () => token;
export default createOneTitmeToken;
