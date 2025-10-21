import path from 'path';
import ucid from 'unique-custom-id';
import { readdir, readFile, rmfile, writeFile } from '../utils/fs.js';
import { padLog } from '../utils/log.js';
import data from './data.js';

export async function branch(name, log = true) {
  if (!name) {
    const branches = await readdir(data.basedir);
    const currentbr = await currentBranch();
    branches.forEach((b, i) => {
      branches[i] = b.replace('.json', b === `${currentbr}.json` ? ' *' : '');
    });
    branches.splice(branches.indexOf('branch'), 1);
    padLog(branches.join('\n'));
    return;
  }

  const id = ucid.format('short-uuid');

  const obj = { id: id, name, todos: [] };
  await writeFile(
    path.join(data.basedir, `${name}.json`),
    JSON.stringify(obj, null, 2)
  );
  log ? console.log(`Created branch: ${name} [${id}]`) : null;
}

export async function getBranchObject() {
  const br = await currentBranch();
  const file = path.join(data.basedir, `${br}.json`);
  try {
    const content = await readFile(file);
    const parsed = JSON.parse(content || '[]');

    if (Array.isArray(parsed)) {
      const obj = { id: ucid.format('short-uuid'), name: br, todos: parsed };
      await writeFile(file, JSON.stringify(obj, null, 2));
      return obj;
    }
    if (parsed && typeof parsed === 'object') {
      parsed.todos = parsed.todos || [];
      parsed.name = parsed.name || br;
      parsed.id = parsed.id || ucid.format('short-uuid');
      return parsed;
    }
    const obj = { id: ucid.format('short-uuid'), name: br, todos: [] };
    await writeFile(file, JSON.stringify(obj, null, 2));
    return obj;
  } catch (err) {
    const obj = { id: ucid.format('short-uuid'), name: br, todos: [] };
    await writeFile(file, JSON.stringify(obj, null, 2));
    return obj;
  }
}

export async function writeBranchObject(branchObj) {
  const file = path.join(data.basedir, `${branchObj.name}.json`);
  await writeFile(file, JSON.stringify(branchObj, null, 2));
}

export async function deleteBranch(name) {
  if (!name) {
    console.error('Please provide a branch name to delete.');
    process.exit(1);
  }
  const branches = await readdir(data.basedir);
  const exists = branches.includes(`${name}.json`);
  if (!exists) {
    console.error(`Branch ${name} does not exist.`);
    process.exit(1);
  }
  const raw = await readFile(path.join(data.basedir, `${name}.json`));
  const id = JSON.parse(raw).id;
  await rmfile(path.join(data.basedir, `${name}.json`));
  console.log(`Deleted branch ${name} [${id}]`);
}

export async function mergeBranches(sourceBranch, targetBranch) {
  if (!targetBranch) {
    targetBranch = await currentBranch();
  }
  if (!sourceBranch) {
    console.error('Please provide a source branch to merge from.');
  }
  if (sourceBranch === targetBranch) {
    console.error("Source and target branches can't be the same.");
    process.exit(1);
  }
  const sourceFile = path.join(data.basedir, `${sourceBranch}.json`);
  const targetFile = path.join(data.basedir, `${targetBranch}.json`);
  let sourceObj, targetObj;
  try {
    const sourceContent = await readFile(sourceFile);
    sourceObj = JSON.parse(sourceContent);
  } catch (err) {
    console.error(`Source branch ${sourceBranch} does not exist.`);
    process.exit(1);
  }
  try {
    const targetContent = await readFile(targetFile);
    targetObj = JSON.parse(targetContent);
  } catch (err) {
    targetObj = {
      id: ucid.format('short-uuid'),
      name: targetBranch,
      todos: [],
    };
  }
  targetObj.todos = targetObj.todos.concat(sourceObj.todos);
  await writeBranchObject(targetObj);
  console.log(`Merged branch ${sourceBranch} into ${targetBranch}.`);
}

export async function importExportBranch(name, direction, filepath) {
  if (!name || !direction || !filepath) {
    console.error(
      'Please provide branch name, direction (import/export), and file path.'
    );
    process.exit(1);
  }
  const file = path.join(data.basedir, `${name}.json`);
  if (direction === 'export') {
    const branchObj = await getBranchObject();
    await writeFile(filepath, JSON.stringify(branchObj, null, 2));
    console.log(`Exported branch ${name} to ${filepath}`);
  } else if (direction === 'import') {
    const content = await readFile(filepath);
    await writeFile(file, content);
    console.log(`Imported branch ${name} from ${filepath}`);
  } else {
    console.error('Direction must be either "import" or "export".');
    process.exit(1);
  }
}

export async function switchBranch(br) {
  const branches = await readdir(data.basedir);
  const exists = branches.includes(`${br}.json`);
  if (!exists) {
    await branch(br);
    await writeFile(data.branch, br);
  } else {
    await writeFile(data.branch, br);
  }
  console.log(`Switched to branch: ${br}`);
}

export async function currentBranch() {
  const br = await readFile(data.branch);
  return br.trim();
}
