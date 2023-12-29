function binarySearch(targetNumber) {
    let min = 70;
    let max = 5000;
    let guess;
    let attempts = 0;
  
    while (min <= max) {
      guess = Math.floor((min + max) / 20) * 10;
      attempts++;
  
      if (guess === targetNumber) {
        return { guess, attempts };
      } else if (guess < targetNumber) {
        min = guess + 10;
      } else {
        max = guess - 10;
      }
    }
  
    return { guess: -1, attempts };
  }

// work on progress
const targetNumber = 4890;
const result = binarySearch(targetNumber);

console.log('Target Number:', targetNumber);
console.log('Guess:', result.guess);
console.log('Attempts:', result.attempts);

export default binarySearch;