# Intercom-Next

create intercom chat composer in any browser or on the server using javascript. Keep messager up across SSR pages. Easy drop in for Next.js
Extra configuration for priority adjustments to keep the main thread unblocked.

## Installation

`yarn install intercom-next`

## How to use

On the client or you can use the script on the server like Next.js using the ssr toggle.
If your using Next.js you can simply just add the `process.browser` for ssr to render intercom SSR and have it loaded initally.

```typescript
const { loadIntercom, initIntercomWindow } = require("intercom-next");

/* 
  Generate the intercom script and load the composer
*/
loadIntercom({
  appId: "myintercomappid", // default : ''
  email: "someEmail@gmail.com", //default: ''
  name: "Some Name", //default: RandomName
  ssr: false, // default: false
  initWindow: true, // default: true
  delay: 0, // default: 0  - usefull for mobile devices to prevent blocking the main thread
});

// If init was set to false initiate the window when needed
initIntercomWindow({ appId: "myintercomappid", email: "someEmail@gmail.com" });
```

example using on the server

```typescript
const { createIntercomSSR } = require("intercom-next");

// Optiobal appId property unless app was not established: example in nodejs, make sure to globally set fetch to your request type like axios etc
createIntercomSSR({ appId: "myintercomappid", email: "someEmail@gmail.com" });

app.get("/intercom", (req, res) =>
  createIntercomSSR({
    appId: req.query.appId,
  })
);
```

Or use in a fetch like manner if needed from the server or clientside. This returns the script for intercom inline for usage.

```typescript
const { createIntercomSSR } = require("intercom-next");

async function fetchIframe() {
  const intercomScript = await createIntercomSSR(appId);
  return intercomScript;
}
```

Stop intercom and close composer.

```typescript
const { shutdownIntercom } = require("intercom-next");

shutdownIntercom();
```

## About

Simply get started with intercom in your app using javascript.

## Methods

The intercom constructor using window.Intercom('method')

1. boot - load intercom
2. reattach_activator
3. update - update intercom composer data
