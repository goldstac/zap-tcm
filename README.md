# ⚡ Zap TCM — The Git-Style CLI Todo Manager

**Zap TCM** *(Zap Todo Control Manager)* is a blazing-fast, Git-inspired CLI tool for managing todos like code.  
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
npm install -g zap-cli
```

### From source

```bash
git clone https://github.com/calebephrem/zap.git
cd zap
npm install
npm link
```

## 📚 Command Reference

| Command                    | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| `zap init`                 | Initialize a zap repository in the current directory |
| `zap add <task>`           | Add a new task to the current branch                 |
| `zap list`                 | List tasks in the current branch                     |
| update [id] [task]         | Update a task                                        |
| `zap remove <id>`          | Remove a task                                        |
| `zap complete <id>`        | Mark a task as done                                  |
| incomplete [id]            | Mark a task as incomplete                            |
| `zap branch`               | List all branches                                    |
| `zap branch <name>`        | Create a new branch                                  |
| `zap switch <name>`        | Switch between branches                              |
| branch -d, --delete [name] | Delete a branch                                      |
| -h, --help                 | Show this help message                               |

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

- [x] `zap import` / `zap export` — integrate with JSON, CSV, or Markdown
- [x] `zap move` — move todos between branches
- [ ] `zap merge` — merge two branches (todo lists)
- [ ] `zap tag` — tag todo milestones
- [ ] `zap undo` — revert last action
- [ ] `zap search` — quickly find todos across branches
- [ ] `zap ui` — interactive TUI dashboard for managing tasks visually
- [ ] `zap stats` — show productivity analytics & completed tasks count
- [ ] `zap config` — global and local configuration management

## 🧑‍💻 Contributing

Contributions are welcome!  
Fork the repo, make your changes, and submit a pull request.

## 📄 License

MIT © Caleb Ephrem
