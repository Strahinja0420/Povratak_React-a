import { useState } from "react"
import { type Task } from "../../data/tasks"
import Column from "../Tasks/Column"
import InputForm, { type AddNewTaskSchemaType } from "../Tasks/InputForm"
import EditForm from "../Tasks/EditForm";
import { useTasks, useTasksActions } from "../../context/TasksContext";
import { useNavigate, useOutletContext, useParams, useSearchParams } from "react-router";
import type { ProjectDetailsContext } from "../Projects/ProjectDetails";

type PriorityFilter = 'high' | 'medium' | 'low' | 'all'

export default function Board() {
    const tasks = useTasks()
    const { addTask } = useTasksActions()
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const { projectId, boardId } = useParams<{
        projectId: string;
        boardId: string;
    }>();
    const { boards } = useOutletContext<ProjectDetailsContext>();
    const currentBoard = boards.find(board => board.id === boardId)

    if (!projectId || !boardId || !currentBoard) {
        throw new Error('There is no such board or project')
    }

    const search = searchParams.get('search') || '';
    const priorityFilter = (searchParams.get('priority') as PriorityFilter || 'all')
    const { deleteBoard } = useOutletContext<ProjectDetailsContext>();
    const navigate = useNavigate();

    function handleSearchChange(value: string) {
        setSearchParams(prev => {
            if (!value) {
                prev.delete('search')
            } else {
                prev.set('search', value)
            }
            return prev;
        }, { replace: true })
    }

    function handleFilterChange(value: PriorityFilter) {
        setSearchParams(prev => {
            if (!value) {
                prev.delete('priority')
            } else {
                prev.set('priority', value)
            }
            return prev;
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

    const visibleTasks = tasks
        .filter(task => task.projectId === projectId)
        .filter(task => task.boardId === boardId)
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
            projectId: projectId!,
            boardId: boardId!,
            status: 'todo'
        })
    }

    return (
        <div className="w-full">
            <div className="relative flex flex-col items-center justify-center w-full mb-15">
                <h1 className="text-center "> {currentBoard.name}</h1>
                <button className="px-5 font-bold text-white uppercase bg-red-500 rounded-md cursor-pointer "
                    onClick={() => {
                        deleteBoard(boardId)

                        navigate(`/projects/${projectId}/overview`)
                    }} >Delete board</button>
            </div>
            <div className="flex flex-col items-center justify-between w-full max-w-xl gap-3 mx-auto mb-8 sm:flex-row">
                <div className="flex-1 w-full">
                    <input
                        className="w-full px-4 py-2 text-sm text-white placeholder-gray-400 transition-colors border border-gray-700 rounded-lg bg-gray-900/60 focus:outline-none focus:border-purple-500"
                        placeholder="Search tasks..."
                        type="text"
                        value={search}
                        onChange={(event) => handleSearchChange(event.target.value)}
                    />
                </div>
                <div className="w-full sm:w-48">
                    <select
                        className="w-full px-3 py-2 text-sm text-white transition-colors border border-gray-700 rounded-lg cursor-pointer bg-gray-900/60 focus:outline-none focus:border-purple-500"
                        name="filterOptions"
                        id="filter-options"
                        value={priorityFilter}
                        onChange={(event) => handleFilterChange(event?.target.value as PriorityFilter)}
                    >
                        <option value="all" className="bg-gray-900">All Priorities</option>
                        <option value="high" className="bg-gray-900">High Priority (7-10)</option>
                        <option value="medium" className="bg-gray-900">Medium Priority (4-6)</option>
                        <option value="low" className="bg-gray-900">Low Priority (1-3)</option>
                    </select>
                </div>
            </div>

            <div className="grid items-start w-full grid-cols-1 gap-6 md:grid-cols-3">
                <Column tasks={todoTasks} title="Todo" status="todo" onEdit={(task) => setSelectedTask(task)} />
                <Column tasks={inProgressTasks} title="In progress" status="in-progress" onEdit={(task) => setSelectedTask(task)} />
                <Column tasks={doneTasks} title="Done" status="done" onEdit={(task) => setSelectedTask(task)} />
            </div>

            <div className="max-w-lg mx-auto mb-16 mt-14">
                <InputForm onAddTask={handleAddTask} />
            </div>

            {selectedTask && <EditForm task={selectedTask} onClose={() => setSelectedTask(null)} />}
        </div>
    )
}
