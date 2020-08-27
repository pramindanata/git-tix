import { composeGetCurUser, getAuthCookies } from '../../test/util'

describe('GET /current-user', () => {
  it('return current user detail', async () => {
    const body = {
      email: 'test@test.com',
      password: 'password',
    }
    const cookie = await getAuthCookies()
    const curUserRes = await composeGetCurUser()
      .set('Cookie', cookie)
      .expect(200)

    expect(curUserRes.body.data.email).toEqual(body.email)
  })

  it('return 401, empty body, and message if not authenticated', async () => {
    const res = await composeGetCurUser().expect(401)

    expect(1).toEqual(2)

    expect(res.body).toEqual({})
    expect(res.text).toEqual('Unauthorized')
  })
})
