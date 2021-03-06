const qnData = 		{	
			"type": "single",
			"text": "What are the main parts of an airplane",
			"image": "../images/plane-parts.png",
			"options": [
				{
					"text": "Cockpit, Wings, Tyres",
					"image": "../images/some-image.png",
					"value": "a"
				},
				{
					"text": "Wings, Propellor, Engine, Ailerons",
					"image": "../images/some-image.png",
					"value": "b"
				},
				{
					"text": "Engine(s), Wings, Tail, Langing Gear, Fuselage",
					"image": "",
					"value": "c"
				},
				{
					"text": "Cockpit, Wings, Chairs, Rudder",
					"image": "../images/some-image.png",
					"value": "d"
				}
			],
			"answers": [{
				"text": "Engine(s), Wings, Tail, Langing Gear, Fuselage",
				"image": "../images/some-image.png",
				"value": "c"
			}]
		}



class Question {
	constructor(qnData){
		this.data = qnData;
		this.correct = false;
		this.shuffledOptions = shuffle(this.data.options);
		this.isQnWithSingleAnswer = (this.data.type == "single");
		this.checkedOptions = [];
		this.evaluation = {};
		this.hasBeenDisplayed = false;
		this.highlightUnanswered = false;
	};
	display(parentNode){
		const tempQn = document.querySelector(".templates .question-wrapper");
		this.node = tempQn.cloneNode(true);

		const questionP = this.node.querySelector(".question-text");
		questionP.textContent = this.data.text;

		const questionImg = this.node.querySelector(".question img");
		questionImg.src = this.data.image;
		if (this.data.image){ questionImg.src = this.data.image; }
		else { this.node.querySelector(".question .image-wrapper").classList.add("no-image"); }

		const optionsNode = this.node.querySelector("section.options");
		if(this.highlightUnanswered && (this.checkedOptions.length == 0)){
			optionsNode.classList.add("unanswered");
		}else{
			optionsNode.classList.remove("unanswered");
		}

		this.displayOptionsIn(optionsNode);
		this.hasBeenDisplayed = true;

		const containerDiv = document.querySelector(".container .questions-wrapper");
		const parent = parentNode ? parentNode : containerDiv;
		parent.appendChild(this.node);
	};
	undisplay(){
		this.node.remove();
	};
	displayOptionsIn(optionsNode){
		// this.shuffledOptions.forEach((optionData, i)=> {
		for (var i = 0; i < this.shuffledOptions.length; i++) {
						const optionData = this.shuffledOptions[i];

			const tempOption = document.querySelector(".templates .option-item");
			const optionNode = tempOption.cloneNode(true);

			const optionsTextP = optionNode.querySelector("p");
			if(optionData.text){
				optionsTextP.textContent = optionData.text;
			}else{
				optionsTextP.classList.add("no-text");
			}

			if(optionData.image){
				optionNode.querySelector("img").src = optionData.image;
				optionNode.classList.add("has-image");
			}else{
				optionNode.querySelector(".image-wrapper").classList.add("no-image");
			}

			const optionInput = optionNode.querySelector("input");
			optionInput.name = this.data.id || this.data.text;
			if(!this.isQnWithSingleAnswer){
				optionInput.type = "checkbox";
				optionInput.name = "";
			}
			optionInput.dataset.shuffledIndex = i;
			optionInput.addEventListener("change", this.check.bind(this));

			optionsNode.appendChild(optionNode);
					}
		// })
		if(this.hasBeenDisplayed) this.markAlreadyCheckedOptions();
	};
	markAlreadyCheckedOptions(){
		this.checkedOptions.forEach(index => {
			this.node.querySelector(`input[data-shuffled-index='${index}']`).checked = true;
		})
	}
	check(e){
		const inputChecked = e.target.checked;
		const optionIndex = e.target.dataset.shuffledIndex;

		if(this.isQnWithSingleAnswer && inputChecked){
			this.checkedOptions[0] = optionIndex;
		}

		// // if we're checking an input in a qn with multiple answers
		if(!this.isQnWithSingleAnswer && inputChecked){
			// const optionData = this.shuffledOptions[optionIndex];
			this.checkedOptions.push(optionIndex);
		}

		if(!this.isQnWithSingleAnswer && !inputChecked){
			// // if we're unchecking an input in a qn with multiple answers
			// remove the option from the checked array
			const indexInChecked = this.checkedOptions.indexOf(optionIndex);
			this.checkedOptions.splice(indexInChecked, 1);
		}

		// highlighting and unhighlighting when option inputs are clicked
		// if checkedOptions empty and the highlight flag is on add unanswered class
		// else if checkedOptions is not empty, then remove unanswered class
		if(!this.highlightUnanswered) return;
		if(this.checkedOptions.length === 0 ) {
			this.node.querySelector("section.options").classList.add("unanswered");
		}else {
			this.node.querySelector("section.options").classList.remove("unanswered");
		}
	};
	evaluate(){
		// if all the checked options are in the right answers
		// and if the number of checked options are the same as 
		// number of right answers then the questions is answered correct
		// also make sure that there aren't repeated checkedOptions indexes

		const sameLength = this.checkedOptions.length === this.data.answers.length;
		let correctBool = true;
		const correctlyChecked = [];
		const incorrectlyChecked = [];
		// const 
		for (let i = 0; i < this.checkedOptions.length; i++) {
			const index = this.checkedOptions[i];	
			const checkedAns = this.shuffledOptions[index];
			let optionIsCorrect = false;
			for (let j = 0; j < this.data.answers.length; j++) {
				const answer = this.data.answers[j];
				// use value as default criterion to check if the answer is
				// correct or not, if the answer has no value prop then use text
				// this is to allow options with images which don't have texts
				const criterion = answer.value ? "value" : "text";
				if (checkedAns[criterion] === answer[criterion]) {
					optionIsCorrect = true;
					break;
				}
			}
			if(optionIsCorrect) {
				correctlyChecked.push(checkedAns);
			}else{ incorrectlyChecked.push(checkedAns) }
			// AND all checked options, bacause if any one is wrong then
			// this question is NOT answered correctly.
			correctBool = (correctBool && optionIsCorrect);
		}
		const answeredCorrectly = (correctBool && sameLength);
		const evaluation = {
			answeredCorrectly,
			correctlyChecked,
			incorrectlyChecked
		}
		this.correct = answeredCorrectly;
		this.evaluation = evaluation;
		return evaluation;
	};
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}