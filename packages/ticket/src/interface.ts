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

/**
 * Request Payload
 */
export namespace RP {
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

  export interface UpdateTicketParams extends CoreParams {
    id: string
  }

  export interface UpdateTicketBody {
    title: string
    price: number
  }
}

/**
 * Data Transfer Object
 */
export namespace DTO {
  export interface WithCreatedAt {
    createdAt: string
  }

  export interface WithUpdatedAt {
    updatedAt: string
  }

  export interface WithUserId {
    userId: string
  }
}

/**
 * Response Object
 */
export namespace RO {
  export interface Item<DTO> {
    data: DTO
  }

  export interface List<DTO> {
    data: DTO[]
  }
}
