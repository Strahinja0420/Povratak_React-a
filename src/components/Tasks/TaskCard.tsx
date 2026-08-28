import type React from "react";
import { type Task } from "../../data/tasks"

type TaskCardProps = {
    task: Task;
    moveTask: (taskId: Task['id']) => void;
    onEdit: (task: Task) => void;
    onDeleteTask: (taskId: Task['id']) => void;
}

export default function TaskCard({ task, moveTask, onEdit, onDeleteTask }: TaskCardProps) {

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
                            <button className="text-black bg-white cursor-pointer" onClick={() => moveTask(task.id)}>Move to next</button>

                        </div>
                    )
                }
                <br />
                <button className="mt-2 text-black bg-white cursor-pointer" onClick={() => onEdit(task)}>Edit</button>
                <br />
                <button className="mt-2 text-black bg-white cursor-pointer" onClick={() => onDeleteTask(task.id)}>Delete</button>

            </div>


        </>
    )
}