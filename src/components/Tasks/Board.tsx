import { useState } from "react"
import { tasks as initialTasks, type Task } from "../../data/tasks"
import Column from "./Column"



export default function Board() {

    const [tasks, setTasks] = useState<Task[]>(initialTasks)

    function getNextStatus(status: Task['status']): Task['status'] {
        if (status === 'todo') {
            return 'in-progress'
        }

        return 'done';
    }

    function moveTask(taskId: Task['id']) {

        setTasks(currentTasks =>
            currentTasks.map(task => {

                if (task.id !== taskId) {
                    return task;
                }

                const status = getNextStatus(task.status);

                return { ...task, status }
            })
        )
    }

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
            <Column title='Todo' tasks={todoTasks} moveTask={moveTask} />
            <Column title='In progress' tasks={inProgressTasks} moveTask={moveTask} />
            <Column title='Done' tasks={doneTasks} moveTask={moveTask} />
        </>
    )
}