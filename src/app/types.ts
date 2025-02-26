export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publishedDate: string;
    description: string;
    categories: string[];
    imageLinks: {
      thumbnail: string;
    };
    pageCount: number;
    averageRating: number;
    language: string;
  };
}