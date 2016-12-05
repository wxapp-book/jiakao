var handle,_fn;
var answerService = require('answer-service.js');
	

handle = {
	getQuestionType:function(answer){
		var answerMap = answerService.getAnswerMap();
		answerArr = answerMap[answer];
		return answerArr[0].length===1?1:2;//1单选题，2多选题
	},
	getQuestionAnswer:function(question){
		var correctAnswer = question.answer;
		var answerMap = answerService.getAnswerMap();
		answerArr = answerMap[correctAnswer];
		var answerStr = answerArr[0];
		var answerObj = {};
		for(var i=1 ; i<=4 ; i++){
			for(var j=0 ; j<answerStr.length; j++){
				if(i===answerStr.charAt(j)/1){
					answerObj["item"+i]="correct";
				}
			}
			if(answerObj["item"+i]!=="correct"){
				answerObj["item"+i] = "in-correct";
			}

		}
		return{
			answerStr:answerStr,
			answerObj:answerObj
		};
	}

};



module.exports = handle;