import fs from 'fs';
import path from 'path';
import ucid from 'unique-custom-id';
import data from './data.js';
import {
  createFolder,
  padLog,
  readdir,
  readFile,
  rmfile,
  writeFile,
} from './utils.js';

export async function init() {
  if (!fs.existsSync(data.basedir)) {
    await createFolder(data.basedir);
    await branch(data.defaultBranch, false);
    await writeFile(data.branch, data.defaultBranch);
  } else {
    console.error('.zap repository already exists.');
    process.exit(1);
  }
  console.log('Initialized empty zap repository in', data.basedir);
}

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

  const obj = { id: ucid.format('short-uuid'), name, todos: [] };
  await writeFile(
    path.join(data.basedir, `${name}.json`),
    JSON.stringify(obj, null, 2)
  );
  log ? console.log('Created branch:', name) : null;
}

async function getBranchObject() {
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

async function writeBranchObject(branchObj) {
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
  await rmfile(path.join(data.basedir, `${name}.json`));
  console.log(`Deleted branch: ${name}`);
}

export async function moveTask(id, targetBranch) {
  const sourceBranch = await currentBranch();
  if (sourceBranch === targetBranch) {
    console.error('Source and target branches are the same.');
    process.exit(1);
  }
  const sourceObj = await getBranchObject();
  const todoIndex = sourceObj.todos.findIndex((todo) => todo.id === id);
  if (todoIndex === -1) {
    console.error(`Task with id ${id} not found in branch ${sourceBranch}.`);
    process.exit(1);
  }
  const [todo] = sourceObj.todos.splice(todoIndex, 1);
  await writeBranchObject(sourceObj);
  const targetFile = path.join(data.basedir, `${targetBranch}.json`);
  let targetObj;
  try {
    const content = await readFile(targetFile);
    targetObj = JSON.parse(content);
  } catch (err) {
    targetObj = {
      id: ucid.format('short-uuid'),
      name: targetBranch,
      todos: [],
    };
  }
  targetObj.todos.push(todo);
  await writeBranchObject(targetObj);
  console.log(`Moved task id ${id} from ${sourceBranch} to ${targetBranch}.`);
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

export async function addTask(task) {
  if (!task) {
    console.error('Please provide a task.');
    process.exit(1);
  }
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const id = todos.length ? todos[todos.length - 1].id + 1 : 1;
  const createdAt = new Date().toISOString();
  todos.push({ id, task, completed: false, createdAt });
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  console.log(`Added todo: ${task}`);
}

export async function getTodos() {
  const branchObj = await getBranchObject();
  return branchObj.todos || [];
}

export async function listTasks() {
  const todos = await getTodos();
  if (todos.length === 0) {
    console.log('No tasks found.');
    return;
  }
  todos.forEach((todo) => {
    console.log(`${todo.id}. [${todo.completed ? 'x' : ' '}] ${todo.task}`);
  });
}

export async function completeTask(id) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }
  todos[index].completed = true;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  console.log(`Completed task: ${todos[index].task}`);
}

export async function incompleteTask(id) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }
  todos[index].completed = false;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  console.log(`Marked task as incomplete: ${todos[index].task}`);
}

export async function deleteTask(id) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }
  const [deleted] = todos.splice(index, 1);
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  console.log(`Deleted task: ${deleted.task}`);
}

export async function updateTask(id, task) {
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const index = todos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }

  if (!task) {
    console.error('Please provide a new task description.');
    process.exit(1);
  }

  const updated = { ...todos[index], task };
  todos[index] = updated;
  branchObj.todos = todos;
  await writeBranchObject(branchObj);
  console.log(`Updated task: ${updated.task}`);
}
