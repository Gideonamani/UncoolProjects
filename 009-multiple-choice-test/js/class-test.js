const testData = {
	"intro": "Welcome to test number one",
	"list": [
		{	
			"type": "multiple",
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
					"image": "../images/some-image.png"
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
		},
		{	
			"type": "single",
			"text": "Capital City of Russia",
			"image": "../images/plane-parts.png",
			"options": [
				{
					"text": "Moscow",
					"image": "../images/some-image.png"
				},
				{
					"text": "St. Petersburg",
					"image": "../images/some-image.png"
				},
				{
					"text": "Kaliningrad",
					"image": "../images/some-image.png"
				},
				{
					"text": "Sochi",
					"image": "../images/some-image.png"
				}
			],
			"answers": [{
					"text": "Moscow",
					"image": "../images/some-image.png"
				}]
		}
	]
};


class Test {
	constructor(testData){
		this.testData = testData;
		this.questions = [];
		this.evaluation = [];
		this.hasBeenEvaluated = false;
		this.highlightUnanswered = false;
	};
	isThereNextQuestion(){
		return (this.currentQuestionIndex < (this.testData.list.length - 1));
	};
	isTherePreviousQuestion(){
		return (this.currentQuestionIndex > 0 );
	};
	display(){
		const shuffledQnList = shuffle(this.testData.list);
		for (var i = 0; i < shuffledQnList.length; i++) {
			const qnData = shuffledQnList[i];
			this.questions.push(new Question(qnData));
		}
		this.currentQuestionIndex = 0;
		this.showQuestion(this.currentQuestionIndex);

		if (!this.isThereNextQuestion()) this.hideNextQnBtn();
		if (!this.isTherePreviousQuestion()) this.hidePrevQnBtn();
	};
	calcCheckedQuestions(){
		const testProgress = document.querySelector(".paginator progress");
		let checkedQns = 0;
		for (var i = 0; i < this.questions.length; i++) {
			if(this.questions[i].checkedOptions.length > 0) checkedQns++;
		}
		const checkedFraction = checkedQns / this.questions.length;
		const checkedPercentage = checkedFraction * 100;
		testProgress.value = checkedPercentage;
		return checkedPercentage;
	};
	calcPageIndex(){
		const qnIndexSpan = document.getElementById("question-index");
		const totalQnsSpan = document.getElementById("total-questions");
		qnIndexSpan.textContent = this.currentQuestionIndex + 1;
		totalQnsSpan.textContent = this.questions.length;
	}
	showResults(){
		// display percentage of correctly answered question to
		// total number of all questions in the test.
		if(!this.hasBeenEvaluated) this.evaluate();
		let correctItems = 0;
		for (var i = 0; i < this.questions.length; i++) {
			correctItems += Number(this.questions[i].correct);
		}
		const total = this.questions.length;
		const correctFraction = correctItems / total;
		const percScore = Math.ceil(correctFraction * 100);
		document.getElementById("test-score").textContent = percScore;
		document.getElementById("test-container").classList.add("hide");
		document.querySelector(".results-wrapper").classList.add("show");
	};
	showReport(){
		if(!this.hasBeenEvaluated) this.evaluate();
		// display a detailed evalutation of all questions
		// with correctly and incorrectly checked options
		// properly highlighted in a neat UI
		console.log(this.evaluation);

		function createListItem(text, node){
			const li = document.createElement("LI");
			li.textContent = text;
			node.appendChild(li);
		}

		this.evaluation.forEach( (evaluatedQn, index) => {
			// copy question html
			const reportQnNode = document.querySelector(".templates .report-question-wrapper").cloneNode(true);

			const qnData = this.questions[index].data;
			// insert qn number
			reportQnNode.querySelector(".question-number .figure").textContent = index+1;

			// insert qn text
			reportQnNode.querySelector("p.question-text").textContent =  qnData.text;

			// add question status
			if(evaluatedQn.answeredCorrectly){
				reportQnNode.querySelector(".question-evaluation-status").classList.add("correct");
			}

			// insert image if it exists
			if(qnData.image){
				reportQnNode.querySelector(".image-wrapper img").src =  qnData.image;
			}else{ reportQnNode.querySelector(".image-wrapper").classList.add("no-image"); }

			// insert the qn answers
			const answersUL = reportQnNode.querySelector("ul.answers");
			qnData.answers.forEach(ans => createListItem(ans.text, answersUL) );

			// insert the correctly checked options
			const correctUL = reportQnNode.querySelector("ul.correct");
			evaluatedQn.correctlyChecked.forEach(ans => createListItem(ans.text, correctUL) );

			// insert the incorrectly checked options
			const incorrectUL = reportQnNode.querySelector("ul.incorrect");
			evaluatedQn.incorrectlyChecked.forEach(ans => createListItem(ans.text, incorrectUL) );

			document.querySelector(".full-report-wrapper .full-report").appendChild(reportQnNode);
		});
		document.querySelector(".full-report-wrapper").classList.add("show");
	};
	evaluate(){
		// evaluate each question
		this.evaluation = [];
		for (var i = 0; i < this.questions.length; i++) {
			this.evaluation.push(this.questions[i].evaluate());
		}
		this.hasBeenEvaluated = true;
	};
	showQuestion(newIndex, oldIndex){
		// if there is a current question, undisplay it
		if(oldIndex >= 0) this.questions[oldIndex].undisplay();
		this.currentQuestion = this.questions[newIndex];
		this.currentQuestion.display();
		this.currentQuestion.node.querySelectorAll(".option input").forEach( (el, i, yo) => {
			el.onchange = function(){this.calcCheckedQuestions();}.bind(this);
		});
		this.calcCheckedQuestions();
		this.calcPageIndex()
	};
	reshowCurrentQuestion(){
		this.currentQuestion.undisplay();
		this.currentQuestion.display();
	};
	highlightUnansweredQns(yes){
		this.highlightUnanswered = yes;
		for (var i = 0; i < this.questions.length; i++) {
			this.questions[i].highlightUnanswered = this.highlightUnanswered;
		}
		this.reshowCurrentQuestion();
	}
	showNextQuestion(){
		// if no further questions hide the next button
		this.currentQuestionIndex++;
		this.showPaginatorBtns();
		this.showQuestion(this.currentQuestionIndex, this.currentQuestionIndex-1);
	};
	showPreviousQuestion(){
		// if no previos questions hide the prev button
		this.currentQuestionIndex--;
		this.showPaginatorBtns();
		this.showQuestion(this.currentQuestionIndex, this.currentQuestionIndex+1);
	};
	showPaginatorBtns(){
		if (!this.isThereNextQuestion()) this.hideNextQnBtn();
		if (this.isThereNextQuestion()) this.showNextQnBtn();

		if (!this.isTherePreviousQuestion()) this.hidePrevQnBtn();
		if (this.isTherePreviousQuestion()) this.showPrevQnBtn();
	}
	showNextQnBtn(){
		document.querySelector("button#next-question").style.display = "inline-block";
	};
	showPrevQnBtn(){
		document.querySelector("button#prev-question").style.display = "inline-block";
	};
	hideNextQnBtn(){
		document.querySelector("button#next-question").style.display = "none";
	};
	hidePrevQnBtn(){
		document.querySelector("button#prev-question").style.display = "none";
	}
}
