import BasePage from './basePage';

class HotelSearchResultsPage extends BasePage {

    //#region [Hotel Search Results Page Locator]

    private get viewMoreButton() { return $("(//article)[1]//span[contains(text(),'View More')]"); }


    //#endregion [Hotel Search Results  Locator]

    //#region [Hotel Search Results Page]

    public async verifyHotelSearchResultsPage() {

        await (await this.viewMoreButton).waitForDisplayed({ timeout: 90000, timeoutMsg: "Hotel Search Results page is not displayed after waiting 90 seconds" })
        await browser.pause(3000);
    }

    public async selectHotel() {
        await browser.pause(3000);
        await (await this.viewMoreButton).scrollIntoView();
        await (await this.viewMoreButton).click();
    }

    //#endregion [Home Page Method]
}
export default new HotelSearchResultsPage;