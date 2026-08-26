import type { Task } from "../../data/tasks"

type TaskCardProps = {
    task: Task
}

export default function TaskCard({ task }: TaskCardProps) {


    return (
        <>
            <div>
                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <small>{task.priority}</small>
            </div>
        </>
    )
}