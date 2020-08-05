export interface SerializedActionFailDetail {
  type: string;
  message: string;
}

export type SerializedRequestValidationDetail = {
  message: string;
  field: string;
}[];
