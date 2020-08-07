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

// DTO
export interface WithCreatedAt {
  createdAt: number
}

export interface WithUpdatedAt {
  updatedAt: number
}

export interface WithUserId {
  userId: string
}

export interface TicketCatalogDTO extends WithUserId, WithCreatedAt {
  id: string
  title: string
  price: number
}
