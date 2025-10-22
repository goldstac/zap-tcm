import path from 'path';
import { readdir, readFile } from '../utils/fs.js';
import { getBranchObject } from './branch.js';
import data from './data.js';

export async function searchTodos(keyword) {
  if (!keyword) {
    console.error('Please provide a keyword to search for.');
    process.exit(1);
  }
  const branchObj = await getBranchObject();
  const todos = branchObj.todos;
  const results = todos.filter((todo) =>
    todo.task.toLowerCase().includes(keyword.toLowerCase())
  );
  if (results.length === 0) {
    console.log('No matching tasks found.');
    return;
  }
  console.log(
    `Found ${results.length} matching task${results.length > 1 ? 's' : ''}:`
  );
  results.forEach((todo) => {
    console.log(
      `${todo.id}. [${todo.completed ? 'x' : ' '}] ${todo.task}${
        todo.tag ? ` (${todo.tag})` : ``
      }`
    );
  });
}

// function to search todos across all branches, there is no need of branchFile because we are searching the entire .zap repository for branches

export async function searchTodosGlobally(keyword) {
  if (!keyword) {
    console.error('Please provide a keyword to search for.');
    process.exit(1);
  }
  const branchFiles = await readdir(data.basedir);
  let allResults = [];
  for (const file of branchFiles) {
    if (file === 'branch') continue;
    const content = await readFile(path.join(data.basedir, file));
    const branchObj = JSON.parse(content);
    const todos = branchObj.todos || [];
    const results = todos.filter((todo) =>
      todo.task.toLowerCase().includes(keyword.toLowerCase())
    );
    results.forEach((todo) => {
      allResults.push({
        branch: branchObj.name,
        id: todo.id,
        task: todo.task,
        completed: todo.completed,
        tag: todo.tag,
      });
    });
  }
  if (allResults.length === 0) {
    console.log('No matching tasks found across all branches.');
    return;
  }
  console.log(
    `Found ${allResults.length} matching task${
      allResults.length > 1 ? 's' : ''
    } across all branches:`
  );
  allResults.forEach((todo) => {
    console.log(
      `[${todo.branch}] ${todo.id}. [${todo.completed ? 'x' : ' '}] ${
        todo.task
      }${todo.tag ? ` (${todo.tag})` : ``}`
    );
  });
}
