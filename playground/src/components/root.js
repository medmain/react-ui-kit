import React from 'react';
import PropTypes from 'prop-types';
import {createBaseApp} from '@medmain/base-frontend';
import {Root as BaseRoot} from '@medmain/react-ui-kit';

import {englishLocale} from '../locales/english';

const locales = {
  en: englishLocale
};

const App = createBaseApp({productId: 'demo', locales});
const app = new App();

const Root = ({children}) => <BaseRoot app={app}>{children}</BaseRoot>;
Root.propTypes = {
  children: PropTypes.node.isRequired
};

export default Root;
