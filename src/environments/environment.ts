// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // @ts-ignore
  apiURL: window['env'] ? window['env']['apiURL'] : 'http://localhost:8080/',
  firebase: {
    apiKey: "AIzaSyCix3rffaXvYwEAuKts4G1SdAMdxsxypnA",
    authDomain: "finansaurus-c8adc.firebaseapp.com",
    projectId: "finansaurus-c8adc",
    storageBucket: "finansaurus-c8adc.appspot.com",
    messagingSenderId: "1025535147332",
    appId: "1:1025535147332:web:bc655e8d507eceb30feb11",
    measurementId: "G-PPJVQ6V6XJ"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
