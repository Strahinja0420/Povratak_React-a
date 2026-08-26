import type { Task } from "../../data/tasks"

type TaskCardProps = {
    task: Task
    moveTask: (taskId: Task['id']) => void;
}

export default function TaskCard({ task, moveTask }: TaskCardProps) {

    return (
        <>
            <div className="border border-white my-3 max-w-sm mx-auto">
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <small>{task.priority}</small>
                <br />
                {task.status === 'done'
                    ? (<div></div>)
                    :
                    <button className="cursor-pointer bg-white text-black" onClick={() => moveTask(task.id)}>Move to next</button>
                }
            </div>


        </>
    )
}