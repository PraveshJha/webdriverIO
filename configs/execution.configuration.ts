export const uiExecutionConfig = {
	"maxParallelInstances": 1,
	"domain": "qa", //qa,dev,prod
	"browser": "chrome",//chrome
	"executionPlatform": "desktop", // desktop,mobile,tab, execution
	"mobileDeviceName": "iPhone 8", // iPhone 8,Pixel 2 XL,iPhone X
	"tabletName": "iPad Pro",
	"tagExpression": "",
	"executionAt" :"azure" // local,azure,Test
};
export const uiEnvDetails = {
	"qa": "https://www.travelrepublic.co.uk/"
};

export const apiExecutionConfig = {
	"maxParallelInstances": 1,
	"domain": "qa", //qa,dev,prod
	"tagExpression": "",
	"isMock": true,
	"requestQueryFormat": false,
	"executionAt" :"azure" // local,azure
};
export const apiEnvDetails = {
	"qa": "https://gorest.co.in/"
};