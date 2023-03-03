import {AddPlaceEntity} from "../types";
import {ValidationError} from "../utils/errors";

interface AddNewPlaceEntity extends Omit<AddPlaceEntity, "id"> {
    id?: string;
}

export class AddPlaceRecord implements AddPlaceEntity {
    id: string;
    name: string;
    currency: string;
    createdAt: string;

    constructor(obj: AddNewPlaceEntity) {
        const {id, name, currency, createdAt} = obj;
        if (!name || name === '') {
            throw new ValidationError('Wpisz nazwę miejsca, które chcesz dodać.')
        }
        if (!currency || currency === '') {
            throw new ValidationError('Wybierz walutę, która obowiązuje w wybranym miejscu.')
        }
        if (!createdAt || createdAt === '') {
            throw new ValidationError('Wybierz datę, od kiedy jesteś w tym miejscu.')
        }
        this.id = id;
        this.name = name;
        this.currency = currency;
        this.createdAt = createdAt;

    }
}
