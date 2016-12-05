var handle,_fn;
var constant = require('../common/js/constant.js');
var wxService = require('../common/js/wx.js');



var handle = {
	initAnswerMap:function(callBack){
		_fn.queryAnswerMap({
			complete:function(resp){
				var answerMap = _fn.dataAnswerMap(resp);
				_fn.saveAnswerMap(answerMap);
				if(typeof callBack==='function'){
					callBack(answerMap);
				}
			}

		});
	},
	getAnswerMap:function(callBack){
		return _fn.getAnswerMap(callBack);
	}
};
_fn = {
	queryAnswerMap:function(args){
		var url =  constant.CGI.answer;
		var complete = function(resp){//处理错误
			var data = resp.data;
			if(data.error_code===0 &&data.reason==='success'){
				if(typeof args.complete === 'function'){
					args.complete(data);
				}
			}else{
				//使用微信提供的组建进行错误提示
			}
		};
		var faild = function(resp){
			//使用微信提供的组建进行错误提示

		};
		wxService.queryJH({
			url:url,
			complete:complete,
			faild:faild
		});
	},
	dataAnswerMap:function(args){//将文字映射数字化
		var keyWordMap = {
			"A":"1",
			"B":"2",
			"C":"3",
			"D":"4",
			"正确":"1",
			"错误":"2"
		};
		var or="或者";
		var choices = args.result;
		var answerMap = {};

		for(var i in choices){
			var choice = choices[i];//选项文字
			var answerList = [];
			var curAnswer = "";
			for(var j in keyWordMap){
				var keyWord = j+"";
				if(choice.indexOf(or)===0){
					answerList.push(curAnswer);
					curAnswer = "";
					choice = choice.substring(or.length,choice.length);
				}
				if(choice.indexOf(keyWord)===0){
					curAnswer = curAnswer+keyWordMap[keyWord];
					choice = choice.substring(j.length,choice.length);
					if(choice.length<=0){
						break;
					}
				}

			}
			answerList.push(curAnswer);
			answerMap[i] = answerList;
		}
		return answerMap;
	},
	getAnswerMap:function(callBack){
		if(callBack && typeof callBack === 'function'){
			wxService.getStorage({
				key:constant.storageKey.answerMap,
				complete:complete
			});
		}else{
			return wxService.getStorage(constant.storageKey.answerMap);
		}

	},
	saveAnswerMap:function(answerMap){
		console.log(answerMap);
		wxService.setStorage({
			key:constant.storageKey.answerMap,
			data:answerMap,
			complete:function(){

			}
		});

	}
};



module.exports = handle;