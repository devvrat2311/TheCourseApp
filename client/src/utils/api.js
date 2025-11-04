class ApiClient {
    constructor(baseURL = "/baseURI") {
        this.baseURL = baseURL;
        this.isRefreshing = false;
        this.failedQueue = [];
    }

    processQueue(error, token = null) {
        this.failedQueue.forEach(({ resolve, reject }) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });
    }

    async refreshAccessToken() {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await fetch(`/api/v1/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            console.log("Token refresh Failed");
            throw new Error("Token refresh Failed");
        }

        const data = await response.json();
        if (data.refreshToken !== refreshToken) {
            console.log("refresh token changed");
        } else {
            console.log("refreshToken same");
        }

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        if (localStorage.getItem("refreshToken") !== refreshToken) {
            console.log("refresh token changed");
        } else {
            console.log("refreshToken same");
        }
        return data.accessToken;
    }

    async fetch(url, options = {}) {
        // Ensure URL is properly formatted
        // const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;
        const fullUrl = url;

        // Add authorization header if token exists
        const token = localStorage.getItem("accessToken");
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        const response = await fetch(fullUrl, config);

        // If request is successful, return response
        if (response.ok) {
            return response;
        }

        // If unauthorized and we haven't tried refreshing yet
        if (response.status === 401 || response.status === 403) {
            // If already refreshing, queue this request
            if (this.isRefreshing) {
                return new Promise((resolve, reject) => {
                    this.failedQueue.push({ resolve, reject });
                }).then(() => {
                    // Retry with new token
                    const newToken = localStorage.getItem("accessToken");
                    return fetch(fullUrl, {
                        ...config,
                        headers: {
                            ...config.headers,
                            Authorization: `Bearer ${newToken}`,
                        },
                    });
                });
            }

            // Try to refresh token
            this.isRefreshing = true;

            try {
                const newToken = await this.refreshAccessToken();
                this.processQueue(null, newToken);

                // Retry original request with new token
                const retryResponse = await fetch(fullUrl, {
                    ...config,
                    headers: {
                        ...config.headers,
                        Authorization: `Bearer ${newToken}`,
                    },
                });

                return retryResponse;
            } catch (refreshError) {
                this.processQueue(refreshError, null);

                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";

                throw refreshError;
            } finally {
                this.isRefreshing = false;
            }
        }

        // For other errors, just return the response
        return response;
    }

    async get(url, options = {}) {
        return this.fetch(url, { ...options, method: "GET" });
    }

    async post(url, data, options = {}) {
        return this.fetch(url, {
            ...options,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put(url, data, options = {}) {
        return this.fetch(url, {
            ...options,
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete(url, options = {}) {
        return this.fetch(url, { ...options, method: "DELETE" });
    }

    async patch(url, data, options = {}) {
        return this.fetch(url, {
            ...options,
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}

// Create and export a singleton instance
const api = new ApiClient();
export default api;
