export const environment = {
  production: true,

  // @ts-ignore
  apiURL: window['env']['apiURL'] || 'http://localhost:8080/',
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
