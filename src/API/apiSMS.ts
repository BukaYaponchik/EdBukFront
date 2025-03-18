const API_BASE = 'http://147.45.103.3:1880';

export const apiSMS = {
    async post(url: string, data: any) {
        const response = await fetch(`${API_BASE}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }
};

// Эндпоинты Node-RED
export const ENDPOINTSSMS = {
    VERIFY_CODE: '/verify-code',
    RESEND_CODE: '/resend-code'
};