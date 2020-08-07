export interface JWTPayload {
  id: string
  email: string
  iat: number
}

export interface AuthUser {
  id: string
  email: string
}

export interface RequestContext {
  authUser?: AuthUser
}

export interface SessionPayload {
  token: string
}

export interface CreateTicketReqDTO {
  title: string
  price: number
}

interface ModelWithCreatedAt {
  createdAt: number
}

interface ModelWithUpdatedAt {
  updatedAt: number
}

export interface TicketResDTO extends ModelWithCreatedAt, ModelWithUpdatedAt {
  id: string
  title: string
  price: number
}
