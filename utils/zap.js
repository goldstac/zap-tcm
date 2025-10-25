import fs from 'fs';
import path from 'path';
import { readFile } from '../utils/fs.js';

export async function readPackageVersion() {
  try {
    const packageJsonPath = path.join('.', 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const content = await readFile(packageJsonPath);
      const parsed = JSON.parse(content);
      return parsed.version;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function sliceSHA(sha) {
  if (sha.length <= 7) {
    return sha;
  }
  return sha.slice(0, 7);
}
