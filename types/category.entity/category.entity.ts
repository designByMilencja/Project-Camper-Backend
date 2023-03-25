export interface CategoryEntity extends AddCategoryEntity{
    insertCategory(): Promise<string>;
    deleteCategory(id:string): Promise<void>;
    updateCategory(name: string): Promise<void>;
}
export interface AddCategoryEntity {
    id?:string;
    name:string;
}
