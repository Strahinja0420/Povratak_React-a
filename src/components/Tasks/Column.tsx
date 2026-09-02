
import { useState } from 'react';
import type React from 'react';
import TaskCard from './TaskCard';
import type { Task } from '../../data/tasks';
import { useTasksActions } from '../../context/TasksContext';


type ColumnProps = {
    tasks: Task[];
    status: Task['status'];
    title: string;
    onEdit: (task: Task) => void;
}


export default function Column({ tasks, title, status, onEdit }: ColumnProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const { moveToStatus } = useTasksActions();

    /* DROP LOGIC FOR DRAG AND DROP */
    const handleOnDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    const handleOnDragEnter = () => {
        setIsDragOver(true);
    }

    const handleOnDragLeave = () => {
        setIsDragOver(false);
    }

    const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        const taskId = event.dataTransfer.getData("text/plain");

        if (!taskId) {
            return
        }

        moveToStatus(taskId, status);
    }

    return (
        <>
            <div

            >
                <h1>{title}</h1>
                <div
                    className={`min-h-50 transition-colors duration-200 ${isDragOver ? 'bg-purple-100 ring-2 ring-purple-500' : ''}`}
                    onDragEnter={handleOnDragEnter}
                    onDragOver={handleOnDragOver}
                    onDragLeave={handleOnDragLeave}
                    onDrop={handleOnDrop}>
                    {tasks.length === 0 && <p>No tasks</p>}
                    {tasks.map(task => (
                        <TaskCard onEdit={onEdit} task={task} key={task.id} />
                    ))}
                </div>
            </div>
        </>
    )
}