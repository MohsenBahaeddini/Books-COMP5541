import { generateRecommendations } from "../generateRecommendations";
import { Book } from "../../shared/types/Book";

describe("generateRecommendations", () => {
  it("should generate recommendations based on user books", () => {
    const userBooks: Book[] = [
      {
        id: 1,
        title: "Book 1",
        bookGenre: ["Fiction"],
        img: "",
        author: { fullName: "" },
        predefinedShelf: { shelfName: "" },
        numberOfPages: 0,
        rating: 0,
      }
    ];
    const allBooks: Book[] = [
      {
        id: 3,
        title: "Book 3",
        bookGenre: ["Fiction"],
        img: "",
        author: { fullName: "" },
        predefinedShelf: { shelfName: "" },
        numberOfPages: 0,
        rating: 0,
      },
      {
        id: 4,
        title: "Book 4",
        bookGenre: ["Non-Fiction"],
        img: "",
        author: { fullName: "" },
        predefinedShelf: { shelfName: "" },
        numberOfPages: 0,
        rating: 0,
      },
      {
        id: 5,
        title: "Book 5",
        bookGenre: ["Fiction"],
        img: "",
        author: { fullName: "" },
        predefinedShelf: { shelfName: "" },
        numberOfPages: 0,
        rating: 0,
      },
    ];

    const recommendations = generateRecommendations(allBooks, userBooks);

    expect(recommendations).toHaveLength(2);
    expect(recommendations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 3 }),
        expect.objectContaining({ id: 5 }),
      ])
    );
  });
});
