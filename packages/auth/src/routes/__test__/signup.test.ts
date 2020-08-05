import request from 'supertest'
import { app } from '../../app'
import { composeSignupReq } from '../../test/util'

async function expect422OnSignup(body: any) {
  return composeSignupReq(body).expect(422)
}

describe('POST /signup', () => {
  it('return 201 on successful signup', async () => {
    return request(app)
      .post('/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200)
  })

  it('return 422 with an invalid email', async () => {
    return expect422OnSignup({
      email: 'test@@',
      password: 'password',
    })
  })

  it('return 422 with an invalid password', async () => {
    return expect422OnSignup({
      email: 'test@@',
      password: 'xxx',
    })
  })

  it('return 422 with missing email and password', async () => {
    await expect422OnSignup({
      email: 'test@test.com',
    })

    await expect422OnSignup({
      password: 'password',
    })
  })

  it('disallow duplicate emails', async () => {
    const body = {
      email: 'test@test.com',
      password: 'password',
    }

    await composeSignupReq(body).expect(200)
    await composeSignupReq(body).expect(403)
  })

  it('has set cookie after successful signup', async () => {
    const res = await composeSignupReq({
      email: 'test@test.com',
      password: 'password',
    }).expect(200)

    expect(res.get('Set-Cookie')).toBeDefined()
  })
})
