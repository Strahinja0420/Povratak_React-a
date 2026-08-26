import type { Task } from "../../data/tasks"

type TaskCardProps = {
    task: Task
    moveTask: (taskId: Task['id']) => void;
}

export default function TaskCard({ task, moveTask }: TaskCardProps) {


    return (
        <>
            <div>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <small>{task.priority}</small>
            </div>
            {task.status === 'done'
                ? (<div></div>)
                : <div>
                    <button onClick={() => moveTask(task.id)}>Move to next</button>
                </div>}

        </>
    )
}