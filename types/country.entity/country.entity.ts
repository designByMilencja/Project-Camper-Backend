export interface CountryEntity {
    id?: string;
    name: string;
    currency: string;
    deleteCountry(id:string): Promise<void>;
    updateCountry(name: string,currency:string): Promise<void>;
}
