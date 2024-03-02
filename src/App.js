import React, { useState } from "react";
import TodoList from "./components/TodoList";
import { refresh } from "./utils";
import BacklogList from "./components/BacklogList";

const App = () => {

const initialState = {
  'isTodoView': true,
  'list': 'empty',
  'priority': 'white'
}

const textInput = React.createRef()
const initLocalStorageView = () => {
  if (!localStorage.getItem('isTodoView')) {
    localStorage.setItem('isTodoView', initialState.isTodoView)
  }
}
initLocalStorageView()

const isTodoView = () => {
  const isTodoView = (localStorage.getItem('isTodoView') === 'true')
  return isTodoView
}

const setIsTodoView = (boolString) => {
  localStorage.setItem('isTodoView', boolString)
}

const initLists = () => {
  if (!localStorage.getItem("todo-list")) { localStorage.setItem("todo-list", initialState.list) } 
  if (!localStorage.getItem("backlog-list")) { localStorage.setItem("backlog-list", initialState.list) }
}

initLists()

const [todoButtonClasses, setTodoButtonClasses] = useState(isTodoView() ? 'todo-button active ': 'todo-button')
const [backlogButtonClasses, setBacklogButtonClasses] = useState(!isTodoView() ? 'backlog-button active ': 'backlog-button')

const initTaskPriority = (newTask) => {
  localStorage.setItem(newTask, initialState.priority)
}

const addTask = () => {
  const list = getListFromStorage().split(',')
  const newTask = `${textInput.current.value}`
  const newtaskWithoutCommas = newTask.replaceAll(",","")
  if (newtaskWithoutCommas !== '') {
    const emptyIndex = list.indexOf("empty")
    if (emptyIndex > -1) {
      list.splice(emptyIndex, 1)
    }
    list.push(newtaskWithoutCommas)
    initTaskPriority(newtaskWithoutCommas)
    updateList(list)
  }
  clearInput()
  refresh()
}

const clearInput = () => { textInput.current.value = "" }

const updateList = (todoList) => {
  isTodoView()
  ? localStorage.setItem("todo-list", todoList)
  :  localStorage.setItem("backlog-list", todoList);
};

const getListFromStorage = () => {
  return isTodoView()
         ? (localStorage.getItem("todo-list"))
         : (localStorage.getItem("backlog-list"))
};

const toTodo = () => {
  if (!isTodoView()) {
    setIsTodoView(true)
    localStorage.setItem('isTodoView', true)
    setTodoButtonClasses('todo-button active')
    setBacklogButtonClasses('backlog-button')
    refresh()
  }
}

const toBacklog = () => {
  if (isTodoView()) {
    setIsTodoView(false);
    localStorage.setItem('isTodoView', false)
    setTodoButtonClasses('todo-button')
    setBacklogButtonClasses('backlog-button active')
    refresh()
  }
}

const getTodoButtonDesc = () => {
  return isTodoView() ? "TODO" : ""
}

const getBacklogButtonDesc = () => {
  return !isTodoView() ? "BACKLOG" : ""
}

const Switch = () => {
  return (
    <div className="switch-buttons-wrapper">
      <div className="switch-buttons">
        <button 
          className={todoButtonClasses}
          onClick={toTodo}>
          {getTodoButtonDesc()}
        </button>
        <button 
          className={backlogButtonClasses}
          onClick={toBacklog}>
          {getBacklogButtonDesc()}
        </button>
      </div>      
    </div>

  )
}

const List = () => { return ( isTodoView() ? ( <TodoList /> ) : ( <BacklogList /> ) ) }

const Add = () => { return ( <button className="add-task-button" id="add-button-id" onClick={handleAddButton} /> ) }

const handleAddButton = () => {
  let addButton = document.getElementById('add-button-id');
  let modal = document.getElementById('modal-id')
  let modalInput = document.getElementById('modal-input-id')
  if (addButton && modal && modalInput) {
    addButton.classList.add('hide')
    modal.classList.remove('hide')
    modalInput.focus()
  }
}

const Modal = () => {
  return (
    <div className="modal hide" id="modal-id">
        <input
          className="modal-input"
          id="modal-input-id"
          ref={textInput}
          type="text"
          maxLength="100"
          onKeyDown={(e) => (e.key === 'Enter' ? handlePressEnter() : null)}
          placeholder="nowe zadanie"
        />
    </div>
  )}

  const handlePressEnter = () => {
    addTask()
    let addButton = document.getElementById('add-button-id');
    let modal = document.getElementById('modal-id')
    if (addButton && modal) {
      modal.classList.add('hide')
      addButton.classList.remove('hide')
    }
  }

return (
  <div className="app">
    <Switch />
    <List />
    <Modal />
    <Add />
  </div>
)};

export default App;
