import type { Task } from "../../data/tasks"

type TaskCardProps = {
    task: Task;
    moveTask: (taskId: Task['id']) => void;
    onEdit: (task : Task) => void;
}

export default function TaskCard({ task, moveTask, onEdit }: TaskCardProps) {

    return (
        <>
            <div className="max-w-sm mx-auto my-3 border border-white">
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

            </div>


        </>
    )
}