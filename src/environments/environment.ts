export const environment = {
    production: false,
    jsonServerUrl: import.meta.env['NG_APP_DB_URL'] || 'http://localhost:3000',
    adzuna: {
        appId: import.meta.env['NG_APP_APP_ID'] || '',
        appKey: import.meta.env['NG_APP_APP_KEY'] || '',
        apiUrl: import.meta.env['NG_APP_API_URL'] || 'https://api.adzuna.com/v1/api'
    }
};