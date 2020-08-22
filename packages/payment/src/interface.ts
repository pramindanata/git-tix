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

  export interface GetOneOrderParams extends CoreParams {
    orderId: string
  }

  export interface CancelOrderParams extends CoreParams {
    orderId: string
  }

  export interface CreateOrderBody {
    ticketId: string
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
