import { uiEnvDetails, uiExecutionConfig } from './execution.configuration'
import { browserDriverVersion } from './browser.config'
import ConfigUtility from '../configs/configUtility'
import DateTimeUtility from '../utilities/dateTimeUtility'
const args = require('minimist')(process.argv.slice(2))
const reportPath = '././reports/webAutomation/';
const featureFilePath = './webAutomation/featureFile/';
const stepDefinitionPath = './webAutomation/stepDefinitions/';
export const config: WebdriverIO.Config = {

    //###### COMPILER SETUP ####################################
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            transpileOnly: true,
            project: 'tsconfig.json'
        }
    },
    //###### Spec and Suite File Location ####################################
    specs: [
        featureFilePath + '**/*.feature'
    ],
    suites: {
        regression: [
            featureFilePath + '**/*.feature'
        ]
    },
    //###### Execution Excluded Profile ####################################
    exclude: [
        // 'path/to/excluded/files'
    ],

    //###### Execution and Browser Capability Setup ##########################

    services: [['selenium-standalone', { drivers: { firefox: browserDriverVersion.firefox, chrome: browserDriverVersion.chrome, chromiumedge: browserDriverVersion.edge } }]],
    framework: 'cucumber',
    baseUrl: uiEnvDetails[uiExecutionConfig.domain],
    maxInstances: uiExecutionConfig.maxParallelInstances,
    capabilities: [{
        maxInstances: uiExecutionConfig.maxParallelInstances,
        browserName: args.browser == undefined ? uiExecutionConfig.browser : args.browser,
        acceptInsecureCerts: true,
    }],
    connectionRetryCount: 3,
    reporters: ['spec',
        ['allure', {
            outputDir: reportPath + 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
            useCucumberStepReporter: true,
        }],
        ['junit', {
            outputDir: reportPath + 'junit-results',
            outputFileFormat: function () {
                return `webTestSummaryResults.xml`
            }
        }]
    ],

    //###### WebdriverIO Log option ##########################

    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',

    //###### bail setUP ##########################

    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,

    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,

    //
    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        // <string[]> (file/dir) require files before executing features
        require: [stepDefinitionPath + '*.ts'],
        // <boolean> show full backtrace for errors
        backtrace: false,
        // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        requireModule: [],
        // <boolean> invoke formatters without executing steps
        dryRun: false,
        // <boolean> abort the run on first failure
        failFast: false,
        // <boolean> hide step definition snippets for pending steps
        snippets: true,
        // <boolean> hide source uris
        source: true,
        // <boolean> fail if there are any undefined or pending steps
        strict: false,
        // <string> (expression) only execute the features or scenarios with tags matching the expression
        tagExpression: args.tagExpression == undefined ? uiExecutionConfig.tagExpression : args.tagExpression,
        // <number> timeout for step definitions
        timeout: 180000,
        // <boolean> Enable this config to treat undefined definitions as warnings.
        ignoreUndefinedDefinitions: false
    },

    // ===== Hooks ===== // 

    onPrepare: async function (config, capabilities) {
        await ConfigUtility.removeAllureResultsFile(reportPath);
        var tabletName = await args.tabletName == undefined ? uiExecutionConfig.tabletName : await args.tabletName
        var mobileDeviceName = await args.mobileDeviceName == undefined ? uiExecutionConfig.mobileDeviceName : await args.mobileDeviceName
        var platform = await args.executionPlatform == undefined ? uiExecutionConfig.executionPlatform : await args.executionPlatform
        var browser = await args.browser == undefined ? uiExecutionConfig.browser : await args.browser
        capabilities = await ConfigUtility.addBrowserCapability(platform, capabilities, mobileDeviceName, tabletName, browser);
    },

    before: async function (capabilities) {
        await ConfigUtility.setExecutionGlobalValue(capabilities);
        var domain = await args.domain == undefined ? uiExecutionConfig.domain : await args.domain
        config.baseUrl = await uiEnvDetails[domain]
        global.baseUrl = config.baseUrl;
        global.domain = await domain;
    },

    afterStep: async function (result) {
        await ConfigUtility.takeScreenShotForFailureCase(result);
    },
    afterScenario: async function (result) {
        await ConfigUtility.takeScreenShotForSuccessCase(result);
        await ConfigUtility.addEnvironmentInformationInAllureReport(config.baseUrl)
    },

    onComplete: async function () {
        var platform = config.capabilities[0]['execution:options']['executionPlatform'];
        var deviceName = config.capabilities[0]['execution:options']['deviceName'];
        var allureReport = ''
        if (uiExecutionConfig.executionAt.toLocaleLowerCase().trim() === 'azure') {
            allureReport = reportPath + 'azure';
        }
        else {
            if (platform.toLocaleLowerCase().includes('api')) {
                allureReport = reportPath + await DateTimeUtility.addOrSubtractDaysToCurrentDate(0, "DD MMM YYYY") + '/' + await DateTimeUtility.addOrSubtractDaysToCurrentDate(0, "HH_mm_ss");
            }
            else {
                allureReport = reportPath + await DateTimeUtility.addOrSubtractDaysToCurrentDate(0, "DD MMM YYYY") + '/' + platform + '/' + await DateTimeUtility.addOrSubtractDaysToCurrentDate(0, "HH_mm_ss");
                allureReport = reportPath + '-' + deviceName;
            }
        }
        await ConfigUtility.generateAllureReportAfterEndOfExecution(platform, deviceName, reportPath, allureReport);
    }
}
