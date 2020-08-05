import { createContext } from 'react';
import { Context } from '~/interfaces';

export const GlobalContext = createContext<Context.Global>({
  user: null,
});
