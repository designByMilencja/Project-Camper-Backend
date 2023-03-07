export interface AddPlaceEntity {
    id: string;
    name: string;
    currency: string;
}
export interface AddNewPlaceEntity extends Omit<AddPlaceEntity, "id"> {
    id?: string;
}
