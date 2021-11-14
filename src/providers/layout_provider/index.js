// package
import { createContext, useContext, useState } from 'react';

const defaultValue = {
  showHeaderBtn: false,
}

const LayoutContext = createContext(defaultValue);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  return context;
};

export const useLayoutSetting = () => {
  const context = useContext(LayoutContext);
  const { showHeaderBtn } = context;

  return { showHeaderBtn };
};

const LayoutProvider = (props) => {
  const { children } = props;

  const [layout, setLayout] = useState({showHeaderBtn: false});

  const value = {
    ...layout,
    setLayout: (newLayout) => {
      setLayout((prev) => {
        return {...prev, ...newLayout};
      });
    }
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutProvider;
