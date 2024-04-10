import { Book } from "../shared/types/Book";

export const generateRecommendations = (
  allBooks: Book[],
  userBooks: Book[]
): Book[] => {
  // Gather all genres from user's books
  const userGenres = new Set(userBooks.flatMap((book) => book.bookGenre));

  // Filter out the books that the user already has from the recommendation pool
  const recommendationPool = allBooks.filter(
    (book) => !userBooks.some((userBook) => userBook.id === book.id)
  );

  // Filter the remaining books to only include ones that match the user's genres
  const filteredRecommendations = recommendationPool.filter((book) =>
    book.bookGenre.some((genre) => userGenres.has(genre))
  );
  // Randomly pick 20 books from the filtered recommendations
  return filteredRecommendations.sort(() => 0.5 - Math.random()).slice(0, 6);
};
