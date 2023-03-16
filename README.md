# next-intercom

[![next-intercom](https://circleci.com/gh/j-mendez/next-intercom.svg?style=svg)](https://circleci.com/gh/j-mendez/next-intercom)[![Maintainability](https://api.codeclimate.com/v1/badges/422f08689baacea0631c/maintainability)](https://codeclimate.com/github/j-mendez/next-intercom/maintainability)[![codecov](https://codecov.io/gh/j-mendez/next-intercom/branch/master/graph/badge.svg?token=V6yOdLoHOX)](https://codecov.io/gh/j-mendez/next-intercom)

create intercom chat composer in any browser or on the server using javascript. Keep messager up across SSR pages. Easy drop in for Next.js
Extra configuration for priority adjustments to keep the main thread unblocked.

## Installation

`yarn install next-intercom`

## How to use

On the client or you can use the script on the server like Next.js using the ssr toggle.
If you're using Next.js you can simply just add the `process.browser` for ssr to render intercom SSR and have it loaded initally.

```typescript
const { loadIntercom, initIntercomWindow } = require("next-intercom");

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
initIntercomWindow({ appId: "myintercomappid", email: "something@email.com", api_base: "https://api-iam.intercom.io" }); // api_base is optional: If on EU servers use `https://api.eu.intercom.io`
```

example using on the server

```typescript
const { createIntercomSSR } = require("next-intercom");

// Optiobal appId property unless app was not established: example in nodejs, make sure to globally set fetch to your request type like axios etc
app.get("/intercom", (req, res) =>
  createIntercomSSR({
    appId: req.query.appId,
  })
);
```

Or use in a fetch like manner if needed from the server or clientside. This returns the script for intercom inline for usage.

```typescript
const { createIntercomSSR } = require("next-intercom");

async function fetchIframe() {
  const intercomScript = await createIntercomSSR(appId);
  return intercomScript;
}
```

Stop intercom and close composer.

```typescript
const { shutdownIntercom } = require("next-intercom");

shutdownIntercom();
```

Add events to Intercom.

```ts
const { updateIntercom } = require("next-intercom");

updateIntercom("onShow", function newEvent() {
  console.log("composer opened!");
});
```

Track an Intercom event.

```typescript
const { trackEvent } = require("next-intercom");

var metadata = {
  invitee_email: "pi@example.org",
  invite_code: "ADDAFRIEND",
};

trackEvent("invited-friend", metadata);
```

## About

Simply get started with intercom in your app using javascript.

## Methods

The intercom constructor using window.Intercom('method')

1. boot - load intercom
2. reattach_activator
3. update - update intercom composer data
