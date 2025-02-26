import { Book } from "../types";

interface OpenLibraryDoc {
  key?: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  description?: string;
  subject?: string[];
  cover_i?: number;
  number_of_pages_median?: number;
  language?: string[];
  edition_key?: string[];
}

interface OpenLibraryBookData {
  title?: string;
  authors?: Array<{name: string}>;
  publish_date?: string;
  notes?: string;
  excerpts?: Array<{text: string}>;
  subjects?: Array<{name: string}>;
  cover?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  number_of_pages?: number;
  languages?: Array<{key: string}>;
}

// Função para buscar livros da Open Library API
export async function fetchBooks(category: string = '', searchQuery: string = ''): Promise<Book[]> {
  try {
    const baseUrl = 'https://openlibrary.org/search.json';
    
    // Mapeamento de categorias para consultas na Open Library
    const categoryMap: Record<string, string> = {
      Romance: 'subject:romance',
      Magic: 'subject:fantasy',
      Action: 'subject:action',
      History: 'subject:history',
      Horror: 'subject:horror',
      Programming: 'subject:programming'
    };

    // Construir a consulta com base nos parâmetros
    let query = '';
    if (searchQuery) {
      query = `q=${encodeURIComponent(searchQuery)}`;
    } else if (category && categoryMap[category]) {
      query = `q=${encodeURIComponent(categoryMap[category])}`;
    } else {
      query = 'q=subject:fiction';
    }

    // Adicionar parâmetros adicionais (limite e formato)
    const url = `${baseUrl}?${query}&limit=30`;
    
    console.log('Fetching books from URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching books (${response.status}):`, errorText);
      throw new Error(`Error fetching books: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Mapear os resultados da Open Library para o formato Book usado no seu app
    const books: Book[] = data.docs.map((item: OpenLibraryDoc) => {
      return {
        id: item.key || `ol-${item.edition_key?.[0] || Math.random().toString(36).substring(2)}`,
        volumeInfo: {
          title: item.title || 'Unknown Title',
          authors: item.author_name || ['Unknown Author'],
          publishedDate: item.first_publish_year?.toString() || 'Unknown',
          description: item.description || '',
          categories: item.subject || [],
          imageLinks: {
            thumbnail: item.cover_i 
              ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` 
              : '/images/placeholder-cover.png'
          },
          pageCount: item.number_of_pages_median || 0,
          averageRating: 0, // Open Library não fornece ratings
          language: item.language?.[0] || 'en'
        }
      };
    });
    
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

// Função para buscar detalhes de um livro específico
export async function fetchBookDetails(bookId: string): Promise<Book | null> {
  try {
    // Se o ID começar com 'ol-', é um ID da Open Library
    if (bookId.startsWith('ol-')) {
      const cleanId = bookId.replace('ol-', '');
      const url = `https://openlibrary.org/api/books?bibkeys=OLID:${cleanId}&format=json&jscmd=data`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error fetching book details: ${response.status}`);
      }
      
      const data = await response.json();
      const bookData : OpenLibraryBookData = data[`OLID:${cleanId}`];
      
      if (!bookData) return null;
      
      return {
        id: bookId,
        volumeInfo: {
          title: bookData.title || 'Unknown Title',
          authors: bookData.authors?.map((a: {name: string}) => a.name) || ['Unknown Author'],
          publishedDate: bookData.publish_date || 'Unknown',
          description: bookData.notes || bookData.excerpts?.[0]?.text || '',
          categories: bookData.subjects?.map((s: any) => s.name) || [],
          imageLinks: {
            thumbnail: bookData.cover?.medium || '/images/placeholder-cover.png'
          },
          pageCount: bookData.number_of_pages || 0,
          averageRating: 0,
          language: bookData.languages?.[0]?.key?.split('/')?.pop() || 'en'
        }
      };
    } 
    
    // Se não for um ID da Open Library, tentar buscar por título
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(bookId)}&limit=1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching book details: ${response.status}`);
    }
    
    const data = await response.json();
    const item = data.docs[0];
    
    if (!item) return null;
    
    return {
      id: `ol-${item.edition_key?.[0] || item.key}`,
      volumeInfo: {
        title: item.title || 'Unknown Title',
        authors: item.author_name || ['Unknown Author'],
        publishedDate: item.first_publish_year?.toString() || 'Unknown',
        description: item.description || '',
        categories: item.subject || [],
        imageLinks: {
          thumbnail: item.cover_i 
            ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` 
            : '/images/placeholder-cover.png'
        },
        pageCount: item.number_of_pages_median || 0,
        averageRating: 0,
        language: item.language?.[0] || 'en'
      }
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
}