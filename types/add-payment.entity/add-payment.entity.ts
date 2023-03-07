export interface AddPaymentEntity {
    id:string;
    cost: number;
    currency: string;
    boughtAt: string;
    idPlace: string;
    idCategory: string;
}
export interface AddNewPaymentEntity extends Omit<AddPaymentEntity, "id"> {
    id?: string;
}
