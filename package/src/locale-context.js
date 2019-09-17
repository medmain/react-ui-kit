import React, {useContext} from 'react';
import PropTypes from 'prop-types';

const LocaleContext = React.createContext({});

export const LocaleProvider = ({locale, children}) => {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
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
    <LocaleContext.Consumer>
      {locale => <Wrapped {...props} locale={locale} />}
    </LocaleContext.Consumer>
  );
  Component.displayName = `${Wrapped.displayName || Wrapped.name || 'Component'}WithLocale`;
  return Component;
};

/*
Hook version
*/
export const useLocale = () => useContext(LocaleContext);
