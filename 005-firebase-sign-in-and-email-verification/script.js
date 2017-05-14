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
  console.log("Sign IN has Started");
  // Signing(Logging) IN a user to your firebase app
  var errMsgDiv = document.querySelector("#sign-in-page .error-msg-container");
  var errMsgP = document.querySelector("#sign-in-page p.error-msg");
  errMsgDiv.style.display = "none";
  console.log(errMsgDiv);
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    errMsgDiv.style.display = "block";
    errMsgP.textContent = "ERROR: " + errorMessage;
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
  // Make sure first that the passwords match
  if( !document.querySelector("#sign-up-page input:invalid")
    && !document.querySelector("input.chceck-failed") ){
    var email = document.querySelector("#sign-up-page input#useremail").value;
    var password = document.querySelector("#sign-up-page input#password").value;
    signUpUserToFirebase(email, password);
  }
}

function signUpUserToFirebase(email, password){
  console.log("Sign UP has Started");
  // Signing(Logging) IN a user to your firebase app
  var errMsgDiv = document.querySelector("#sign-up-page .error-msg-container");
  var errMsgP = document.querySelector("#sign-up-page p.error-msg");
  errMsgDiv.style.display = "none";
  // Signing UP a user to your firebase app
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    errMsgDiv.style.display = "block";
    errMsgP.textContent = "ERROR: " + errorMessage;
    console.log("Sign UP Error. \n Error:", errorCode, " \n The Message is:", errorMessage);
  });
}

window.onload = function(){
  listenForFirstKeyUpOnCPI();
}

// function to listen for the first key up event on the Confirm Password Input
function listenForFirstKeyUpOnCPI(){
  document.querySelector("#sign-up-page #confirm-password").addEventListener("keyup", function(e){
    var passConfirmInput = e.target;
    var passInput = document.querySelector("#sign-up-page #password");
    checkIfPasswordsMatch(passInput, passConfirmInput);
    listenForKeyUpOnPassInput();
  })
}

function listenForKeyUpOnPassInput(){
  document.querySelector("#sign-up-page #password").addEventListener("keyup", function(e){
    var passInput = e.target;
    var passConfirmInput = document.querySelector("#sign-up-page #confirm-password");
    checkIfPasswordsMatch(passInput, passConfirmInput);
  })
}

function checkIfPasswordsMatch(passInput, passConfirmInput){
  var submitBtn = document.querySelector("#sign-up-page input[type='submit']");
  if(passInput.value === passConfirmInput.value){
    // add classes to show that they now match
    passConfirmInput.classList.remove("check-failed");
    passConfirmInput.classList.add("check-passed");
    // enable send button
    submitBtn.disabled = false;
  }else {
    passConfirmInput.classList.remove("check-passed");
    passConfirmInput.classList.add("check-failed");
    //disable send button
    submitBtn.disabled = true;
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