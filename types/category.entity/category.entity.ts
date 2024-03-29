export interface CategoryEntity {
    id?:string;
    name:string;
    insertCategory?(): Promise<string>;
    deleteCategory?(id:string): Promise<void>;
    updateCategory?(name: string, userId:string): Promise<void>;
}

