import { useState } from "react"
import { tasks as initialTasks, type Task } from "../../data/tasks"
import Column from "./Column"
import InputForm, { type AddNewTaskSchemaType } from "./InputForm"
import EditForm, { type EditTaskSchemaType } from "./EditForm";

type PriorityFilter = 'high' | 'medium' | 'low' | 'all'

export default function Board() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
    const [search, setSearch] = useState<string>('')

    const getNextStatus = (status: Task['status']) => status === 'todo' ? 'in-progress' : 'done';

    /* TASK ACTIONS */
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

    /* EVERYTHING USED FOR FILTERING AND SEARCHING */
    //TODO OVO GOVNO OVDE MORAS DA PROMENIS IZ KORENA DA NE KORISTI BROJEVE ALI NE ZURI LAGANO
    function priorityFilterConversion(filterValue: PriorityFilter): number[] {
        if (filterValue === 'high') {
            return [7, 8, 9, 10]
        } else if (filterValue === 'medium') {
            return [4, 5, 6]
        } else if (filterValue === 'low') {
            return [1, 2, 3]
        } else return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }

    const allowedPriorities = priorityFilterConversion(priorityFilter)

    const filteredTasks = tasks.filter(task =>
        allowedPriorities.includes(task.priority)
    );

    const searchedTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()))

    const todoTasks = searchedTasks.filter(task =>
        task.status === 'todo'
    )
    const inProgressTasks = searchedTasks.filter(task =>
        task.status === 'in-progress'
    )
    const doneTasks = searchedTasks.filter(task =>
        task.status === 'done'
    )

    return (
        <>
            <div className="flex flex-col w-62.5 mx-auto">
                <h2>FILTER & SEARCH</h2>
                <select className="w-full" name="filterOptions" id="filter-options" value={priorityFilter} onChange={(event) => setPriorityFilter(event?.target.value as typeof priorityFilter)}>
                    <option value="all">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <input className="w-full text-center border" placeholder="Search" type="text" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-2">
                <Column title='Todo' tasks={todoTasks} moveTask={moveTask} onEdit={setSelectedTask} onDeleteTask={deleteTask} />
                <Column title='In progress' tasks={inProgressTasks} moveTask={moveTask} onEdit={setSelectedTask} onDeleteTask={deleteTask} />
                <Column title='Done' tasks={doneTasks} moveTask={moveTask} onEdit={setSelectedTask} onDeleteTask={deleteTask} />
            </div>
            <div>
                <h2>ADD NEW TASK</h2>
                <InputForm onAddTask={addTask} />
            </div>
            {selectedTask && <EditForm task={selectedTask} onSubmitEdit={editTask} onClose={() => setSelectedTask(null)} />}
        </>
    )
}