import { useState } from "react"
import { tasks as initialTasks, type Task } from "../../data/tasks"
import Column from "./Column"
import InputForm, { type AddNewTaskSchemaType } from "./InputForm"
import EditForm, { type EditTaskSchemaType } from "./EditForm";



export default function Board() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const getNextStatus = (status: Task['status']) => status === 'todo' ? 'in-progress' : 'done';

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
        const newTask: Task = {
            id: crypto.randomUUID(),
            status: 'todo',
            ...data
        }

        setTasks(currentTasks => [
            ...currentTasks,
            newTask
        ])
    }

    function editTask(data: EditTaskSchemaType) {
        if (!selectedTask) {
            return;
        }

        setTasks(currentTasks => currentTasks.map(task =>
            task.id === selectedTask.id ? { ...task, ...data } : task
        ));
        setSelectedTask(null);
    }

    function deleteTask(taskId: Task['id']) {
        setTasks(currentTasks => {
            const filteredTasks = currentTasks.filter(task => task.id !== taskId)

            return [...filteredTasks]
        })
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
                <Column title='Todo' tasks={todoTasks} moveTask={moveTask} onEdit={setSelectedTask} onDeleteTask={deleteTask} />
                <Column title='In progress' tasks={inProgressTasks} moveTask={moveTask} onEdit={setSelectedTask} onDeleteTask={deleteTask} />
                <Column title='Done' tasks={doneTasks} moveTask={moveTask} onEdit={setSelectedTask} onDeleteTask={deleteTask} />
            </div>
            <div>
                <InputForm onAddTask={addTask} />
            </div>
            {selectedTask && <EditForm task={selectedTask} onSubmitEdit={editTask} onClose={() => setSelectedTask(null)} />}
        </>
    )
}