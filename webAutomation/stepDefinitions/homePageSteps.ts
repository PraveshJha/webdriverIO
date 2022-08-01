import { Given, When, Then } from '@wdio/cucumber-framework';
import HomePage from '../pageobjects/homePage';

//#region [Home Page Steps]

Given(/^I am on the Home page$/, async () => {
	await HomePage.navigateToHomePage();
});

When(/^I select \'(.*)\' tab$/, async (tabName) => {
	await HomePage.selectTab(tabName);
});

When(/^I select destination as \'(.*)\'$/, async (destinationName:string) => {
	await HomePage.selectDestination(destinationName);
});

When(/^I select checkindate which is \'(.*)\' days ahead from the present day with stay of duration \'(.*)\'$/, async (checkinDate:string,durationOfStay:string) => {
	await HomePage.populateDate(Number(checkinDate),Number(durationOfStay))
});

When(/^I add guest \'(.*)\' details$/, async (guestInfo:any) => {
	await HomePage.selectRoomAndGuests(await guestInfo)
});

When(/^I click on Search button$/, async () => {
	await HomePage.clickonSearchButton();
});


//#endregion [Home Page Steps]








