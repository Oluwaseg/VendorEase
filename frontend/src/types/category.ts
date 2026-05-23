export interface CategoryImage {
  url: string;
  publicId: string;
}

export interface Category {
  _id: string;

  name: string;
  slug: string;
  image?: CategoryImage;
  description?: string;
  isPublished: boolean;

  createdAt: string;
  updatedAt: string;
}
