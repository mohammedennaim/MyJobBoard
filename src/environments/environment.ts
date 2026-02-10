export const environment = {
    production: false,
    jsonServerUrl: 'http://localhost:3000',
    adzuna: {
        appId: import.meta.env['NG_APP_APP_ID'],
        appKey: import.meta.env['NG_APP_APP_KEY'],
        apiUrl: import.meta.env['NG_APP_API_URL']
    }
};