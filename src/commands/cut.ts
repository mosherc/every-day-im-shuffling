import { Card } from "../entities/Card";

export const cut = (cards: Card[], cutStdDev: number) => {
  let half;
  if (cutStdDev === 0) {
    half = Math.floor(cards.length / 2);
  } else {
    // Generate a normally distributed random number for the cut index
    // u and v are two independent random variables that are uniformly distributed between 0 and 1
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    // Box-Muller transform
    let cutIndex = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    cutIndex = cutIndex * cutStdDev + cards.length / 2;
    half = Math.round(cutIndex);
  }

  half = Math.max(0, Math.min(cards.length, half));

  console.log(`Cutting between index ${half - 1} and ${half} of ${cards.length - 1} max index.`);

  let firstHalf = cards.slice(0, half);
  let secondHalf = cards.slice(half);
  return { firstHalf, secondHalf, index: half };
}