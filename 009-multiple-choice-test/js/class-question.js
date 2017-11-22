const qnData = 		{	
			"type": "single",
			"text": "What are the main parts of an airplane",
			"image": "../images/plane-parts.png",
			"options": [
				{
					"text": "Cockpit, Wings, Tyres",
					"image": "../images/some-image.png"
				},
				{
					"text": "Wings, Propellor, Engine, Ailerons",
					"image": "../images/some-image.png"
				},
				{
					"text": "Engine(s), Wings, Tail, Langing Gear, Fuselage",
					"image": ""
				},
				{
					"text": "Cockpit, Wings, Chairs, Rudder",
					"image": "../images/some-image.png"
				}
			],
			"answers": [{
				"text": "Engine(s), Wings, Tail, Langing Gear, Fuselage",
				"image": "../images/some-image.png"
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

		this.displayOptionsIn(this.node.querySelector("section.options"));
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

			optionNode.querySelector("p").textContent = optionData.text;
			if(optionData.image){
				optionNode.querySelector("img").src = optionData.image;
			}else{
				optionNode.querySelector(".image-wrapper").classList.add("no-image");
			}

			const optionInput = optionNode.querySelector("input");
			optionInput.name = this.data.text;
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
			return;
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
		for (let i = 0; i < this.checkedOptions.length; i++) {
			const index = this.checkedOptions[i];	
			const checkedAns = this.shuffledOptions[index];
			let correctOption = false;
			for (let j = 0; j < this.data.answers.length; j++) {
				const answer = this.data.answers[j];
				if (checkedAns.text === answer.text) {
					correctOption = true;
					correctlyChecked.push(checkedAns);
				}else{ incorrectlyChecked.push(checkedAns) }
			}
			correctBool = (correctBool && correctOption);
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