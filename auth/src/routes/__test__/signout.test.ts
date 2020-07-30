import { composeSignupReq, composeSignoutReq } from '../../test/util'

describe('POST /signout', () => {
  it('clear cookie after signin out', async () => {
    await composeSignupReq({
      email: 'test@test.com',
      password: 'password',
    }).expect(200)

    const res = await composeSignoutReq().expect(200)

    expect(res.get('Set-Cookie')).toEqual([
      'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
    ])
  })
})
