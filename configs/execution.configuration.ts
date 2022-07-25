export const uiExecutionConfig = {
	"maxParallelInstances": 1,
	"domain": "qa", //qa,dev,prod
	"browser": "chrome",//chrome
	"executionPlatform": "desktop", // desktop,mobile
	"mobileDeviceName": "iPhone X",
	"tabletName": "iPad Pro",
	"tagExpression": "",
	"executionAt" :"local" // local,azure
};
export const uiEnvDetails = {
	"qa": "https://www.emirates.com/in/english/",
	"dev": "https://www.emirates.com/in/english/",
	"prod": "https://www.emirates.com/in/english/"
};

export const apiExecutionConfig = {
	"maxParallelInstances": 1,
	"domain": "qa", //qa,dev,prod
	"tagExpression": "",
	"isMock": true,
	"requestQueryFormat": false,
	"executionAt" :"local" // local,azure
};
export const apiEnvDetails = {
	"qa": "https://gorest.co.in/",
	"dev": "https://www.emirates.com/in/english/",
	"prod": "https://www.emirates.com/in/english/"
};