import { faker } from '@faker-js/faker';
export class DataGeneratorUtility {

    //#region [Data Generator Method]

    async getEmail() {
        return faker.internet.email();
    }

    async getName() {
        return faker.name.findName();
    }

    async getAddress() {
        return faker.address.streetAddress;
    }

    async getPhoneNumber() {
        return faker.phone.number('99########');
    }

    //#endregion [Generic Method]
}
export default new DataGeneratorUtility;

