console.log("ready");

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
	document.querySelector(".page-spinner").classList.add("show");
}

function hideLoading(){
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
			btn.onclick = function(){ button.function.apply(functionArgs) };
			btnsDiv.appendChild(btn);
		});
    }

    // Add the "show" class to DIV
    snackbarDiv.classList.add("show");

    // After 3 seconds, remove the show class from DIV and delete it
    setTimeout(function(){
    snackbarDiv.classList.remove("show");
        // snackbarDiv.remove()
    }, 3000);
}