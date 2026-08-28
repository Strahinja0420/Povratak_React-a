
import type { Task } from '../../data/tasks';
import TaskCard from './TaskCard';


type ColumnProps = {
    tasks: Task[];
    title: string;
    moveTask: (taskId: Task['id']) => void;
    onEdit: (task: Task) => void;
    onDeleteTask: (taskId: Task['id']) => void;
}


export default function Column({ tasks, title, moveTask, onEdit, onDeleteTask }: ColumnProps) {
    return (
        <>
            <div >
                <h1>{title}</h1>
                {tasks.length === 0 && <p>No tasks</p>}
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} moveTask={moveTask} onEdit={onEdit} onDeleteTask={onDeleteTask} />
                ))}
            </div>
        </>
    )
}