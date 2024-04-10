/*
The book project lets a user keep track of different books they would like to read, are currently
reading, have read or did not finish.
Copyright (C) 2020  Karan Kumar

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <https://www.gnu.org/licenses/>.
*/

import React, { ReactElement } from "react";
import "./ShelfCarousel.css";
import { Icon, Paper, IconButton } from "@material-ui/core";
import { Book } from "../types/Book";
import { Component } from "react";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

function ShelfBook(props: BookProps): JSX.Element {
  const bookClass = "book" + (props.img ? " with-image" : "");
  const displayTitle =
    props.title.length > 12
      ? props.title.substring(0, 12) + "..."
      : props.title;

  return (
    <Paper className={bookClass} variant="elevation" square={false}>
      {props.img ? (
        <img
          src={props.img}
          alt={props.title}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            borderRadius: "2px",
          }}
          className="book-cover"
        />
      ) : (
        <div className={props.img ? "book-details" : ""}>{displayTitle}</div>
      )}
    </Paper>
  );
}

type BookProps = {
  title: string;
  img: string;
};

interface IShelfCarouselState {
  title: string;
  books: Book[];
  viewAllClicked: boolean;
  favorites: Book[];
}

export default class ShelfCarousel extends Component<
  ShelfCarouselProps,
  IShelfCarouselState
> {
  constructor(props: ShelfCarouselProps) {
    super(props);
    this.state = {
      title: props.title,
      books: props.books,
      viewAllClicked: false,
      favorites: [],
    };
    this.searchText = props.searchText;
  }

  componentDidMount(): void {
    this.setState({
      favorites: this.props.favorites,
      books: this.searchText !== "" ? this.filterBooks() : this.state.books,
    });
  }

  searchText = "";

  filterBooks(): Book[] {
    return this.state.books.filter((book) => {
      return book.title.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  render(): JSX.Element {
    return (
      <div className="shelf-container">
        <span className="shelf-title">{this.state.title}</span>
        {/* <span className="view-all">View All</span> */}
        <div className="clear" />
        <div className="books-and-shelf">
          <div className="book-wrap">
            {this.renderShelfBook(this.state.books)}
            {/* <AddBook /> */}
            <div className="clear" />
          </div>
          <div className="shelf"></div>
        </div>
      </div>
    );
  }

  isFavorite(book: Book): boolean {
    return this.state.favorites.some((favBook) => favBook.id === book.id);
  }

  toggleFavorite = (book: Book) => {
    console.log("Toggle Favorite Called");
    let updatedFavorites = [...this.state.favorites];
    console.log("Initial updatedFavorites:", updatedFavorites);
    const isCurrentlyFavorite = updatedFavorites.some(
      (favBook) => favBook.id === book.id
    );
    console.log("isCurrentlyFavorite:", isCurrentlyFavorite);

    if (isCurrentlyFavorite) {
      updatedFavorites = updatedFavorites.filter(
        (favBook) => favBook.id !== book.id
      );
      this.props.removeFromFavorites && this.props.removeFromFavorites(book);
    } else {
      updatedFavorites.push(book);
      this.props.addToFavorites && this.props.addToFavorites(book);
    }

    this.setState({ favorites: updatedFavorites }, () => {
      console.log("Updated Favorites:", this.state.favorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    });
  };

  renderShelfBook(books: Book[]): ReactElement[] {
    const elements = Array<ReactElement>();
    const maxBooksToDisplay = Math.min(books.length, 6);
    for (let i = 0; i < maxBooksToDisplay; i++) {
      elements.push(
        <div key={books[i].id}>
          <ShelfBook title={books[i].title} img={books[i].img} />
          {this.props.showAddToFavorites && (
            <IconButton
              onClick={() => {
                this.toggleFavorite(books[i]);
                console.log("clicked :", books[i]);
              }}
              style={{
                color: this.isFavorite(books[i]) ? "red" : "inherit",
                padding: 0,
              }}
            >
              {this.isFavorite(books[i]) ? <Favorite /> : <FavoriteBorder />}{" "}
            </IconButton>
          )}
        </div>
      );
    }
    return elements;
  }
}
type ShelfCarouselProps = {
  title: string;
  books: Book[];
  searchText: string;
  addToFavorites?: (book: Book) => void;
  removeFromFavorites?: (book: Book) => void;
  showAddToFavorites?: boolean;
  favorites: Book[];
};
