<br />
<div align="center">

  <img src="https://github.com/calebephrem/zap-tcm/blob/main/assets/icon.png?raw=true" alt="Logo" width="200" height="200" />

  <p align="center" style="margin-top: 12px;">
    <strong><small>The Git-Style CLI Todo Manager</small></strong>
  </p>
  
</div>
<br />

# ⚡ Zap TCM

**Zap TCM** _(Zap Todo Control Manager)_ is a blazing-fast, Git-inspired CLI tool for managing todos like code.  
Create branches for different projects, switch between them, and keep your workflow lightning clean ⚡

## 🚀 Features

- 🧠 **Git-like workflow** — Use familiar commands like `zap add`, `zap branch`, and `zap switch`
- 🗂️ **Branch-based todo lists** — Each branch acts as a separate todo list
- 💾 **Persistent storage** — Todos are locally stored across sessions in `.zap` repository
- 🔥 **Minimal & intuitive** — No setup needed, just start zapping tasks

## 🧩 Example Usage

```bash
# Initialize zap in your project
zap init

# Add a new todo
zap add "Finish the README file"

# List all todos
zap list

# Mark a todo as done
zap complete 1

# Create a new branch (todo list)
zap branch work

# Switch to another branch
zap switch work

# View branches
zap branch
```

## ⚙️ Installation

### Using npm (recommended)

```bash
npm install -g zap-tcm
```

### From source

```bash
git clone https://github.com/calebephrem/zap-tcm.git
cd zap
npm install
npm link
```

## 📚 Command Reference

| Command                      | Description                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------- |
| init                         | Initialize a new zap repository                                                 |
| branch [name]                | Create a branch (or list branches if no name is given)                          |
| branch -d, --delete [name]   | Delete a branch                                                                 |
| switch [name]                | Switch to a branch                                                              |
| add [task]                   | Add a new task to the current branch                                            |
| list                         | List all tasks in the current branch                                            |
| update [id] [task]           | Update a task                                                                   |
| remove [id]                  | Remove a task                                                                   |
| complete [id]                | Mark a task as complete                                                         |
| incomplete [id]              | Mark a task as incomplete                                                       |
| search [keyword]             | Search tasks in the current branch (use search -g [keyword] to search globally) |
| merge [source] [target]      | Merge source branch into target branch                                          |
| tag [id] [tag]               | Add a tag to a task (replace id with -d to remove a tag)                        |
| move [id] [branch]           | Move a task to another branch                                                   |
| import [branch] [file]       | Import tasks from a file into a branch                                          |
| export [branch] [file]       | Export tasks from a branch to a file                                            |
| stats                        | Show statistics for the current branch (use stats -g for global stats)          |
| config [scope] [key] [value] | Configuration for `--global` and `--local` settings                             |
| -v, --version                | Show version information                                                        |
| -h, --help                   | Show help message                                                               |

## 💡 Example Workflow

```bash
zap init
zap add "Build Quantum Theme site"
zap add "Complete the README file"
zap list

zap branch personal
zap switch personal
zap add "Learn Python"
zap add "Learn Rust"

zap switch main
zap list
```

Each branch has its own independent todos — just like code branches in Git.

## 🧰 Configuration

Zap stores its data locally in a `.zap/` folder inside your project.

## 🌟 _(coming soon)_

- [ ] `zap undo` — revert last action
- [ ] `zap ui` — interactive TUI dashboard for managing tasks visually

## 🧑‍💻 Contributing

Contributions are welcome!  
Fork the repo, make your changes, and submit a pull request.  
Make sure to read [CONTRIBUTING](./CONTRIBUTING.md) before you start.

## 📄 License

MIT © Caleb Ephrem
