import { useState } from "react"
import { type Task } from "../data/tasks"
import Column from "../components/Tasks/Column"
import InputForm, { type AddNewTaskSchemaType } from "../components/Tasks/InputForm"
import EditForm from "../components/Tasks/EditForm";
import { useTasks, useTasksActions } from "../context/TasksContext";

type PriorityFilter = 'high' | 'medium' | 'low' | 'all'


type BoardProps = {
    projectId: string;
}

export default function Board({ projectId }: BoardProps) {
    const tasks = useTasks()
    const { addTask } = useTasksActions()
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
    const [search, setSearch] = useState<string>('')

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
        .filter(task => task.projectId === projectId)
        .filter(task => allowedPriorities.includes(task.priority))
        .filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
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

    function handleAddTask(data: AddNewTaskSchemaType) {
        const id = crypto.randomUUID()
        addTask({
            ...data,
            id,
            projectId,
            status: 'todo'
        })
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

                <Column tasks={todoTasks} title='Todo' status={'todo'} onEdit={(task) => setSelectedTask(task)} />
                <Column tasks={inProgressTasks} title='In progress' status={'in-progress'} onEdit={(task) => setSelectedTask(task)} />
                <Column tasks={doneTasks} title='Done' status={'done'} onEdit={(task) => setSelectedTask(task)} />

            </div>
            <div>
                <h2>ADD NEW TASK</h2>
                <InputForm onAddTask={handleAddTask} />
            </div>
            {selectedTask && <EditForm task={selectedTask} onClose={() => setSelectedTask(null)} />}
        </>
    )
}
