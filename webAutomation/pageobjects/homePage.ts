import BasePage from '../pageobjects/basePage';
import DateTimeUtility from '../../utilities/dateTimeUtility'
import { HomePageData } from '../dataModal/homePageData';
import { isGetAccessor } from 'typescript';
class HomePage extends BasePage {

    //#region [Home Page Locator]

    private get crossIcon() { return $("//div[contains(@class,'dialog')]//button[@aria-label='Close']"); }
    private get searchButton() { return $("//button/span[text()='Search']"); }
    private async productTabName(tabName: string) {
        return await $("//*[@role='tablist']//*[contains(text(),'" + tabName + "')]");
    }
    private get textboxDestinationForMobile() { return $("//input[@id='destination-autocompleter-field']"); }
    private get textboxDestination() { return $('#destination-autocompleter-field'); }
    private get labelDestination() { return $("//button[text()='Add a destination']"); }
    private async resultDestinationAutoCompleter(searchResult: string) {
        return await $("//ul[@id='destination-autocompleter-list']/li/ul/li[1]//*[contains(text(),'" + searchResult + "')]");
    }
    private get headerDestinationAutoCompleter() { return $("//span[contains(text(),'Destination or hotel')]"); }
    private get buttonAddDates() { return $("//button[text()='Add dates']"); }
    private get calenderDefaultMonth() { return $("//div[@class='DayPicker-Months']/div[1]/div[@class='DayPicker-Caption']"); }
    private get previousMonth() { return $("//div[@class='DayPicker-wrapper']/button[1]"); }
    private get nextMonth() { return $("//div[@class='DayPicker-wrapper']/button[2]"); }
    private get calenderForm() { return $("//div[@class='DayPicker-Months']"); }
    private async calenderDay(areaLabelValue: string) {
        return await $("//div[@aria-label='" + areaLabelValue + "']");

    }
    private get buttonDone() { return $("//span[text()='Done']/.."); }
    private get popupRoomandGuest() { return $("//*[text()='Rooms & guests']"); }
    private async childAgeInputAlertButton(age: string) {
        return await $("//label[@for='age-toggle-" + age + "']");
    }
    private get childAgeInputAlert() { return $("//*[text()='Age of child at time of return']"); }

    private async childInput(roomNumber: string, childNumber: string) {
        if (Number(roomNumber) === 1) {
            if (Number(childNumber) == 1) {
                return await $("//*[text()='Child']/..//input");
            }
            else
                return await $("//*[text()='" + childNumber + "' and text()='Child']/..//input");
        }
        else {
            if (Number(childNumber) == 1) {
                return await $("//span[text()='Room " + roomNumber + "']/../../..//*[text()='Child']/..//input");
            }
            else
                return await $("//span[text()='Room " + roomNumber + "']/../../..//*[text()='" + childNumber + "' and text()='Child']/..//input");
        }
    }
    private async plusIconAdultField(roomNumber: string) {
        if (Number(roomNumber) === 1) {
            return await $("//button[@aria-label='Increase' and @aria-controls='adults-picker']");
        }
        else
            return await $("//span[text()='Room " + roomNumber + "']/../..//button[@aria-label='Increase' and @aria-controls='adults-picker']");
    }
    private async plusIconChildrenField(roomNumber: string) {
        if (Number(roomNumber) === 1) {
            return await $("//button[@aria-label='Increase' and @aria-controls='children-picker']");
        }
        else
            return await $("//span[text()='Room " + roomNumber + "']/../..//button[@aria-label='Increase' and @aria-controls='children-picker']");
    }

    private async minusIconAdultField(roomNumber: string) {
        if (Number(roomNumber) === 1) {
            return await $("//button[@aria-label='Decrease' and @aria-controls='adults-picker']");
        }
        else
            return await $("//span[text()='Room " + roomNumber + "']/../..//button[@aria-label='Decrease' and @aria-controls='adults-picker']");
    }
    private async minusIconChildrenField(roomNumber: string) {
        if (Number(roomNumber) === 1) {
            return await $("//button[@aria-label='Decrease' and @aria-controls='children-picker']");
        }
        else {
            return await $("//span[text()='Room " + roomNumber + "']/../..//button[@aria-label='Decrease' and @aria-controls='children-picker']");
        }

    }

    private async inputChildrenField(roomNumber: string) {
        if (Number(roomNumber) === 1) {
            return await $("//input[@id='children-picker']");
        }
        else
            return await $("//span[text()='Room " + roomNumber + "']/../..//input[@id='children-picker']");
    }

    private async inputAdultField(roomNumber: string) {
        if (Number(roomNumber) === 1) {
            return await $("//input[@id='adults-picker']");
        }
        else
            return await $("//span[text()='Room " + roomNumber + "']/../..//input[@id='adults-picker']");
    }

    private async inputRoomSelection(roomCount: string) {
        return await $("//input[@id='room-toggle-" + roomCount + "']");
    }

    private get buttonGuests() { return $("//*[text()='Guests']/..//button"); }

    //#endregion [Home Page Locator]

    //#region [Home Page Method]

    public async selectTab(tabName: string) {
        await (await this.searchButton).scrollIntoView();
        await (await this.searchButton).waitForDisplayed({ timeout: 60000, timeoutMsg: "Landing page is not loaded completely after waiting  milliseconds" })
        await (await this.productTabName(tabName)).click();
        await browser.pause(2000);
    }

    public async navigateToHomePage() {
        await this.goToUrl('/');
    }

    async selectDestination(destination: string) {
        await this.populateDestination(destination);
        await this.verifyResultsInDestinationAutoCompleter(destination);
        await this.selectDestinationFromAutoCompleter(destination);
        HomePageData.Destination = destination;
    }

    async populateDestination(destination: string) {
        await this.openDestinationAutoCompleter();
        if (await global.isMobileView) {
            await this.jsClear(await this.textboxDestinationForMobile);
            await this.textboxDestinationForMobile.setValue(destination);
        }
        else {
            await browser.pause(500);
            await this.jsClear(await this.textboxDestination);
            await this.textboxDestination.setValue(destination);
            await browser.pause(1000);
        }
    }

    async verifyResultsInDestinationAutoCompleter(searchResult: string) {
        await (await this.resultDestinationAutoCompleter(searchResult)).waitForDisplayed({ timeout: 30000 })
    }

    async selectDestinationFromAutoCompleter(searchResult: string) {
        await (await this.resultDestinationAutoCompleter(searchResult)).click();
    }

    async openDestinationAutoCompleter() {
        if (!await (this.headerDestinationAutoCompleter).isDisplayed()) {
            await (await this.labelDestination).click();
            await browser.pause(1000);
        }
    }

    async populateDate(checkinDaysFromToday: number = 60, durationOfStay: number = 5) {
        var checkinDate = await DateTimeUtility.addOrSubtractDaysToCurrentDate(Number(checkinDaysFromToday));
        var checkOutDate = await DateTimeUtility.addOrSubtractDaysToCurrentDate(Number(checkinDaysFromToday) + Number(durationOfStay));
        HomePageData.CheckinDate = checkinDate;
        HomePageData.CheckoutDate = checkOutDate;
        await this.selectDate(checkinDate);
        await this.selectDate(checkOutDate);
        if (global.isMobileView) {
            await this.closeDialog();
        }
    }

    async selectDate(date: string) {
        await this.openCalenderForm()
        await this.selectMonthFromCalender(date);
        var dateLevel = await DateTimeUtility.getDateFormatFromGivenDate(date, "DD-MMM-yyyy", "ddd MMM DD, yyyy");
        if (global.isMobileView) {
            await (await this.calenderDay(dateLevel)).scrollIntoView();
        }
        await (await this.calenderDay(dateLevel)).click();
    }

    async openCalenderForm() {
        var calenderFormOpen = await (await this.calenderForm).isDisplayed();
        if (!calenderFormOpen) {
            await this.buttonAddDates.click();
            await (await this.calenderForm).waitForDisplayed();
            return this;
        }
        return true;
    }

    async selectMonthFromCalender(date: string) {
        await (await this.calenderDefaultMonth).waitForDisplayed();
        var presentDate = await (await this.calenderDefaultMonth).getText();
        presentDate = await DateTimeUtility.getDateFormatFromGivenDate(presentDate, "MMMM yyyy", "DD-MMM-yyyy");
        var monthDifference = await DateTimeUtility.getDateDifference(presentDate, date, "month");
        if (!global.isMobileView) {
            if (monthDifference > 1) {
                for (let i = 0; i < Math.round(Number(monthDifference) - 1); i++) {
                    await (await this.nextMonth).click();
                }
            }
            if (monthDifference < 0) {
                for (let i = 0; i < Math.round(Math.abs(Number(monthDifference))); i++) {
                    await (await this.previousMonth).click();
                }
            }
        }
    }

    async selectRoomAndGuests(gestInfo: any) {
        try {
            gestInfo = JSON.parse(gestInfo);
        }
        catch (error) { }
        await this.openRoomsAndGuestsModal();
        var totalRooms = await gestInfo.length;
        HomePageData.TotalRooms = totalRooms;
        HomePageData.RoomAndGuestInformation = gestInfo;
        var childInfo: any;
        var totalAdult = 0;
        var totalChild = 0;
        var totalInfant = 0;
        await this.selectRoom(totalRooms);
        for (let i = 1; i <= totalRooms; i++) {
            var AdulutCountRoomWise = await gestInfo[Number(i) - 1]["Adult"];
            if (AdulutCountRoomWise === undefined) {
                AdulutCountRoomWise = await gestInfo[Number(i) - 1]["Adults"];
            }
            totalAdult = Number(totalAdult) + Number(AdulutCountRoomWise);
            await this.selectAdult(i, AdulutCountRoomWise);
            //@ total child count
            childInfo = await gestInfo[Number(i) - 1]["Child"];
            try {
                totalChild = Number(totalChild) + Number(childInfo.length);
                await this.selectChildren(i, childInfo.length);
                for (let j = 1; j <= childInfo.length; j++) {
                    await this.selectChildAge(i.toString(), j.toString(), childInfo[Number(j - 1)]);
                    if (childInfo[Number(j - 1)] < 2) {
                        totalInfant = totalInfant + 1;
                    }
                }
            }
            catch (error) { }

        }
        await this.clickDoneButton();
    }

    async openRoomsAndGuestsModal() {
        var itemOpenCheck = await (await this.popupRoomandGuest).isDisplayed();
        if (!itemOpenCheck) {
            await this.jsClick(await this.buttonGuests);
            await (await this.popupRoomandGuest).waitForDisplayed({ timeout: 30000 });
        }
    }

    async selectRoom(roomCount: string) {
        (await this.jsClick(await this.inputRoomSelection(roomCount)))
    }

    async selectAdult(roomNumber, AdultCount) {
        await (await this.inputAdultField(roomNumber)).scrollIntoView();
        var selectAdult = await (await this.inputAdultField(roomNumber)).getValue();
        if (selectAdult === AdultCount) {
            return true;
        }
        var diff = Number(AdultCount) - Number(selectAdult);
        if (diff > 0) {
            for (let i = 0; i < Math.round(Number(diff)); i++) {
                await (await this.plusIconAdultField(roomNumber)).click();
                await this.waitForPageLoad();
            }
        }
        if (diff < 0) {
            for (let i = 0; i < Math.round(Math.abs(Number(diff))); i++) {
                await (await this.minusIconAdultField(roomNumber)).click();
                await this.waitForPageLoad();
            }
        }
    }

    async selectChildren(roomNumber, ChildrenCount) {
        var selectedChildren = await (await this.inputChildrenField(roomNumber)).getValue();
        if (selectedChildren === ChildrenCount) {
            return true;
        }
        var diff = Number(ChildrenCount) - Number(selectedChildren);
        if (diff > 0) {
            for (let i = 0; i < Number(diff); i++) {
                await (await this.plusIconChildrenField(roomNumber)).click();
                await this.waitForPageLoad();
            }
        }
        else {
            for (let i = 0; i < Math.abs(Number(diff)); i++) {
                await (await this.minusIconChildrenField(roomNumber)).click();
                await this.waitForPageLoad();
            }
        }

    }

    async selectChildAge(roomNumber: string, childNumber: string, Age: string) {

        var selectedChildAge = await (await this.childInput(await roomNumber, await childNumber)).getValue();
        if (Number(selectedChildAge) === Number(Age)) {
            return true;
        }
        await (await this.childInput(roomNumber, await childNumber)).click();
        await (await this.childAgeInputAlert).waitForDisplayed();
        await this.jsClick(await this.childAgeInputAlertButton(Age));
        //await (await this.childAgeInputAlertButton(await Age)).click();
        await this.waitForPageLoad();

    }

    async clickDoneButton() {
        await (await this.buttonDone).click();
        await (await this.popupRoomandGuest).waitForDisplayed({ reverse: true });
    }

    async clickonSearchButton() {
        await (await this.searchButton).waitForClickable({ timeoutMsg: "Seach button is not clickable" });
        await (await this.searchButton).click();
    }

    async closeDialog() {
        var isdialoagOpen = await (await this.crossIcon).isDisplayed();
        if (isdialoagOpen) {
            await (await this.crossIcon).click();
        }
    }

    //#endregion [Home Page Method]
}
export default new HomePage;