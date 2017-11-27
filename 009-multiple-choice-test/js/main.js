console.log("ready");
const urlsPREFIX = "/UncoolProjects/009-multiple-choice-test/";
const localTestStoreName = "storedTests-v1";

function getJSON (jsonPath){
	return fetch(jsonPath)
	.then( res => {
		if(res.url.endsWith(".html")) {
			throw({code: "badJSON", message: "Couldn't locate required resource.", url: res.url});
		}else {
			return res.json() 
		}
	})
}



function showLoading(){
	// document.querySelector(".container").classList.remove("show");
	if(!document.querySelector(".page-spinner")){
		const pageSpinnerDiv = document.createElement("DIV");
		pageSpinnerDiv.classList.add("page-spinner");
		const spinnerDiv = document.createElement("DIV");
		spinnerDiv.classList.add("spinner");
		const cube1Div = document.createElement("DIV");
		cube1Div.classList.add("cube1");
		const cube2Div = document.createElement("DIV");
		cube2Div.classList.add("cube2");

		const loadingTextP = document.createElement("P");
		loadingTextP.textContent = "Loading...";

		pageSpinnerDiv.appendChild(spinnerDiv);
		spinnerDiv.appendChild(loadingTextP);
		spinnerDiv.appendChild(cube1Div);
		spinnerDiv.appendChild(cube2Div);
		document.querySelector(".container").appendChild(pageSpinnerDiv);
	}
	document.querySelector(".page-spinner").classList.add("show");
}

function hideLoading(){
	if(!document.querySelector(".page-spinner")) return;
	// document.querySelector(".container").classList.add("show");
	document.querySelector(".page-spinner").classList.remove("show");
}


function showSnackbar(text, buttons) {
	// button = {
	// 	text: "Yes",
	// 	function: hideLoading,
	// 	functionArgs = []
	// }

	// if no snackbar wrapper on document then add it;
	if(!document.getElementById("snackbar-wrapper")){
	    const snackbarWrapperDiv  = document.createElement("DIV");
	    snackbarWrapperDiv.id = "snackbar-wrapper";
	    document.body.appendChild(snackbarWrapperDiv);
	}

    // Create the snackbar DIV
    const snackbarDiv  = document.createElement("DIV");
    snackbarDiv.classList.add("snackbar");
    snackbarDiv.textContent = text;
    document.getElementById("snackbar-wrapper").appendChild(snackbarDiv);

    if(buttons){
		const btnsDiv  = document.createElement("DIV");
		btnsDiv.classList.add("buttons");

		snackbarDiv.classList.add("justify-space-between");
		snackbarDiv.appendChild(btnsDiv);

		buttons.forEach( button => {
			const btn = document.createElement("BUTTON");
			btn.textContent = button.text;
			btn.onclick = function(){ button.function.apply(button.functionArgs) };
			btnsDiv.appendChild(btn);
		});
    }

    // Add the "show" class to DIV
    snackbarDiv.classList.add("show");

    // After 3 seconds, remove the show class from DIV and delete it
    setTimeout(function(){
	    snackbarDiv.classList.remove("show");
	    snackbarDiv.remove();
    }, 3000);
}

function putInLocalStorage(key, data){
	window.localStorage.setItem(key, JSON.stringify(data));
}
function getFromLocalStorage(key){
	const dataString = window.localStorage.getItem(key);
	return JSON.parse(dataString);
}


// TODO 
// 1) make proper offline page
// 2) display cached test on offline page
// 3) delete the cached test in storage when user unchecks caching	
function saveTestInCache(testId){
	return caches.open('gideonamani-testor-test-#' + testId)
	.then(function(cache) {
	  const jsonPath = '../json/'+ testId +'.json';
	  fetch(jsonPath).then(function(response) {
	    // /get-article-urls returns a JSON-encoded array of
	    // resource URLs that a given article depends on
	    return response.json();
	  }).then(function(jsonData){
	  	// calc all the urls resources for this test by reading the image keys
	  	return getImageUrlsFromTestData(jsonData);
	  }).then(function(urls) {
	  	urls.push(jsonPath);
	    return cache.addAll(urls);
	  });
	}).catch( err => showSnackbar(err));	
}

function deleteTestCache(testId){
	const cacheName = 'gideonamani-testor-test-#' + testId;
	return caches.delete(cacheName);
}

function getImageUrlsFromTestData(testData){
	const urls = [];
	function cleanUrl(url){
		if (url.startsWith("../")) return url.replace(".", ".");
	}
	for (var i = 0; i < testData.list.length; i++) {
		const qn = testData.list[i];
		if(qn.image) urls.push(cleanUrl(qn.image));
		for (var j = 0; j < qn.options.length; j++) {
			const optionImage = qn.options[j].image;
			if(optionImage) urls.push(cleanUrl(optionImage));
		}
	}
	return urls;
}