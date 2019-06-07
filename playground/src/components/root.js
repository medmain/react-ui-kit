import '@babel/polyfill'; // fix build error `regeneratorRuntime is not defined`

import React from 'react';
import PropTypes from 'prop-types';
import {createBaseApp} from '@medmain/base-frontend';
import {Root as BaseRoot, Modal} from '@medmain/react-ui-kit';

import {englishLocale} from '../locales/english';

const locales = {
  en: englishLocale
};

const App = createBaseApp({productId: 'demo', locales});
const app = new App();
const modal = new Modal();

const Root = ({children}) => (
  <BaseRoot app={app}>
    {modal.createElement()}
    {typeof children === 'function' ? children({app, modal}) : children}
  </BaseRoot>
);
Root.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired
};

export default Root;
