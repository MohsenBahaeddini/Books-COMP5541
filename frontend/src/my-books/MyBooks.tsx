// // Map the recommendations pool to add the predefinedShelf property
// const updatedRecommendedBooks = recommendationsPool.map((book) => ({
//   ...book,
//   predefinedShelf: { shelfName: "Recommendation" },
// }));

// // Update the state with the new recommendations
// this.setState({ recommendedBooks: updatedRecommendedBooks });
// Generate random recommendations based on the favorites
// Generate random recommendations based on the favorites for the ShelfCarousel
// For the BookList, use the entire recommendations pool
// updateRecommendations = () => {

//   const updatedRecommendedBooks = recommendationsPool.map((book) => ({
//     ...book,
//     predefinedShelf: { shelfName: "Recommendation" },
//   }));
//   this.setState({ loadingRecommendations: true });

//   // Generate recommendations asynchronously
//   setTimeout(() => {
//     const newShelfCarouselRecommendations = generateRecommendations(
//       [...recommendationsPool],
//       this.state.favorites
//     ).map((book) => ({
//       ...book,
//       predefinedShelf: { shelfName: "Recommendation" },
//     }));
//     console.log(
//       "newShelfCarouselRecommendations :",
//       newShelfCarouselRecommendations
//     );
//     // Update the state once recommendations are ready
//     this.setState({
//       recommendedBooks: updatedRecommendedBooks,
//       shelfCarouselRecommendations: newShelfCarouselRecommendations,
//       loadingRecommendations: false,
//     });
//   }, 0);
// };

import React, { Component, ReactElement } from "react";
import { NavBar } from "../shared/navigation/NavBar";
import Switch from "../settings/Switch";
import Button from "@material-ui/core/Button";
import ShelfModal from "./ShelfModal";
import { Layout } from "../shared/components/Layout";
import BookList from "../shared/book-display/BookList";
import { Book } from "../shared/types/Book";
import "./MyBooks.css";
import ShelfView from "../shared/book-display/ShelfView";
import GenreSelector from "../genre/GenreSelector";
import localBooksData from "../books_dataset.json"; // Import your local data
import { generateRecommendations } from "../recommendations/generateRecommendations";
import recommendationsPool from "../recommendations_pool.json";
import { RouteComponentProps, useLocation } from "react-router-dom";
import { getUserData, saveUserData } from "../userBooks";
import { emailContext, useEmail } from "../EmailContext";

interface LocationState {
  email: string;
}

interface MyBooksProps {
  email: string;
}
interface MyBooksProps extends RouteComponentProps {
  email: string;
}

interface IState {
  showShelfModal: boolean;
  showListView: boolean;
  bookList: Book[];
  readBooks: Book[];
  didNotFinishBooks: Book[];
  toReadBooks: Book[];
  readingBooks: Book[];
  searchVal: string;
  selectedGenres: string[];
  filteredBookList: Book[];
  recommendedBooks: Book[];
  favorites: Book[];
  email: string;
  mainRecommended: Book[];
  mainFavorites: Book[];
  shelfCarouselRecommendations: Book[];
  loadingRecommendations: boolean;
}

class MyBooks extends Component<MyBooksProps, IState> {
  static contextType = emailContext;

  constructor(props: MyBooksProps) {
    super(props);
    this.state = {
      showShelfModal: false,
      showListView: false,
      bookList: localBooksData,
      favorites: [],
      readBooks: [],
      didNotFinishBooks: [],
      toReadBooks: [],
      readingBooks: [],
      searchVal: "",
      selectedGenres: [],
      filteredBookList: [],
      recommendedBooks: [],
      mainRecommended: [],
      mainFavorites: [],
      email: "",
      shelfCarouselRecommendations: [],
      loadingRecommendations: true,
    };
    this.onAddShelf = this.onAddShelf.bind(this);
    this.onAddShelfModalClose = this.onAddShelfModalClose.bind(this);
    this.onToggleListView = this.onToggleListView.bind(this);
    this.filterBooksByShelf = this.filterBooksByShelf.bind(this);
    this.updateRecommendations = this.updateRecommendations.bind(this);
  }

  componentDidMount(): void {
    const email = this.context.email;

    const userData = getUserData(email);

    const favoritesKey = email + "_favorites";

    const storedFavorites = localStorage.getItem(favoritesKey);

    if (storedFavorites) {
      this.setState({
        favorites: JSON.parse(storedFavorites),
        mainFavorites: JSON.parse(storedFavorites),
      });
    } else if (userData) {
      this.setState({
        favorites: userData.favorites || [],
        readBooks: userData.readBooks || [],
        didNotFinishBooks: userData.didNotFinishBooks || [],
        toReadBooks: userData.toReadBooks || [],
        readingBooks: userData.readingBooks || [],
        mainFavorites: userData.favorites || [],
      });
    }

    this.filterBooksByShelf();
    this.updateRecommendations();
  }

  filterBooksByShelf() {
    this.setState(
      {
        readBooks: this.state.bookList.filter(
          (book) => book.predefinedShelf.shelfName === "read"
        ),
        didNotFinishBooks: this.state.bookList.filter(
          (book) => book.predefinedShelf.shelfName === "did-not-finish"
        ),
        toReadBooks: this.state.bookList.filter(
          (book) => book.predefinedShelf.shelfName === "to-read"
        ),
        readingBooks: this.state.bookList.filter(
          (book) => book.predefinedShelf.shelfName === "reading"
        ),
      },
      this.updateRecommendations
    ); // Ensure updateRecommendations is called after the state is set
  }

  onAddShelf(): void {
    this.setState({
      showShelfModal: true,
    });
  }

  onAddShelfModalClose(): void {
    this.setState({
      showShelfModal: false,
    });
  }

  onToggleListView(): void {
    this.setState({
      showListView: !this.state.showListView,
    });
  }

  handleGenresApply = (selectedGenres: string[]) => {
    this.setState({ selectedGenres }, () => {
      this.filterBooksByGenre();
      this.updateRecommendations(); // Call updateRecommendations to ensure recommendations are updated
    });
  };

  filterBooksByShelfs = (books: Book[], shelfName: string) => {
    if (books) {
      return books.filter(
        (book) => book.predefinedShelf.shelfName === shelfName
      );
    }
  };

  filterBooksByGenre = () => {
    const {
      selectedGenres,
      mainFavorites,
      shelfCarouselRecommendations,
      mainRecommended,
    } = this.state;

    const filterByGenre = (books: Book[]) =>
      books.filter((book) =>
        book.bookGenre.some((genre) => selectedGenres.includes(genre))
      );

    const readBooks = this.filterBooksByShelfs(localBooksData, "read");
    const didNotFinishBooks = this.filterBooksByShelfs(
      localBooksData,
      "did-not-finish"
    );
    const toReadBooks = this.filterBooksByShelfs(localBooksData, "to-read");
    const readingBooks = this.filterBooksByShelfs(localBooksData, "reading");
    const recommendedBooks = this.filterBooksByShelfs(
      this.state.mainRecommended,
      "Recommendation"
    );

    this.setState({
      bookList: filterByGenre(localBooksData),
      readBooks: readBooks ? filterByGenre(readBooks) : [],
      didNotFinishBooks: didNotFinishBooks
        ? filterByGenre(didNotFinishBooks)
        : [],
      toReadBooks: toReadBooks ? filterByGenre(toReadBooks) : [],
      readingBooks: readingBooks ? filterByGenre(readingBooks) : [],
      favorites: filterByGenre(this.state.mainFavorites),
      recommendedBooks: recommendedBooks ? filterByGenre(recommendedBooks) : [],
      shelfCarouselRecommendations: filterByGenre(shelfCarouselRecommendations),
    });
  };

  updateRecommendations = () => {
    const updatedRecommendedBooks = recommendationsPool.map((book) => ({
      ...book,
      predefinedShelf: { shelfName: "Recommendation" },
    }));

    this.setState({ loadingRecommendations: true });

    // Generate recommendations asynchronously
    setTimeout(() => {
      const newShelfCarouselRecommendations = generateRecommendations(
        [...recommendationsPool],
        // Combine favorites and localBooksData for generating recommendations
        [...this.state.favorites, ...localBooksData]
      ).map((book) => ({
        ...book,
        predefinedShelf: { shelfName: "Recommendation" },
      }));

      // Update the state once recommendations are ready
      this.setState({
        recommendedBooks: updatedRecommendedBooks,
        shelfCarouselRecommendations: newShelfCarouselRecommendations,
        loadingRecommendations: false,
      });
    }, 0);
  };

  saveFavoritesToLocalStorage = (email: string) => {
    localStorage.setItem(
      email + "favorites",
      JSON.stringify(this.state.favorites)
    );
  };

  addToFavorites = (book: Book) => {
    this.setState(
      (prevState) => ({
        favorites: [...prevState.favorites, book],
      }),
      () => {
        const { email } = this.props;
        if (email) {
          // Fetch the current state of user data
          const userData = getUserData(email) || {
            readBooks: [],
            didNotFinishBooks: [],
            toReadBooks: [],
            readingBooks: [],
            favorites: [],
          };
          // Update the favorites within user data
          userData.favorites = [...this.state.favorites];
          console.log("Added to favorites :", userData);

          // Save the updated user data back to local storage
          saveUserData(email, userData);
          this.updateRecommendations();
        }
      }
    );
  };

  removeFromFavorites = (book: Book) => {
    this.setState(
      (prevState) => ({
        favorites: prevState.favorites.filter(
          (favBook) => favBook.id !== book.id
        ),
      }),
      () => {
        const { email } = this.props;
        if (email) {
          // Fetch the current state of user data
          const userData = getUserData(email) || {
            readBooks: [],
            didNotFinishBooks: [],
            toReadBooks: [],
            readingBooks: [],
            favorites: [],
          };
          // Update the favorites within user data
          userData.favorites = this.state.favorites;
          console.log("Removed from favorites :", userData);

          // Save the updated user data back to local storage
          saveUserData(email, userData);
          this.updateRecommendations();
        }
      }
    );
  };

  render(): ReactElement {
    // Combine all books from different shelves
    const combinedBooks = [
      ...this.state.readBooks,
      ...this.state.didNotFinishBooks,
      ...this.state.toReadBooks,
      ...this.state.readingBooks,
      ...this.state.recommendedBooks,
      ...this.state.favorites,
    ];

    // Create a set of unique book IDs
    const uniqueBookIds = new Set(combinedBooks.map((book) => book.id));

    // Filter out duplicates based on the unique book IDs
    const uniqueBooks = combinedBooks.filter((book) =>
      uniqueBookIds.delete(book.id)
    );
    return (
      <Layout
        title="My books"
        btn={
          <div className="my-book-top-buttons">
            {/* <Button
              variant="contained"
              className="tempButton"
              color="primary"
              disableElevation
            >
              Add Book
            </Button>
            <Button
              onClick={this.onAddShelf}
              variant="contained"
              color="primary"
              disableElevation
            >
              Add Shelf
            </Button> */}
            <GenreSelector onApply={this.handleGenresApply} />
          </div>
        }
      >
        <NavBar />
        <div>
          {this.state.showListView ? (
            <BookList
              key={uniqueBooks.length + this.state.searchVal}
              bookListData={
                this.state.filteredBookList.length > 0
                  ? this.state.filteredBookList
                  : uniqueBooks
              }
              searchText={this.state.searchVal}
              favorites={this.state.favorites}
              addToFavorites={this.addToFavorites}
              removeFromFavorites={this.removeFromFavorites}
            />
          ) : this.state.loadingRecommendations ? (
            <div>Loading recommendations...</div>
          ) : (
            <ShelfView
              key={
                [
                  ...this.state.favorites,
                  ...this.state.readBooks,
                  ...this.state.readingBooks,
                  ...this.state.toReadBooks,
                  ...this.state.didNotFinishBooks,
                  ...this.state.recommendedBooks,
                ].length + this.state.searchVal
              }
              readBooks={this.state.readBooks}
              toReadBooks={this.state.toReadBooks}
              didNotFinishBooks={this.state.didNotFinishBooks}
              readingBooks={this.state.readingBooks}
              searchText={this.state.searchVal}
              recommendedBooks={this.state.shelfCarouselRecommendations}
              favorites={this.state.favorites}
              addToFavorites={this.addToFavorites}
              removeFromFavorites={this.removeFromFavorites}
            />
          )}
        </div>
        <ShelfModal
          open={this.state.showShelfModal}
          onClose={this.onAddShelfModalClose}
        />
        <div className="my-book-switch-container">
          <div className="toggle-text">Shelf View</div>
          <Switch onClick={this.onToggleListView} />
          <div className="toggle-text">List View</div>
        </div>
      </Layout>
    );
  }
}

MyBooks.contextType = emailContext;

export default MyBooks;
