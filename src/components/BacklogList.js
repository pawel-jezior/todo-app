import { refresh } from "../utils";
import Logo from "./Logo";

const BacklogList = () => {

    const backlogListStorage = localStorage.getItem('backlog-list')

    const drawLineThroughTask = (index) => {
        let task = document.getElementById(`backlog-task-${index}`)
        if (task) {
           task.classList.add("done")
        }
    }

    const deleteTask = (element, remove) => {
        const list = backlogListStorage.split(',')
        const index = list.indexOf(element)
        if (index > -1) { list.splice(index, 1) }
        localStorage.setItem("backlog-list", list)
        if (remove) {localStorage.removeItem(element)}
    }

    const handleTaskDone = (element, index) => {
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
        let buttonsContainer = document.getElementById(`backlog-task-buttons-wrapper-${index}`)
        buttonsContainer.style.display = 'none'
    }

    const changePriorityOnRed = (element, index) => { if (localStorage.getItem(element)) {localStorage.setItem(element, "red");hideFunctionalButtons(index)}}
    const changePriorityOnBlue = (element, index) => { if (localStorage.getItem(element)) { localStorage.setItem(element, "blue");hideFunctionalButtons(index)}}
    const changePriorityOnWhite = (element, index) => { if (localStorage.getItem(element)) { localStorage.setItem(element, "white");hideFunctionalButtons(index)}}

    const moveToTodo = (element, index) => {
        if (localStorage.getItem('isTodoView')) {
            const list = localStorage.getItem('todo-list').split(',')
            const emptyIndex = list.indexOf("empty")
            if (emptyIndex > -1) { list.splice(emptyIndex, 1) }
            list.push(element)
            localStorage.setItem('todo-list', list)
            deleteTask(element, false)
            hideFunctionalButtons(index)            
        }
    }

    const showFunctionalButtons = (index) => {
        let buttonsContainer = document.getElementById(`backlog-task-buttons-wrapper-${index}`)
        if (buttonsContainer) {buttonsContainer.style.display = 'flex'}
    }

    const sortedList = (list) => {
        let sortedList = []
        for (let i = 0; i < list.length; i++) {
            if (getTaskPriority(list[i].props.children[2].props.children.props.children.props.children) === '#F51200') {sortedList.push(list[i])}
        }
        for (let i = 0; i < list.length; i++) {
            if (getTaskPriority(list[i].props.children[2].props.children.props.children.props.children) === '#4300F5') {sortedList.push(list[i])}
        }
        for (let i = 0; i < list.length; i++) {
            if (getTaskPriority(list[i].props.children[2].props.children.props.children.props.children) === 'white') {sortedList.push(list[i])}
        }
        return sortedList
    }

    const getList = () => {
        if (backlogListStorage) {
            let backlogList = backlogListStorage.split(',')
            if (backlogList.length === 1 && backlogList.indexOf('empty') > -1) {
                return <Logo />
            } else {
                var list = backlogList.map((element, index) => (
                    <div className="backlog-task-wrapper" key={`backlog-task-wrapper-${index}`}>
                        <div className="backlog-task-prioryty" key={`backlog-task-prioryty-${index}`} style={{ backgroundColor: `${getTaskPriority(element)}`}}/>
                        <div className="backlog-task-buttons-wrapper" id={`backlog-task-buttons-wrapper-${index}`}>
                                <button className="backlog-move" key={`"backlog-move-${index}`} onClick={() => {moveToTodo(element, index);refresh()}} />
                                <button className="backlog-task-priority-button-red" onClick={() => {changePriorityOnRed(element, index);refresh()}}/>
                                <button className="backlog-task-priority-button-blue" onClick={() => {changePriorityOnBlue(element, index);refresh()}}/>
                                <button className="backlog-task-priority-button-white" onClick={() => {changePriorityOnWhite(element, index);refresh()}}/>  
                                <button className="todo-buttons-close"  key={`"todo-buttons-close-${index}`} onClick={() => {hideFunctionalButtons(index)}} />                       
                        </div>
                        <div className="backlog-task-container" key={`backlog-task-container-${index}`}>
                            <div className="backlog-task-small-wrapper" onClick={() => {showFunctionalButtons(index)}}>
                                <button
                                    className="backlog-task"
                                    id={`backlog-task-${index}`}
                                    key={`backlog-task-${index}`}
                                >
                                    {element}
                                </button>
                            </div>
                        </div>
                        <button className="backlog-done" onClick={() => {handleTaskDone(element, index)}} key={`backlog-done-${index}`} />
                    </div>
                ))
                return sortedList(list)
            }
        }    
    }
    return (<div className="backlog-list">{getList()}</div>)
}

export default BacklogList