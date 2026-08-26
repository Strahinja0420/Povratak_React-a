import { useState } from "react"
import { tasks as initialTasks, type Task } from "../../data/tasks"
import Column from "./Column"



export default function Board() {

    const [tasks] = useState<Task[]>(initialTasks)

    const todoTasks = tasks.filter(task =>
        task.status === 'todo'
    )
    const inProgressTasks = tasks.filter(task =>
        task.status === 'in-progress'
    )
    const doneTasks = tasks.filter(task =>
        task.status === 'done'
    )

    return (
        <>
            <Column title='Todo' tasks={todoTasks} />
            <Column title='In progress' tasks={inProgressTasks} />
            <Column title='Done' tasks={doneTasks} />
        </>
    )
}