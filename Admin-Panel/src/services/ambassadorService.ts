// ============ TYPES & INTERFACES ============
export interface Ambassador {
    id: number;
    userId: number;
    user?: {
        id: number;
        firstName: string;
        lastName: string;
        mobile: string;
        email?: string;
    };
    country: string;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
    languages: { [key: string]: number };
    services: string[];
    bio: string;
    videoSelfieUrl?: string;
    documents?: Array<{
        type: string;
        url: string;
        fileName: string;
        fileSize: number;
    }>;
    agreementAccepted: boolean;
    currentStep: number;
    registrationStatus: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    adminNotes?: string;
    reviewedAt?: string;
    reviewedBy?: number;
    rating?: number;
    totalCompletedServices?: number;
    totalEarnings?: number;
    responseRate?: number;
    avgResponseTime?: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AmbassadorRequest {
    id: number;
    ambassador: Ambassador;
    status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
    adminNotes?: string;
    reviewedBy?: number;
    reviewedAt?: string;
    createdAt: string;
}

export interface AmbassadorStats {
    totalAmbassadors: number;
    activeAmbassadors: number;
    pendingRequests: number;
    totalEarnings: number;
    totalCompletedServices: number;
    avgRating: number;
    monthlyGrowth: number;
}

export interface AmbassadorAnalytics {
    registrationsByDate: Array<{ date: string; count: number }>;
    servicesByType: Array<{ service: string; count: number }>;
    earningsByMonth: Array<{ month: string; amount: number }>;
    topAmbassadors: Array<{
        id: number;
        name: string;
        completedServices: number;
        earnings: number;
        rating: number;
    }>;
}

export interface AmbassadorMessage {
    id?: number;
    ambassadorIds: number[];
    subject: string;
    message: string;
    sendViaSMS: boolean;
    sendViaEmail: boolean;
    sendViaNotification: boolean;
    scheduledAt?: string;
    sentAt?: string;
    status?: 'DRAFT' | 'SCHEDULED' | 'SENT' | 'FAILED';
}

// ============ API CONFIG ============
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const AMBASSADOR_API = `${API_BASE_URL}/admin/ambassadors`;

// ============ HELPER FUNCTIONS ============
const getAuthHeaders = () => {
    // فرض می‌کنیم توکن در localStorage با کلید 'token' ذخیره می‌شود
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }

    return response.text();
};

// ============ AMBASSADOR SERVICE ============
export const ambassadorService = {
    // ============ BASIC CRUD OPERATIONS ============

    // دریافت لیست سفیران با فیلتر و صفحه‌بندی
    getAmbassadors: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        country?: string;
        city?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        try {
            const queryParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, String(value));
                    }
                });
            }

            const url = `${AMBASSADOR_API}${queryParams.toString() ? `?${queryParams}` : ''}`;
            const response = await fetch(url, {
                headers: getAuthHeaders(),
            });

            const data = await handleResponse(response);
            return {
                data: data.data || [],
                total: data.total || 0,
                page: data.page || 1,
                limit: data.limit || 10,
            };
        } catch (error) {
            console.error('Error fetching ambassadors:', error);
            throw error;
        }
    },

    // دریافت اطلاعات یک سفیر
    getAmbassadorById: async (id: number) => {
        try {
            const response = await fetch(`${AMBASSADOR_API}/${id}`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            console.error(`Error fetching ambassador ${id}:`, error);
            throw error;
        }
    },

    // به‌روزرسانی اطلاعات سفیر
    updateAmbassador: async (id: number, data: Partial<Ambassador>) => {
        try {
            const response = await fetch(`${AMBASSADOR_API}/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error) {
            console.error(`Error updating ambassador ${id}:`, error);
            throw error;
        }
    },

    // حذف سفیر (غیرفعال کردن)
    deleteAmbassador: async (id: number) => {
        try {
            const response = await fetch(`${AMBASSADOR_API}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            console.error(`Error deleting ambassador ${id}:`, error);
            throw error;
        }
    },

    // ============ REQUEST MANAGEMENT ============

    // دریافت درخواست‌های ثبت‌نام جدید
    getPendingRequests: async (params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        try {
            const queryParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, String(value));
                    }
                });
            }

            const url = `${AMBASSADOR_API}/requests/pending${queryParams.toString() ? `?${queryParams}` : ''}`;
            const response = await fetch(url, {
                headers: getAuthHeaders(),
            });

            const data = await handleResponse(response);
            return {
                data: data.data || [],
                total: data.total || 0,
            };
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            throw error;
        }
    },

    // تایید یا رد درخواست سفیر
    reviewRequest: async (requestId: number, data: {
        status: 'APPROVED' | 'REJECTED';
        adminNotes?: string;
        sendNotification?: boolean;
    }) => {
        try {
            const response = await fetch(
                `${AMBASSADOR_API}/requests/${requestId}/review`,
                {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(data),
                }
            );
            return handleResponse(response);
        } catch (error) {
            console.error(`Error reviewing request ${requestId}:`, error);
            throw error;
        }
    },

    // ============ ANALYTICS & STATS ============

    // دریافت آمار کلی سفیران
    getStats: async () => {
        try {
            const response = await fetch(`${AMBASSADOR_API}/stats`, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response) as Promise<AmbassadorStats>;
        } catch (error) {
            console.error('Error fetching ambassador stats:', error);
            throw error;
        }
    },

    // دریافت گزارشات تحلیلی
    getAnalytics: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') => {
        try {
            const url = `${AMBASSADOR_API}/analytics?period=${period}`;
            const response = await fetch(url, {
                headers: getAuthHeaders(),
            });
            return handleResponse(response) as Promise<AmbassadorAnalytics>;
        } catch (error) {
            console.error('Error fetching ambassador analytics:', error);
            throw error;
        }
    },

    // ============ MESSAGING ============

    // ارسال پیام به سفیران
    sendMessage: async (messageData: AmbassadorMessage) => {
        try {
            const response = await fetch(
                `${AMBASSADOR_API}/messages/send`,
                {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(messageData),
                }
            );
            return handleResponse(response);
        } catch (error) {
            console.error('Error sending message to ambassadors:', error);
            throw error;
        }
    },

    // دریافت تاریخچه پیام‌ها
    getMessageHistory: async (params?: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
    }) => {
        try {
            const queryParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, String(value));
                    }
                });
            }

            const url = `${AMBASSADOR_API}/messages${queryParams.toString() ? `?${queryParams}` : ''}`;
            const response = await fetch(url, {
                headers: getAuthHeaders(),
            });

            const data = await handleResponse(response);
            return {
                data: data.data || [],
                total: data.total || 0,
            };
        } catch (error) {
            console.error('Error fetching message history:', error);
            throw error;
        }
    },

    // ============ EXPORT FUNCTIONS ============

    // خروجی اکسل از لیست سفیران
    exportToExcel: async (params?: {
        startDate?: string;
        endDate?: string;
        status?: string;
    }) => {
        try {
            const queryParams = new URLSearchParams();
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, String(value));
                    }
                });
            }

            const url = `${AMBASSADOR_API}/export/excel${queryParams.toString() ? `?${queryParams}` : ''}`;
            const response = await fetch(url, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error('Error exporting ambassadors to Excel:', error);
            throw error;
        }
    },
};

export default ambassadorService;