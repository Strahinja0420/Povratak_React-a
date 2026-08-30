import { useEffect, useReducer, useState } from "react"
import { tasks as initialTasks, type Task } from "../../data/tasks"
import Column from "./Column"
import InputForm, { type AddNewTaskSchemaType } from "./InputForm"
import EditForm, { type EditTaskSchemaType } from "./EditForm";
import * as z from 'zod';

type PriorityFilter = 'high' | 'medium' | 'low' | 'all'

type Action =
    | { type: 'EDIT_TASK'; taskId: Task['id']; data: EditTaskSchemaType }
    | { type: 'ADD_TASK'; task: Task }
    | { type: 'REMOVE_TASK'; taskId: Task['id'] }
    | { type: 'MOVE_TASK'; taskId: Task['id'] }
    | { type: 'MOVE_TO_STATUS'; taskId: Task['id']; status: Task['status'] };

//TODO NAPRAVI DA ZOD KONTROLISE TIP SEME POSLE NEMOJ DA SE BIJU TYPESCRIPT I ZOD KO UPRAVLJA TIME
const TaskSchema = z.object({
    id: z.union([z.number(), z.string()]),
    title: z.string(),
    description: z.string(),
    priority: z.number(),
    status: z.enum(['todo', 'in-progress', 'done'])
});

function loadInitialTasks() {
    const tasksInStorage = localStorage.getItem('tasks');

    if (!tasksInStorage) {
        return initialTasks;
    }

    const parsedTasks = TaskSchema.array().safeParse(JSON.parse(tasksInStorage));

    if (parsedTasks.success) {
        return parsedTasks.data;
    }

    return initialTasks;
}

function tasksReducer(tasks: Task[], action: Action): Task[] {
    switch (action.type) {
        case 'MOVE_TASK': {
            return tasks.map(task =>
                task.id === action.taskId
                    ? { ...task, status: task.status === 'todo' ? 'in-progress' : 'done' }
                    : task
            )
        }
        case 'ADD_TASK': {
            return [...tasks, action.task]
        }
        case 'REMOVE_TASK': {
            return tasks.filter(task => task.id !== action.taskId)
        }
        case 'EDIT_TASK': {
            return tasks.map(task =>
                task.id === action.taskId
                    ? { ...task, ...action.data }
                    : task
            )
        }
        case 'MOVE_TO_STATUS': {
            return tasks.map(task =>
                task.id === action.taskId
                    ? { ...task, status: action.status }
                    : task
            )
        }


        default:
            throw Error('Unknown action' + action)
    }
}

export default function Board() {
    const [tasks, dispatch] = useReducer(tasksReducer, undefined, loadInitialTasks)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
    const [search, setSearch] = useState<string>('')

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    /* TASK ACTIONS */
    function moveTask(taskId: Task['id']) {
        dispatch({ type: 'MOVE_TASK', taskId })
    }

    function addTask(data: AddNewTaskSchemaType) {
        const newTask: Task = {
            id: crypto.randomUUID(),
            status: 'todo',
            ...data
        }

        dispatch({ type: 'ADD_TASK', task: newTask })
    }

    function editTask(data: EditTaskSchemaType) {
        if (!selectedTask) {
            return;
        }

        dispatch({ type: 'EDIT_TASK', taskId: selectedTask.id,data })

        setSelectedTask(null);
    }

    function deleteTask(taskId: Task['id']) {
        dispatch({ type: 'REMOVE_TASK', taskId })
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

    const visibleTasks = tasks
        .filter(tasks => allowedPriorities.includes(tasks.priority))
        .filter(tasks => tasks.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.priority - a.priority)

    const todoTasks = visibleTasks.filter(task =>
        task.status === 'todo'
    )
    const inProgressTasks = visibleTasks.filter(task =>
        task.status === 'in-progress'
    )
    const doneTasks = visibleTasks.filter(task =>
        task.status === 'done'
    )

    function moveTaskToStatus(
        taskId: Task['id'],
        status: Task['status']
    ) {
        dispatch({ type: 'MOVE_TO_STATUS', taskId, status })
    }

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

                <Column onDropTask={moveTaskToStatus} title='Todo' status={'todo'} tasks={todoTasks} moveTask={moveTask} onEdit={setSelectedTask} onDeleteTask={deleteTask} />
                <Column onDropTask={moveTaskToStatus} title='In progress' status={'in-progress'} tasks={inProgressTasks} moveTask={moveTask} onEdit={setSelectedTask} onDeleteTask={deleteTask} />
                <Column onDropTask={moveTaskToStatus} title='Done' tasks={doneTasks} status={'done'} moveTask={moveTask} onEdit={setSelectedTask} onDeleteTask={deleteTask} />

            </div>
            <div>
                <h2>ADD NEW TASK</h2>
                <InputForm onAddTask={addTask} />
            </div>
            {selectedTask && <EditForm task={selectedTask} onSubmitEdit={editTask} onClose={() => setSelectedTask(null)} />}
        </>
    )
}