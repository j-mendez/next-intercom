"use strict";

var APP_ID = "";

function setAppId(id) {
  if (id) {
    APP_ID = id;
  }
}

function updateIntercom(event = "update", settings) {
  if (typeof window !== "undefined" && window.Intercom) {
    window.Intercom("update", settings);
  }
}

async function createIntercomSSR(appId) {
  try {
    var dataSource = await fetch(
      `https://widget.intercom.io/widget/${appId || APP_ID}`
    );
    var scriptBody = await dataSource.text();

    return `
        <script type="text/javascript" async="true">
        ${scriptBody}
        </script>
    `;
  } catch (error) {
    console.log(error);
    return error;
  }
}

function loadIntercom({
  appId,
  ssr = false,
  callBack,
  delay = 0,
  email,
  name,
  initWindow = true,
  scriptType = "async",
  scriptInitDelay = 0
}) {
  setAppId(appId);
  const app_id = appId || APP_ID;

  if (ssr) {
    const ssrIntercomScript = createIntercomSSR(appId);

    return ssrIntercomScript;
  } else if (typeof window !== "undefined") {
    if (typeof window.Intercom === "function") {
      updateIntercom("reattach_activator");
      updateIntercom("update", window.intercomSettings);
    } else if (typeof document !== "undefined") {
      var intercomeBase = function() {
        intercomeBase.c(arguments);
      };
      intercomeBase.q = [];
      intercomeBase.c = function(args) {
        intercomeBase.q.push(args);
      };

      window.Intercom = intercomeBase;

      function loadScript() {
        var intercomLoaded = document.querySelector(
          `script[src="${`https://widget.intercom.io/widget/${app_id}`}"]`
        );

        if (!intercomLoaded) {
          var intercomScript = document.createElement("script");
          intercomScript.type = "text/javascript";

          // set scriptType to null for no async/defer
          if (scriptType) {
            intercomScript[scriptType] = "true";
          }
          intercomScript.src = `https://widget.intercom.io/widget/${app_id}`;
          var initialScript = document.getElementsByTagName("script")[0];

          if (initialScript) {
            initialScript.parentNode.insertBefore(
              intercomScript,
              initialScript
            );
          }

          if (typeof callBack === "function") {
            callBack();
          }

          if (initWindow) {
            if (delay && typeof delay === "number") {
              setTimeout(
                () => initIntercomWindow({ email, appId, name }),
                delay
              );
            } else {
              initIntercomWindow({ email, appId, name });
            }
          }
        } else {
          console.log("intercom script already inserted");
        }
      }

      if (typeof document !== "undefined") {
        if (scriptInitDelay && typeof scriptInitDelay === "number") {
          setTimeout(loadScript, scriptInitDelay);
        } else {
          loadScript();
        }
      }
    } else {
      if (console && typeof console.warn === "function") {
        console.warn("ISSUE: loading intercom");
      }
    }
  }
}

function initIntercomWindow({ email, name, appId }) {
  setAppId(appId);
  const app_id = appId || APP_ID;

  if (typeof window !== "undefined" && window.Intercom) {
    if (window.intercomSettings && !window.intercomSettings.app_id) {
      window.intercomSettings = {
        app_id,
        name,
        email
      };
    }

    window.Intercom("boot", {
      app_id
    });
  }
}

module.exports = {
  updateIntercom,
  createIntercomSSR,
  setAppId,
  loadIntercom,
  initIntercomWindow
};
