import { getTodos, updateTodo } from './task.js';

export async function tag(id, tag) {
  if (!id || !tag) {
    console.error('Please provide both id and tag');
    process.exit(1);
  }
  if (tag.length > 20) {
    console.error('Tag length should not exceed 20 characters');
    process.exit(1);
  }
  const todos = await getTodos();
  const todo = todos.filter((t) => t.id == id)[0];
  todo.tag = tag;
  await updateTodo(id, todo, false);
  console.log(`Added tag "${tag}" to todo: ${id}`);
}

export async function removeTag(tag) {
  if (!tag) {
    console.error('Please provide a tag');
    process.exit(1);
  }
  const todos = await getTodos();
  const todo = todos.filter((t) => t.tag == tag)[0];
  const index = todos.indexOf(todo);
  const id = todos[index].id;
  todo.tag = undefined;
  await updateTodo(id, todo, false);
  console.log(`Removed tag "${tag}" from todo: ${id}`);
}
