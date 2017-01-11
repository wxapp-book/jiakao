var wxService = require("../../common/js/wx.js");
var constant = require("../../common/js/constant.js");
var examService = require("../../service/exam-service.js");
var questionService = require("../../service/question-service.js");
var us = require("../../lib/underscore.js");

var app = getApp();
var pageLock = false;
Page({
  data:{
    title:"",
  },

  onLoad:function(args){
    console.log(args);
    //this.setData(_fn.getInitData(args));
    _fn.init(args);
  },
  doAnswer:function(args){
    var curQuestion = test.getCurrentQuestion().question;
    var isLock = curQuestion.lockQuestion;
    if(isLock){
      return;
    }
    var questionId = args.target.dataset.itemId;
    var judgeRes = answer.judge(questionId);
    _fn.lockQuestion(questionId);
    if(judgeRes===false){
      _fn.showExplain(questionId);
      render.renderCurrentPage();
    }else{
      render.renderCurrentPage();
      setTimeout(function(){
        render.renderNextPage();
        render.exchangeShowHide();
      },500);
    }
  },
  selectItem:function(args){
    var questionId = args.target.dataset.itemId;
    var selectValue = args.target.dataset.value;
    answer.hightLightItem(questionId,selectValue);
  },
  goNext:function(){
    if(pageLock){
      return;
    }
    pageLock = true;
    if(render.renderNextPage()){
      render.exchangeShowHide();
    }
  },
  goPrev:function(){
    if(pageLock){
      return;
    }
    pageLock = true;
    if(render.renderPrevPage()){
      render.exchangeShowHide();
    }
  },
  goFinish:function(){
    test.finish();
  }
});
var _fn = {
  init:function(args){
    args.model = args.model ||　wxService.getStorage(constant.storageKey.userModel);
    var initData= {
      testModel:args.model ,
      testSubject:args.subject,
      testType:args.testType==="order"?"顺序学习":"随机测试",
      testTypeOrg:args.testType,
      page1:{
        name:"page1",
        pageInfo:{
          isCurrent:"current",
          isShow:"show"
        }
      },
      page2:{
        name:"page2",
        pageInfo:{
          isCurrent:"backup",
          isShow:"hide"
        }
      },
      randRecord:{
        correct:[],
        inCorrect:[]
      }
    };
    us.last(getCurrentPages()).setData(initData);
    test.init(args);
  },
  showExplain:function(questionId){
    var curQuestion =  test.getCurrentQuestion().question;
    curQuestion.showExplains = true;
  },
  lockQuestion:function(questionId){
    var curQuestion = test.getCurrentQuestion().question;
    curQuestion.lockQuestion = true;
  },
  getPageData:function(){
    var page1 = us.last(getCurrentPages()).data.page1;
    var page2 = us.last(getCurrentPages()).data.page2;//得到渲染页面的两个数据对象
    var showPage={},hidePage={};
    if(page1.pageInfo.isCurrent==="current"){//page1为显示数据
      showPage =  {
        name:"page1",
        data:page1
      };
      hidePage = {
        name:"page2",
        data:page2
      };
    }else if(page2.pageInfo.isCurrent==="current"){//page2为显示数据
      showPage = {
        name:"page2",
        data:page2
      };
      hidePage =  {
        name:"page1",
        data:page1
      };
    }
    return {//调用者可以通过这个方法获取当前显示层和隐藏层的数据
      showPage:showPage,
      hidePage:hidePage
    };
  },
  getExamIndex:function(){
    return us.last(getCurrentPages()).data.examDataIndex;
  }

};
var record = {
  doRecord:function(args){
    var judgeRes = args.judgeRes;
    var testType = us.last(getCurrentPages()).data.testTypeOrg;
    var model = us.last(getCurrentPages()).data.testModel;
    var subject = us.last(getCurrentPages()).data.testSubject;
    var id = _fn.getPageData().showPage.data.pageData.id;
    var currentIndex = 0;
    examService.readExam({
      model:model,
      subject:subject
    },function(data){
      var examList = data.data;
      for(var i = 0 ; i < examList.length ; i++){
        var cExam = examList[i];
        if(id === cExam.id){
          currentIndex = i;
          break;
        }
      }
      console.log(currentIndex);
      //从storage中初始化统计对象
      var orderRecord = examService.readExamRecord({
        model:us.last(getCurrentPages()).data.testModel,
        subject:us.last(getCurrentPages()).data.testSubject
      });
      if(!orderRecord){
        orderRecord = {
          correct:[],
          inCorrect:[],
          lastIndex:1,
          total:examList.length
        };
      }
      var orderCorrectArr = orderRecord.correct;//获取正确序列
      var orderInCorrectArr = orderRecord.inCorrect;//获取错误序列
      if(orderCorrectArr.indexOf(currentIndex)>=0){
        orderCorrectArr[orderCorrectArr.indexOf(currentIndex)]="";//清空本题在正确序列的记录
      }
      if(orderInCorrectArr.indexOf(currentIndex)>=0){
        orderInCorrectArr[orderInCorrectArr.indexOf(currentIndex)]="";//清空本题在错误序列的记录
      }
      if(judgeRes===true){//正确添加正确序列
        orderCorrectArr.push(currentIndex);
      }else{//错误添加错误序列
        orderInCorrectArr.push(currentIndex);
      }
      if(testType==="rand"){//答题模式为随机考试
        //初始化统计对象
        var randRecord = us.last(getCurrentPages()).data.randRecord||{correct:[],inCorrect:[]};
        var correctArr = randRecord.correct;
        var inCorrectArr = randRecord.inCorrect;
        randRecord.total = _fn.getExamIndex().length;
        if(judgeRes===true){
          //添加到正确序列中
          correctArr.push(currentIndex);
        }else{
          //添加到错误序列中
          inCorrectArr.push(currentIndex);
        }
        us.last(getCurrentPages()).data.randRecord = randRecord;
      }else{//答题模式为顺序学习
        var orderLastIndex = orderRecord.lastIndex;//获取答题进度
        //更新进度数据
         orderRecord.lastIndex = orderLastIndex<currentIndex?currentIndex:orderLastIndex;
         orderRecord.total = _fn.getExamIndex().length;
      }
      //将数据保存到storage中
      examService.saveExamRecord({
        model:us.last(getCurrentPages()).data.testModel,
        subject:us.last(getCurrentPages()).data.testSubject,
        value:orderRecord
      });
    });
  }
};
var answer = {
  hightLightItem:function(questionId,selectValue){
    var curQuestion = test.getCurrentQuestion().question;//得到当前显示的考题
    var isLock = curQuestion.lockQuestion;//锁住回答
    if(isLock){
      return;
    }
    var questionType = questionService.getQuestionType(curQuestion.answer);//计算该题是单选还是多选
    var userSelect = curQuestion.userSelect||{};
    if(questionType===1){//如果是单选，则清空已经选的选项
      userSelect = {};
    }
    userSelect["item"+selectValue] = userSelect["item"+selectValue]?false:'selected';
    curQuestion.userSelect = userSelect;//构建userSelect对象
    render.renderCurrentPage();
  },
  judge:function(questionId){
    var curQuestion = test.getCurrentQuestion().question;
    var userSelect = curQuestion.userSelect || {};
    var item1Status = userSelect.item1==='selected'?"1":"";
    var item2Status = userSelect.item2==='selected'?"2":"";
    var item3Status = userSelect.item3==='selected'?"3":"";
    var item4Status = userSelect.item4==='selected'?"4":"";
    //将用户选择的选项转换为答案映射接口处理后的字符串
    var userAnswerStr = item1Status+item2Status+item3Status+item4Status;
    var correctAnswer = questionService.getQuestionAnswer(curQuestion);
    //获取数据映射接口处理后的答案数据
    curQuestion.correctAnswerMap = correctAnswer.answerObj;
    var judgeRes = false;
    //如果相同则表示正确，否则为错误
    if(userAnswerStr===correctAnswer.answerStr){
      judgeRes = true;
    }
    curQuestion.judgeRes = judgeRes;
    record.doRecord({
      questionId:questionId,
      judgeRes:judgeRes
    });
    return judgeRes;
  }
};
var test = {
  init :function(args){
    var testModel = args.testModel;
    var testSubject = args.testSubject;
    var testType = args.testType;
    if(testType === "order"){
      test.renderOrderTest(args);
    }else if(testType === "rand"){
      test.renderRandTest(args);
    }else if(testType === 'error'){
      test.renderErrorTest(args);
    }
  },
  finish:function(){
    var model=us.last(getCurrentPages()).data.testModel;
    var subject=us.last(getCurrentPages()).data.testSubject;
    var testType = us.last(getCurrentPages()).data.testTypeOrg;
    var randRecord = us.last(getCurrentPages()).data.randRecord;
    var paramStr = "?param="+JSON.stringify({
      model : model,
      subject:subject,
      testType:testType,
      randRecord:randRecord
    });
    wx.redirectTo({
      url:"../finish/finish"+paramStr,

    });

  },
  renderOrderTest:function(args){
    var storageExamData = examService.readExam({
      subject : args.subject,
      model : args.model
    },function(data){
        if(data.data && data.data.length>0){//storage中有数
          test.addTestData(data.data);
        }else{//storage中没有数，通过接口获取
          examService.queryExam({
            subject : args.subject,
            model : args.model,
            testType:args.testType,
            complete:function(data){
              examService.saveExam({//保存storage中
                subject:args.subject,
                model:args.model,
                exam:data.result,
                complete:function(){
                  test.renderOrderTest(args);//结束后递归一遍这个方法
                }
              });
            }
          });
        }
      });
  },
  renderRandTest:function(args){
    examService.queryExam({
      subject : args.subject,
      model : args.model,
      testType:args.testType,
      complete:function(result){
        var examDataObj = result.result;
        test.addTestData(examDataObj);
      }
    });
  },
  renderErrorTest:function(args){
    console.log(args);
    var inCorrectList = JSON.parse(args.inCorrect);
    var storageExamData = examService.readExam({
      subject : args.subject,
      model : args.model
    },function(data){
        if(data.data && data.data.length>0){//storage中有数
          var examList = data.data;
          var renderExamList = [];
          for(var i = 0 ; i < inCorrectList.length ; i++){
            renderExamList.push(examList[inCorrectList[i]/1]);
          }
          test.addTestData(renderExamList);
        }else{//storage中没有数，通过接口获取
          examService.queryExam({
            subject : args.subject,
            model : args.model,
            testType:args.testType,
            complete:function(data){
              examService.saveExam({//保存storage中
                subject:args.subject,
                model:args.model,
                exam:data.result,
                complete:function(){
                  test.renderErrorTest(args);//结束后递归一遍这个方法
                }
              });
            }
          });
        }
      });

  },
  addTestData:function(args){
    var examData = us.last(getCurrentPages()).data.testData||[];
      examData = us.extend(examData,args);

      us.last(getCurrentPages()).setData({
        examDataIndex : examData
      });
      if(us.last(getCurrentPages()).data.testTypeOrg==="order"){
        var pageNum = examService.readExamRecord({
          model:us.last(getCurrentPages()).data.testModel,
          subject:us.last(getCurrentPages()).data.testSubject
        }).lastIndex;
        render.renderSpcialPage(pageNum);
      }else{
        render.renderNextPage();
      }
  },
  getNextQuestion:function(){
  	//获取页码
    var currentPageNum = us.last(getCurrentPages()).data.current?us.last(getCurrentPages()).data.current:0;
    //计算要渲染的页码
    var nextPageNum = currentPageNum+1;
    //获取要渲染的考题
    var questionInfo = test.getQuestionByPageNum(nextPageNum);
    return questionInfo;
  },
  getPrevQuestion:function(){
    var currentPageNum = us.last(getCurrentPages()).data.current?us.last(getCurrentPages()).data.current:0;
    var nextPageNum = currentPageNum-1;
    var questionInfo = test.getQuestionByPageNum(nextPageNum);
    return questionInfo;
  },
  getCurrentQuestion:function(){
    var currentPageNum = us.last(getCurrentPages()).data.current?us.last(getCurrentPages()).data.current:0;
    var questionInfo = test.getQuestionByPageNum(currentPageNum);
    return questionInfo;

  },
  getQuestionByPageNum:function(nextPageNum){
    var examData = _fn.getExamIndex();
    nextPageNum = nextPageNum||1;
    if(nextPageNum-1>=0 && nextPageNum-1<=examData.length){
      var question = examData[nextPageNum-1];
      question.index = nextPageNum;
      return {
        question:question,
        total:examData.length,
        current:nextPageNum
      };
    }else{
      return false;
    }
  },
};
render = {
  renderCurrentPage:function(){
    var curQuestionObj = test.getCurrentQuestion();//获取当前的考题
    var curQuestion = curQuestionObj.question;//获取新的渲染数据
    if(!curQuestion){
      return false;
    }
    var pages = _fn.getPageData();
    var showPage = pages.showPage;//获取显示页的数据
    var showPageName = showPage.name;
    var showPageData = showPage.data;

    showPageData.pageData = curQuestion;//更新渲染页的数据

    newRenderData = {};
    newRenderData[showPageName]=showPageData;
    newRenderData.total = curQuestionObj.total;//更新页码数据
    newRenderData.current = curQuestionObj.current;
    // newRenderData.isFinish = curQuestionObj.total===curQuestionObj.current?true:false;
    newRenderData.isFinish = true;
    us.last(getCurrentPages()).setData(newRenderData);//渲染
    return true;
  },
  renderPrevPage:function(){
    var prevQuestionObj = test.getPrevQuestion();
    return render.exchangePageContent(prevQuestionObj);
  },
  renderNextPage:function(){
    //从examDataIndex中获取当前题目的下一道题
    var nextQuestionObj = test.getNextQuestion();
    //将这道题渲染在页面上边
    return render.exchangePageContent(nextQuestionObj);
  },
  renderSpcialPage:function(pageNum){
    var spcialQuestionObj = test.getQuestionByPageNum(pageNum);
    return render.exchangePageContent(spcialQuestionObj);
  },
  exchangePageContent:function(question){
    var newQuestionObj = question;
    var newQuestion = newQuestionObj.question;
    if(!newQuestion){
      return false;
    }
    //获取显示页和隐藏页的数据
    var pages = _fn.getPageData();
    var showPage = pages.showPage;
    var hidePage = pages.hidePage;
    var showPageName = showPage.name;
    var showPageData = showPage.data;
    var hidePageName = hidePage.name;
    var hidePageData = hidePage.data;

    if(!showPageData.pageData){
      //页面初始化第一次被调用，两个层都没有被渲染，就选当前的显示层
      showPageData.pageData = newQuestion;
      hidePageData.pageData = {};
    }else{
      //第一次之后的渲染，就选择当前的渲染层渲染
      hidePageData.pageData = newQuestion;
      showPageData.pageData = {};
    }
    newRenderData = {};
    newRenderData[showPageName]=showPageData;
    newRenderData[hidePageName]=hidePageData;
    newRenderData.total = newQuestionObj.total;
    newRenderData.current = newQuestionObj.current;
    us.last(getCurrentPages()).setData(newRenderData);
    return true;
  },
  exchangeShowHide:function(){
    var pages = _fn.getPageData();
    var showPage = pages.showPage;
    var hidePage = pages.hidePage;
    var showPageName = showPage.name;
    var showPageData = showPage.data;
    var hidePageName = hidePage.name;
    var hidePageData = hidePage.data;
    setTimeout(function(){
      showPageData.pageInfo.isCurrent="backup";
      hidePageData.pageInfo.isCurrent="current";
      showPageData.pageInfo.isShow="hide";
      hidePageData.pageInfo.isShow="show";
      newRenderData = {};
      newRenderData[showPageName]=showPageData;
      newRenderData[hidePageName]=hidePageData;
      us.last(getCurrentPages()).setData(newRenderData);
      //解开考题锁
      pageLock = false;
    },500);
  }
};
