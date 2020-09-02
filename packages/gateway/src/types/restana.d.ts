import 'restana'

declare module 'restana' {
  export interface RequestExtensions {
    cookies: any
  }
}
