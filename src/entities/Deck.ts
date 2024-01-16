import { compareDecks } from "../commands/compareDecks";
import { cut } from "../commands/cut";
import { shuffleRanking } from "../commands/shuffleRanking";
import { Card, CardSuits, CardValues } from "./Card";

interface DeckOptions {
  decks?: number;
  shuffled?: boolean;
  includeJokers?: boolean;
}

export class Deck {
  private _cards: Card[];
  private _drawnCards: Card[];
  private _decks: number;
  private _shuffled: boolean;
  private _includeJokers: boolean;
  private _newCards: Card[];

  constructor({ decks = 1, shuffled = false, includeJokers = false }: DeckOptions) {
    this._cards = [];
    this._decks = decks;
    this._includeJokers = includeJokers;
    this._shuffled = false;
    this._drawnCards = [];

    for (let i = 0; i < decks; i++) {
      if (includeJokers) {
        this._cards.push(new Card('Joker'), new Card('Joker'));
      }

      for (const suit of CardSuits) {
        for (const value of CardValues) {
          this._cards.push(new Card('Normal', value, suit));
        }
      }
    }

    this._newCards = [...this._cards];

    if (shuffled) {
      this.shuffle();
    }
  }

  get cards(): Card[] {
    return this._cards;
  }

  shuffle(): void {
    const shuffledCards = [];
    const originalDeck = [...this._cards];
    const prevDeck = [...this._cards];

    while (this._cards.length > 0) {
      const randomIndex = Math.floor(Math.random() * this._cards.length);
      const card = this._cards.splice(randomIndex, 1)[0];
      shuffledCards.push(card);
    }

    this._cards = shuffledCards;
    this._shuffled = true;

    compareDecks(originalDeck, prevDeck, this._cards);
  }

  riffleShuffle(randomness: number, cutStdDev: number): void {
    const shuffledCards = [];
    const originalDeck = [...this._newCards];
    const prevDeck = [...this._cards];

    const { firstHalf, secondHalf } = this.cut(cutStdDev);

    while (firstHalf.length > 0 && secondHalf.length > 0) {
      const randomIndex = Math.random() * 100 < randomness ? Math.round(Math.random()) : 0;

      if (randomIndex === 0) {
        shuffledCards.push(firstHalf.shift()!, secondHalf.shift()!);
      } else {
        shuffledCards.push(secondHalf.shift()!, firstHalf.shift()!);
      }
    }

    // Push any remaining cards
    shuffledCards.push(...firstHalf, ...secondHalf);

    this._cards = shuffledCards;
    this._shuffled = true;

    compareDecks(originalDeck, prevDeck, this._cards);
    console.log(`Shuffle ranking: ${this.shuffleRanking()}`);
  }

  cut(cutStdDev: number) {
    return cut(this._cards, cutStdDev);
  }

  cutAndJoin(cutStdDev: number): void {
    const originalDeck = [...this._newCards];
    const prevDeck = [...this._cards];
    const { firstHalf, secondHalf, index } = this.cut(cutStdDev);
    this._cards = [...secondHalf, ...firstHalf];
    compareDecks(originalDeck, prevDeck, this._cards, index);
  }

  draw(): Card | null {
    if (this._cards.length === 0) {
      return null;
    }

    const drawn = this._cards.pop()!;
    this._drawnCards.push(drawn);
    return drawn;
  }

  drawMultiple(numberOfCards: number): Card[] {
    const drawn = [];
    for (let i = 0; i < numberOfCards; i++) {
      const card = this.draw();
      if (card === null) {
        break;
      }
      drawn.push(card);
    }
    return drawn;
  }

  drawnCards(): Card[] {
    return this._drawnCards;
  }

  drawnCardsToString(): string {
    return this._drawnCards.map((card) => card.toString()).join('\n');
  }

  drawnCardsLogTable(): void {
    console.table(this._drawnCards.map((card) => ({ Suit: card.suit, Value: card.value })));
  }

  isShuffled(): boolean {
    // check if the deck is currently like a new deck or shuffled
    const newCards = this._newCards;
    const currentCards = this._cards;

    if (newCards.length !== currentCards.length) {
      return false;
    }

    return !newCards.some((card, i) => {
      return card.value !== currentCards[i].value || card.suit !== currentCards[i].suit;
    });
  }

  toString(): string {
    return this._cards.map((card) => card.toString()).join('\n');
  }

  logTable(): void {
    console.table(this._cards.map((card) => ({ Suit: card.suit, Value: card.value })));
  }

  shuffleRanking(): number {
    return shuffleRanking(this._newCards, this._cards);
  }

  get deckLength(): number {
    return this._cards.length;
  }

  get hasJokers(): boolean {
    return this._includeJokers;
  }
}
