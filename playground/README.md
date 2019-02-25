# React UI Kit Playground

This is the playground to show Medmain [React UI Kit](https://github.com/medmain/react-ui-kit/tree/master/react-ui-kit) components in action!

It provides documentation about the available components, their variations and how to use them.
The JSX code is available by clicking on the appropriate button, just below every example.

Made with [Docz](https://docz.site/).

## Overview

Documentation is written in [mdx](https://mdxjs.com/) language, a mix of Markdown and JSX components.

`mdx` files are located inside the `/src/docs` folder, one file by component or by set of components.

Beside importing components, regular JavaScript code cannot be written inside the mdx files, the `/src/components` folder contains some helpers and shared logic.

To showcase components, [Docz](https://docz.site/) provides a `<Playground>` component.
We wrap our components using a `<Root>` component to provide the required context about the theme and the locale.

```jsx
<Playground>
  <Root>Your component here!</Root>
</Playground>
```

Docz `<PropsTable>` feature is disabled for now because it works only when components are exported using the **default** exports, as mentioned [here](https://www.docz.site/documentation/components-api#propstable).

## Development

Install the dependencies:

```
npm install
```

Start the development server:

```
npm start
```

Open http://localhost:3000 in the browser

Note: it doesn't work with pnpm package manager.

## Deploy

Build in production mode, generating the `/.docz/dist` folder:

```
npm run build
```

Deploy to `https://medmain-playground.surge.sh` domain:

```
npm run deploy
```
