interface Book {
  id: number;
  title: string;
  img: string;
  author: {
    fullName: string;
  };
  predefinedShelf: {
    shelfName: string;
  };
  bookGenre: string[];
  numberOfPages: number;
  rating: number;
}

export interface UserData {
  readBooks: Book[];
  didNotFinishBooks: Book[];
  toReadBooks: Book[];
  readingBooks: Book[];
  favorites: Book[];
}


export const getUserData = (userId: string): UserData | null => {
  const userData = localStorage.getItem(userId);
  const favorites = localStorage.getItem(userId + "_favorites");
  if (userData) {
    const parsedData = JSON.parse(userData) as UserData;
    if (favorites) {
      parsedData.favorites = JSON.parse(favorites);
    }
    return parsedData;
  }
  return null;
};

export const saveUserData = (userId: string, data: UserData): void => {
  const { favorites, ...rest } = data;
  localStorage.setItem(userId, JSON.stringify(rest));
  localStorage.setItem(userId + "_favorites", JSON.stringify(favorites));
};
/**
 * Adds a book to a user's shelf.
 * @param {string} userId The ID of the user.
 * @param {Book} book The book to add.
 * @param {string} shelf The shelf to add the book to.
 */
export const addBookToShelf = (
  userId: string,
  book: Book,
  shelf: keyof UserData
): void => {
  const userData: UserData = getUserData(userId) || {
    readBooks: [],
    didNotFinishBooks: [],
    toReadBooks: [],
    readingBooks: [],
    favorites: [],
  };
  if (!userData[shelf]) {
    userData[shelf] = [];
  }
  userData[shelf].push(book);
  saveUserData(userId, userData);
};

/**
 * Removes a book from a user's shelf.
 * @param {string} userId The ID of the user.
 * @param {number} bookId The ID of the book to remove.
 * @param {string} shelf The shelf to remove the book from.
 */
export const removeBookFromShelf = (
  userId: string,
  bookId: number,
  shelf: keyof UserData
): void => {
  const userData: UserData | null = getUserData(userId);
  if (userData && userData[shelf]) {
    userData[shelf] = userData[shelf].filter((book) => book.id !== bookId);
    saveUserData(userId, userData);
  }
};

