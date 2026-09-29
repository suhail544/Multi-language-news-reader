export interface Article {
  id: number;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  publishedAt: string | null;
  source: {
    name: string;
  };
  language: {
    name: string;
    code: string;
  };
}