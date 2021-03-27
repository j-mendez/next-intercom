"use strict"

declare global {
  interface Window {
    Intercom: any
    intercomSettings: any
  }
}

export type ScriptType = "defer" | "async"

export interface IntercomProps {
  [x: string]: any
  appId?: string
  ssr?: boolean
  callBack?(param?: any): any
  delay?: number
  email?: string | null
  name?: string
  initWindow?: boolean
  scriptType?: ScriptType
  scriptInitDelay?: number
}
