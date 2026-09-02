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

    return (
        <>
            <div draggable onDragStart={(e) => handleDragStart(e, task.id)} onDragEnd={handleDragEnd} className="max-w-sm mx-auto my-3 border border-white">
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <small>{task.priority}</small>
                <br />
                {task.status !== 'done' &&
                    (
                        <div>
                            <button className="text-black bg-white cursor-pointer"
                                onClick={() =>
                                    moveToStatus(
                                        task.id,
                                        task.status === 'todo' ? 'in-progress' : 'done'
                                    )
                                }>
                                Move to next</button>

                        </div>
                    )
                }
                <br />
                <button className="mt-2 text-black bg-white cursor-pointer" onClick={() => onEdit(task)}>Edit</button>
                <br />
                <button className="mt-2 text-black bg-white cursor-pointer" onClick={() => removeTask(task.id)}>
                    Delete</button>

            </div>


        </>
    )
}