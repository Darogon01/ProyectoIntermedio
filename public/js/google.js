import {firebaseConfig} from "./config.js"
firebase.initializeApp(firebaseConfig);

 let provider = new firebase.auth.GoogleAuthProvider();

// const googleButton = document.querySelector('#googleLogin');
// googleButton.addEventListener('click', e =>{
//    const provider =  new firebase.auth.GoogleAuthProvider();
//    auth.signInWithPopup(provider)
//    .then(result => {
//        console.log('google sign in')
//    })
//    .catch(err =>{
//        console.log(err)
//    })
// })

firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    let credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    let token = credential.accessToken;
    // The signed-in user info.
    let user = result.user;
    // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
firebase.auth()
.getRedirectResult()
.then((result) => {
  if (result.credential) {
    /** @type {firebase.auth.OAuthCredential} */
    let credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    let token = credential.accessToken;
    // ...
  }
  // The signed-in user info.
  let user = result.user;
}).catch((error) => {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});



  





  
