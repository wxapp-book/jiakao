var us = require('../../lib/underscore.js');

var queue = function(name){
	this.name = name;
	this.callbackArray = [];
};
queue.prototype = {
	getName:function(){
		return this.name;
	},
	add:function(){
		this.callbackArray.push({
			callback:us.last(arguments),
			args:arguments
		});
	},
	fire:function(){
		var fireObj = this.callbackArray.shift();
		fireObj.callback(fireObj.args);
	},
	getSize:function(){
		return this.callbackArray.length;
	},

};

var queues = {
	wxAjaxQueue:new queue("wxAjaxQueue")
};
var handle = {
	getQueue:function(name){
		if(queues[name]){
			return queues[name];
		}
	}

};

module.exports = handle;