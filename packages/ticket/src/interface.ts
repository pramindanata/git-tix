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

export namespace RequestPayload {
  interface CoreParams {
    [key: string]: string
  }

  export interface CreateTicketBody {
    title: string
    price: number
  }

  export interface GetOneTicketParams extends CoreParams {
    id: string
  }
}

export namespace DTO {
  interface WithCreatedAt {
    createdAt: number
  }

  interface WithUpdatedAt {
    updatedAt: number
  }

  interface WithUserId {
    userId: string
  }

  export interface Ticket extends WithUserId, WithCreatedAt {
    id: string
    title: string
    price: number
  }
}

// Response Object
export namespace RO {
  export interface Item<DTO> {
    data: DTO
  }

  export interface List<DTO> {
    data: DTO[]
  }
}
