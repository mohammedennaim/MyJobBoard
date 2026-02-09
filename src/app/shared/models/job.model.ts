export interface Job {
    id: string;
    title: string;
    company: {
        display_name: string;
    };
    location: {
        display_name: string;
    };
    description: string;
    redirect_url: string;
    created: string;
    contract_time?: string;
    contract_type?: string;
    category: {
        label: string;
        tag: string;
    };
    salary_min?: number;
    salary_max?: number;
    latitude?: number;
    longitude?: number;
}

export interface AdzunaResponse {
    results: Job[];
    mean?: number;
    count?: number;
    __class__?: string;
}
