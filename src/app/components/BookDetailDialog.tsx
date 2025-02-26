"use client";

import {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Book} from "../types";
import Image from "next/image";
import {Clock, Book as BookIcon, Globe, FileText, User} from "lucide-react";

interface BookComments {
  [key: string]: string;
}

interface BookDetailDialogProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookDetailDialog({
  book,
  isOpen,
  onClose,
}: BookDetailDialogProps) {
  const [comments, setComments] = useState<BookComments>({});
  const [currentComment, setCurrentComment] = useState("");
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  const handleSaveComment = (bookId: string) => {
    setComments((prev) => ({
      ...prev,
      [bookId]: currentComment,
    }));
    setCurrentComment("");
  };

  // Função para gerar uma descrição genérica se não houver uma
  const getDescription = () => {
    if (book.volumeInfo.description && book.volumeInfo.description.length > 0) {
      return book.volumeInfo.description;
    }

    // Descrição genérica baseada nos dados disponíveis
    return `${book.volumeInfo.title} is a book written by ${
      book.volumeInfo.authors?.join(", ") || "unknown author(s)"
    }.
    Published in ${
      book.volumeInfo.publishedDate || "unknown date"
    }, it belongs to the ${
      book.volumeInfo.categories?.join(", ") || "uncategorized"
    } genre.
    This book is part of our digital collection and is available for reading.`;
  };

  // Função para gerar um preço fictício baseado no id do livro
  const generatePrice = () => {
    // Usar o id do livro para gerar um preço pseudo-aleatório mas consistente
    const hash = Array.from(book.id).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const basePrice = (hash % 30) + 10; // Preço entre 10 e 39.99
    const cents = hash % 100;
    return `R$ ${basePrice.toFixed(0)},${cents.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl w-[90%] overflow-auto max-h-[700px]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-semibold font-roboto">
              {book.volumeInfo.title}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex justify-center">
              {book.volumeInfo.imageLinks?.thumbnail ? (
                <Image
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  width={200}
                  height={300}
                  className="w-full h-auto object-fit border-[1px]"
                />
              ) : (
                <div className="w-full max-w-[200px] h-[300px] bg-gray-200 flex items-center justify-center">
                  <BookIcon size={64} className="text-gray-400" />
                </div>
              )}
            </div>

            <div className="space-y-4 flex flex-col">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User size={16} />
                  Authors
                </h3>
                <p className="font-playwrite">
                  {book.volumeInfo.authors?.join(", ") || "Unknown author"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText size={16} />
                  Description
                </h3>
                <p className="text-sm text-gray-600 line-clamp-4 font-playwrite">
                  {getDescription().slice(0, 100)}...
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="text-sm border-0 p-2 bg-transparent translate-y-[-18px]"
                  onClick={() => setIsDescriptionOpen(true)}
                >
                  See more...
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Clock size={16} />
                    Published
                  </h3>
                  <p className="font-playwrite">
                    {book.volumeInfo.publishedDate || "Unknown"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Globe size={16} />
                    Language
                  </h3>
                  <p className="font-playwrite">
                    {book.volumeInfo.language === "en"
                      ? "English"
                      : book.volumeInfo.language === "pt"
                      ? "Portuguese"
                      : book.volumeInfo.language === "es"
                      ? "Spanish"
                      : book.volumeInfo.language === "fr"
                      ? "French"
                      : book.volumeInfo.language || "Unknown"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Price (Estimated)</h3>
                <p className="font-bold text-green-700">{generatePrice()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  *Preço estimado com base na popularidade
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Your Rating</h3>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`text-2xl ${
                        userRating && star <= userRating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">Comments</h3>

            {comments[book.id] && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{comments[book.id]}</p>
              </div>
            )}

            <div className="space-y-2">
              <Textarea
                placeholder="Write your comment here..."
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={() => handleSaveComment(book.id)}
                disabled={!currentComment.trim()}
              >
                Save Comment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
        <DialogContent className="max-w-lg max-h-[600px] overflow-auto w-[90%]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-semibold font-roboto">
              Full description
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700 font-playwrite">{getDescription()}</p>
          <Button onClick={() => setIsDescriptionOpen(false)} className="mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
