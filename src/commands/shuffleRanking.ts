import { Card } from "../entities/Card";

export const shuffleRanking = (baseDeck: Card[], comparedDeck: Card[]): number => {
  // Use Spearman's rank correlation coefficient to determine how shuffled the current deck is to a new deck with the same constructor options
  // https://en.wikipedia.org/wiki/Spearman%27s_rank_correlation_coefficient
  // https://www.statisticshowto.com/spearmans-rank-correlation-definition-calculate/
  // https://www.statisticshowto.com/probability-and-statistics/correlation-coefficient-formula/
  // https://www.statisticshowto.com/probability-and-statistics/sampling-distributions/spearman-rank-correlation-definition-calculate/
  const newCards = baseDeck;
  const currentCards = comparedDeck;

  const newCardIndicesMap = new Map(newCards.map((card, index) => [`${card.value}-${card.suit}`, index]));

  let sumOfSquaredDifferences = 0;
  currentCards.forEach((card, index) => {
    const newCardIndex = newCardIndicesMap.get(`${card.value}-${card.suit}`);
    if (newCardIndex !== undefined) {
      const difference = newCardIndex - index;
      sumOfSquaredDifferences += difference ** 2;
    }
  });

  const n = currentCards.length;
  const rho = 1 - ((6 * sumOfSquaredDifferences) / (n * (n**2 - 1)));

  return rho;
}