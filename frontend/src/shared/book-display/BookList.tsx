/*
The book project lets a user keep track of different books they would like to read, are currently
reading, have read or did not finish.
Copyright (C) 2021  Karan Kumar

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <https://www.gnu.org/licenses/>.
*/

import React, { Component } from "react";
import { Book } from "../types/Book";
import "./BookList.css";
import { BOOK_OVERVIEW } from "../routes";
import { Link } from "react-router-dom";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import { Favorite, FavoriteBorder } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

const CHAR_LIMIT = 40;

export interface BookListProps {
  bookListData: Book[];
  searchText: string;
  favorites: Book[];
  addToFavorites: (book: Book) => void;
  removeFromFavorites: (book: Book) => void;
}

interface BookListState {
  bookListData: Book[];
  searchText: string;
  favorites: Book[];
}

interface SortingConfig {
  propertyName: string;
  ascendingOrder: boolean;
}

export default class BookList extends Component<BookListProps, BookListState> {
  constructor(props: BookListProps) {
    super(props);
    this.state = {
      bookListData: [...props.bookListData],
      searchText: props.searchText || "",
      favorites: props.favorites,
    };
  }

  componentDidMount(): void {
    if (this.state.searchText !== "") {
      this.setState({
        bookListData: this.filterBooks(),
      });
    }
    console.log("this.state.bookListData :", this.state.bookListData);
  }

  sortingConfigs: SortingConfig[] = [];
  nameToOrder = new Map<string, boolean>();

  filterBooks(): Book[] {
    return this.state.bookListData.filter((book) => {
      return book.title
        .toLowerCase()
        .includes(this.state.searchText.toLowerCase());
    });
  }

  sortBooks(books: Book[]): Book[] {
    const sortedBooks = [...books];
    this.sortingConfigs.forEach((config) => {
      const sortingMechanism = getSortingMechanism(config);
      sortedBooks.sort(sortingMechanism);
    });
    return sortedBooks;
  }

  sortBy = (propertyName: string): void => {
    const pendingChange = [...this.sortingConfigs];
    const sortingIndex = this.sortingConfigs.findIndex(
      (configuration) => configuration.propertyName === propertyName
    );
    if (sortingIndex !== -1) {
      const configuration: SortingConfig = this.sortingConfigs[sortingIndex];
      if (configuration.ascendingOrder) {
        pendingChange[sortingIndex] = { propertyName, ascendingOrder: false };
      } else {
        pendingChange.splice(sortingIndex, 1);
      }
    } else {
      pendingChange.push({ propertyName, ascendingOrder: true });
    }
    this.sortingConfigs = pendingChange;
    this.nameToOrder = getNameToOrder(pendingChange);
    this.setState(this.state);
  };

  isFavorite = (book: Book) => {
    return this.props.favorites.some((favBook) => favBook.id === book.id);
  };
  toggleFavorite = (book: Book) => {
    if (this.isFavorite(book)) {
      this.props.removeFromFavorites(book);
    } else {
      this.props.addToFavorites(book);
    }
  };

  render(): JSX.Element {
    return (
      <div className="booklist-container">
        <div className="booklist-container-headers booklist-book">
          <div className="booklist-book-thumbnail"></div>
          <div
            className="booklist-book-title"
            onClick={() => this.sortBy("title")}
          >
            Title{getSortingIcon("title", this.nameToOrder)}
          </div>
          <div
            className="booklist-book-author"
            onClick={() => this.sortBy("author")}
          >
            Author{getSortingIcon("author", this.nameToOrder)}
          </div>
          <div
            className="booklist-book-shelf"
            onClick={() => this.sortBy("shelf")}
          >
            Shelf{getSortingIcon("shelf", this.nameToOrder)}
          </div>
          <div
            className="booklist-book-genre"
            onClick={() => this.sortBy("genre")}
          >
            Genre{getSortingIcon("genre", this.nameToOrder)}
          </div>
          <div
            className="booklist-book-rating"
            onClick={() => this.sortBy("rating")}
          >
            Rating{getSortingIcon("rating", this.nameToOrder)}
          </div>
        </div>
        {this.sortBooks(this.state.bookListData)
          .map((book) => (
            <Link
              to={BOOK_OVERVIEW + "/" + book.id}
              style={{ textDecoration: "none", color: "black" }}
              key={book.id}
            >
              <div className="booklist-book">
                <div className="booklist-book-thumbnail">
                  {/* {book.title.length > CHAR_LIMIT ?
                        book.title.substring(0, CHAR_LIMIT) + "..." : book.title} */}
                  {book.img ? (
                    <img
                      src={book.img}
                      alt={book.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "2px",
                      }}
                      className="book-cover"
                    />
                  ) : (
                    <div className={book.img ? "book-details" : ""}>
                      {book.title}
                    </div>
                  )}
                </div>
                <div className="booklist-book-title">{book.title}</div>
                <div className="booklist-book-author">
                  {book.author.fullName}
                </div>
                <div className="booklist-book-shelf">
                  {book.predefinedShelf.shelfName}
                </div>
                <div className="booklist-book-genre">{book.bookGenre}</div>
                <div className="booklist-book-rating">{book.rating}</div>
                <IconButton
                  onClick={(e) => {
                    e.preventDefault(); // Prevent the default action of the link
                    e.stopPropagation(); // Stop the event from propagating to the parent Link component
                    this.toggleFavorite(book);
                  }}
                  style={{
                    color: this.isFavorite(book) ? "red" : "inherit",
                    marginTop: "-40px",
                  }}
                >
                  {this.isFavorite(book) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </div>
            </Link>
          ))
          .filter((_, index, array) => {
            // Show at least 20 books if they are from the "Recommendations" shelf
            return (
              array[index].props.children.props.children[4].props.children !==
                "Recommendations" || index < 20
            );
          })}
      </div>
    );
  }
}

function getSortingMechanism(
  config: SortingConfig
): (book1: Book, book2: Book) => number {
  const orderIndex = config.ascendingOrder ? 1 : -1;
  switch (config.propertyName) {
    default:
    case "title":
      return (book1: Book, book2: Book) =>
        orderIndex * book1.title.localeCompare(book2.title);
    case "author":
      return (book1: Book, book2: Book) =>
        orderIndex * book1.author.fullName.localeCompare(book2.author.fullName);
    case "shelf":
      return (book1: Book, book2: Book) =>
        orderIndex *
        book1.predefinedShelf.shelfName.localeCompare(
          book2.predefinedShelf.shelfName
        );
    case "genre":
      return (book1: Book, book2: Book) =>
        orderIndex *
        book1.bookGenre.toString().localeCompare(book2.bookGenre.toString());
    case "rating":
      return (book1: Book, book2: Book) => {
        if (!isRated(book1) && !isRated(book2)) {
          return 0;
        }
        if (!isRated(book1)) {
          return 1;
        }
        if (!isRated(book2)) {
          return -1;
        }
        return orderIndex * (getRating(book1) - getRating(book2));
      };
  }
}

function getRating(book: Book): number {
  return Number(book.rating.toString().split("/")[0]);
}

function isRated(book: Book): boolean {
  return book.rating.toString().includes("/");
}

function getNameToOrder(configurations: SortingConfig[]): Map<string, boolean> {
  const nameToOrder = new Map<string, boolean>();
  configurations.forEach((configuration) =>
    nameToOrder.set(configuration.propertyName, configuration.ascendingOrder)
  );
  return nameToOrder;
}

function getSortingIcon(
  propertyName: string,
  nameToOrder: Map<string, boolean>
): JSX.Element {
  const ascendingOrder = nameToOrder.get(propertyName);
  if (ascendingOrder === undefined) {
    return <div />;
  }
  if (ascendingOrder) {
    return (
      <ArrowDropUp
        fontSize="inherit"
        className="booklist-sorting-arrow-icons"
      />
    );
  }
  return (
    <ArrowDropDown
      fontSize="inherit"
      className="booklist-sorting-arrow-icons"
    />
  );
}
