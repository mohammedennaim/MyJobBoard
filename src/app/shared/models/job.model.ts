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
    salary_min?: number;
    salary_max?: number;
}

export interface AdzunaResponse {
    results: Job[];
    mean?: number;
    count?: number;
    __class__?: string;
}
