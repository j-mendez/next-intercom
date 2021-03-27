import {
  APP_ID,
  setAppId,
  loadIntercom,
  initIntercomWindow,
  shutdownIntercom
} from "../src"

describe("next-intercom", () => {
  const appId = "myintercomappid"
  const intercomBooted = () => window.Intercom.q[0][0]

  test("can set intercom app id properly", async () => {
    setAppId(appId)
    expect(appId).toBe(APP_ID)
  })

  test("can load intercom properly", async () => {
    loadIntercom({ appId })
    expect(window.Intercom).toBeTruthy()
    expect(intercomBooted()).toEqual("boot")
  })

  test("can boot intercom properly", async () => {
    initIntercomWindow({ appId })
    expect(window.Intercom && window.intercomSettings).toBeFalsy()
    expect(intercomBooted()).toEqual("boot")
  })

  test("can shutdown intercom properly", async () => {
    shutdownIntercom()
    expect(window.Intercom).toBeFalsy()
  })
})
