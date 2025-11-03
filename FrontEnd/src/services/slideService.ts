const API_BASE = 'http://localhost:8080/api';

export interface Slide {
  id: number;
  image: string;          // تغییر از imageUrl به image
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;     // تغییر از targetUrl به buttonLink
  altText: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  displayOrder: number;   // تغییر از sortOrder به displayOrder
  slideType?: string;
  mediaSource?: string;
  transitionType?: string;
  navigationType?: string;
  customNavigation?: boolean;
  slideInterval?: number;
  transitionDuration?: number;
  createdAt?: string;
  updatedAt?: string;
}

class SlideService {
  async getAllSlides(): Promise<Slide[]> {
    try {
      const response = await fetch(`${API_BASE}/slides`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch slides: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || result || [];
    } catch (error) {
      console.error('❌ Error fetching all slides:', error);
      return [];
    }
  }

  async getActiveSlides(): Promise<Slide[]> {
    try {
      const response = await fetch(`${API_BASE}/slides/active`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch active slides: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || result || [];
    } catch (error) {
      console.error('❌ Error fetching active slides:', error);
      return [];
    }
  }

  async getSlideById(id: number): Promise<Slide | null> {
    try {
      const response = await fetch(`${API_BASE}/slides/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch slide: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || result || null;
    } catch (error) {
      console.error(`❌ Error fetching slide ${id}:`, error);
      return null;
    }
  }

  async createSlide(slideData: Partial<Slide>): Promise<Slide | null> {
    try {
      const response = await fetch(`${API_BASE}/slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create slide: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || result || null;
    } catch (error) {
      console.error('❌ Error creating slide:', error);
      return null;
    }
  }

  async updateSlide(id: number, slideData: Partial<Slide>): Promise<Slide | null> {
    try {
      const response = await fetch(`${API_BASE}/slides/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update slide: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || result || null;
    } catch (error) {
      console.error(`❌ Error updating slide ${id}:`, error);
      return null;
    }
  }

  async deleteSlide(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/slides/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete slide: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Error deleting slide ${id}:`, error);
      return false;
    }
  }
}

export const slideService = new SlideService();