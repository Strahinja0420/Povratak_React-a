
import type { Task } from '../../data/tasks';
import TaskCard from './TaskCard';


type ColumnProps = {
    tasks: Task[];
    title: string;
}

export default function Column({ tasks, title }: ColumnProps) {
    return (
        <>
            <div>
                <h1>{title}</h1>

                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </>
    )
}