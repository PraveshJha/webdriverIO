import { Given, When, DataTable } from '@wdio/cucumber-framework';
import PayLoad from '../components/generatePayLoad';
import { RestRequest } from '../../utilities/restRequest'

Given(/^I update the http header with following details$/, async (requestData: DataTable) => {
  await PayLoad.updateHttpHeaderData(requestData)
});

Given(/^I have a playload for request \'(.*)\'$/, async (controllerName: string) => {
  await PayLoad.initializePayload(controllerName);
});

Given(/^I update the payload for request \'(.*)\' with following details$/, async (controllerName: string, requestData: DataTable) => {
  await PayLoad.updatePayload(controllerName, requestData)
});

Given(/^I remove \'(.*)\' key from payload$/, async (keyName: string) => {
  RestRequest.requestBody = await PayLoad.deleteKeyFromJsonObject(RestRequest.requestBody, keyName);
});
