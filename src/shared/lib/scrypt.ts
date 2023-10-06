import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/*
  #Wikipedia: 
  Scrypt: https://en.wikipedia.org/wiki/Scrypt
  PBKDF2: https://en.wikipedia.org/wiki/PBKDF2
*/

const SALT_LENGTH_BYTES = 32;
const HASH_LENGTH_BYTES = 64;
const HASH_ITERATIONS = 1024;
const JOIN_CHARACTER = ".";

/*
  #Note: Final hash character length will be:
  2 * ( SALT_LENGTH_BYTES + HASH_LENGTH_BYTES ) + JOIN_CHARACTER.length

  For example:
  2 * (32 + 64) + 1 = 193 characters
  ---
  
  #Note: HASH_ITERATIONS must be a power of 2
  For example:
  1024 = 2^10
  ---
*/

async function _hash(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      HASH_LENGTH_BYTES,
      { N: HASH_ITERATIONS },
      (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      },
    );
  });
}

/**
 * @returns hashed password
 * @description hashes a password
 */
export async function hash(password: string) {
  const salt = randomBytes(SALT_LENGTH_BYTES).toString("hex");
  const hash = await _hash(password, salt).then(x => x.toString("hex"));
  return `${hash}${JOIN_CHARACTER}${salt}`;
}

/**
 * @returns true if passwords match, else false
 * @description compares a plain password to a hashed password
 */
export async function compare(plainPassword: string, hashedPassword: string) {
  const [originalHash, originalSalt] = hashedPassword.split(JOIN_CHARACTER);

  if (!originalHash || !originalSalt) {
    throw Error("Invalid format for hashed password");
  }

  const originalHashBuffer = Buffer.from(originalHash, "hex");
  const generatedHashBuffer = await _hash(plainPassword, originalSalt);

  return timingSafeEqual(originalHashBuffer, generatedHashBuffer);
}
