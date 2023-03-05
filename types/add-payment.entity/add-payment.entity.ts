export interface AddPaymentEntity {
    id:string;
    cost: number;
    boughtAt: string;
    catSymbol:string;
}
export interface AddNewPaymentEntity extends Omit<AddPaymentEntity, "id"> {
    id?: string;
}
