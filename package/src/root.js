import React from 'react';
import PropTypes from 'prop-types';
import {Style} from 'radium';
import RadiumStarter, {RadiumStarterRoot} from 'radium-starter';
import subscribe from '@ministate/react';
import Fullscreen from 'react-full-screen';

import {LocaleProvider} from './locale-context';
import {AppProvider} from './app-context';
import {baseTheme, baseStyles, baseGlobalStyles} from './styling';

/*
The top level component that wraps the React applications
It includes all our Context providers: Radium theme, App, Locale...
*/
const Wrapper = props => {
  const {
    app,
    theme: customTheme,
    styles: customStyles,
    globalStyles: customGlobalStyles,
    children
  } = props;
  const theme = () => ({
    ...baseTheme(),
    ...customTheme
  });
  const styles = (t, s) => ({
    ...baseStyles(t, s),
    ...(customStyles && customStyles(t, s))
  });
  const globalStyles = (t, s) => ({
    ...baseGlobalStyles(t),
    ...(customGlobalStyles && customGlobalStyles(t, s))
  });

  return (
    <RadiumStarterRoot theme={theme} styles={styles}>
      <AppProvider app={app}>
        <LocaleProvider locale={app.getLocale()}>
          <Fullscreen
            enabled={app.state.isFullscreen}
            onChange={value => {
              app.setIsFullscreen(value);
            }}
          >
            <RadiumStarter>
              {(t, s) => (
                <React.Fragment>
                  <Style rules={globalStyles(t, s)} />
                  {children}
                </React.Fragment>
              )}
            </RadiumStarter>
            {/* Modal element must be mounted inside <Fullscreen> */}
            {app.getModal().createElement()}
            {app.getToaster().createElement()}
          </Fullscreen>
        </LocaleProvider>
      </AppProvider>
    </RadiumStarterRoot>
  );
};
Wrapper.propTypes = {
  app: PropTypes.object.isRequired,
  // Props used to customize the look and feel (not required):
  theme: PropTypes.object,
  styles: PropTypes.func,
  globalStyles: PropTypes.func,
  children: PropTypes.node.isRequired
};

/*
The exported `Root` component subscribes to the `app` object,
so that the whole application re-renders every time a change is published.
No `subscribe` call should be necessary elsewhere.
*/
export const Root = ({app, children, ...rest}) => {
  return React.createElement(subscribe(app)(Wrapper), {app, ...rest}, children);
};
Root.propTypes = {
  app: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};
