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

import React from "react";
import { useQuery, gql } from "@apollo/client";
import recommendationsPool from "../../../src/recommendations_pool.json";
import booksDataset from "../../../src/books_dataset.json";

interface ISearchResultProps {
  query: string;
}

export default function SearchResults({
  query,
}: ISearchResultProps): JSX.Element {
  const searchQuery = query.toLowerCase().trim();

  const combinedBooks = [...recommendationsPool, ...booksDataset];

  const filteredResults = combinedBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.fullName.toLowerCase().includes(searchQuery)
  );

  if (!query) {
    return <></>;
  }

  return (
    <div className="query-results-container">
      {" "}
      {filteredResults.length > 0 ? (
        filteredResults.map((book) => (
          <div key={book.id} className="booklist-book">
            {" "}
            <div className="booklist-book-thumbnail">
              {" "}
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
                  {" "}
                  {book.title}{" "}
                </div>
              )}{" "}
            </div>{" "}
            <div className="query-result">
              {" "}
              <div className="booklist-book-title">{book.title}</div>{" "}
              <div className="booklist-book-author">
                {" "}
                by {book.author.fullName}{" "}
              </div>{" "}
            </div>{" "}
          </div>
        ))
      ) : (
        <p>No results found for "{query}".</p>
      )}{" "}
    </div>
  );
}
