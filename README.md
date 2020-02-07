# Intercom-Next

create intercom chat composer in any browser or on the server using javascript. Persist messager across all pages with SSR capabilities. Easy drop in for Next.js

## Installation

`yarn install intercom-next`

## How to use

On the client or you can use the script on the server like Next.js using the ssr toggle.
If your using Next.js you can simply just add the `process.browser` for ssr to render intercom SSR and have it loaded initally.

```typescript
const { loadIntercom, initIntercomWindow } = require("intercom-next");

// first init the window top level
initIntercomWindow({ appId: "myintercomappid" });

// once your page inits top level or contructor
loadIntercom({ appId: "myintercomappid", ssr: false });
```

example using on the server

```typescript
const { createIntercomSSR } = require("intercom-next");

// first init the window top level if you want or pass in the appId in the query like below: example in nodejs
createIntercomSSR({ appId: "myintercomappid" });

app.get("/intercom", (req, res) =>
  createIntercomSSR({
    appId: req.query.appId
  })
);
```

Or use in a fetch like manner if needed from the server or clientside. This returns the script for intercom inline for usage.

```typescript
const { createIntercomSSR } = require("intercom-js");

async function fetchIframe() {
  const intercomScript = await createIntercomSSR(appId);
  return intercomScript;
}
```

![Example App](https://raw.githubusercontent.com/A11yWatch/Project-Screenshots/master/intercom.png)

Screenshot above is an example image of the package used at [A11ywatch](https://www.a11ywatch.com)

## About

Simply get started with intercom in your app using javascript

## Methods

The intercom constructor using window.Intercom('method')

1. boot
2. reattach_activator
3. update

## TODO

Add typescript for better editor support etc.
