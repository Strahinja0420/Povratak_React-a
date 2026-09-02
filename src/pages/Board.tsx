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
        <div className="w-full">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between max-w-xl w-full mx-auto mb-8">
                <div className="flex-1 w-full">
                    <input
                        className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900/60 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        placeholder="Search tasks..."
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <select
                        className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900/60 text-white focus:outline-none focus:border-purple-500 transition-colors text-sm cursor-pointer"
                        name="filterOptions"
                        id="filter-options"
                        value={priorityFilter}
                        onChange={(event) => setPriorityFilter(event?.target.value as PriorityFilter)}
                    >
                        <option value="all" className="bg-gray-900">All Priorities</option>
                        <option value="high" className="bg-gray-900">High Priority (7-10)</option>
                        <option value="medium" className="bg-gray-900">Medium Priority (4-6)</option>
                        <option value="low" className="bg-gray-900">Low Priority (1-3)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full">
                <Column tasks={todoTasks} title="Todo" status="todo" onEdit={(task) => setSelectedTask(task)} />
                <Column tasks={inProgressTasks} title="In progress" status="in-progress" onEdit={(task) => setSelectedTask(task)} />
                <Column tasks={doneTasks} title="Done" status="done" onEdit={(task) => setSelectedTask(task)} />
            </div>

            <div className="mt-14 mb-16 max-w-lg mx-auto">
                <InputForm onAddTask={handleAddTask} />
            </div>

            {selectedTask && <EditForm task={selectedTask} onClose={() => setSelectedTask(null)} />}
        </div>
    )
}
