if(navigator.serviceWorker){
	navigator.serviceWorker.register('./sw.js').then(reg => {
		// console.log('sw ready to go.', reg);
		if(!navigator.serviceWorker.controller){
			// page didn't load through service worker;
			// console.log({msg: "page didn't load through service worker"});

			if(reg.installing){
				// sw is taking control for the first time
				const sw = reg.installing;
				// SW states: "installing", "installed", "activating", 
				// 				"activated", "redundant"
				sw.addEventListener('statechange', event => {
					// console.log('SW statechange', sw.state, reg.active);
					if (sw.state == "activated") {
						// there is an update ready
						// console.log({msg: "Site Cached, You can use it offline."});
						showSnackbar("Site is offline enabled.");
					}
				});
			}
			return;
		}

		let promptedUpdate = false;
		const activateWaitingSW = function(){
			reg.waiting.postMessage({skipWaiting: true});
		}

		if(reg.waiting){
			// there's an udate ready
			// console.log({msg: "sw waiting..."});
			const button = {text: "Update", function: activateWaitingSW};
			showSnackbar("Please update the page", [button]);
			promptedUpdate = true;
		}

		if(reg.active){
			// there's a sw controlling this page
			// console.log({msg: "sw active!"});
		}

		// registration methods and properties
		// reg.unregister();
		// reg.update();
		// reg.installing;
		// reg.waiting;
		// reg.active;
		reg.addEventListener('updatefound', function() {
			// reg.installing has changed after a sw has been active on page
			reg.installing.addEventListener('statechange', function() {
				console.log('SW statechange:', this.state);
				if (this.state == 'redundant') return;

				if (this.state == 'installed'){
					// there is an update ready
					// console.log({msg: "sw successfully installed, there is an update ready"});
					if(promptedUpdate) {
						// the user hasn't updated when last propmted and thus
						// there is an even new sw available
						// console.log("Already prompted user to update");
					}else{
						const button = {text: "Refresh", function: activateWaitingSW};
						showSnackbar("There is a new site version", [button]);
					}
				}
			})
		});



	}).catch( err => {
		console.log('sw registration error:', err);
	});

	navigator.serviceWorker.addEventListener('controllerchange', function(){
		// the service worker controlling this page has change
		// i.e incummbent sw has become redundat and the waiting one has taken over
		// this is a good time to reload the page
		// console.log("About to RELOAAAAD!");
		window.location.reload();
	});
}