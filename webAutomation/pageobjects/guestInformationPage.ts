import BasePage from './basePage';

class GuestInformationPage extends BasePage {

    //#region [Hotel Search Results Page Locator]

    private get pageHeader() { return $("//*[text()='Please enter your guest information']"); }
    private get bookingSummary() { return $("//h3[text()='Booking Summary']"); }

    //#endregion [Hotel Search Results  Locator]

    //#region [Hotel Search Results Page]

    public async verifyGuestInfoPage() {
        if (global.isMobileView) 
        {
            await (await this.bookingSummary).waitForDisplayed({ timeout: 60000, timeoutMsg: "Hotel Search Results page is not displayed after waiting 90 seconds" })
        }
        else
        await (await this.pageHeader).waitForDisplayed({ timeout: 60000, timeoutMsg: "Hotel Search Results page is not displayed after waiting 90 seconds" })
    }

    //#endregion [Home Page Method]
}
export default new GuestInformationPage;