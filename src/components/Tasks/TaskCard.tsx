import type React from "react";
import { type Task } from "../../data/tasks"
import { useTasksActions } from "../../context/TasksContext";

type TaskCardProps = {
    task: Task;
    onEdit: (task: Task) => void
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
    const { moveToStatus, removeTask } = useTasksActions()

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, taskId: Task['id']) => {
        event.dataTransfer.setData("text/plain", taskId.toString())
    }

    const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.clearData();
    }

    const getPriorityBadge = (priority: number) => {
        if (priority >= 7) {
            return (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-950/60 text-red-400 border border-red-800/60 whitespace-nowrap">
                    High ({priority})
                </span>
            );
        } else if (priority >= 4) {
            return (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/60 whitespace-nowrap">
                    Med ({priority})
                </span>
            );
        } else {
            return (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 whitespace-nowrap">
                    Low ({priority})
                </span>
            );
        }
    }

    return (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={handleDragEnd}
            className="group flex flex-col justify-between p-4 bg-gray-900/70 hover:bg-gray-900 border border-gray-800 hover:border-purple-500/50 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing text-left"
        >
            <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white text-base leading-snug break-words">
                        {task.title}
                    </h3>
                    {getPriorityBadge(task.priority)}
                </div>

                {task.description && (
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4 break-words">
                        {task.description}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-800/80 mt-2">
                <div className="flex items-center gap-1.5">
                    <button
                        className="px-2.5 py-1 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-md cursor-pointer transition-colors border border-gray-700/60"
                        onClick={() => onEdit(task)}
                    >
                        Edit
                    </button>
                    <button
                        className="px-2.5 py-1 text-xs font-medium text-red-400 hover:text-white bg-red-950/40 hover:bg-red-600 rounded-md cursor-pointer transition-colors border border-red-900/40 hover:border-red-600"
                        onClick={() => removeTask(task.id)}
                    >
                        Delete
                    </button>
                </div>

                {task.status !== 'done' && (
                    <button
                        className="px-3 py-1 text-xs font-medium text-purple-200 bg-purple-900/60 hover:bg-purple-800 hover:text-white rounded-md cursor-pointer transition-colors border border-purple-700/60 flex items-center gap-1"
                        onClick={() =>
                            moveToStatus(
                                task.id,
                                task.status === 'todo' ? 'in-progress' : 'done'
                            )
                        }
                    >
                        <span>Next</span>
                        <span>&rarr;</span>
                    </button>
                )}
            </div>
        </div>
    )
}