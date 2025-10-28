export interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
  sortOrder: number;
  altText: string;
  seoTitle?: string;
  seoDescription?: string;
}

export const slideService = {
  async getActiveSlides(): Promise<Slide[]> {
    try {
      const response = await fetch('http://localhost:8083/api/slides');
      if (!response.ok) {
        throw new Error('Failed to fetch slides');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching slides:', error);
      throw error;
    }
  }
};