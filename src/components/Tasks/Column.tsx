
import { useState } from 'react';
import type React from 'react';
import type { Task } from '../../data/tasks';
import TaskCard from './TaskCard';


type ColumnProps = {
    tasks: Task[];
    status: Task['status'];
    title: string;
    moveTask: (taskId: Task['id']) => void;
    onEdit: (task: Task) => void;
    onDeleteTask: (taskId: Task['id']) => void;
    onDropTask: (taskId: Task['id'], status: Task['status']) => void;
}


export default function Column({ tasks, title, status, moveTask, onEdit, onDeleteTask, onDropTask }: ColumnProps) {
    const [isDragOver, setIsDragOver] = useState(false);

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

        onDropTask(taskId, status)
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
                        <TaskCard key={task.id} task={task} moveTask={moveTask} onEdit={onEdit} onDeleteTask={onDeleteTask} />
                    ))}
                </div>
            </div>
        </>
    )
}