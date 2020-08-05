import { CurrentUser } from './domain';

export interface Global {
  user: CurrentUser | null;
}
