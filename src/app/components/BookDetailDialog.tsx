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

  const handleSaveComment = (bookId: string) => {
    setComments((prev) => ({
      ...prev,
      [bookId]: currentComment,
    }));
    setCurrentComment("");
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
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className="w-full max-w-[200px] h-auto object-cover border-[1px]"
                />
              )}
            </div>

            <div className="space-y-4 flex flex-col">
              <div>
                <h3 className="font-semibold text-lg">Authors</h3>
                <p className="font-playwrite">
                  {book.volumeInfo.authors?.join(", ")}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-sm text-gray-600 line-clamp-4 font-playwrite">
                  {book.volumeInfo.description
                    ? `${book.volumeInfo.description.slice(0, 100)}...`
                    : "No description available"}
                </p>
              </div>
              <div className="flex justify-end">
                {book.volumeInfo.description && (
                  <Button
                    variant="outline"
                    className="text-sm border-0 p-2 bg-transparent translate-y-[-18px]"
                    onClick={() => setIsDescriptionOpen(true)}
                  >
                    See more...
                  </Button>
                )}
              </div>

              {book.saleInfo?.listPrice && (
                <div>
                  <h3 className="font-semibold text-lg">Price</h3>
                  <p>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: book.saleInfo.listPrice.currencyCode,
                    }).format(book.saleInfo.listPrice.amount)}
                  </p>
                </div>
              )}
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
          <p className="text-gray-700 font-playwrite">
            {book.volumeInfo.description}
          </p>
          <Button onClick={() => setIsDescriptionOpen(false)} className="mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
