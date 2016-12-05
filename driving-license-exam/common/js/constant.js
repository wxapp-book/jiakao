var handle = {
	CGI : {
		// query:"http://api2.juheapi.com/jztk/query",
		// answer:"http://api2.juheapi.com/jztk/answers",
		query:"https://www.wxapp-gateway.com/wxapp/dle/examData",
		answer:"https://www.wxapp-gateway.com/wxapp/dle/answerMap",
	},
	appKey:"325e34a760339c8c8f29c061308e8b55",
	subjects:["1","4"],
	models:['c1','c2','a1','a2','b1','b2'],
	storageKey:{
		defaultSubject:"default-subject",
		defaultModel:"default-model",
		userModel:"user.model",
		answerMap:"answerMap"
	},
	pages:{
		finish:"pages/finish/finish"
	},
	exam2:[
		{
			videoSrc:"http://data.vod.itc.cn/?rb=1&prot=1&key=jbZhEJhlqlUN-Wj_HEI8BjaVqKNFvDrn&prod=flash&pt=1&new=/64/244/dCjgbXrXRdeMg33bV6YYpD.mp4",
			videoImgSrc:"http://img.my.tv.sohu.com.cn/o_zoom,w_170,h_110/p225/2016/11/20/14/16/6_15961afbcd3g102SysCutcloud_86018507_7_2b.jpg"
		},
		{
			videoSrc:"http://data.vod.itc.cn/?rb=1&prot=1&key=jbZhEJhlqlUN-Wj_HEI8BjaVqKNFvDrn&prod=flash&pt=1&new=/91/85/G2ogndzdRQWntfoRcVGuoD.mp4",
			videoImgSrc:"http://img.my.tv.sohu.com.cn/o_zoom,w_170,h_110/p225/2016/11/18/5/0/6_159543ac5fbg104SysCutcloud_85971163_7_4b.jpg"
		},
		{
			videoSrc:"http://data.vod.itc.cn/?rb=1&prot=1&key=jbZhEJhlqlUN-Wj_HEI8BjaVqKNFvDrn&prod=flash&pt=1&new=/250/239/H78xQ1RLp9Op05jYwZcIOC.mp4",
			videoImgSrc:"http://img.my.tv.sohu.com.cn/o_zoom,w_170,h_110/p225/2016/11/20/22/26/6_159637099f4g102SysCutcloud_86023651_9_3b.jpg"
		}
	],
	exam3:[
		{
			videoSrc:"http://data.vod.itc.cn/?rb=1&prot=1&key=jbZhEJhlqlUN-Wj_HEI8BjaVqKNFvDrn&prod=flash&pt=1&new=/165/143/TstcGKnxSbe1LFxgIJO8zF.mp4",
			videoImgSrc:"http://img.my.tv.sohu.com.cn/o_zoom,w_170,h_110/p223/2016/11/18/7/28/6_15955d1d3fdg102SysCutcloud_85973469_7_0b.jpg"
		},
		{
			videoSrc:"http://data.vod.itc.cn/?rb=1&prot=1&key=jbZhEJhlqlUN-Wj_HEI8BjaVqKNFvDrn&prod=flash&pt=1&new=/169/4/vZTxMxtOShSCvRmfI49QhC.mp4",
			videoImgSrc:"http://img.my.tv.sohu.com.cn/o_zoom,w_170,h_110/p223/2016/11/23/17/6/6_15971a3050dg102SysCutcloud_86088263_7_2b.jpg"
		},
		{
			videoSrc:"http://data.vod.itc.cn/?rb=1&prot=1&key=jbZhEJhlqlUN-Wj_HEI8BjaVqKNFvDrn&prod=flash&pt=1&new=/173/74/hmJEPi7cS1WIasuOmMX8dE.mp4",
			videoImgSrc:"http://img.my.tv.sohu.com.cn/o_zoom,w_170,h_110/p225/2016/11/4/7/16/6_1590dadcbd9g102SysCutcloud_85750273_7_4b.jpg"
		}
	]
};

module.exports = handle;