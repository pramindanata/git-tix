import { composeSigninReq, composeSignupReq } from '../../test/util'

describe('POST /signin', () => {
  it('return 403 when non existing email given', () => {
    return composeSigninReq({
      email: 'test@test.com',
      password: 'password',
    }).expect(403)
  })

  it('return 403 when incorrect password given', async () => {
    const body = {
      email: 'test@test.com',
      password: 'password',
    }

    await composeSignupReq(body).expect(200)
    await composeSigninReq({
      email: body.email,
      password: 'test',
    }).expect(403)
  })

  it('return a cookie when given valid credentials', async () => {
    const body = {
      email: 'test@test.com',
      password: 'password',
    }
    await composeSignupReq(body).expect(200)
    const res = await composeSigninReq(body).expect(200)

    expect(res.get('Set-Cookie')).toBeDefined()
  })
})
