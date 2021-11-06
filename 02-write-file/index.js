const fs = require('fs');
const path = require('path');
const { stdout, stdin } = process;

const output = fs.createWriteStream(path.join(__dirname, 'output.txt'));

stdout.write('Hello. Why did you decide to become a programmer?\n');

stdin.on('data', (data) => {
  if (data.toString() === 'exit\n') process.exit();

  output.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('\nBest of luck!\n'));
