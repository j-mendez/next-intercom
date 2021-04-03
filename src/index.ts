import type { IntercomProps, ScriptType } from "./types"
import { loadScript } from "./load-script"
import { hasIntercom } from "./has-intercom"

let APP_ID = ""
const widgetCdn = "https://widget.intercom.io/widget/"

function setAppId(id: string): void {
  if (id) {
    APP_ID = id
  }
}

function updateIntercom(event: string = "update", settings: any = null): void {
  hasIntercom() && window.Intercom(event, settings)
}

function trackEvent(type: string, metadata: any = null): void {
  hasIntercom() && window.Intercom("trackEvent", type, metadata)
}

async function createIntercomSSR(appId: string = APP_ID): Promise<string> {
  try {
    const dataSource = await fetch(`${widgetCdn}${appId}`)
    const scriptBody = await dataSource.text()

    return `<script type="text/javascript" async="true">${scriptBody}</script>`
  } catch (error) {
    console.error(error)
    return error
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

  if (hasIntercom()) {
    if (window.intercomSettings && !window.intercomSettings.app_id) {
      window.intercomSettings = intercomProps
    }

    window.Intercom("boot", intercomProps)
  }
}

function loadIntercom({
  appId = APP_ID,
  delay = 0,
  initWindow = true,
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

      const { callBack, scriptType, email, name, ...stripedProps } = extra || {}

      const baseLoadProps = {
        src: `${widgetCdn}${appId}`,
        callBack,
        initWindow,
        initIntercomWindow,
        scriptType
      }

      const updateProps = Object.assign(
        {},
        {
          email: email || null,
          appId,
          name
        },
        stripedProps
      )

      delay
        ? setTimeout(() => loadScript(baseLoadProps, updateProps), delay)
        : loadScript(baseLoadProps, updateProps)
    } else {
      console.warn("intercom failed to load")
    }
  }
}

function showIntercomWindow(): void {
  hasIntercom() && window.Intercom("show")
}

function shutdownIntercom(): void {
  if (hasIntercom()) {
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
  showIntercomWindow,
  shutdownIntercom,
  APP_ID
}
