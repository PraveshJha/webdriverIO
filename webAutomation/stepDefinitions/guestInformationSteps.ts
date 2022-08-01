import { Given, When, Then } from '@wdio/cucumber-framework';
import GuestInformationPage from '../pageobjects/guestInformationPage';

//#region [Home Page Steps]

Then(/^Guest information page should be displayed$/, async () => {
	
	await GuestInformationPage.verifyGuestInfoPage();
});




//#endregion [Home Page Steps]








