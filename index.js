#!/usr/bin/env node

import {
  addTask,
  branch,
  completeTask,
  data,
  deleteBranch,
  deleteTask,
  importExportBranch,
  incompleteTask,
  init,
  listTasks,
  mergeBranches,
  moveTask,
  switchBranch,
  updateTask,
} from './zap.js';

const args = process.argv.slice(2);

const cmd = process.argv.slice(2)[0].startsWith('--')
  ? undefined
  : process.argv.slice(2)[0];

const helpText = `
Usage: zap [command] [options]

Commands:
  init                          Initialize a new zap repository
  branch [name]                 Create a branch (or list branches if no name is given)
  branch -d | --delete [name]   Delete a branch
  switch [name]                 Switch to a branch
  add [task]                    Add a new task to the current branch
  list                          List all tasks in the current branch
  update [id] [task]            Update a task
  remove [id]                   Remove a task
  complete [id]                 Mark a task as complete
  incomplete [id]               Mark a task as incomplete
  merge [source] [target]       Merge source branch into target branch
  move [id] [branch]            Move a task to another branch
  import [branch] [file]        Import tasks from a file into a branch
  export [branch] [file]        Export tasks from a branch to a file
  -h, --help                    Show this help message

`;

switch (cmd) {
  case 'init':
    await init();
    break;

  case 'branch':
    if (args[1] === '-d' || args[1] === '--delete') {
      await deleteBranch(args[2]);
    } else {
      await branch(args[1]);
    }
    break;

  case 'switch':
    await switchBranch(args[1]);
    break;

  case 'add':
    await addTask(args.slice(1).join(' '));
    break;

  case 'list':
    await listTasks();
    break;

  case 'update':
    await updateTask(parseInt(args[1], 10), args.slice(2).join(' '));
    break;

  case 'remove':
    await deleteTask(parseInt(args[1], 10));
    break;

  case 'complete':
    await completeTask(parseInt(args[1], 10));
    break;

  case 'move':
    await moveTask(parseInt(args[1], 10), args[2]);
    break;

  case 'incomplete':
    await incompleteTask(parseInt(args[1], 10));
    break;

  case 'merge':
    await mergeBranches(args[1], args[2]);
    break;

  case 'import':
    await importExportBranch(args[1], 'import', args[2]);
    break;

  case 'export':
    await importExportBranch(args[1], 'export', args[2]);
    break;

  case '--help':
  case '-h':
    console.log(helpText);
    break;

  case '--version':
  case '-v':
    console.log(`zap version ${data.version}`);
    break;

  default:
    console.log(helpText);
}
