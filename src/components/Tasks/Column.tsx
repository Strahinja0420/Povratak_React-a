
import { useRef, useState } from 'react';
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
    const dragCounter = useRef(0);
    const { moveToStatus } = useTasksActions();

    /* DROP LOGIC FOR DRAG AND DROP */
    const handleOnDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }

    const handleOnDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragCounter.current += 1;
        setIsDragOver(true);
    }

    const handleOnDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragCounter.current -= 1;
        if (dragCounter.current <= 0) {
            dragCounter.current = 0;
            setIsDragOver(false);
        }
    }

    const handleOnDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragCounter.current = 0;
        setIsDragOver(false);
        const taskId = event.dataTransfer.getData("text/plain");

        if (!taskId) {
            return
        }

        moveToStatus(taskId, status);
    }

    const getStatusHeaderColor = () => {
        switch (status) {
            case 'todo':
                return 'text-blue-400 bg-blue-950/40 border-blue-800/40';
            case 'in-progress':
                return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
            case 'done':
                return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
        }
    }

    return (
        <div
            className={`flex flex-col flex-1 rounded-2xl p-4 shadow-sm transition-all duration-200 border ${
                isDragOver
                    ? 'bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/60 shadow-lg shadow-purple-500/10'
                    : 'bg-gray-950/40 border-gray-800'
            }`}
            onDragEnter={handleOnDragEnter}
            onDragOver={handleOnDragOver}
            onDragLeave={handleOnDragLeave}
            onDrop={handleOnDrop}
        >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800/80 pointer-events-none">
                <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${status === 'todo' ? 'bg-blue-400' : status === 'in-progress' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <h2 className="text-base font-bold text-white m-0 tracking-wide">{title}</h2>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusHeaderColor()}`}>
                    {tasks.length}
                </span>
            </div>

            <div
                className={`flex flex-col gap-3 min-h-[320px] rounded-xl p-2 transition-all duration-200 ${
                    isDragOver
                        ? 'bg-purple-900/20 border border-purple-500/40'
                        : 'bg-gray-900/20 border border-transparent'
                }`}
            >
                {tasks.length === 0 ? (
                    <div
                        className={`flex flex-col items-center justify-center flex-1 py-12 text-xs border-2 border-dashed rounded-xl pointer-events-none transition-colors ${
                            isDragOver
                                ? 'border-purple-400/60 text-purple-300 bg-purple-950/30 font-medium'
                                : 'border-gray-800/70 text-gray-500'
                        }`}
                    >
                        <p>{isDragOver ? 'Release to drop task' : 'No tasks'}</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskCard onEdit={onEdit} task={task} key={task.id} />
                    ))
                )}
            </div>
        </div>
    )
}