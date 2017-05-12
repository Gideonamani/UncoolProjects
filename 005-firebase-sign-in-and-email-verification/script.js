// Initialize Firebase
var config = {
  apiKey: "AIzaSyA9qbEIGZh8B9dpFCgeDk9kj3gD3kuYXkA",
  authDomain: "gideonamaniaudioproject01.firebaseapp.com",
  databaseURL: "https://gideonamaniaudioproject01.firebaseio.com",
  projectId: "gideonamaniaudioproject01",
  storageBucket: "gideonamaniaudioproject01.appspot.com",
  messagingSenderId: "282223454104"
};
firebase.initializeApp(config);

// // Signing UP a user to your firebase app
// firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });


// // Signing(Logging) IN a user to your firebase app
// firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });


// // Signing OUT a user to your firebase app
// firebase.auth().signOut().then(function() {
//   // Sign-out successful.
// }).catch(function(error) {
//   // An error happened.
// });

function showSignInPage(){
  document.querySelector("#landing").style.display = "none";
  document.querySelector("#sign-in-page").style.display = "block";
}

function showSignUpPage(){
  document.querySelector("#landing").style.display = "none";
  document.querySelector("#sign-up-page").style.display = "block";
}

function returnHome(){
  document.querySelector("#landing").style.display = "flex";
  document.querySelector("#sign-up-page").style.display = "none";
  document.querySelector("#sign-in-page").style.display = "none";
}

function checkSignIn(){
  document.querySelector("#sign-in-page").querySelectorAll("input").forEach(
    function(input){
      input.classList.add("checkedValidity");
      input.reportValidity();
    }
  )
  if(!document.querySelector("#sign-in-page").querySelector("input:invalid")){
    var email = document.querySelector("#sign-in-page").querySelector("input#useremail").value;
    var password = document.querySelector("#sign-in-page").querySelector("input#password").value;
    signInUserToFirebase(email, password);
  }
}

function signInUserToFirebase(email, password){
  // Signing(Logging) IN a user to your firebase app
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Sign IN Error. \n Error:", errorCode, " \n The Message is:", errorMessage);
  });
}

function checkSignUp(){
  document.querySelector("#sign-up-page").querySelectorAll("input").forEach(
    function(input){
      input.classList.add("checkedValidity");
      input.reportValidity();
    }
  )
  // // Make sure first that the passwords match
  // if(!document.querySelector("#sign-up-page").querySelector("input:invalid")){
  //   var email = document.querySelector("#sign-in-page").querySelector("input#useremail").value;
  //   var password = document.querySelector("#sign-in-page").querySelector("input#password").value;
  //   signUpUserToFirebase(email, password);
  // }
}

function signUpUserToFirebase(email, password){
  // Signing UP a user to your firebase app
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Sign UP Error. \n Error:", errorCode, " \n The Message is:", errorMessage);
  });
}

// adding a custom html validation info
// this is for checking if the passwords match
document.querySelector("input").addEventListener("onkeyup")


function passwordsMatch(passInput, passConfirmInput){
  if(passInput.value === passConfirmInput.value){
    // add classes to show that they now match
    
    // enable send button
    button.disabled = false;
  }
}









// script from "http://stackoverflow.com/questions/9461621/how-to-format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900-in-javascrip"
function shortenLargeNumber(num, digits) {
    var units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
        decimal;

    for(var i=units.length-1; i>=0; i--) {
        decimal = Math.pow(1000, i+1);

        if(num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }

    return num;
}

randomizeStats = function(){
  document.querySelectorAll(".stats-text p").forEach(function(el){
    var statsTextP = el;
    var randNum = Math.floor(Math.random(1) * 2000);
    statsTextP.dataset.engagementCounter = randNum;
    statsTextP.textContent = String( shortenLargeNumber(randNum, 1) );
  })
}

document.querySelectorAll(".bottom-block").forEach(function(el){
  // Add event listeners to all the bottom blocks (ie, like, bookmark and comment)
  el.addEventListener('click', function(){

    // whenever we click we want to give feedback with a slight light gray blink
    // that this area has been clicked and the action (like or bookmark) has
    // been engaged
    el.classList.add("bg-gray");
    setTimeout(function(){
      el.classList.remove("bg-gray");
    }, 100);

    // Then we change the colour of the icon to give a postive feedback
    // also we adjust the stats number up or down by one.
    var iconContainer = el.querySelector(".icon-container");
    var statsTextP = el.querySelector(".stats-text p");
    var currentCount = Number(statsTextP.dataset.engagementCounter);
    var updatedCount;

    if( !iconContainer.className.includes("engaged") ){
      updatedCount = currentCount+1;
      statsTextP.classList.add("green-highlight");
    }else{
      updatedCount = currentCount-1;
      statsTextP.classList.remove("green-highlight");
    }

    statsTextP.dataset.engagementCounter = updatedCount;
    statsTextP.textContent = String( shortenLargeNumber(updatedCount, 1) );
    iconContainer.classList.toggle("engaged");
    // console.log("clicked", updatedCount);
  })
})