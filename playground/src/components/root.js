import React from 'react';
import {createBaseApp, englishLocale} from '@medmain/base-frontend';
import {Root as BaseRoot} from '@medmain/react-ui-kit';

const locales = {
  // en: { $id: "en", $name: "english", formatNumberInput: () => "?" }
  en: englishLocale
};

const App = createBaseApp({productId: 'demo', locales});
const app = new App();

const Root = ({children}) => <BaseRoot app={app}>{children}</BaseRoot>;

export default Root;
