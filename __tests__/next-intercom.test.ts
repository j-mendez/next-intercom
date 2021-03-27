import * as Intercom from "../src"

const {
  createIntercomSSR,
  setAppId,
  loadIntercom,
  initIntercomWindow,
  showIntercomWindow,
  shutdownIntercom,
  trackEvent,
  updateIntercom
} = Intercom

describe("next-intercom", () => {
  const appId = "myintercomappid"
  const intercomMessage = (methodType: string = "boot") => {
    return window.Intercom.q
      .map(args => {
        const [intercomQ] = Object.entries(args)
        if (Array.isArray(intercomQ)) {
          return intercomQ.reduce(
            (acc: any, val: any) => intercomQ.concat(val),
            []
          )
        }
        return []
      })
      .flat()
  }

  test("can set intercom app id properly", async () => {
    setAppId(appId)
    expect(appId).toBe(Intercom.APP_ID)
  })

  test("can load intercom properly", async () => {
    loadIntercom({ appId })
    expect(window.Intercom).toBeTruthy()
    expect(intercomMessage()).toContain("boot")
  })

  test("can boot intercom properly", async () => {
    initIntercomWindow({ appId })
    expect(window.Intercom && window.intercomSettings).toBeFalsy()
    expect(intercomMessage()).toContain("boot")
  })

  test("can show intercom window properly", async () => {
    showIntercomWindow()
    expect(intercomMessage()).toContain("show")
  })

  test("can track intercom event properly", async () => {
    trackEvent("click")
    expect(intercomMessage()).toContain("trackEvent")
  })

  test("can update intercom properly", async () => {
    updateIntercom("update", { email: "test@gmail.com" })
    expect(intercomMessage()).toContain("update")
  })

  test("can create intercom ssr properly", async () => {
    ;(global.fetch as () => Promise<any>) = jest.fn(() =>
      Promise.resolve({ text: () => "" })
    )
    const intercomSSR = await createIntercomSSR(appId)

    expect(intercomSSR).toBe(
      `<script type="text/javascript" async="true"></script>`
    )
  })

  test("can shutdown intercom properly", async () => {
    shutdownIntercom()
    expect(window.Intercom).toBeFalsy()
  })
})
