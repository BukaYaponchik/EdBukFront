const API_BASE = 'http://147.45.103.3:1880';

export const api = {
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
    },

    async get(url: string, params?: Record<string, string>) {
        const query = new URLSearchParams(params).toString();
        const fullUrl = `${API_BASE}${url}${query ? `?${query}` : ''}`;

        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },
};

export const ENDPOINTS = {
    LOGIN: '/login',
    REGISTER: '/register',
    UPDATE_PROFILE: '/update-profile',
    USERS: '/users',
    COURSE: '/course',
    SECTION: '/section',
    TOPIC: '/topic',
    TOPIC_CONTENT: '/topic-content' // Добавьте этот эндпоинт
};