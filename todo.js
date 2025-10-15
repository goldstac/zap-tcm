import fs from 'fs';
import path from 'path';
import data from './data.js';
import {
  createFolder,
  padLog,
  readdir,
  readFile,
  rmfile,
  writeFile,
} from './utils/utils.js';

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
  await writeFile(path.join(data.basedir, `${name}.json`), '[]');
  log ? console.log('Created branch:', name) : null;
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
  const br = await currentBranch();
  const todos = await getTodos();
  const id = todos.length ? todos[todos.length - 1].id + 1 : 1;
  const createdAt = new Date().toISOString();
  todos.push({ id, task, done: false, createdAt });
  await writeFile(
    path.join(data.basedir, `${br}.json`),
    JSON.stringify(todos, null, 2)
  );
  console.log(`Added todo: ${task}`);
}

export async function getTodos() {
  const br = await currentBranch();
  const todos = await readFile(path.join(data.basedir, `${br}.json`));
  return JSON.parse(todos || '[]');
}

export async function listTasks() {
  const todos = await getTodos();
  if (todos.length === 0) {
    console.log('No tasks found.');
    return;
  }
  todos.forEach((todo) => {
    console.log(`${todo.id}. [${todo.done ? 'x' : ' '}] ${todo.task}`);
  });
}

export async function completeTask(id) {
  const todos = await getTodos();
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }
  todos[index].done = true;
  await writeFile(
    path.join(data.basedir, `${await currentBranch()}.json`),
    JSON.stringify(todos, null, 2)
  );
  console.log(`Completed task: ${todos[index].task}`);
}

export async function incompleteTask(id) {
  const todos = await getTodos();
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }
  todos[index].done = false;
  await writeFile(
    path.join(data.basedir, `${await currentBranch()}.json`),
    JSON.stringify(todos, null, 2)
  );
  console.log(`Marked task as incomplete: ${todos[index].task}`);
}

export async function deleteTask(id) {
  const todos = await getTodos();
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    console.error(`Task with id ${id} not found.`);
    process.exit(1);
  }
  const [deleted] = todos.splice(index, 1);
  await writeFile(
    path.join(data.basedir, `${await currentBranch()}.json`),
    JSON.stringify(todos, null, 2)
  );
  console.log(`Deleted task: ${deleted.task}`);
}

export async function updateTask(id, task) {
  const todos = await getTodos();
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

  await writeFile(
    path.join(data.basedir, `${await currentBranch()}.json`),
    JSON.stringify(todos, null, 2)
  );
  console.log(`Updated task: ${updated.task}`);
}
