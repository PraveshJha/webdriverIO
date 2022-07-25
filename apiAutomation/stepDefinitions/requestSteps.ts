import { Given, When, DataTable } from '@wdio/cucumber-framework';
import RestAPI from '../../utilities/restAPI'
import { RestRequest } from '../../utilities/restRequest'
import { RestResponse } from '../../utilities/restResponse'
import GeneratePayLoad from '../components/generatePayLoad'
import { ResponseVariable } from '../components/responseVariable';
import {apiExecutionConfig,apiEnvDetails} from '../../configs/execution.configuration';
var apiBaseUrl =  apiEnvDetails[apiExecutionConfig.domain];


When(/^I call \'(.*)\' request with endpoint \'(.*)\'$/, async (httpMethodName: string, endpoint: string) => {
  await RestAPI.callAPIRequest(httpMethodName, await apiBaseUrl, endpoint, RestRequest.requestHeader, RestRequest.requestParamameter, RestRequest.requestBody);
});

When(/^I call \'(.*)\' request with endpoint \'(.*)\' with following request parameter details$/, async (httpMethodName: string, endpoint: string, requestData: DataTable) => {
  var requestParameter = GeneratePayLoad.generateRequestParameter(requestData);
  RestRequest.requestParamameter = await requestParameter;
  await RestAPI.callAPIRequest(httpMethodName, await apiBaseUrl, endpoint, RestRequest.requestHeader, await RestRequest.requestParamameter, RestRequest.requestBody);
});

When(/^I get all \'(.*)\' value from Response key \'(.*)\' and save in variable \'(.*)\'$/, async (arrayKeyName: string, responseKeyName: any, variableName: string) => {
  var allValue = [];
  var responseKeyValue = await GeneratePayLoad.getKeyValue(RestResponse.responseBody, responseKeyName);
  for (let keyCounter = 0; keyCounter < await responseKeyValue.length; keyCounter++) {
    var onebyOneKeyValue = await responseKeyValue[keyCounter][arrayKeyName];
    allValue.push(await onebyOneKeyValue);
  }
  ResponseVariable[variableName] = allValue;
});

When(/^I save Response body key \'(.*)\' in variable \'(.*)\'$/, async (responseKeyName: any, variableName: string) => {
  var responseKeyValue = await GeneratePayLoad.getKeyValue(RestResponse.responseBody, responseKeyName);
  ResponseVariable[variableName] = responseKeyValue;

});

When(/^I save Request body key \'(.*)\' in variable \'(.*)\'$/, async (responseKeyName: any, variableName: string) => {
  var responseKeyValue = await GeneratePayLoad.getKeyValue(RestRequest.requestBody, responseKeyName);
  ResponseVariable[variableName] = responseKeyValue;

});

When(/^I save Response header key \'(.*)\' in variable \'(.*)\'$/, async (responseKeyName: any, variableName: string) => {
  var responseKeyValue = await GeneratePayLoad.getKeyValue(RestResponse.responseHeader, responseKeyName);
  ResponseVariable[variableName] = responseKeyValue;

});

When(/^I save Request header key \'(.*)\' in variable \'(.*)\'$/, async (responseKeyName: any, variableName: string) => {
  var responseKeyValue = await GeneratePayLoad.getKeyValue(RestRequest.requestHeader, responseKeyName);
  ResponseVariable[variableName] = responseKeyValue;

});
