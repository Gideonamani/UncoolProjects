console.log("ready");

function getJSON (jsonPath){
	return fetch(jsonPath)
	.then( res => res.json() )
}


function showLoading(){
	// document.querySelector(".container").classList.remove("show");
	document.querySelector(".page-spinner").classList.add("show");
}

function hideLoading(){
	// document.querySelector(".container").classList.add("show");
	document.querySelector(".page-spinner").classList.remove("show");
}