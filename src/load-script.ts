import type { IntercomProps, IntercomLoad } from "./types";

function loadScript(
  {
    src,
    initIntercomWindow,
    initWindow,
    scriptType = "async",
    callBack,
  }: IntercomLoad,
  updateProps: IntercomProps
) {
  const intercomLoaded = document.querySelector(`script[src="${src}"]`);

  if (!intercomLoaded) {
    const intercomScript = document.createElement("script");
    intercomScript.type = "text/javascript";

    if (typeof scriptType !== "undefined") {
      intercomScript[scriptType] = true;
    }

    intercomScript.src = src;
    const scripts = document.getElementsByTagName("script");
    const initialScript = scripts?.length ? scripts[0] : null;

    if (intercomScript) {
      initialScript?.parentNode
        ? initialScript.parentNode.insertBefore(intercomScript, initialScript)
        : document.body.appendChild(intercomScript);
    }

    if (initWindow && updateProps) {
      initIntercomWindow(updateProps);
    }
  } else {
    console.error("intercom script already inserted");
  }

  typeof callBack === "function" && callBack();
}

export { loadScript };
