export interface Favorite {
    id?: number;
    userId: number;
    offerId: string;
    title: string;
    company: string;
    location: string;
    url: string;
    dateAdded: string;
    description?: string;
    contract_time?: string;
    contract_type?: string;
    salary_min?: number;
    salary_max?: number;
}
