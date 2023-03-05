import {AddNewPaymentEntity, AddPaymentEntity} from "../types";
import {ValidationError} from "../utils/errors";

export class AddPaymentRecord implements AddPaymentEntity {
    id: string;
    cost: number;
    boughtAt: string;
    catSymbol: string;

    constructor(obj: AddNewPaymentEntity) {
        const { cost, boughtAt, catSymbol} = obj;
        if (!catSymbol || catSymbol === '') {
            throw new ValidationError('Musisz wybrać nazwę kategorii Twojej płatności')
        }
        if (!cost || cost === 0) {
            throw new ValidationError('Musisz podać koszt , aby dodać Twoją płatność')
        }
        if (!boughtAt || boughtAt === '') {
            throw new ValidationError('Musisz wybrać datę płatności, by dokończyć proces dodawania.')
        }
    }

}
