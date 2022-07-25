import BasePage from '../pageobjects/basePage';
class HomePage extends BasePage{

    //#region [Home Page Locator]

    private get emiratesLogo() { return $("//a[@data-id='header_logo_link']/img"); }
    private async productTabName(tabName:string) {return await $("//p[text()='"+tabName+"']");}
    private async productTabWidget(tabName:string) {return await $("//p[text()='"+tabName+"']/../../../../li[1]");}

    //#endregion [Home Page Locator]

    //#region [Home Page Method]

    public async isLogoDisplayed() {
        await (await this.emiratesLogo).waitForDisplayed({ timeout: 90000, timeoutMsg: 'Landing page is not loaded completely after waiting 90000 milliseconds' })
        return await (await this.emiratesLogo).isDisplayed();
    }

    public async selectTab(tabName: string) {
        await (await this.productTabName(tabName)).scrollIntoView();
        await (await this.productTabName(tabName)).waitForDisplayed({ timeout: 90000, timeoutMsg: 'Landing page is not loaded completely after waiting 90000 milliseconds' })
        //await (await this.productTabName(tabName)).click();
        await this.jsClick(await this.productTabName(tabName));
    }

    public async isTabSelected(tabName: string) {
        var isselectedValue= await (await this.productTabWidget(tabName)).getAttribute('aria-selected')
        return isselectedValue.includes("true");
    }

    public async navigateToHomePage() {
        await this.goToUrl('/');
    }

    //#endregion [Home Page Method]
}
export default new HomePage;