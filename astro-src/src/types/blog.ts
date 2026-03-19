export type BlogCategory = 'success-story' | 'tutorial';

export interface BlogPost {
  id: string;
  slug: string;
  category: BlogCategory;
  title_cs: string;
  title_en: string;
  excerpt_cs: string;
  excerpt_en: string;
  content_cs: string;
  content_en: string;
  author: string;
  author_role_cs: string;
  author_role_en: string;
  author_image: string;
  featured_image?: string;
  published_date: string;
  read_time_minutes: number;
  tags_cs: string[];
  tags_en: string[];
  featured?: boolean;
  // For case studies - optional metrics
  metrics?: {
    label_cs: string;
    label_en: string;
    value: string;
    highlight?: boolean;
  }[];
  // Related client logos for case studies
  related_clients?: string[];
}

export interface BlogCategoryInfo {
  id: BlogCategory;
  name_cs: string;
  name_en: string;
  description_cs: string;
  description_en: string;
  icon: string;
  color: string;
}

export const blogCategories: BlogCategoryInfo[] = [
  {
    id: 'success-story',
    name_cs: 'Případové studie',
    name_en: 'Case Studies',
    description_cs: 'Reálné výsledky a úspěšné projekty',
    description_en: 'Real results and successful projects',
    icon: 'solar:chart-2-bold',
    color: 'primary'
  },
  {
    id: 'tutorial',
    name_cs: 'Návody',
    name_en: 'Tutorials',
    description_cs: 'Praktické návody a tipy',
    description_en: 'Practical guides and tips',
    icon: 'solar:book-bold',
    color: 'orange'
  }
];

