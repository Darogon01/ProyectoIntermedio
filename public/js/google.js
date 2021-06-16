import {firebaseConfig} from "./config.js"
firebase.initializeApp(firebaseConfig);

 let provider = new firebase.auth.GoogleAuthProvider();

const googleButton = document.querySelector('#googleLogin');
googleButton.addEventListener('click', e =>{
   const provider =  new firebase.auth.GoogleAuthProvider();
   firebase.auth().signInWithPopup(provider)
   .then(result => {
       console.log('google sign in');
       showUserDetails(result.user);

   })
   .catch(err =>{
       console.log(err)
   })

   firebase.auth().onAuthStateChanged(user => {
    if(user) 
    {
       window.location = '/dashboard';
    }
  });
})


function showUserDetails(user){
  document.getElementById('userDetails').innerHTML = `
    <img src="${user.photoURL}" style="width:10%">
    <p>Name: ${user.displayName}</p>
    <p>Email: ${user.email}</p>
  `
}




  





  
