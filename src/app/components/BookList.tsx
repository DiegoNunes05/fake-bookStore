"use client";

import {useState, useEffect} from "react";
import {Book} from "../types";
import {fetchBooks} from "../api/book";
import "../styles/bookList.css";
import {Input} from "@/components/ui/input";
import Loading from "./Loading";
import BookDetailDialog from "./BookDetailDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Pencil, Plus, Star, Trash2} from "lucide-react";
import Image from "next/image";

interface BookListProps {
  activeCategory?: string;
  onFavorite: (title: string) => void;
  favorites: string[];
}

interface BookFormData {
  title: string;
  authors: string;
  description: string;
  category: string;
  publishedDate: string;
}

export default function BookList({
  activeCategory = "",
  onFavorite,
  favorites
}: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    authors: "",
    description: "",
    category: "",
    publishedDate: "",
  });

  useEffect(() => {
    const loadInitialBooks = async () => {
      setLoading(true);
      const fetchedBooks = await fetchBooks(activeCategory, "");
      setBooks(fetchedBooks);
      setLoading(false);
    };
    loadInitialBooks();
  }, [activeCategory]);

  useEffect(() => {
    if (!loading) {
      const loadSearchedBooks = async () => {
        const fetchedBooks = await fetchBooks(activeCategory, searchQuery);
        setBooks(fetchedBooks);
      };
      const delayDebounceFn = setTimeout(() => {
        loadSearchedBooks();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setSelectedCategory(activeCategory);
  }, [activeCategory]);

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBook(null);
  };

  const filteredBooks = books.filter((book) =>
    book.volumeInfo.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateBook = async () => {
    const newBook: Book = {
      id: Date.now().toString(),
      volumeInfo: {
        title: formData.title,
        authors: formData.authors.split(",").map((author) => author.trim()),
        description: formData.description,
        categories: [formData.category],
        publishedDate: formData.publishedDate,
        imageLinks: {
          thumbnail: "/api/placeholder/200/300",
        },
      },
    };

    await new Promise((resolve) => setTimeout(resolve, 500));
    setBooks((prev) => [newBook, ...prev]);

    setFormData({
      title: "",
      authors: "",
      description: "",
      category: "",
      publishedDate: "",
    });
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors?.join(", ") || "",
      description: book.volumeInfo.description || "",
      category: book.volumeInfo.categories?.[0] || "",
      publishedDate: book.volumeInfo.publishedDate || "",
    });
  };

  const handleUpdateBook = () => {
    if (!editingBook) return;

    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === editingBook.id
          ? {
              ...book,
              volumeInfo: {
                ...book.volumeInfo,
                title: formData.title,
                authors: formData.authors
                  .split(",")
                  .map((author) => author.trim()),
                description: formData.description,
                categories: [formData.category],
                publishedDate: formData.publishedDate,
              },
            }
          : book
      )
    );
    setEditingBook(null);
  };

  const handleDeleteBook = async (bookId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setBooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  if (loading) {
    return (
      <div className="pt-[300px]">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Input
          placeholder="Find your favorite here..."
          className="input w-[92%]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Dialog>
          <DialogTrigger asChild>
            {isMobile ? (
              <Button className="flex items-center gap-2 mx-4">
                <Plus size={14} />
              </Button>
            ) : (
              <Button className="flex items-center gap-2 mx-4">
                <Plus size={16} />
                Add New Book
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="w-[90%]">
            <DialogHeader>
              <DialogTitle>
                {editingBook ? "Edit Book" : "Add New Book"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({...prev, title: e.target.value}))
                }
              />
              <Input
                placeholder="Authors (comma separated)"
                value={formData.authors}
                onChange={(e) =>
                  setFormData((prev) => ({...prev, authors: e.target.value}))
                }
              />
              <Input
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({...prev, category: e.target.value}))
                }
              />
              <DialogClose asChild>
                <Button
                  onClick={() =>
                    editingBook ? handleUpdateBook() : handleCreateBook()
                  }
                  className="w-full"
                >
                  {editingBook ? "Update Book" : "Add Book"}
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full flex">
        <h2 className="text-3xl font-smooch font-semibold mt-4 px-4">
          {selectedCategory || "All Books"}
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pt-2">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="px-4 py-2 border-[1px] border-gray-500 card"
            onClick={() => handleBookClick(book)}
          >
            {book.volumeInfo.imageLinks?.thumbnail && (
              <Image
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                width={200}
                height={300}
                className="w-full h-[200px] object-fill border-[1px]"
              />
            )}
            <div className="flex w-full justify-between items-center flex-col">
              <div className="flex flex-col items-center">
                <h2 className="text-md font-semibold mt-2 font-roboto leading-[1rem]">
                  {book.volumeInfo.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600 font-roboto">
                  {book.volumeInfo.authors?.join(", ")}
                </p>
              </div>
              <div className="pt-4 w-full flex justify-between">
                <Button
                  className="border-[1px] md:px-6 bg-transparent shadow-none hover:bg-yellow-200"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onFavorite(book.volumeInfo.title);
                  }}
                >
                  <Star
                    className={`text-yellow-600 ${
                      favorites.includes(book.volumeInfo.title)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </Button>
                <Button
                  className="border-[1px] md:px-6 bg-transparent shadow-none hover:bg-gray-300"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleEditBook(book);
                  }}
                >
                  <Pencil size={8} className="text-gray-700" />
                </Button>
                <Button
                  className="border-[1px] md:px-6 bg-transparent shadow-none hover:bg-red-200"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setBookToDelete(book.id);
                    setIsConfirmDelete(true);
                  }}
                >
                  <Trash2 size={8} className="text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingBook && (
        <Dialog
          open={Boolean(editingBook)}
          onOpenChange={() => setEditingBook(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Book</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({...formData, title: e.target.value})
                }
                placeholder="Book Title"
              />
              <Input
                value={formData.authors}
                onChange={(e) =>
                  setFormData({...formData, authors: e.target.value})
                }
                placeholder="Authors"
              />
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({...formData, description: e.target.value})
                }
                placeholder="Description"
              />
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({...formData, category: e.target.value})
                }
                placeholder="Category"
              />
              <Input
                value={formData.publishedDate}
                onChange={(e) =>
                  setFormData({...formData, publishedDate: e.target.value})
                }
                placeholder="Published Date"
              />
              <Button onClick={handleUpdateBook}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedBook && (
        <BookDetailDialog
          book={selectedBook}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
        />
      )}

      <Dialog open={isConfirmDelete} onOpenChange={setIsConfirmDelete}>
        <DialogContent className="w-[90%]">
          <DialogHeader className="items-start">
            <DialogTitle>Confirmed Delete</DialogTitle>
            <DialogDescription className="text-start">
              Are you sure you want to delete? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="default"
              className=""
              onClick={() => setIsConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (bookToDelete) {
                  await handleDeleteBook(bookToDelete);
                  setIsConfirmDelete(false);
                  setBookToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
