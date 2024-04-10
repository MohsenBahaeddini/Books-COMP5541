// /*
// The book project lets a user keep track of different books they would like to read, are currently
// reading, have read or did not finish.
// Copyright (C) 2020  Karan Kumar

// This program is free software: you can redistribute it and/or modify it under the terms of the
// GNU General Public License as published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
// PURPOSE.  See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License along with this program.
// If not, see <https://www.gnu.org/licenses/>.
// */

import React, { Component, ReactElement } from "react";
import { Book } from "../types/Book";
import ShelfCarousel from "./ShelfCarousel";

interface IShelfProps {
  favorites: Book[];
  readingBooks: Book[];
  toReadBooks: Book[];
  readBooks: Book[];
  didNotFinishBooks: Book[];
  searchText: string;
  recommendedBooks: Book[];
  addToFavorites: (book: Book) => void;
  removeFromFavorites: (book: Book) => void;
}

export default class ShelfView extends Component<IShelfProps> {
  render(): ReactElement {
    const {
      readingBooks,
      toReadBooks,
      readBooks,
      didNotFinishBooks,
      searchText,
      recommendedBooks,
      favorites,
      addToFavorites,
    } = this.props;

    return (
      <div>
        <ShelfCarousel
          title="Favorites"
          books={favorites}
          searchText={searchText}
          addToFavorites={addToFavorites}
          showAddToFavorites={true}
          removeFromFavorites={this.props.removeFromFavorites}
          favorites={favorites}
        />
        <ShelfCarousel
          title="Reading"
          books={readingBooks}
          searchText={searchText}
          addToFavorites={addToFavorites}
          showAddToFavorites={true}
          removeFromFavorites={this.props.removeFromFavorites}
          favorites={favorites}
        />
        <ShelfCarousel
          title="To Read"
          books={toReadBooks}
          searchText={searchText}
          addToFavorites={addToFavorites}
          showAddToFavorites={true}
          removeFromFavorites={this.props.removeFromFavorites}
          favorites={favorites}
        />
        <ShelfCarousel
          title="Read"
          books={readBooks}
          searchText={searchText}
          addToFavorites={addToFavorites}
          showAddToFavorites={true}
          removeFromFavorites={this.props.removeFromFavorites}
          favorites={favorites}
        />
        <ShelfCarousel
          title="Did not finish"
          books={didNotFinishBooks}
          searchText={searchText}
          addToFavorites={addToFavorites}
          showAddToFavorites={true}
          removeFromFavorites={this.props.removeFromFavorites}
          favorites={favorites}
        />
        <ShelfCarousel
          title="Recommendations"
          books={recommendedBooks}
          searchText={searchText}
          addToFavorites={addToFavorites}
          showAddToFavorites={true}
          removeFromFavorites={this.props.removeFromFavorites}
          favorites={favorites}
        />
      </div>
    );
  }
}
