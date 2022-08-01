export class CommonFunctions {

    async getRandomNumber(min:number, max:Number){
        return Math.floor(Math.random() * (Number(max) - Number(min) + 1) + min);
    }
    
    async getNumberFromString(input:string)
    {
        return Number(input.toString().replace(/[^0-9.]+/gi, ""));
    }

}
export default new CommonFunctions;





