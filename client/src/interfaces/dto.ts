export interface SignUpRes {
  data: {
    id: string;
    email: string;
  };
}

export interface ActionFailRes {
  type: string;
  message: string;
}

export interface RequestValidationRes {
  data: {
    message: string;
    field: string;
  }[];
}

export type UnauthenticatedRes = string;
