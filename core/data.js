import fs from 'fs';
import path from 'path';

function readPackageVersion() {
  const candidates = [
    path.resolve(process.cwd(), 'package.json'),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (pkg && pkg.version) return pkg.version;
      }
    } catch (e) {
      // ignore
    }
  }
  return null;
}

const version = readPackageVersion() || '0.0.0';

export const data = {
  basedir: path.join('.', '.zap'),
  branch: path.join('.', '.zap', 'branch'),
  defaultBranch: 'main',
  version,
};

export default data;
