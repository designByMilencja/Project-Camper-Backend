export interface AddPlaceEntity {
    id: string;
    name: string;
    currency: string;
    addedAt: string;
    sumPayments: number;
}
export interface AddNewPlaceEntity extends Omit<AddPlaceEntity, "id"> {
    id?: string;
}
