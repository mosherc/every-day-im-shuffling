import { Card } from "../entities/Card";

export const compareDecks = (
  originalCards: Card[],
  prevCards: Card[],
  newCards: Card[],
  separatorIndex?: number
) => {
  const comparisonData = originalCards.map((card, index) => {
    const showSeparator = separatorIndex && index === separatorIndex - 1;
    return {
      "Original Card": card.toString(),
      "Previous Index": showSeparator
        ? `___${String(originalCards.indexOf(prevCards[index]))}___`
        : String(originalCards.indexOf(prevCards[index])),
      "Previous Card": showSeparator
        ? `___${prevCards[index].toString()}___`
        : prevCards[index].toString(),
      "New Index": String(originalCards.indexOf(newCards[index])),
      "New Card": newCards[index].toString(),
    };
  });

  // if (separatorIndex) {
  //   comparisonData.splice(separatorIndex, 0, {
  //     "Original Card": "---",
  //     "Previous Index": "---",
  //     "Previous Card": "---",
  //     "New Index": "---",
  //     "New Card": "---",
  //   });
  // }

  console.table(comparisonData);
};
