// ADMIN-PANEL/src/services/sliderService.ts
const API_BASE = 'http://localhost:8083/api/admin';

export interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  sortOrder: number;
  altText: string;
  seoTitle?: string;
  seoDescription?: string;
}

class SliderService {
  async getAllSlides(): Promise<Slide[]> {
    console.log('🔄 Fetching slides from:', `${API_BASE}/slides`);
    try {
      const response = await fetch(`${API_BASE}/slides`);
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch slides: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Received data:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching slides:', error);
      throw error;
    }
  }

  async createSlide(slideData: Omit<Slide, 'id'>): Promise<Slide> {
    console.log('🔄 Creating slide:', slideData);
    try {
      const response = await fetch(`${API_BASE}/slides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData)
      });
      
      console.log('📡 Create response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to create slide: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Created slide:', data);
      return data;
    } catch (error) {
      console.error('❌ Error creating slide:', error);
      throw error;
    }
  }

  async updateSlide(id: string, slideData: Partial<Slide>): Promise<Slide> {
    console.log('🔄 Updating slide:', id, slideData);
    try {
      const response = await fetch(`${API_BASE}/slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData)
      });
      
      console.log('📡 Update response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to update slide: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Updated slide:', data);
      return data;
    } catch (error) {
      console.error('❌ Error updating slide:', error);
      throw error;
    }
  }

  async deleteSlide(id: string): Promise<void> {
    console.log('🔄 Deleting slide:', id);
    try {
      const response = await fetch(`${API_BASE}/slides/${id}`, { 
        method: 'DELETE' 
      });
      
      console.log('📡 Delete response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to delete slide: ${response.status} ${response.statusText}`);
      }
      
      console.log('✅ Slide deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting slide:', error);
      throw error;
    }
  }

  async toggleSlideStatus(id: string, isActive: boolean): Promise<Slide> {
    console.log('🔄 Toggling slide status:', id, isActive);
    try {
      const response = await fetch(`${API_BASE}/slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: isActive })
      });
      
      console.log('📡 Toggle response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to toggle slide status: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📦 Toggled slide:', data);
      return data;
    } catch (error) {
      console.error('❌ Error toggling slide status:', error);
      throw error;
    }
  }
}

export const sliderService = new SliderService();