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


// Signing OUT a user to your firebase app
function signOut(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    alert("Signed out.");
  }).catch(function(error) {
    // An error happened.
    alert("Sign OUT Error!!");
  });
}

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
  firebase.auth().signInWithEmailAndPassword(email, password).
      then(function(userData){
        console.log("About to send the User Data to DB!");
        var ref = firebase.database().ref("userData/UncoolProjects/"+userData.uid);
        var data = {
          email: userData.email,
          emailVerified: userData.emailVerified,
          uid: userData.uid
        };
        ref.set(data).then(function(){
            // showProfilePage();
            window.location = "";
          })
          .catch(function(error) {
            // Handle error writing to the database
            displayErrorMsg(error, errMsgDiv, errMsgP);
          });
      })
      .catch(function(error) {
        // Handle Errors here for Sign In.
        displayErrorMsg(error, errMsgDiv, errMsgP);
      });
}

function displayErrorMsg(error, errMsgDiv, errMsgP){
  var errorCode = error.code;
  var errorMessage = error.message;
  errMsgDiv.style.display = "block";
  errMsgP.textContent = "ERROR: " + errorMessage;
  console.log("Sign IN Error. \n Error:", errorCode, " \n The Message is:", errorMessage);
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
  firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(userData){
        console.log(userData);
        clearInputs(document.querySelector("#sign-up-page"));
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        errMsgDiv.style.display = "block";
        errMsgP.textContent = "ERROR: " + errorMessage;
        console.log("Sign UP Error. \n Error:", errorCode, " \n The Message is:", errorMessage);
      });
}

window.onload = function(){
  checkForUser()
  listenForFirstKeyUpOnCPI();
  listenForLikes();
  // showHomePage();
}

// function to listen for the first key up event on the Confirm Password Input
function listenForFirstKeyUpOnCPI(){
  var passConfirmInput = document.querySelector("#sign-up-page #confirm-password");
  if(passConfirmInput){
    passConfirmInput.addEventListener("keyup", function(e){
      var passInput = document.querySelector("#sign-up-page #password");
      checkIfPasswordsMatch(passInput, passConfirmInput);
      listenForKeyUpOnPassInput();
    })
  }
}

function listenForKeyUpOnPassInput(){
  var passInput = document.querySelector("#sign-up-page #password");
  if(passInput){  
    passInput.addEventListener("keyup", function(e){
      var passConfirmInput = document.querySelector("#sign-up-page #confirm-password");
      checkIfPasswordsMatch(passInput, passConfirmInput);
    })
  }
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


function listenForLikes(){
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
}

function checkForUser(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      removeLoadingScreen();
      showProfilePage();
      getProfileData();
    } else {
      // No user is signed in.
      removeLoadingScreen();
      showHomePage();
    }
  });
}


// Profile Functions
function getProfileData(){
  var currentUser = firebase.auth().currentUser;
  var displayNameH2 = document.querySelector("#profile-display-name");
  var emailP = document.querySelector("#profile-email");
  var avatarImg = document.querySelector("#main-avatar-image");
  // if  user hasn't set the username yet use the email.
  if(currentUser.displayName){
    displayNameH2.textContent = currentUser.displayName;
  }else{
    displayNameH2.textContent = currentUser.email;
  }

  if(currentUser.photoURL){
    avatarImg.src = currentUser.photoURL;
  }else{
    avatarImg.src = "../001-some-gsb-mock-pages/images/avatar 3.png";
  }

  //if the email is unverified
  if(!currentUser.emailVerified){
    document.querySelector("#profile-email-div").classList.add("email-unverified");
    document.querySelector("#verify-email-button").hidden = false;
  }

  emailP.title = currentUser.email;
  emailP.textContent = currentUser.email;
  console.log(currentUser);


  var settingsPg = document.querySelector("#profile-settings-page");
  settingsPg.querySelector("#profilename").value = currentUser.displayName;
  settingsPg.querySelector("#profilephotourl").value = currentUser.photoURL;
  settingsPg.querySelector("#profileemail").value = currentUser.email;
}

function verifyEmail(){
  showProfilePage();
  var user = firebase.auth().currentUser;
  user.sendEmailVerification().then(function() {
    // Email sent.
    document.querySelector("#verify-email-button").hidden = true;
    document.querySelector("#verification-sent-info").hidden = false;
    console.log("Email has been sent.");
  }).catch( function(error) {
    // An error happened.
    document.querySelector("#verification-sent-info").textContent = error.message;
  });
}

function refresh(){
  window.location = "";
}




// Profile Setting Functions
function updateProfileNameNPhoto(){
  var user = firebase.auth().currentUser;
  var settingsPg = document.querySelector("#profile-settings-page");
  var dNameInput = settingsPg.querySelector("#profilename");
  var pUrlInput = settingsPg.querySelector("#profilephotourl");
  user.updateProfile({
    displayName: dNameInput.value,
    photoURL: pUrlInput.value
  }).then(function() {
    // Update successful.
    getProfileData();
    showProfilePage();
    console.info("Update was successful!!");
  }).catch(function(error) {
    // An error happened.
    document.querySelector(".error-div").hidden = false;
    document.querySelector("#updateErrorMsg").textContent = "ERROR: " + error.message;
    console.info("ERROR:", error.message);
  });
}

function updateEmailNVerify(){
  var user = firebase.auth().currentUser;
  var currentEmail = user.email;
  var inputEmail = document.querySelector("#profile-settings-page #profileemail").value;
  if( currentEmail !== inputEmail ){
    user.updateEmail(inputEmail).then(function() {
        // Update successful.
        getProfileData();
        showProfilePage();
        verifyEmail();
        return;
      }).catch(function(error) {
        // An error happened.
        document.querySelector(".error-div").hidden = false;
        document.querySelector("#updateErrorMsg").textContent = "ERROR: " + error.message;
        console.info("ERROR:", error.message);
      });
  }
}


// General Functions
function removeLoadingScreen(){
  document.querySelector("#loading-screen").style.display = "none";
}

function showHomePage(){
  document.querySelector("#profile-page").hidden = true;
  document.querySelector("#profile-settings-page").hidden = true;
  document.querySelector("#home-page").hidden = false;
}

function showProfilePage(){
  document.querySelector("#profile-settings-page").hidden = true;
  document.querySelector("#home-page").hidden = true;
  document.querySelector("#profile-page").hidden = false;
}

function showProfileSettingsPage(){
  document.querySelector("#home-page").hidden = true;
  document.querySelector("#profile-page").hidden = true;
  document.querySelector("#profile-settings-page").hidden = false;
}

function clearInputs(domSection){
  var inputs = domSection.querySelectorAll("input");
  inputs.forEach(function(input){
    input.value = "";
  });
}