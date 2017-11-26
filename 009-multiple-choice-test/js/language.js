// findout the language the user prefers
const userLangPreference = getFromLocalStorage("languagePreference");

// get the language json with keyword and translation pairs
// getJSON("./json/languages.json").then( languagesData => {
getJSON(urlsPREFIX+"json/languages.json").then( languagesData => {
	// console.log(languagesData);
	document.querySelectorAll("[data-lang-keyword]").forEach(elNode => {
		// get the keyword
		const langKeyword = elNode.dataset.langKeyword;

		// get the translation of the keyword in the prefered lang
		// if we don't have user prefered language we use the default
		const defaultLanguage = "en-US";
		const displayLang = userLangPreference || defaultLanguage;
		const keywordTranslation = languagesData[displayLang][langKeyword];

		// convert translated text to appropriate case
		const textCase = elNode.dataset.textCase;
		const casedKeyword = textCase 
				? caseKeyword(keywordTranslation, textCase) : keywordTranslation;

		// set the textcontentof the element to be the string
		// of the translated keyword
		elNode.textContent = casedKeyword;
		document.body.hidden = false;
	});
}).catch( error => {
	console.log(error);
	hideLoading();
	showSnackbar("Oops. Language data can't be found!");
	document.body.hidden = false;
});

function caseKeyword (keywordTranslation, textCase){
	const string = keywordTranslation;
	if(textCase == "upperCase") return string.toUpperCase();
	if(textCase == "lowerCase") return string.toLowerCase();
	if(textCase == "sentenceCase"){
		const sentence = string[0].toUpperCase() + string.slice(1,).toLowerCase();
		return sentence;
	}
}