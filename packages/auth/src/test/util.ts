import request from 'supertest'
import { app } from '../app'

export function composeSigninReq(body: unknown): request.Test {
  return request(app)
    .post('/signin')
    .send(body as any)
}

export function composeSignupReq(body: unknown): request.Test {
  return request(app)
    .post('/signup')
    .send(body as any)
}

export function composeSignoutReq(): request.Test {
  return request(app).post('/signout')
}

export function composeGetCurUser(): request.Test {
  return request(app).get('/current-user')
}

export async function getAuthCookies(): Promise<string[]> {
  const body = {
    email: 'test@test.com',
    password: 'password',
  }
  const res = await composeSignupReq(body).expect(200)

  return res.get('Set-Cookie')
}
