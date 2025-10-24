import fs from 'fs';
import path from 'path';
import { readFile } from '../utils/fs.js';

async function readPackageVersion() {
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

const version = await readPackageVersion() || '0.0.0';

export const data = {
  basedir: path.join('.', '.zap'),
  branch: path.join('.', '.zap', 'branch'),
  defaultBranch: 'main',
  version,
};

export default data;
