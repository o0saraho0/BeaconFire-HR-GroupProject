// this is only used for generating env variable ACCESS_TOKEN_SECRET, which is used to sign JWT.
// In theory you can use any value of ACCESS_TOKEN_SECRET.
import { randomBytes } from 'crypto';
console.log(randomBytes(64).toString('hex'));
