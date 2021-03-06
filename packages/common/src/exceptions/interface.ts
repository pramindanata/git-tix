import { ActionFailType } from './constant';

export type ServerErrorType = 'DB_CONNECTION_ERROR' | 'SYNTAX_ERROR';

export interface ValidationErrorItem {
  message: string;
  field?: string;
}

export interface ValidationErrorBody {
  data: ValidationErrorItem[];
}

export interface ServerErrorBody {
  type: ServerErrorType;
  message: string;
}

export interface MessageOnlyBody {
  message: string;
}

export interface ActionFailBody {
  type: ActionFailType;
  message: string;
}
