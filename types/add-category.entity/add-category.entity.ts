export interface AddCategoryEntity {
    id:string;
    name:string;
}
export interface AddNewCategoryEntity extends Omit<AddCategoryEntity, "id"> {
    id?: string;
}
