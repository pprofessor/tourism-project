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
  address?: string;
  latitude?: number;
  longitude?: number;
  languages: string[]; // format: ["en:80", "fa:100"]
  services: string[];
  hourlyRate: number;
  rating: number;
  completedTasks: number;
  isAvailable: boolean;
  bio: string;
  workExperience?: string;
  certificates: string[];
  profileImage: string | null;
  videoSelfieUrl?: string;
  whatsappNumber: string | null;
  telegramUsername: string | null;
  isVerified: boolean;
  responseTime: number | null;
  agreementAccepted?: boolean;
  registrationStep?: number;
  status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface AmbassadorRegistrationData {
  // Step 1
  country: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;

  // Step 2
  languages: { [key: string]: number }; // {en: 80, fa: 100}

  // Step 3
  services: string[];
  bio: string;
  workExperience: string;

  // Step 4
  videoSelfieUrl?: string;
  documents?: Array<{
    type: string;
    url: string;
    fileName: string;
    fileSize: number;
  }>;

  // Step 5
  agreementAccepted: boolean;

  // Metadata
  currentStep: number;
  registrationStatus?: "DRAFT" | "PENDING_REVIEW";
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  currentStep?: number;
  status?: string;
  savedAt?: string;
  submissionDate?: string;
  referenceId?: number;
}

export interface RegistrationStatus {
  hasRegistration: boolean;
  message?: string;
  currentStep?: number;
  status?: string;
  ambassador?: Ambassador;
}

class AmbassadorService {
  private baseUrl = `${API_BASE_URL}/ambassadors`;

  // ============ NEW REGISTRATION METHODS ============

  /**
   * دریافت وضعیت ثبت‌نام کاربر
   */
  async getMyRegistration(): Promise<RegistrationStatus> {
    const response = await fetch(`${this.baseUrl}/my-registration`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch registration status");
    }

    return await response.json();
  }

  /**
   * ذخیره موقت اطلاعات ثبت‌نام
   */
  async saveDraft(
    data: AmbassadorRegistrationData
  ): Promise<RegistrationResponse> {
    const response = await fetch(`${this.baseUrl}/save-draft`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to save draft");
    }

    return await response.json();
  }

  /**
   * ارسال نهایی فرم ثبت‌نام
   */
  async submitRegistration(
    data: AmbassadorRegistrationData
  ): Promise<RegistrationResponse> {
    const response = await fetch(`${this.baseUrl}/submit-registration`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to submit registration");
    }

    return await response.json();
  }

  // ============ LOCATION API ============

  /**
   * دریافت لیست کشورها
   */
  async getCountries(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/locations/countries`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    return await response.json();
  }

  /**
   * دریافت شهرهای اصلی یک کشور
   */
  async getMajorCitiesByCountry(countryId: number): Promise<any[]> {
    const response = await fetch(
      `${API_BASE_URL}/locations/cities/major?countryId=${countryId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch major cities");
    }

    return await response.json();
  }

  /**
   * دریافت همه شهرهای یک کشور
   */
  async getCitiesByCountry(countryId: number): Promise<any[]> {
    const response = await fetch(
      `${API_BASE_URL}/locations/cities?countryId=${countryId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch cities");
    }

    return await response.json();
  }

  // ============ EXISTING METHODS (حفظ شده) ============

  async getAmbassadors(params: any = {}): Promise<Ambassador[]> {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        queryParams.append(key, params[key].toString());
      }
    });

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

  // ثبت‌نام قدیمی (برای سازگاری)
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

  async createRequest(requestData: any): Promise<any> {
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

  async getMyRequests(): Promise<any[]> {
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

  async updateRequestStatus(requestId: number, status: string): Promise<any> {
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

  async addTouristReview(
    requestId: number,
    rating: number,
    review: string
  ): Promise<any> {
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

  async payDeposit(requestId: number): Promise<any> {
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

  async payFull(requestId: number): Promise<any> {
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

  async getCurrentUserAmbassadorStatus(): Promise<{
    status: "NOT_REGISTERED" | "PENDING" | "APPROVED" | "REJECTED";
    ambassador?: Ambassador;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/my-status`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { status: "NOT_REGISTERED" };
        }
        throw new Error("Failed to fetch ambassador status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching ambassador status:", error);
      return { status: "NOT_REGISTERED" };
    }
  }
}

export const ambassadorService = new AmbassadorService();
export default ambassadorService;
