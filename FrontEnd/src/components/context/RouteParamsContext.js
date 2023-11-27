import React, { createContext, useState } from 'react';

export const RouteParamsContext = createContext({
  routeParams: {}, // Initial empty object
  setRouteParams: () => {}
});

export const RouteParamsProvider = ({ children }) => {
  const [routeParams, setRouteParams] = useState({});

  return (
    <RouteParamsContext.Provider value={{ routeParams, setRouteParams }}>
      {children}
    </RouteParamsContext.Provider>
  );
};
