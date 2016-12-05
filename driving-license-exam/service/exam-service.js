var constant = require('../common/js/constant.js');
var wxService = require('../common/js/wx.js');

var handle = {
	queryExam:function(args){
		var url = constant.CGI.query;
		var data = {
			subject : args.subject,
			model : args.subject/1===1?args.model:null,
			testType:args.testType
		};
		var complete = function(resp){//处理错误
			if(resp.statusCode===200){
				var data = resp.data;
				if(data.error_code===0 &&data.reason==='ok'){
					if(typeof args.complete === 'function'){
						args.complete(data);
					}
				}else{
					//使用微信提供的组建进行错误提示
				}
			}else{
				//接口不稳定，需要提示用户刷新
			}
		};
		var fail = function(resp){
			//使用微信提供的组建进行错误提示

		};
		wxService.queryJH({
			url:url,
			data:data,
			complete:complete,
			fail:fail
		});
	},
	saveExam:function(args){
		var subject = args.subject,
			model = args.subject==="1"?args.model:"All",
			key = subject + "-" + model,
			data = args.exam,
			complete=args.complete;
		//此处应该调用等待界面
		wxService.setStorage({
			"key":key,
			"data":data,
			complete:function(data){
				//此处应该关闭等待界面，并且提示保存成功
				console.log("complete");
				if(typeof complete === 'function'){
					complete(data);
				}
			}
		});
	},
	readExam:function(args,complete){
		var subject = args.subject,
		model = subject==="4"?"All":args.model,
		key =  subject+ "-" +model;
		if(complete && typeof complete === 'function'){
			wxService.getStorage(key,complete);
		}else{
			return wxService.getStorage(key);

		}
	},
	cleareExam:function(){
		var subject = args.subject,
			model = args.model,
			key = model + "-" +subject,
			data = args.exam,
			complete=args.complete;
		//此处应该调用等待界面
		wxService.setStorage({
			"key":key,
			"data":null,
			complete:function(data){
				//此处应该关闭等待界面，并且提示保存成功
				console.log("complete");
				if(typeof complete === 'function'){
					complete(data);
				}
			}
		});
	},
	queryAndSaveExam:function(subject,model){
		handle.queryExam({
			subject:subject,
			model:model,
			testType:"order",
			complete:function(data){
				handle.saveExam({
					subject:subject,
					model:model,
					exam:data.result
				});
			}
		});
	},
	queryAndSaveAllExam:function(){
		var subjectList = constant.subjects;
		var modelList = constant.models;
		for(var i=0 ;i<subjectList.length ;++i){
			var subject=subjectList[i];
			for(var j=0 ; j<modelList.length ;++j){
				if(subject===4 && j>0){//科目四不区分车型
					break;
				}
				var model=modelList[j];
				this.queryAndSaveExam(subject,model);
			}

		}
	},
	readExamRecord:function(args,complete){
		var model = args.model;
		var subject = args.subject;
		var key = model + "-" +subject + "-" +"record";
		if(complete && typeof complete === 'function'){
			wxService.getStorage(key,complete);
		}else{
			return wxService.getStorage(key);
		}
	},
	saveExamRecord:function(args,complete){
		var model = args.model;
		var subject = args.subject;
		var key = model + "-" +subject + "-" +"record";
		var value = args.value;
		if(complete && typeof complete === 'function'){
			wxService.setStorage({
				key:key,
				data:value
			},complete);
		}else{
			return wxService.setStorage({
				key:key,
				data:value
			});

		}
	}

};



module.exports = handle;