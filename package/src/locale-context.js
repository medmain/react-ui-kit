import React from 'react';
import PropTypes from 'prop-types';

const {Provider, Consumer} = React.createContext({});

export const LocaleProvider = ({locale, children}) => {
  return <Provider value={locale}>{children}</Provider>;
};
LocaleProvider.propTypes = {
  locale: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

/*
HOC to inject `locale` props to the wrapped component
*/
export const withLocale = Wrapped => {
  const Component = props => (
    <Consumer>{locale => <Wrapped {...props} locale={locale} />}</Consumer>
  );
  Component.displayName = `${Wrapped.displayName || Wrapped.name || 'Component'}WithLocale`;
  return Component;
};
