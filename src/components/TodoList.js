import { refresh } from "../utils";

const TodoList = () => {

    const todoListStorage = localStorage.getItem('todo-list')

    const drawLineThroughTask = (index) => {
        let task = document.getElementById(`todo-task-${index}`)
        if (task) { task.classList.add("done") }
    }

    const deleteTask = (element, remove) => {
        const list = todoListStorage.split(',')
        const index = list.indexOf(element)
        if (index > -1) { list.splice(index, 1) }
        localStorage.setItem("todo-list", list)
        if (remove) {localStorage.removeItem(element)}
    }

    const addClassToIcon = (index) => {
        let button = document.getElementById(`todo-done-${index}`)

        if (button) {button.classList.add("clicked")}
    }

    const handleTaskDone = (element, index) => {
        addClassToIcon(index)
        drawLineThroughTask(index)
        setTimeout(() => {
            deleteTask(element, true)
            refresh()
        }, 450);
    }

    const getTaskPriority = (element) => {
        if (localStorage.getItem(element)) {
            const priority = localStorage.getItem(element)
            if (priority === 'white') {
                return 'white'
            } else if (priority === 'blue') {
                return '#4300F5'
            } else {
                return '#F51200'
            }
        }
    }

    const hideFunctionalButtons = (index) => {
        let buttonsContainer = document.getElementById(`todo-task-buttons-wrapper-${index}`)
        buttonsContainer.style.display = 'none'
    }

    const changePriorityOnRed = (element, index) => { if (localStorage.getItem(element)) {localStorage.setItem(element, "red");hideFunctionalButtons(index)}}
    const changePriorityOnBlue = (element, index) => { if (localStorage.getItem(element)) { localStorage.setItem(element, "blue");hideFunctionalButtons(index)}}
    const changePriorityOnWhite = (element, index) => { if (localStorage.getItem(element)) { localStorage.setItem(element, "white");hideFunctionalButtons(index)}}

    const moveToBacklog = (element, index) => {
        if (localStorage.getItem('isTodoView')) {
            const list = localStorage.getItem('backlog-list').split(',')
            const emptyIndex = list.indexOf("empty")
            if (emptyIndex > -1) { list.splice(emptyIndex, 1) }
            list.push(element)
            localStorage.setItem('backlog-list', list)
            deleteTask(element, false)
            hideFunctionalButtons(index)            
        }
    }

    const showFunctionalButtons = (index) => {
        let buttonsContainer = document.getElementById(`todo-task-buttons-wrapper-${index}`)
        if (buttonsContainer) {buttonsContainer.style.display = 'flex'}
    }

    const sortedList = (list) => {
        let sortedList = []
        for (let i = 0; i < list.length; i++) {
            if (getTaskPriority(list[i].props.children[3].props.children.props.children.props.children) === '#F51200') {sortedList.push(list[i])}
        }
        for (let i = 0; i < list.length; i++) {
            if (getTaskPriority(list[i].props.children[3].props.children.props.children.props.children) === '#4300F5') {sortedList.push(list[i])}
        }
        for (let i = 0; i < list.length; i++) {
            if (getTaskPriority(list[i].props.children[3].props.children.props.children.props.children) === 'white') {sortedList.push(list[i])}
        }
        return sortedList
    }

    const getList = () => {
        if (todoListStorage) {
            let todoList = todoListStorage.split(',')
            if (todoList.length === 1 && todoList.indexOf('empty') > -1) {
                return null
            } else {
                var list = todoList.map((element, index) => (
                    <div className="todo-task-wrapper" key={`todo-task-wrapper-${index}`}>
                        <button className="todo-done" id={`todo-done-${index}`} onClick={() => {handleTaskDone(element, index)}} key={`todo-done-${index}`} />
                        <div className="todo-task-prioryty" key={`todo-task-prioryty-${index}`} style={{ backgroundColor: `${getTaskPriority(element)}`}}/>
                        <div className="todo-task-buttons-wrapper" id={`todo-task-buttons-wrapper-${index}`}>
                                <button className="todo-task-priority-button-red" onClick={() => {changePriorityOnRed(element, index);refresh()}}/>
                                <button className="todo-task-priority-button-blue" onClick={() => {changePriorityOnBlue(element, index);refresh()}}/>
                                <button className="todo-task-priority-button-white" onClick={() => {changePriorityOnWhite(element, index);refresh()}}/>
                                <button className="todo-move" key={`"todo-move-${index}`} onClick={() => {moveToBacklog(element, index);refresh()}} />
                                <button className="todo-buttons-close"  key={`"todo-buttons-close-${index}`} onClick={() => {hideFunctionalButtons(index)}} />                 
                        </div>
                        <div className="todo-task-container" key={`todo-task-container-${index}`}>
                            <div className="todo-task-small-wrapper" onClick={() => {showFunctionalButtons(index)}}>
                                <button
                                    className="todo-task"
                                    id={`todo-task-${index}`}
                                    key={`todo-task-${index}`}
                                >
                                    {element}
                                </button>
                            </div>
                        </div>
                    </div>
                ))
                return sortedList(list)
            }
        }    
    }
    return (<div className="todo-list">{getList()}</div>)
}

export default TodoList
