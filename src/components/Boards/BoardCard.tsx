import { Link, useNavigate, useOutletContext, useParams } from "react-router";
import { useTasks } from "../../context/TasksContext";
import type { Project } from "../../data/projects";
import type { Board } from "../../data/boards";
import type { ProjectDetailsContext } from "../Projects/ProjectDetails";

type BoardCardProps = {
    board: Board;
}

export default function BoardCard({ board }: BoardCardProps) {
    const tasks = useTasks()
    const { projectId } = useParams();
    const { deleteBoard } = useOutletContext<ProjectDetailsContext>();
    const navigate = useNavigate();

    function showNumberOfTasks(projectId: Project['id']) {
        const projectTasks = tasks.
            filter(task => task.projectId === projectId)
            .filter(task => task.boardId === board.id)
        const numOfTasks = projectTasks.length;
        const numOfTasksDone = projectTasks.filter(task => task.status === 'done').length;
        const numOfTasksDonePercentage = numOfTasks > 0 ? Math.round((numOfTasksDone / numOfTasks) * 100) : 0;
        return (
            <div className="flex flex-col gap-1.5 my-3 text-sm">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Tasks: <strong className="text-gray-200">{numOfTasks}</strong></span>
                    <span>Done: <strong className="text-gray-200">{numOfTasksDone}</strong></span>
                </div>
                <div className="w-full h-2 overflow-hidden bg-gray-800 rounded-full">
                    <div
                        className="h-2 transition-all duration-300 bg-purple-500 rounded-full"
                        style={{ width: `${numOfTasksDonePercentage}%` }}
                    />
                </div>
                <div className="text-xs font-medium text-right text-purple-400">
                    {numOfTasksDonePercentage}% completed
                </div>
            </div>
        )
    }

    return (
        <>
            <div
                className="relative flex flex-col justify-between p-5 text-left transition-all duration-200 border border-gray-700 shadow-md hover:border-purple-500/60 bg-gray-900/40 rounded-xl"
                key={board.id}
            >
                <Link className="absolute inset-0 z-0 rounded-xl" to={`/projects/${projectId}/boards/${board.id}`}>
                    <span className="sr-only">{board.name}</span>
                </Link>

                <div className="relative z-0 pointer-events-none">
                    <h3 className="mb-1 text-lg font-semibold text-white truncate">
                        {board.name}
                    </h3>
                    {showNumberOfTasks(projectId!)}
                </div>


                <div className="relative z-10 flex justify-end gap-2 pt-3 border-t border-gray-800">
                    <button
                        className="px-3 py-1 text-xs font-medium text-black transition-colors bg-white rounded-md cursor-pointer hover:bg-gray-200"

                    >
                        Edit
                    </button>
                    <button
                        className="px-3 py-1 text-xs font-medium text-white transition-colors bg-red-600 rounded-md cursor-pointer hover:bg-red-700"
                        onClick={() => {
                            deleteBoard(board.id)
                            navigate(`/projects/${projectId}/overview`)
                        }}
                    >
                        Delete
                    </button>
                </div>

            </div>
        </>
    )
}