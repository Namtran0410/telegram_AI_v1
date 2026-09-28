import { faker } from '@faker-js/faker'
import { dataGenerationType } from 'src/types/session.type.js'
export class DataGeneration {
    generateData(type: dataGenerationType, length: number): string{
        let data
        switch(type) {
            case ('number'):
                data = String(faker.number.int(length))
                break
            case('string'):
                data= faker.string.alpha(length)
                break;
            case('strAndNum'):
                data= faker.string.alphanumeric(length)
                break;
            case('uuid'):
                data= faker.string.uuid()
                break
        }
        return data
    }
}
export default new DataGeneration()