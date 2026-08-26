import { useState } from "react"
import { tasks as initialTasks, type Task } from "../../data/tasks"
import Column from "./Column"
import InputForm, { type AddNewTaskSchemaType } from "./InputForm"


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

    function addTask(data: AddNewTaskSchemaType) {
        console.log(data)
        const newTask : Task = {
            id: crypto.randomUUID(),
            status: 'todo',
            ...data
        }

        setTasks(currentTasks => [
            ...currentTasks,
            newTask
        ])
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
            <div className="grid grid-cols-3 gap-2">
                <Column title='Todo' tasks={todoTasks} moveTask={moveTask} />
                <Column title='In progress' tasks={inProgressTasks} moveTask={moveTask} />
                <Column title='Done' tasks={doneTasks} moveTask={moveTask} />
            </div>
            <div>
                <InputForm onAddTask={addTask} />
            </div>
        </>
    )
}