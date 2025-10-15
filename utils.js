import fsp from 'fs/promises';

export async function createFolder(path) {
  await fsp.mkdir(path);
}

export async function writeFile(path, content = '') {
  await fsp.writeFile(path, content);
}

export async function readFile(path) {
  return await fsp.readFile(path, 'utf8');
}

export async function rmfile(path) {
  fsp.unlink(path);
}

export async function readdir(path) {
  return await fsp.readdir(path);
}

export function padLog(msg) {
  console.log('\n' + msg + '\n');
}
