import { Given, When, Then } from '@wdio/cucumber-framework';
import EstabPage from '../pageobjects/estabPage';

//#region [Home Page Steps]

Then(/^Estab page should be displayed$/, async () => {
	await EstabPage.verifyHotelEstabPage();
});

When(/^I select all rooms$/, async () => {
	await EstabPage.selectAllRooms();
});



//#endregion [Home Page Steps]








