import path from 'path';
import { readdir, readFile } from '../utils/fs.js';
import { getBranchObject } from './branch.js';
import data from './data.js';

export async function stats() {
  const branchObj = await getBranchObject();
  const totalTasks = branchObj.todos.length;
  const completedTasks = branchObj.todos.filter(
    (todo) => todo.completed
  ).length;
  const incompleteTasks = totalTasks - completedTasks;
  const productivityRate = totalTasks
    ? ((completedTasks / totalTasks) * 100).toFixed(2)
    : 0;
  console.log(`Statistics for branch: ${branchObj.name}`);
  console.log(`Total tasks: ${totalTasks}`);
  console.log(`Completed tasks: ${completedTasks}`);
  console.log(`Incomplete tasks: ${incompleteTasks}`);
  console.log(`Productivity rate: ${productivityRate}%`);
}

export async function globalStats() {
  const branchFiles = await readdir(data.basedir);
  let totalTasks = 0;
  let completedTasks = 0;
  for (const file of branchFiles) {
    if (file === 'branch') continue;
    const content = await readFile(path.join(data.basedir, file));
    const branchObj = JSON.parse(content);
    const todos = branchObj.todos || [];
    totalTasks += todos.length;
    completedTasks += todos.filter((todo) => todo.completed).length;
  }
  const incompleteTasks = totalTasks - completedTasks;
  const productivityRate = totalTasks
    ? ((completedTasks / totalTasks) * 100).toFixed(2)
    : 0;
  console.log(`Global Statistics across all branches:`);
  console.log(`Total tasks: ${totalTasks}`);
  console.log(`Completed tasks: ${completedTasks}`);
  console.log(`Incomplete tasks: ${incompleteTasks}`);
  console.log(`Productivity rate: ${productivityRate}%`);
}
