"use strict";

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}

type ScriptType = "defer" | "async";

interface IntercomProps {
  [x: string]: any;
  appId?: string;
  ssr?: boolean;
  callBack?(param?: any): any;
  delay?: number;
  email?: string | null;
  name?: string;
  initWindow?: boolean;
  scriptType?: ScriptType;
  scriptInitDelay?: number;
}

let APP_ID = "";

function setAppId(id: string) {
  if (id) {
    APP_ID = id;
  }
}

function updateIntercom(event: string = "update", settings: any = null) {
  if (typeof window !== "undefined" && window.Intercom) {
    window.Intercom("update", settings);
  }
}

async function createIntercomSSR(appId: string = APP_ID) {
  try {
    const dataSource = await fetch(
      `https://widget.intercom.io/widget/${appId}`
    );
    const scriptBody = await dataSource.text();

    return `<script type="text/javascript" async="true">${scriptBody}</script>`;
  } catch (error) {
    console.error(error);
    return error;
  }
}

function loadIntercom({
  appId = APP_ID,
  ssr = false,
  callBack,
  delay = 0,
  email = null,
  name,
  initWindow = true,
  scriptType = "async",
  scriptInitDelay = 0,
  ...extra
}: IntercomProps) {
  setAppId(appId);

  if (ssr) {
    return createIntercomSSR(appId);
  } else if (typeof window !== "undefined") {
    if (typeof window.Intercom === "function") {
      updateIntercom("reattach_activator");
      updateIntercom("update", window.intercomSettings);
    } else if (typeof document !== "undefined") {
      var intercomeBase: any = function () {
        intercomeBase.c(arguments);
      };
      intercomeBase.q = [];
      intercomeBase.c = function (args) {
        intercomeBase.q.push(args);
      };

      window.Intercom = intercomeBase;

      var loadScript = function () {
        var intercomLoaded = document.querySelector(
          `script[src="${`https://widget.intercom.io/widget/${appId}`}"]`
        );

        if (!intercomLoaded) {
          var intercomScript = document.createElement("script");
          intercomScript.type = "text/javascript";

          // set scriptType to null for no async/defer
          if (scriptType) {
            intercomScript[scriptType] = true;
          }
          intercomScript.src = `https://widget.intercom.io/widget/${appId}`;
          var initialScript = document.getElementsByTagName("script")[0];

          if (initialScript && initialScript.parentNode) {
            initialScript.parentNode.insertBefore(
              intercomScript,
              initialScript
            );
          }

          if (initWindow) {
            const intercomProps = Object.assign(
              {},
              {
                email: email || null,
                appId,
                name,
              },
              extra
            );

            if (delay && typeof delay === "number") {
              setTimeout(() => initIntercomWindow(intercomProps), delay);
            } else {
              initIntercomWindow(intercomProps);
            }
          }
        } else {
          console.log("intercom script already inserted");
        }

        typeof callBack === "function" && callBack();
      };

      if (scriptInitDelay && typeof scriptInitDelay === "number") {
        setTimeout(loadScript, scriptInitDelay);
      } else {
        loadScript();
      }
    } else {
      console.warn("intercom failed to load");
    }
  }
}

function initIntercomWindow({ appId = APP_ID, ...otherProps }): void {
  const intercomProps = Object.assign(
    {},
    {
      app_id: appId,
    },
    otherProps
  );

  if (typeof window !== "undefined" && window.Intercom) {
    if (window.intercomSettings && !window.intercomSettings.app_id) {
      window.intercomSettings = intercomProps;
    }

    window.Intercom("boot", intercomProps);
  }
}

function shutdownIntercom(): void {
  if (typeof window !== "undefined" && window.Intercom) {
    window.Intercom("shutdown");
    delete window.Intercom;
    delete window.intercomSettings;
  }
}

export {
  updateIntercom,
  createIntercomSSR,
  setAppId,
  loadIntercom,
  initIntercomWindow,
  shutdownIntercom,
};
