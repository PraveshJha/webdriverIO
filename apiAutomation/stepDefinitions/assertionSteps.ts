import { Given, When, Then } from '@wdio/cucumber-framework';
import { RestResponse } from '../../utilities/restResponse'
import GeneratePayload from '../components/generatePayLoad'
import CommonFunctions from '../../utilities/commonFunctions';

Then(/^Response code should be \'(.*)\'$/, async (responseCode: string) => {
  expect(Number(await RestResponse.responseCode)).toBe(Number(responseCode));
});

Then(/^Response body should have \'(.*)\'$/, async (expectedValue: string) => {
  expectedValue = await GeneratePayload.getDynamicData(expectedValue);
  expect(JSON.stringify(RestResponse.responseBody)).toContain(expectedValue);
});

Then(/^Response body should not have \'(.*)\'$/, async (expectedValue: string) => {
  expectedValue = await GeneratePayload.getDynamicData(expectedValue);
  expect(JSON.stringify(RestResponse.responseBody)).not.toContain(expectedValue);
});

Then(/^Response key \'(.*)\' should be \'(.*)\'$/, async (responseKey: string, expectedValue: any) => {
  var responseKeyValue = await GeneratePayload.getKeyValue(RestResponse.responseBody, responseKey)
  expectedValue = await GeneratePayload.getDynamicData(await expectedValue);
  var getTypeOf = typeof (responseKeyValue);
  var actualValue: any;
  var formatExpectedValue: any;
  switch (getTypeOf.toString().toLocaleLowerCase()) {
    case "string":
      actualValue = await responseKeyValue.toString();
      formatExpectedValue = await expectedValue.toString();
      break;
    case "number":
      actualValue = Number(responseKeyValue);
      formatExpectedValue = Number(expectedValue);
      break;
    case "object":
      actualValue = JSON.stringify(responseKeyValue);
      formatExpectedValue = JSON.stringify(await JSON.parse(expectedValue));
      break;
    case "boolean":
      actualValue = Boolean(responseKeyValue);
      formatExpectedValue = Boolean(expectedValue);
      break;
    default:
      actualValue = await responseKeyValue.toString();
      formatExpectedValue = await expectedValue.toString();

  }
  expect(actualValue).toEqual(formatExpectedValue);
});

Then(/^Response key \'(.*)\' should not be \'(.*)\'$/, async (responseKey: string, expectedValue: any) => {
  var responseKeyValue = await GeneratePayload.getKeyValue(RestResponse.responseBody, responseKey)
  expectedValue = await GeneratePayload.getDynamicData(await expectedValue);
  expect(await responseKeyValue).not.toEqual(await expectedValue);
});

Then(/^Response key \'(.*)\' length should be \'(.*)\'$/, async (responseKey: string, expectedValue: any) => {
  var responseKeyValue = await GeneratePayload.getKeyValue(RestResponse.responseBody, responseKey)
  expectedValue = await GeneratePayload.getDynamicData(await expectedValue);
  expect(Number(await responseKeyValue.length)).toEqual(Number(await expectedValue));
});

Then(/^Response key \'(.*)\' length should be greater than \'(.*)\'$/, async (responseKey: string, expectedValue: any) => {
  var responseKeyValue = await GeneratePayload.getKeyValue(RestResponse.responseBody, responseKey)
  expectedValue = await GeneratePayload.getDynamicData(await expectedValue);
  expect(Number(responseKeyValue.length)).toBeGreaterThan(Number(expectedValue))
});

Then(/^Response key \'(.*)\' should not be null$/, async (responseKey: string) => {
  var responseKeyValue = await GeneratePayload.getKeyValue(RestResponse.responseBody, responseKey)
  expect(responseKeyValue).not.toBe(null);
});

Then(/^Response key \'(.*)\' should be null$/, async (responseKey: string) => {
  var responseKeyValue = await GeneratePayload.getKeyValue(RestResponse.responseBody, responseKey)
  expect(responseKeyValue).toBe(null);
});

Then(/^Response key \'(.*)\' should contain \'(.*)\'$/, async (responseKey: string, expectedValue: any) => {
  var responseKeyValue = await GeneratePayload.getKeyValue(RestResponse.responseBody, responseKey)
  expectedValue = await GeneratePayload.getDynamicData(await expectedValue);
  expect(responseKeyValue.toString()).toContain(expectedValue.toString());
});

Then(/^Response key \'(.*)\' value between \'(.*)\'$/, async (responseKey: string, expectedValue: any) => {
  var responseKeyValue = await GeneratePayload.getKeyValue(RestResponse.responseBody, responseKey)
  var lowerRange = await expectedValue.toString().trim().split('-')[0];
  lowerRange = await CommonFunctions.getNumberFromString(await GeneratePayload.getDynamicData(await lowerRange));
  var upperRange = await expectedValue.toString().trim().split('-')[1];
  upperRange = await CommonFunctions.getNumberFromString(await GeneratePayload.getDynamicData(await upperRange));
  responseKeyValue = await CommonFunctions.getNumberFromString(responseKeyValue);
  expect(Number(await responseKeyValue)).toBeGreaterThanOrEqual(Number(await lowerRange));
  expect(Number(await responseKeyValue)).toBeLessThanOrEqual(Number(await upperRange));
});

Then(/^Response key \'(.*)\' should be within set \'(.*)\'$/, async (responseKey: string, expectedValue: any) => {
  var responseKeyValue = await GeneratePayload.getKeyValue(RestResponse.responseBody, responseKey)
  var allSetValue = expectedValue.split(',');
  var expectedOutput =[];
  for(let setCounter=0;setCounter<await allSetValue.length;setCounter++)
  {
    expectedOutput.push(await GeneratePayload.getDynamicData(await allSetValue[setCounter]))
  }
  responseKeyValue= await GeneratePayload.convertIntoDataObject(await responseKeyValue)
  expect(expectedOutput).toContain(await responseKeyValue.toString());
});

