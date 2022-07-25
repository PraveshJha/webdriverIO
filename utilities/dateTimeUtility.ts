const moment = require('moment');
export class DateTimeUtility {

    //#region [Generic Method]

    async addOrSubtractDaysToCurrentDate(addorSubtractDays=0, dateFormat="DD-MMM-yyyy") {
        const presentDate = await new Date();
        var returnDate= await moment(presentDate).add(Number(addorSubtractDays), 'days');
        return await moment(returnDate).format(dateFormat);
    }

    async getDateDifference(datesource1,dateSource2,differenceinDayMonthYear:string,dateFormatsource1="DD-MMM-yyyy",dateFormatsource2="DD-MMM-yyyy") {
        var startDate = await moment(datesource1, dateFormatsource1);
        var endDate = await moment(dateSource2, dateFormatsource2);
        switch(differenceinDayMonthYear.toLocaleLowerCase())
        {
            case "month":
            case "months":
            return await endDate.diff(startDate, 'months',true);
            case "day":
            case "days":
            return await endDate.diff(startDate, 'days',true);
            case "year":
            case "years":
            return await endDate.diff(startDate, 'years',true);
            default:
                return null;
        }
    }

    async getDateFormatFromGivenDate(givenDate,givenDateFormat ="DD-MMM-yyyy",dateFormat="DD-MMM-yyyy")
    {
        var dateValue=await moment(givenDate, givenDateFormat).format(dateFormat);
        return dateValue;
    }

    //#endregion [Generic Method]
}
export default new DateTimeUtility;

