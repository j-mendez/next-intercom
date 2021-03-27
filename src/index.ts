"use strict"

import type { IntercomProps, ScriptType } from "./types"

let APP_ID = ""
const widgetCdn = "https://widget.intercom.io/widget/"

function setAppId(id: string) {
  if (id) {
    APP_ID = id
  }
}

function updateIntercom(event: string = "update", settings: any = null) {
  if (typeof window !== "undefined" && window.Intercom) {
    window.Intercom(event, settings)
  }
}

function trackEvent(type: string, metadata: any = null) {
  if (typeof window !== "undefined" && window.Intercom) {
    window.Intercom("trackEvent", type, metadata)
  }
}

async function createIntercomSSR(appId: string = APP_ID) {
  try {
    const dataSource = await fetch(`${widgetCdn}${appId}`)
    const scriptBody = await dataSource.text()

    return `<script type="text/javascript" async="true">${scriptBody}</script>`
  } catch (error) {
    console.error(error)
    return error
  }
}

function loadIntercom({
  appId = APP_ID,
  callBack,
  delay = 0,
  email = null,
  name,
  initWindow = true,
  scriptType = "async",
  scriptInitDelay = 0,
  ...extra
}: IntercomProps) {
  setAppId(appId)

  if (extra.ssr) {
    return createIntercomSSR(appId)
  } else if (typeof window !== "undefined") {
    if (typeof window.Intercom === "function") {
      updateIntercom("reattach_activator")
      updateIntercom("update", window.intercomSettings)
    } else if (typeof document !== "undefined") {
      const intercomBase: any = function () {
        intercomBase.c(arguments)
      }

      intercomBase.q = []
      intercomBase.c = function (args) {
        intercomBase.q.push(args)
      }

      window.Intercom = intercomBase

      const loadScript = function () {
        const intercomLoaded = document.querySelector(
          `script[src="${widgetCdn}${appId}"]`
        )

        if (!intercomLoaded) {
          const intercomScript = document.createElement("script")
          intercomScript.type = "text/javascript"

          if (scriptType) {
            intercomScript[scriptType] = true
          }
          intercomScript.src = `${widgetCdn}${appId}`
          const initialScript = document.getElementsByTagName("script")[0]

          if (initialScript && initialScript.parentNode) {
            initialScript.parentNode.insertBefore(intercomScript, initialScript)
          }

          if (initWindow) {
            const intercomProps = Object.assign(
              {},
              {
                email: email || null,
                appId,
                name
              },
              extra
            )

            delay
              ? setTimeout(() => initIntercomWindow(intercomProps), delay)
              : initIntercomWindow(intercomProps)
          }
        } else {
          console.log("intercom script already inserted")
        }

        typeof callBack === "function" && callBack()
      }
      scriptInitDelay ? setTimeout(loadScript, scriptInitDelay) : loadScript()
    } else {
      console.warn("intercom failed to load")
    }
  }
}

function initIntercomWindow({ appId = APP_ID, ...otherProps }): void {
  const intercomProps = Object.assign(
    {},
    {
      app_id: appId
    },
    otherProps
  )

  if (typeof window !== "undefined" && window.Intercom) {
    if (window.intercomSettings && !window.intercomSettings.app_id) {
      window.intercomSettings = intercomProps
    }

    window.Intercom("boot", intercomProps)
  }
}

function showIntercomWindow(): void {
  if (typeof window !== "undefined" && window.Intercom) {
    window.Intercom("show")
  }
}

function shutdownIntercom(): void {
  if (typeof window !== "undefined" && window.Intercom) {
    window.Intercom("shutdown")
    delete window.Intercom
    delete window.intercomSettings
  }
}

export {
  updateIntercom,
  trackEvent,
  createIntercomSSR,
  setAppId,
  loadIntercom,
  initIntercomWindow,
  shutdownIntercom,
  APP_ID
}
