import { Book } from '../../shared/types/Book';

describe('addToFavorites function', () => {
  test('should add a book to favorites', () => {
    const book: Book = {
      id: 1,
      title: 'Test Book',
      img: '',
      author: { fullName: 'Test Author' },
      predefinedShelf: { shelfName: '' },
      bookGenre: ['Test Genre'],
      numberOfPages: 100,
      rating: 5,
    };

    const favorites: Book[] = [];
    const addToFavorites = jest.fn((book: Book, favorites: Book[]) => {
      favorites.push(book);
    });

    addToFavorites(book, favorites);

    expect(addToFavorites).toHaveBeenCalled();
    expect(favorites).toContain(book);
  });
});
