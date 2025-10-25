import path from 'path';
import { getGlobalConfig, getLocalConfig } from '../core/config.js';
import { readPackageVersion } from '../utils/zap.js';

const version = (await readPackageVersion()) || '0.0.0';
const globalConfig = await getGlobalConfig();
const localConfig = await getLocalConfig();

export const data = {
  basedir: path.join('.', '.zap'),
  branch: path.join('.', '.zap', 'branch'),
  version,
  globalConfig,
  localConfig,
};

export default data;
