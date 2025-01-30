import { Book } from "../types";

const GOOGLE_BOOKS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
const MAX_RESULTS = 20; 

export async function fetchBooks(category: string = ''): Promise<Book[]> {
  try {
    const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    
    const categoryMap: Record<string, string> = {
      Romance: 'subject:romance',
      Magic: 'subject:fantasy',
      Action: 'subject:action',
      History: 'subject:history',
      Horror: 'subject:horror',
      Programming: 'subject:programming'
    };
    
    const query = category && categoryMap[category] 
      ? `?q=${categoryMap[category]}` 
      : '?q=subject:fiction';
    
    const url = `${baseUrl}${query}&maxResults=${MAX_RESULTS}&key=${GOOGLE_BOOKS_API_KEY}&langRestrict=en`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching books: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}