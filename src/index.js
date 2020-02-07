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

function loadIntercom({ appId, ssr } = { appId: APP_ID, ssr: false }) {
  setAppId(appId);
  if (ssr) {
    return createIntercomSSR(appId);
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
          `script[src="${`https://widget.intercom.io/widget/${appId ||
            APP_ID}`}"]`
        );

        if (!intercomLoaded) {
          var intercomScript = document.createElement("script");
          intercomScript.type = "text/javascript";
          intercomScript.defer = "true";
          intercomScript.src = `https://widget.intercom.io/widget/${appId ||
            APP_ID}`;
          var initialScript = document.getElementsByTagName("script")[0];

          if (initialScript) {
            initialScript.parentNode.insertBefore(
              intercomScript,
              initialScript
            );
          }
        } else {
          console.log("intercom script already inserted");
        }
      }

      if (typeof document !== "undefined") {
        loadScript();
      }
    } else {
      if (console && typeof console.warn === "function") {
        console.warn("ISSUE: loading intercom");
      }
    }
  }
}

function initIntercomWindow({ email, appId } = { email: null, appId: APP_ID }) {
  setAppId(appId);
  if (typeof window !== "undefined" && window.Intercom) {
    if (window.intercomSettings && !window.intercomSettings.app_id) {
      window.intercomSettings = {
        app_id: appId || APP_ID,
        name: email || "User",
        email: email || undefined
      };
    }

    window.Intercom("boot", {
      app_id: appId || APP_ID
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
