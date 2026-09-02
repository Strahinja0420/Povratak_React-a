import { createContext, useContext, useEffect, useReducer } from "react";
import type { EditTaskSchemaType } from "../components/Tasks/EditForm";
import { tasks as initialTasks, TaskSchema, type Task } from "../data/tasks"
import { type Project } from "../data/projects";

type TasksProviderProps = {
    children: React.ReactNode
}

type TasksActionType =
    | { type: 'EDIT_TASK'; taskId: Task['id']; data: EditTaskSchemaType }
    | { type: 'ADD_TASK'; task: Task }
    | { type: 'REMOVE_TASK'; taskId: Task['id'] }
    | { type: 'MOVE_TASK'; taskId: Task['id'] }
    | { type: 'MOVE_TO_STATUS'; taskId: Task['id']; status: Task['status'] }
    | { type: 'DELETE_PROJECT_TASKS'; projectId: Project['id'] };

type TasksDispatch = React.Dispatch<TasksActionType>;

export const TasksContext = createContext<Task[]>(initialTasks);
export const TasksReducerContext = createContext<TasksDispatch>({} as TasksDispatch);

function loadInitialTasks(): Task[] {
    const tasksInStorage = localStorage.getItem('tasks');

    if (!tasksInStorage) {
        return initialTasks;
    }

    const parsedTasks = TaskSchema.array().safeParse(JSON.parse(tasksInStorage));

    if (parsedTasks.success) {
        return parsedTasks.data
    }

    return initialTasks;
}

export default function TasksProvider({ children }: TasksProviderProps) {
    const [tasks, dispatch] = useReducer(tasksReducer, undefined, loadInitialTasks)

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }, [tasks])

    return (
        <>
            <TasksContext.Provider value={tasks}>
                <TasksReducerContext.Provider value={dispatch}>
                    {children}
                </TasksReducerContext.Provider>
            </TasksContext.Provider>
        </>
    )
}

export function useTasks() {
    const context = useContext(TasksContext)

    if (!context) {
        throw new Error('No tasks context')
    }

    return context
}

export function useTasksDispatch() {
    const context = useContext(TasksReducerContext)

    if (!context) {
        throw new Error('No tasks reducer context')
    }

    return context
}

export function useTasksActions() {
    const dispatch = useTasksDispatch();

    return {
        addTask: (task: Task) => dispatch({ type: 'ADD_TASK', task }),
        removeTask: (taskId: Task['id']) => dispatch({ type: 'REMOVE_TASK', taskId }),
        editTask: (taskId: Task['id'], data: EditTaskSchemaType) =>
            dispatch({ type: 'EDIT_TASK', taskId, data }),
        moveToStatus: (taskId: Task['id'], status: Task['status']) =>
            dispatch({ type: 'MOVE_TO_STATUS', taskId, status }),
        deleteProjectTasks: (projectId: Project['id']) =>
            dispatch({ type: 'DELETE_PROJECT_TASKS', projectId }),
    };
}

function tasksReducer(tasks: Task[], action: TasksActionType): Task[] {
    switch (action.type) {
        case 'MOVE_TASK': {
            return tasks.map(task =>
                task.id === action.taskId
                    ? { ...task, status: task.status === 'todo' ? 'in-progress' : 'done' }
                    : task
            )
        }
        case 'ADD_TASK': {
            return [...tasks, action.task]
        }
        case 'REMOVE_TASK': {
            return tasks.filter(task => task.id !== action.taskId)
        }
        case 'EDIT_TASK': {
            return tasks.map(task =>
                task.id === action.taskId
                    ? { ...task, ...action.data }
                    : task
            )
        }
        case 'MOVE_TO_STATUS': {
            return tasks.map(task =>
                task.id === action.taskId
                    ? { ...task, status: action.status }
                    : task
            )
        }
        case 'DELETE_PROJECT_TASKS': {
            return tasks.filter(task => task.projectId !== action.projectId)
        }

        default:
            throw Error('Unknown action' + action)
    }
}

