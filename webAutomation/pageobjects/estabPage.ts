import BasePage from './basePage';
import {HomePageData} from '../dataModal/homePageData';
class EstabPage extends BasePage {

    //#region [Hotel Search Results Page Locator]

    private get chooseRoom() {
        return $("//button/span[contains(text(),'Confirm Room') or contains(text(),'Choose Room') or contains(text(),'Select Room') or contains(text(),'Confirm and Continue To Book')]");
    }
    private get confirmAndContinueToBook() { return $("//button/span[contains(text(),'Confirm Room') or contains(text(),'Select Room') or contains(text(),'Choose Room') or contains(text(),'Continue')]"); }
    private async listOfAllBoardOptions() {
        return await $$("//p[contains(@data-id,'_board_') and contains(@data-id,'_desc')]");
    }
    private boardTypeOnMobile(index) { return $("(//article[@class='sc-c-card'])["+index+"]"); }

    //#endregion [Hotel Search Results  Locator]

    //#region [Hotel Search Results Page]

    public async verifyHotelEstabPage() {

        await (await this.chooseRoom).waitForDisplayed({ timeout: 60000, timeoutMsg: "Hotel Search Results page is not displayed after waiting 90 seconds" })
    }

    async selectAllRooms() {
        await (await this.chooseRoom).click();
         var totalRooms = HomePageData.TotalRooms;
        for (let roomNumber = 0; roomNumber < totalRooms; roomNumber++) {
            await browser.pause(2000);
            if (global.isMobileView) {
                await this.selectBoardTypeOptionByIndex(1);
                await this.selectRoomAndConfirmToBook();
            }
            else{
            await this.selectRoomButton();
            }
        }
    }

    async selectRoomButton() {
        await (await this.chooseRoom).waitForDisplayed();
        await (await this.chooseRoom).scrollIntoView();
        await (await this.chooseRoom).click();
    }

    async selectRoomAndConfirmToBook() {
        await (await this.confirmAndContinueToBook).scrollIntoView();
        await (await this.confirmAndContinueToBook).click();
    }

    async selectBoardTypeOptionByIndex(index: number = 0) {
        if (global.isMobileView) {
            await (await this.boardTypeOnMobile(index)).waitForDisplayed();
            await this.boardTypeOnMobile(index).scrollIntoView();
            await this.jsClick(await this.boardTypeOnMobile(index));
        }
        else {
            var boardOptionToSelect = (await this.listOfAllBoardOptions())[index];
            await boardOptionToSelect.scrollIntoView();
            await this.jsClick(boardOptionToSelect);
        }
    }

    //#endregion [Home Page Method]
}
export default new EstabPage;