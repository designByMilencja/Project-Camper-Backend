import {AddPaymentEntity} from "../types";
import {ValidationError} from "../utils/errors";

interface AddNewPaymentEntity extends Omit<AddPaymentEntity, "id"> {
    id?: string;
}

export class AddPaymentRecord implements AddPaymentEntity {
    id: string;
    name: string;
    cost: number;
    createdAt: string;

    constructor(obj: AddNewPaymentEntity) {
        const {id, name, cost, createdAt} = obj;
        if (!name || name==='') {
            throw new ValidationError('Musisz wybrać nazwę kategorii Twojej płatności')
        }
        if (!cost || cost === 0) {
            throw new ValidationError('Musisz podać koszt , aby dodać Twoją płatność')
        }
        if (!createdAt || createdAt === '') {
            throw new ValidationError('Musisz wybrać datę płatności, by dokończyć proces dodawania.')
        }
        this.id = id;
        this.name = name;
        this.cost = cost;
        this.createdAt = createdAt;
    }
}
