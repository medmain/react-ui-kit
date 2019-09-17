import React, {useContext} from 'react';
import PropTypes from 'prop-types';

const AppContext = React.createContext({});

export const AppProvider = ({app, children}) => {
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};
AppProvider.propTypes = {
  app: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

/*
HOC to inject `app` props to the wrapped component
*/
export const withApp = Wrapped => {
  const Component = props => (
    <AppContext.Consumer>{app => <Wrapped {...props} app={app} />}</AppContext.Consumer>
  );
  Component.displayName = `${Wrapped.displayName || Wrapped.name || 'Component'}WithApp`;
  return Component;
};

/*
Hook version
*/
export const useApp = () => useContext(AppContext);
