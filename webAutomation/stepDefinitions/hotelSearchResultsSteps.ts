import { Given, When, Then } from '@wdio/cucumber-framework';
import HotelSearchResultsPage from '../pageobjects/hotelSearchResultsPage';

//#region [Home Page Steps]

Then(/^Hotel search results page should be displayed$/, async () => {
	await HotelSearchResultsPage.verifyHotelSearchResultsPage();
});

When(/^I select any hotel$/, async () => {
	await HotelSearchResultsPage.selectHotel();
});



//#endregion [Home Page Steps]








