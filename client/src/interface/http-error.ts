export interface ActionFailDetail {
  type: string;
  message: string;
}

export interface RequestValidationDetail {
  data: {
    message: string;
    field: string;
  }[];
}
