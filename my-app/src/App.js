import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const key = 'my_todo_tasks';

  const defaultValue = [
    {
      content: 'Complete Assignment 2',
      tags: 'grading,ischool',
      isCompleted: false,
    },
    {
      content: 'Complete Lab 3',
      tags: undefined,
      isCompleted: false,
    }
  ];

  const stored = localStorage.getItem(key);

  var todo_txt = [];
  var initial_todo;

  if (stored) {
    const stored_value = JSON.parse(stored);

    initial_todo = [];

    for (var value of stored_value) {
      var this_object = {};

      if (value.startsWith("x ")) {
        this_object.isCompleted = true;

        value = value.slice(2);
      }

      var splitted = value.split('@').map(v => v.trim());

      this_object.content = splitted.shift();

      if (splitted.length > 0) {
        var tags = splitted.join();
        this_object.tags = tags;
      }

      initial_todo.push(this_object);
    }

  } else {
    initial_todo = defaultValue;

    for (var v of initial_todo) {
      var this_string = '';
      if (v.isCompleted) {
        this_string += 'x ';
      }

      this_string += v.content;

      if (v.tags) {
        const tags = v.tags.split(',');
        for (var tag of tags) {
          this_string = this_string + ' @' + tag;
        }
      }
      todo_txt.push(this_string.trim());
    }

    localStorage.setItem(key, JSON.stringify(todo_txt));
  };


  const [todos, setTodos] = useState(initial_todo);

  function CreateTodo() {
    const newTodos = [...todos];

    const handleSubmit = (event) => {
      event.preventDefault();

      const new_content = event.target.todo_item.value;
      const new_tags = event.target.todo_tag.value;

      if (new_content !== "") {
        newTodos.push({
          content: new_content,
          tags: new_tags,
          isCompleted: false,
        }); // submitting an empty form will have no actual effect
        setTodos(newTodos)

        var current_string = JSON.parse(localStorage.getItem(key));

        var this_string = '';

        this_string += new_content;
        this_string += ' ';

        if (new_tags) {
          const tags = new_tags.split(',');
          for (var tag of tags) {
            this_string = this_string + '@' + tag + ' ';
          }
        }
        current_string.push(this_string.trim());

        localStorage.setItem(key, JSON.stringify(current_string));
      }
    };

    return (
      <div className="todo-container">
        <form onSubmit={handleSubmit} className="todo-form" autoComplete="off">
          <input className="td-input" type="text" name="todo_item" placeholder="I need to..." />
          <br />
          <input className="td-input" type="text" name="todo_tag" placeholder="tag1,tag2...(Optional)" />
          <button type="submit" className="custom-button">Add</button>
        </form>
      </div>
    );
  }

  function updateTodoAtIndex(event, index) {
    const temporaryTodos = [...todos];
    temporaryTodos[index].content = event.target.value;
    setTodos(temporaryTodos);

    var current_string = JSON.parse(localStorage.getItem(key));
    var a = current_string[index];
    a = a.split('@');
    a[0] = temporaryTodos[index].content;

    for (var i = 1; i < a.length; i++) {
      a[i] = '@' + a[i];
      a[i] = a[i].trim();
    }

    a = a.join(' ');

    if (temporaryTodos[index].isCompleted) {
      a = 'x ' + a;
    }

    current_string[index] = a;
    localStorage.setItem(key, JSON.stringify(current_string));
  }

  function updateTodoTagAtIndex(event, index) {
    const temporaryTodos = [...todos];
    temporaryTodos[index].tags = event.target.value;
    console.log(temporaryTodos[index]);
    setTodos(temporaryTodos);

    var current_string = JSON.parse(localStorage.getItem(key));
    var a = current_string[index];
    a = a.split('@');
    var c = a.shift(); // this is todo content
    var t = ''; // this is new tag content

    let tags = temporaryTodos[index].tags.split(',');
    for (var tag of tags) {
      t = t + " @" + tag;
    }

    var n = c + t;

    if (temporaryTodos[index].tags === "") {
      n = c;
    } // if all tags are removed, delete trailing @

    n = n.replace(/\s\s/g, ' '); // remove excessive white space 

    current_string[index] = n;
    localStorage.setItem(key, JSON.stringify(current_string));
  }


  function toggleTodoCompleteAtIndex(index) {
    const temporaryTodos = [...todos];
    temporaryTodos[index].isCompleted = !temporaryTodos[index].isCompleted;
    setTodos(temporaryTodos);

    if (temporaryTodos[index].isCompleted) {
      var current_string = JSON.parse(localStorage.getItem(key));
      current_string[index] = "x " + current_string[index];
      localStorage.setItem(key, JSON.stringify(current_string));
    } else {
      var cs = JSON.parse(localStorage.getItem(key));
      cs[index] = cs[index].slice(2);
      localStorage.setItem(key, JSON.stringify(cs));
    } // handles un-complete

  }

  return (
    <div className="app">
      <div className="header">
        <img src={logo} className="logo" alt="logo" />
      </div>
      <CreateTodo />
      <div className="todo-container">
        <form className="todo-form" autoComplete="off">
          <ul>
            {todos.map((todo, i) => (
              <div key={todo.content + '_' + todo.tags} className={`todo ${todo.isCompleted && 'todo-is-completed'}`}>
                <div className={'checkbox'} onClick={() => toggleTodoCompleteAtIndex(i)}>
                  {todo.isCompleted && (
                    <span>&#x2714;</span>
                  )}
                </div>
                <input
                  type="text"
                  className="display-input"
                  value={todo.content}
                  onChange={event => updateTodoAtIndex(event, i)}
                />
                <br />
                <input
                  type="text"
                  className="display-input"
                  value={todo.tags}
                  onChange={event => updateTodoTagAtIndex(event, i)}
                />
              </div>
            ))}
          </ul>
        </form>
      </div>
    </div>
  );
}

export default App;