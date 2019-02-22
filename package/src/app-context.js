import React from 'react';
import PropTypes from 'prop-types';

const {Provider, Consumer} = React.createContext({});

export const AppProvider = ({app, children}) => {
  return <Provider value={app}>{children}</Provider>;
};
AppProvider.propTypes = {
  app: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

/*
HOC to inject `app` props to the wrapped component
*/
export const withApp = Wrapped => {
  const Component = props => <Consumer>{app => <Wrapped {...props} app={app} />}</Consumer>;
  Component.displayName = `${Wrapped.displayName || Wrapped.name || 'Component'}WithApp`;
  return Component;
};
