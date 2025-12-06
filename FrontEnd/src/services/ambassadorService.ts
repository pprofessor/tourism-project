import { API_BASE_URL } from "../utils/constants";
export interface Ambassador {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  city: string;
  country: string;
  languages: string[];
  services: string[];
  hourlyRate: number;
  rating: number;
  completedTasks: number;
  isAvailable: boolean;
  bio: string;
  certificates: string[];
  profileImage: string | null;
  whatsappNumber: string | null;
  telegramUsername: string | null;
  isVerified: boolean;
  responseTime: number | null;
  createdAt: string;
  updatedAt: string;
  commissionRates?: Record<string, number>;
  specialties?: string[];
}

export interface AmbassadorRequest {
  id: number;
  tourist: {
    id: number;
    firstName: string;
    lastName: string;
  };
  ambassador: Ambassador;
  serviceType: string;
  startTime: string;
  endTime: string;
  notes: string;
  status:
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "DISPUTED";
  totalPrice: number;
  depositPaid: boolean;
  fullPaymentPaid: boolean;
  touristRating: number | null;
  touristReview: string | null;
  ambassadorRating: number | null;
  ambassadorReview: string | null;
  chatThreadId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  city?: string;
  country?: string;
  minRate?: number;
  maxRate?: number;
  minRating?: number;
  services?: string[];
  languages?: string[];
}

class AmbassadorService {
  private baseUrl = `${API_BASE_URL}/ambassadors`;

  // دریافت لیست سفیران با فیلتر
  async getAmbassadors(params: SearchParams = {}): Promise<Ambassador[]> {
    const queryParams = new URLSearchParams();

    if (params.city) queryParams.append("city", params.city);
    if (params.country) queryParams.append("country", params.country);
    if (params.minRate)
      queryParams.append("minRate", params.minRate.toString());
    if (params.maxRate)
      queryParams.append("maxRate", params.maxRate.toString());
    if (params.minRating)
      queryParams.append("minRating", params.minRating.toString());

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ambassadors");
    }

    return await response.json();
  }

  // دریافت سفیران یک شهر
  async getAmbassadorsByCity(city: string): Promise<Ambassador[]> {
    const response = await fetch(
      `${this.baseUrl}/city/${encodeURIComponent(city)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch ambassadors by city");
    }

    return await response.json();
  }

  // دریافت سفیران verified
  async getVerifiedAmbassadors(): Promise<Ambassador[]> {
    const response = await fetch(`${this.baseUrl}/verified`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch verified ambassadors");
    }

    return await response.json();
  }

  // دریافت اطلاعات یک سفیر
  async getAmbassadorById(id: number): Promise<Ambassador> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ambassador");
    }

    return await response.json();
  }

  // ثبت‌نام به عنوان سفیر
  async registerAsAmbassador(
    ambassadorData: Partial<Ambassador>
  ): Promise<Ambassador> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ambassadorData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to register as ambassador");
    }

    return await response.json();
  }

  // به‌روزرسانی پروفایل سفیر
  async updateAmbassador(
    id: number,
    ambassadorData: Partial<Ambassador>
  ): Promise<Ambassador> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ambassadorData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update ambassador");
    }

    return await response.json();
  }

  // تغییر وضعیت available
  async toggleAvailability(
    id: number,
    available: boolean
  ): Promise<Ambassador> {
    const response = await fetch(
      `${this.baseUrl}/${id}/availability?available=${available}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to toggle availability");
    }

    return await response.json();
  }

  // ============ REQUEST METHODS ============

  // ایجاد درخواست جدید
  async createRequest(requestData: {
    ambassadorId: number;
    serviceType: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }): Promise<AmbassadorRequest> {
    const response = await fetch(`${this.baseUrl}/requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create request");
    }

    return await response.json();
  }

  // دریافت درخواست‌های من
  async getMyRequests(): Promise<AmbassadorRequest[]> {
    const response = await fetch(`${this.baseUrl}/my-requests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch requests");
    }

    return await response.json();
  }

  // تغییر وضعیت درخواست
  async updateRequestStatus(
    requestId: number,
    status: string
  ): Promise<AmbassadorRequest> {
    const response = await fetch(
      `${this.baseUrl}/requests/${requestId}/status?status=${status}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update request status");
    }

    return await response.json();
  }

  // ثبت نظر توریست
  async addTouristReview(
    requestId: number,
    rating: number,
    review: string
  ): Promise<AmbassadorRequest> {
    const response = await fetch(
      `${this.baseUrl}/requests/${requestId}/review`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, review }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to add review");
    }

    return await response.json();
  }

  // پرداخت بیعانه
  async payDeposit(requestId: number): Promise<AmbassadorRequest> {
    const response = await fetch(
      `${this.baseUrl}/requests/${requestId}/pay-deposit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to pay deposit");
    }

    return await response.json();
  }

  // پرداخت کامل
  async payFull(requestId: number): Promise<AmbassadorRequest> {
    const response = await fetch(
      `${this.baseUrl}/requests/${requestId}/pay-full`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to pay full amount");
    }

    return await response.json();
  }

  // دریافت آمار سفیر
  async getAmbassadorStats(id: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${id}/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ambassador stats");
    }

    return await response.json();
  }
}

export const ambassadorService = new AmbassadorService();
export default ambassadorService;
