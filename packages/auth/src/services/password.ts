import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

export class Password {
  static async toHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex')
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer
    const hash = `${buffer.toString('hex')}.${salt}`

    return hash
  }

  static async compare(hash: string, plainString: string): Promise<boolean> {
    const [passwordHash, passwordSalt] = hash.split('.')
    const plainStringBuffer = (await scryptAsync(
      plainString,
      passwordSalt,
      64,
    )) as Buffer
    const plainStringHash = plainStringBuffer.toString('hex')

    return plainStringHash === passwordHash
  }
}
