import React from "react";
import { Book } from "../types/Book";
import BookList from "./BookList";
import { RouteComponentProps } from "react-router-dom";

interface ViewAllBooksProps
  extends RouteComponentProps<{}, {}, { books: Book[]; shelfTitle: string }> {}

const ViewAllBooks: React.FC<ViewAllBooksProps> = ({ location }) => {
  const { books, shelfTitle } = location.state as {
    books: Book[];
    shelfTitle: string;
  };
  return (
    <div>
      <h2>{shelfTitle}</h2>
      <BookList
        bookListData={books}
        searchText=""
        favorites={[]}
        addToFavorites={() => {}}
        removeFromFavorites={() => {}}
      />
    </div>
  );
};

export default ViewAllBooks;
