import { RestRequest } from '../../utilities/restRequest'
import { RestResponse } from '../../utilities/restResponse';
import { ResponseVariable } from './responseVariable';
import Utility from '../../utilities/dateTimeUtility'
import DataGeneratorUtility from '../../utilities/dataGeneratorUtility'

export class GeneratePayLoad {

  public async initializePayload(controllerName: string) {
    var payLoadPath = '../requestPayload/' + controllerName + '.json';
    const defaultPayLoad = require(payLoadPath);
    RestRequest.requestBody = defaultPayLoad;
    delete require.cache[require.resolve(payLoadPath)];
    return defaultPayLoad;
  }

  public async updatePayload(controllerName: string, dataTable: any) {
    var defaultPayLoad = await this.initializePayload(controllerName);
    var defaultPayloadVariableParams = await defaultPayLoad;
    var variableParamsToUpdate = await dataTable.rawTable;
    for (let param = 0; param < await variableParamsToUpdate.length; param++) {
      var paramKey = await variableParamsToUpdate[param][0];
      var paramValue = await variableParamsToUpdate[param][1];
      paramValue = await this.getDynamicData(paramValue);
      defaultPayloadVariableParams = await this.updateJsonObjectValueByKey(await defaultPayloadVariableParams, paramKey, paramValue);
    }
    defaultPayLoad = await defaultPayloadVariableParams;
    RestRequest.requestBody = await defaultPayLoad;
  }

  public async updateHttpHeaderData(dataTable: any) {
    var currentHeader = RestRequest.requestHeader;
    var allRequestParam = await dataTable.rawTable;
    for (let param = 0; param < await allRequestParam.length; param++) {
      var parameterName = await allRequestParam[param][0];
      var parameterValue = await allRequestParam[param][1];
      parameterValue = await this.getDynamicData(parameterValue);
      currentHeader = await this.updateJsonObjectValueByKey(currentHeader, parameterName, parameterValue);
    }
    RestRequest.requestHeader = currentHeader;

  }

  async getKeyValue(dataObject: any, keyName: string) {
    var givenData = await dataObject;
    if (keyName.includes('[') && keyName.includes(']')) {
      var allKeyName = keyName.split('[');
      for (let keyCounter = 0; keyCounter < allKeyName.length; keyCounter++) {
        var firstPart = allKeyName[keyCounter];
        if (firstPart.trim() !== '') {
          var onebyOneKey = firstPart.split(']')[0];
          onebyOneKey = await this.setDataTypeforJsonKey(onebyOneKey);
          givenData = await givenData[onebyOneKey]
        }
      }
    }
    else {
      keyName = await this.setDataTypeforJsonKey(keyName);
      return await dataObject[keyName];
    }
    return givenData;
  }

  async updateJsonObjectValueByKey(dataObject: any, keyName: string, keyValue: any) {
    keyValue = await this.convertIntoDataObject(keyValue);
    if (keyName.includes('[') && keyName.includes(']')) {
      var runTimekeyValue = [];
      var allKeyName = keyName.split('[');
      for (let keyCounter = 0; keyCounter < allKeyName.length; keyCounter++) {
        var firstPart = allKeyName[keyCounter];
        var onebyOneKeyName = firstPart.split(']')[0];
        runTimekeyValue.push(onebyOneKeyName)
      }
      dataObject = await this.setJsonObjectForEachKey(await dataObject, runTimekeyValue, keyValue)

    }
    else {
      keyName = await this.setDataTypeforJsonKey(keyName);
      dataObject[keyName] = await keyValue;
    }
    return await dataObject;
  }

  async getDynamicData(paramValue: string) {
    if (paramValue.includes('<')) {
      var dynamicTestSuite = require('../requestPayload/TestData.json');
      paramValue = paramValue.split('<')[1].split('>')[0];
      try {
        if (paramValue.toLowerCase().startsWith('testdata')) {
          paramValue = paramValue.substring(9).split(']')[0];
          var dynamicTestData = await this.getKeyValue(await dynamicTestSuite, paramValue);
          if (dynamicTestData === '' || dynamicTestData === null || dynamicTestData === undefined) {
            dynamicTestData = await this.genrateRandomTestData(paramValue);
          }
          return await dynamicTestData;
        }
        else {
          var resVariableData = await ResponseVariable[paramValue];
          if (resVariableData === undefined) {
            paramValue = await this.getKeyValue(RestResponse.responseBody, paramValue);
            return paramValue;
          }
          else {
            return resVariableData;
          }
        }
      }
      catch (error) {
      }
    }
    else {
      return paramValue;
    }
  }


  async genrateRandomTestData(keyName: string) {
    var dynamicData: any;
    switch (keyName.toLocaleLowerCase()) {
      case "futuredate":
        dynamicData = await Utility.addOrSubtractDaysToCurrentDate(60, "yyyy-MM-DD");
        break;
      case "pastdate":
        dynamicData = await Utility.addOrSubtractDaysToCurrentDate(-1, "yyyy-MM-DD");
        break;
      case "currentdate":
        dynamicData = await Utility.addOrSubtractDaysToCurrentDate(0, "yyyy-MM-DD");
        break;
      case "name":
        dynamicData = await DataGeneratorUtility.getName();
        break;
      case "address":
        dynamicData = await DataGeneratorUtility.getAddress();
        break;
      case "email":
        dynamicData = await DataGeneratorUtility.getEmail();
        break;
      case "phonenumber":
        dynamicData = await DataGeneratorUtility.getPhoneNumber();
        break;
    }
    return dynamicData;
  }

  async convertIntoDataObject(keyValue: any) {
    var outPut: any
    var getTypeOf = typeof (await keyValue);
    switch (getTypeOf.toString().toLocaleLowerCase()) {
      case "string":
        if (keyValue.toString().toLocaleLowerCase() === 'null') {
          outPut = null;
        }
        else {
          try {
            outPut = await JSON.parse(await keyValue);
          }
          catch (error) {
            outPut = keyValue;
          }
        }
        break;
      case "number":
        outPut = Number(await keyValue);
        break;
      case "object":
        outPut = keyValue;
        break;
      case "boolean":
        outPut = Boolean(await keyValue)
        break;
      default:
        outPut = await keyValue;
        break;

    }
    return await outPut;
  }
  public async generateRequestParameter(dataTable: any) {
    var outPut = {};
    var allRequestParam = await dataTable.rawTable;
    for (let param = 0; param < await allRequestParam.length; param++) {
      var parameterName = await allRequestParam[param][0];
      var parameterValue = await allRequestParam[param][1];
      parameterValue = await this.getDynamicData(parameterValue);
      outPut[parameterName] = await this.convertIntoDataObject(parameterValue);
    }
    return outPut;
  }

  async setJsonObjectForEachKey(dataObject: any, allKeys = [], valueToUpdate: any) {
    var updatedPayload = await dataObject;
    var allJsonObject = [];
    for (let keycounter = 0; keycounter < allKeys.length - 1; keycounter++) {
      var onebyOneJobject = {};
      var keyName = await this.setDataTypeforJsonKey(await allKeys[keycounter]);
      onebyOneJobject[await keyName] = await dataObject[await keyName];
      allJsonObject.push(onebyOneJobject);
      dataObject = await dataObject[await keyName];
    }
    var onebyOneJobject = {};
    onebyOneJobject[await this.setDataTypeforJsonKey(allKeys[allKeys.length - 1])] = await valueToUpdate;
    allJsonObject.push(onebyOneJobject);
    var allKeysLength = allJsonObject.length;
    for (let counter = 0; counter < allKeysLength - 1; counter++) {
      var lastCounter = allKeysLength - (counter + 1);
      var parentLastCounter = lastCounter - 1;
      var lastKeyName = await this.setDataTypeforJsonKey(await allKeys[lastCounter]);
      var parentKeyObjectName = await this.setDataTypeforJsonKey(await allKeys[parentLastCounter]);
      allJsonObject[parentLastCounter][parentKeyObjectName][lastKeyName] = await allJsonObject[lastCounter][lastKeyName];
    }
    var parentKey = await this.setDataTypeforJsonKey(await allKeys[0]);
    updatedPayload[parentKey] = await allJsonObject[0][parentKey]
    return await updatedPayload;
  }

  async deleteKeyFromJsonObject(dataObject: any, keyName: string) {
    var allKeys = [];
    if (keyName.includes('[') && keyName.includes(']')) {
      var allJsonObject = [];
      var allKeyName = keyName.split('[');
      for (let keyCounter = 0; keyCounter < allKeyName.length; keyCounter++) {
        var firstPart = allKeyName[keyCounter];
        var onebyOneKeyName = firstPart.split(']')[0];
        allKeys.push(onebyOneKeyName)
      }
      for (let keyCounter = 0; keyCounter < allKeys.length - 1; keyCounter++) {
        var oneByOneKey = {};
        var keyNameToRetrive = await this.setDataTypeforJsonKey(await allKeys[keyCounter]);
        oneByOneKey[keyNameToRetrive] = await dataObject[await keyNameToRetrive];
        dataObject = await dataObject[await keyNameToRetrive];
        allJsonObject.push(oneByOneKey);
      }
      var oneByOneKey = {}
      oneByOneKey[allKeys[allKeys.length - 1]] = null;
      allJsonObject.push(oneByOneKey);
      var allKeysLength = allKeys.length;
      var lastCounter = allKeysLength - 1;
      var parentLastCounter = lastCounter - 1;
      var lastKeyName = await this.setDataTypeforJsonKey(await allKeys[lastCounter]);
      var parentKeyObjectName = await this.setDataTypeforJsonKey(await allKeys[parentLastCounter]);
      delete allJsonObject[parentLastCounter][parentKeyObjectName][lastKeyName];
    }
    else {
      keyName = await this.setDataTypeforJsonKey(keyName)
      return delete dataObject[keyName]
    }

    return await allJsonObject[0];
  }

  async setDataTypeforJsonKey(keyNameToRetrive: any) {
    if (!isNaN(keyNameToRetrive)) {
      keyNameToRetrive = Number(keyNameToRetrive);
    }
    return keyNameToRetrive;
  }

}
export default new GeneratePayLoad;
