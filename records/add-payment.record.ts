import {AddNewPaymentEntity, AddPaymentEntity} from "../types";
import {ValidationError} from "../utils/errors";

export class AddPaymentRecord implements AddPaymentEntity {
    id: string;
    cost: number;
    currency: string;
    boughtAt: string;
    idCategory: string;
    idPlace: string;

    constructor(obj: AddNewPaymentEntity) {
        const {cost, currency, boughtAt, idCategory, idPlace} = obj;
        if (!cost || cost === 0) {
            throw new ValidationError('Musisz podać koszt , aby dodać Twoją płatność')
        }
        if (!currency || currency === '') {
            throw new ValidationError('Wybierz walutę, w której została dokonana płatność.')
        }
        if (!boughtAt || boughtAt === '') {
            throw new ValidationError('Musisz wybrać datę płatności, by dokończyć proces dodawania.')
        }
        if (!idCategory || idCategory === '') {
            throw new ValidationError('Musisz wybrać nazwę kategorii Twojej płatności')
        }
        if (!idPlace || idPlace === '') {
            throw new ValidationError('Musisz wybrać miejsce, w zrealizowania płatności')
        }
    }

}
