import DateTimeUtility from '../utilities/dateTimeUtility'
import { RestResponse } from '../utilities/restResponse'
import { RestRequest } from '../utilities/restRequest';
import { uiExecutionConfig } from '../configs/execution.configuration'
var fs = require('fs');
const allureReporter = require('@wdio/allure-reporter').default
const allure = require('allure-commandline');

export class ConfigUtility {

    //#region [wdio reusable configuration code]

    async generateAllureReportAfterEndOfExecution(platformName: string, deviceName: string, parentReportPath: string, allurePreportPath: string) {
        if (!fs.existsSync(allurePreportPath)) {
            await fs.mkdirSync(allurePreportPath, { recursive: true });
        }
        const reportError = new Error('Could not generate Allure report')
        const generation = await allure(['generate', parentReportPath + 'allure-results', '--clean', '-o', allurePreportPath])
        return new Promise<void>((resolve, reject) => {
            const generationTimeout = setTimeout(
                () => reject(reportError),
                5000)

            generation.on('exit', function (exitCode: number) {
                clearTimeout(generationTimeout)

                if (exitCode !== 0) {
                    return reject(reportError)
                }
                resolve()
            })
        })

    }

    async removeAllureResultsFile(reportPath: string) {
        try {
            await fs.rmdirSync(reportPath + 'allure-results', { recursive: true });
        } catch (err) {
        }
    }

    async addBrowserCapability(platform: string, capabilities: any, mobileDeviceName: string, tabletDeviceName: string, browser: string) {
        var customData = { executionPlatform: '', deviceName: '' }
        switch (platform.toLocaleLowerCase()) {
            case "mobile":
            case "mob":
                capabilities[0]["goog:chromeOptions"] = { mobileEmulation: { 'deviceName': mobileDeviceName } };
                capabilities[0].browserName = 'chrome';
                customData.executionPlatform = 'Mobile Emulator';
                customData.deviceName = mobileDeviceName;
                capabilities[0]['execution:options'] = customData;
                break;
            case "tab":
            case "tablet":
                capabilities[0]["goog:chromeOptions"] = { mobileEmulation: { 'deviceName': tabletDeviceName, } };
                capabilities[0].browserName = 'chrome';
                customData.deviceName = tabletDeviceName;
                customData.executionPlatform = 'Tablet Emulator';
                capabilities[0]['execution:options'] = customData;
                break;
            case "desktop":
                if (browser.toLocaleLowerCase() === 'edge') {
                    capabilities[0].browserName = 'MicrosoftEdge';
                }
                else
                    capabilities[0].browserName = browser
                customData.executionPlatform = 'Desktop';
                customData.deviceName = browser;
                capabilities[0]['execution:options'] = customData;
                break;
            case "api":
                capabilities[0]["goog:chromeOptions"] = { args: ['headless', 'disable-gpu',], };
                customData.executionPlatform = 'API';
                capabilities[0]['execution:options'] = customData;
                break;
        }
        return capabilities;
    }

    async setExecutionGlobalValue(capabilities: any) {
        var platform = await capabilities['execution:options']['executionPlatform'];
        var device = await await capabilities['execution:options']['deviceName'];
        var browserName = await capabilities["browserName"];
        switch (platform.toString().toLocaleLowerCase()) {
            case "mobile emulator":
                global.isMobileView = true;
                global.executionPaltform = 'Mobile Emulator';
                global.deviceName = device;
                break;
            case "tablet emulator":
                await this.setResponsiveModeForTabletDevice(await device);
                global.executionPaltform = 'Tablet Emulator';
                global.deviceName = device;
                break;
            case "desktop":
                global.isMobileView = false;
                global.executionPaltform = 'Desktop';
                global.deviceName = browserName;
                break;
            case "api":
                global.isApiTest = true;
                global.executionPaltform = 'API';
                break;
        }
    }

    async setResponsiveModeForTabletDevice(tabletDeviceName: string) {
        switch (tabletDeviceName.toLocaleLowerCase()) {
            case "ipad pro":
                global.isMobileView = false;
                break;
            case "ipad":
                global.isMobileView = true;
                break;
            case "ipad mini":
                global.isMobileView = true;
                break;
            default:
                global.isMobileView = false;
                break;
        }
    }

    async addEnvironmentInformationInAllureReport(applicationURL: string) {
        await allureReporter.addEnvironment("Application URL", applicationURL)
        await allureReporter.addEnvironment("Execution Platform", await global.executionPaltform)
        if (!await global.isApiTest) {
            if (global.executionPaltform === 'Desktop') {
                await allureReporter.addEnvironment("Browser Name", await global.deviceName)
            }
            else {
                await allureReporter.addEnvironment("Device Name", await global.deviceName)
            }
        }
    }

    async takeScreenShotForFailureCase(result: any) {
        if (!await global.isApiTest) {
            if (result.error) {
                await browser.takeScreenshot();
            }
        }
    }

    async takeScreenShotForSuccessCase(result: any) {
        if (!await global.isApiTest) {
            if (!result.error) {
                await browser.takeScreenshot();
            }
        }
    }

    async addAllureSteps(result: any) {
        if (!result.error) {
            await allureReporter.addAttachment('Execution Details', [{ responseData: RestResponse }, { requestData: RestRequest }]);
        }
    }

    async addHttpHeader() {
        var headerData = require('../apiAutomation/requestPayload/HttpHeader.json');
        RestRequest.requestHeader = headerData;
    }

    //#endregion [wdio reusable configuration code]
}
export default new ConfigUtility;

