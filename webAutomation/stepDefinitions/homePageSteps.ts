import { Given, When, Then } from '@wdio/cucumber-framework';
import HomePage from '../pageobjects/homePage';

//#region [Home Page Steps]

Given(/^I am on the Home page$/, async () => {
	await HomePage.navigateToHomePage();
	expect(await HomePage.isLogoDisplayed()).toBe(true);
});

When(/^I select \'(.*)\' tab$/, async (tabName) => {
	await HomePage.selectTab(tabName);
});

Then(/^\'(.*)\' tab should be selected$/, async (tabName) => {
	 expect(await HomePage.isTabSelected(tabName)).toBe(true);
});

//#endregion [Home Page Steps]








