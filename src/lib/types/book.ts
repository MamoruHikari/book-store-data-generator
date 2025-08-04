export type Book = {
  uniqueId: string;
  index: number;
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  likes: number;
  reviews: { text: string; author: string }[];
};