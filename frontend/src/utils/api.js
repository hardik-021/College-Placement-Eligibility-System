const BASE_URL = 'http://127.0.0.1:8000';
const API_URL = `${BASE_URL}/api`;

const ensureTrailingSlash = (url) => {
    const parts = url.split('?');
    let path = parts[0];
    const query = parts[1] ? `?${parts[1]}` : '';
    
    if (!path.endsWith('/')) {
        path += '/';
    }
    return `${path}${query}`;
};

const getAuthHeaders = (isMultipart = false) => {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const api = {
    baseUrl: BASE_URL,
    
    async get(endpoint) {
        const url = ensureTrailingSlash(endpoint);
        const response = await fetch(`${API_URL}${url}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || errData.detail || 'Something went wrong');
        }
        return response.json();
    },

    async post(endpoint, data, isMultipart = false) {
        const url = ensureTrailingSlash(endpoint);
        const headers = getAuthHeaders(isMultipart);
        const body = isMultipart ? data : JSON.stringify(data);
        
        const response = await fetch(`${API_URL}${url}`, {
            method: 'POST',
            headers,
            body
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || errData.detail || 'Operation failed');
        }
        return response.json();
    },

    async put(endpoint, data, isMultipart = false) {
        const url = ensureTrailingSlash(endpoint);
        const headers = getAuthHeaders(isMultipart);
        const body = isMultipart ? data : JSON.stringify(data);

        const response = await fetch(`${API_URL}${url}`, {
            method: 'PUT',
            headers,
            body
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || errData.detail || 'Update failed');
        }
        return response.json();
    },

    async patch(endpoint, data, isMultipart = false) {
        const url = ensureTrailingSlash(endpoint);
        const headers = getAuthHeaders(isMultipart);
        const body = isMultipart ? data : JSON.stringify(data);

        const response = await fetch(`${API_URL}${url}`, {
            method: 'PATCH',
            headers,
            body
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || errData.detail || 'Update failed');
        }
        return response.json();
    },

    async delete(endpoint) {
        const url = ensureTrailingSlash(endpoint);
        const response = await fetch(`${API_URL}${url}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || errData.detail || 'Deletion failed');
        }
        return true;
    }
};
