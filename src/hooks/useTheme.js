import React from 'react';
import Theme from '@libs/Theme';

const ctx = React.createContext(Theme);

export const Provider = ({children}) => (
  <ctx.Provider value={Theme}>{children}</ctx.Provider>
);

export const useTheme = () => React.useContext(ctx);

export default useTheme;
