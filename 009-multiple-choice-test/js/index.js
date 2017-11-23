if(navigator.serviceWorker){
	navigator.serviceWorker.register('./sw.js').then(reg => {
		console.log('sw ready to go.');
	}).catch( err => {
		console.log('sw registration error:', err);
	});
}