import { RestResponse } from './restResponse'
import fetch from 'cross-fetch';
import { apiExecutionConfig } from '../configs/execution.configuration'
export class RestAPI {

    async callAPIRequest(methodName: string, baseUrl: string, endPointURL = '', requestHeader = {}, requestParam = {}, requestBody = {}) {
        var apiResponse: any;
        var request = {
            method: methodName.toLocaleLowerCase(),
            headers: requestHeader,
        }
        if (methodName.toLocaleLowerCase() === 'post' || methodName.toLocaleLowerCase() === 'put') {
            request['body'] = JSON.stringify(requestBody);
        }
        if (!baseUrl.substring(baseUrl.length - 1).includes('/')) {
            baseUrl = baseUrl + '/';
        }
        if (endPointURL.substring(0, 1).includes('/')) {
            endPointURL = endPointURL.substring(1);
        }
        var appUrl = baseUrl + endPointURL;
        if (appUrl.substring(appUrl.length - 1).includes('/')) {
            appUrl = appUrl.substring(0,appUrl.length-1);
        }
        if (apiExecutionConfig.requestQueryFormat) {
            const esc = encodeURIComponent;
            try {
                if (Object.keys(requestParam).length > 0) {
                    const query = Object.keys(requestParam).map(k => `${esc(k)}=${esc(requestParam[k])}`).join('&')
                    appUrl = appUrl + "?" + query;
                }
            }
            catch (error) { }
        }
        else{
            var allPrams = Object.keys(requestParam);
            var stringForRequestParam = '';
            for(let paramCounter=0;paramCounter<allPrams.length;paramCounter++)
            {
                var KeyName = allPrams[paramCounter];
                var keyValue = await requestParam[KeyName];
                stringForRequestParam = await stringForRequestParam+ KeyName+'/'+keyValue;
            }
            appUrl = appUrl +'/'+stringForRequestParam;
        }
        try {
            apiResponse = await fetch(appUrl, request);
        }
        catch (error) {
        }
        RestResponse.responseCode = await apiResponse["status"];
        RestResponse.responseHeader = await apiResponse["headers"]
        try {
            var jsonResponseFrmat = await apiResponse.json();
            RestResponse.responseBody = await jsonResponseFrmat;
        }
        catch (error) {
        }
    }

    //#endregion [Rest Method]
}
export default new RestAPI;

