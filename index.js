#!/usr/bin/env node

import {
  addTask,
  branch,
  completeTask,
  data,
  deleteBranch,
  deleteTask,
  globalStats,
  importExportBranch,
  incompleteTask,
  init,
  listTasks,
  mergeBranches,
  moveTask,
  removeTag,
  searchTodos,
  searchTodosGlobally,
  setConfig,
  stats,
  switchBranch,
  tag,
  updateTask,
} from './impexp.js';

const args = process.argv.slice(2);

const cmd = process.argv.slice(2)[0].startsWith('--')
  ? undefined
  : process.argv.slice(2)[0];

const helpText = `
                            ███████╗ █████╗ ██████╗
                            ╚══███╔╝██╔══██╗██╔══██╗
                              ███╔╝ ███████║██████╔╝
                              ███╔╝  ██╔══██║██╔═══╝ 
                            ███████╗██║  ██║██║     
                            ╚══════╝╚═╝  ╚═╝╚═╝     

                                  Task Manager

Usage:
  zap <command> [options]

Core Commands:
  init                              Initialize a new zap workspace
  branch [name]                     Create a branch (or list branches if none provided)
  branch -d, --delete <name>        Delete a branch
  switch <name>                     Switch to a branch

Task Management:
  add <task>                        Add a new task to the current branch
  list                              List tasks in current branch
  update <id> <task>                Update a task by ID
  remove <id>                       Remove a task
  complete <id>                     Mark as complete
  incomplete <id>                   Mark as incomplete

Search & Organization:
  search <keyword>                  Search in current branch
  search -g <keyword>               Search globally
  tag <id> <tag>                    Add a tag
  tag -d <id> <tag>                 Remove a tag
  move <id> <branch>                Move task to another branch

Import / Export:
  import <branch> <file>            Import tasks into branch
  export <branch> <file>            Export tasks to file

Branch Intelligence:
  merge <source> <target>           Merge branches
  stats                             Show branch stats
  stats -g                          Global statistics

Configuration:
  config --global, -g <key> <value> Set global configuration
  config --local, -l <key> <value>  Set local configuration

General:
  -v, --version                     Show version
  -h, --help                        Show this help message
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

  case 'search':
    if (args[1] === '--global' || args[1] === '-g') {
      await searchTodosGlobally(args.slice(2).join(' '));
    } else {
      await searchTodos(args.slice(1).join(' '));
    }
    break;

  case 'merge':
    await mergeBranches(args[1], args[2]);
    break;

  case 'tag':
    if (args[1] == '-d') {
      await removeTag(args[2]);
    } else {
      await tag(args[1], args[2]);
    }
    break;

  case 'import':
    await importExportBranch(args[1], 'import', args[2]);
    break;

  case 'export':
    await importExportBranch(args[1], 'export', args[2]);
    break;

  case 'stats':
    if (args[1] == '--global' || args[1] == '-g') {
      await globalStats();
    } else {
      await stats();
    }
    break;

  case 'config':
    if (args[1] === '--global' || args[1] === '-g') {
      await setConfig('global', args[2], args[3]);
    } else if (args[1] === '--local' || args[1] === '-l') {
      await setConfig('local', args[2], args[3]);
    }
    break;

  case '--help':
  case '-h':
    console.log(helpText);
    break;

  case '--version':
  case '-v':
    console.log(`💻 Zap Version ${data.version}`);
    break;

  default:
    console.log(helpText);
}
