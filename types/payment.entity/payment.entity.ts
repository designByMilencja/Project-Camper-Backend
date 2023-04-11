export interface PaymentEntity {
    id?: string;
    cost: number;
    currency: string;
    boughtAt: string;
    idCountry: string;
    idCategory: string;
    sumOneCategory?: number;
    sumOneCategoryInOneCountry?: number;
    sumAllCategoriesInOneCountry?: number;
    sumOneCategoryInOneMonth?: number;
    sumAllCategoriesInOneMonth?: number;
    sumInYear?: number;
}
