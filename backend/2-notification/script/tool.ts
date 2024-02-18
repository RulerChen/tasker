import fsPromises from 'fs/promises';

const src = './src/emails';
const dest = './build/src/emails';

async function move(): Promise<void> {
  await fsPromises.cp(src, dest, { recursive: true });
}

move();
