export const CardValues = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'] as const;
export const CardSuits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'] as const;

type CardValue = typeof CardValues[number];
type CardSuit = typeof CardSuits[number];
type CardType = 'Normal' | 'Joker';

export class Card {
  private _value: CardValue | null;
  private _suit: CardSuit | null;
  private _type: CardType;

  constructor(type: CardType, value?: CardValue, suit?: CardSuit) {
    this._type = type;

    if (type === 'Normal') {
      if (value === undefined || suit === undefined) {
        throw new Error('Value and suit are required for normal cards');
      }

      this._value = value;
      this._suit = suit;
    } else {
      this._value = null;
      this._suit = null;
    }
  }

  get value(): CardValue | null {
    return this._value;
  }

  get suit(): CardSuit | null {
    return this._suit;
  }

  get type(): CardType {
    return this._type;
  }

  set value(value: CardValue | null) {
    if (this._type === 'Normal') {
      this._value = value;
    }
  }

  set suit(suit: CardSuit | null) {
    if (this._type === 'Normal') {
      this._suit = suit;
    }
  }

  toString(): string {
    if (this._type === 'Joker') {
      return 'Joker';
    } else {
      return `${this._value} of ${this._suit}`;
    }
  }
}