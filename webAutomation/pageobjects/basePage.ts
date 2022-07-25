export default class BasePage {

    //#region  [Getter/Setters]

    //#region [Common elelement Property)]

    private get acceptCookiesButton() { return $("//button[text()='Accept']"); }


    //#endregion

    //#endregion

    //region [Common Page level Method]


    async goToUrl(url:string) {
        await browser.url(url);
        await browser.maximizeWindow();
        await this.waitForPageLoad();
        await this.acceptCookies();
    }

    async waitForPageLoad(timeoutToWait: number = 60000) {
        await browser.waitUntil(
            async () => (await this.getBrowserState()) === 'complete',
            {
                timeout: timeoutToWait,
                timeoutMsg: 'browser page is not loaded completeley after ' + timeoutToWait + ' milliseconds'
            }
        );
    }

    private async getBrowserState() {
        browser.pause(100);
        return await browser.execute("return document.readyState");
    }

    async acceptCookies() {
        try {
            await (await this.acceptCookiesButton).click();
        }
        catch (error) { }
    }

    async jsClick(element:any) {
        await browser.execute("arguments[0].click();", await element);
    }

    async jsClear(element:any) {
        await browser.execute("arguments[0].value='';", await element);
    }

    async getActiveElelemnt() {
        return await browser.getActiveElement();
    }

}
