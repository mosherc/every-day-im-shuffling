// Use inquirer to prompt the user for the options to create the deck

import { input, confirm, select } from "@inquirer/prompts";
import { Deck } from "./entities/Deck";

const promptNumberOfDecks = async (): Promise<number> => {
  return parseInt(await input({
    message: 'How many decks would you like to use?',
    default: '1',
    validate: (input) => {
      if (isNaN(Number(input))) {
        return 'Please enter a valid number';
      }
      return true;
    }
  }));
};
const promptShuffled = async () => {
  return await confirm({
    message: 'Would you like the deck to be shuffled?',
    default: false,
  })
};
const promptJokers = async () => {
  return await confirm({
    message: 'Would you like the deck to include jokers?',
    default: false
  })
};
const promptActions = async () => {
  return await select({
    message: 'What would you like to do?',
    choices: [
      { name: 'Riffle shuffle', value: 'riffleShuffle' },
      { name: 'Shuffle', value: 'shuffle' },
      { name: 'Cut', value: 'cutAndJoin' },
      { name: 'Draw', value: 'draw' },
      { name: 'Draw multiple', value: 'drawMultiple'},
      { name: 'Rank Shuffle', value: 'shuffleRanking'},
      { name: 'Tell me my cards', value: 'tellMeMyCards'},
      { name: 'Tell me my drawn cards', value: 'tellMeMyDrawnCards'},
      { name: 'Exit', value: 'exit' },
    ]
  })
};
const promptCutStdDev = async () => {
  return parseFloat(await input({
    message: 'How perfect do you want the cut to be in terms of standard deviation? Good values are 0-5',
    default: '0',
    validate: (input) => {
      if (isNaN(Number(input)) || Number(input) < 0 || Number(input) > 100) {
        return 'Please enter a valid number';
      }
      return true;
    }
  }));
};
const promptNumberOfAction = async () => {
  return parseInt(await input({
    message: 'How many times would you like to perform this action?',
    default: '1',
    validate: (input) => {
      if (isNaN(parseInt(input))) {
        return 'Please enter a valid number';
      }
      return true;
    }
  }));
};
const promptRiffleShuffle = async () => {
  const randomness = parseFloat(await input({
    message: 'How random would you like the shuffle to be? (0-100)',
    default: '0',
    validate: (input) => {
      if (isNaN(Number(input)) || Number(input) < 0 || Number(input) > 100) {
        return 'Please enter a valid number';
      }
      return true;
    }
  }));
  const cutStdDev = await promptCutStdDev();
  const numberOfShuffles = await promptNumberOfAction();
  return { randomness, cutStdDev, numberOfShuffles };
};
const promptNumberOfCards = async () => {
  return parseInt(await input({
    message: 'How many cards would you like to draw?',
    validate: (input) => {
      if (isNaN(parseInt(input))) {
        return 'Please enter a valid number';
      }
      return true;
    }
  }));
};

let numberOfDecks = await promptNumberOfDecks();

while (typeof numberOfDecks !== 'number' || numberOfDecks < 1) {
  console.log('Please enter a valid number of decks');
  numberOfDecks = await promptNumberOfDecks();
}

const shuffled = await promptShuffled();
const jokers = await promptJokers();

// Create the deck with the options
const deck = new Deck({ decks: numberOfDecks, shuffled, includeJokers: jokers });

let action;

while (action !== 'exit') {
  action = await promptActions();

  switch (action) {
    case 'riffleShuffle':
      const { randomness, cutStdDev, numberOfShuffles } = await promptRiffleShuffle();
      for (let i = 0; i < numberOfShuffles; i++) {
        deck.riffleShuffle(randomness, cutStdDev);
      }
      break;
    case 'shuffle':
      deck.shuffle();
      break;
    case 'cutAndJoin':
      const cutAndJoinStdDev = await promptCutStdDev();
      const numberOfCuts = await promptNumberOfAction();
      for (let i = 0; i < numberOfCuts; i++) {
        deck.cutAndJoin(cutAndJoinStdDev);
      }
      break;
    case 'draw':
      const card = deck.draw();
      console.log(card?.toString() ?? 'No cards left in the deck');
      break;
    case 'drawMultiple':
      const numberOfCards = await promptNumberOfCards();
      const cards = deck.drawMultiple(numberOfCards);
      console.table(cards.map((card) => ({ Suit: card.suit, Value: card.value })));
      break;
    case 'shuffleRanking':
      const ranking = deck.shuffleRanking();
      console.log(`The current deck has a ${ranking.toFixed(2)} correlation to a new deck with the same options.`);
      break;
    case 'tellMeMyCards':
      deck.logTable();
      break;
    case 'tellMeMyDrawnCards':
      deck.drawnCardsLogTable()
      break;
    case 'exit':
      console.log('Goodbye');
      break;
  }
}