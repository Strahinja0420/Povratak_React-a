
import type { Task } from '../../data/tasks';
import TaskCard from './TaskCard';


type ColumnProps = {
    tasks: Task[];
    title: string;
    moveTask: (taskId: Task['id']) => void;
}

export default function Column({ tasks, title, moveTask }: ColumnProps) {
    return (
        <>
            <div>
                <h1>{title}</h1>

                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} moveTask = {moveTask} />
                ))}
            </div>
        </>
    )
}