import { useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Task } from '../../data/tasks';
import { useTasksActions } from '../../context/TasksContext';

const EditTaskSchema = z.object({
    title: z.string()
        .trim()
        .min(1, { message: 'Please enter a title for the task' }),
    description: z.string()
        .trim()
        .min(1, { message: 'Please enter a description for the task' }),
    priority: z.number()
        .min(1, { message: 'Priority cant be less than 1' })
        .max(10, { message: 'Priority cant be more than 10' })
})

export type EditTaskSchemaType = z.infer<typeof EditTaskSchema>;

type EditFormProps = {
    task: Task;
    onClose: () => void;
}

export default function EditForm({ onClose, task }: EditFormProps) {
    const { editTask } = useTasksActions()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<EditTaskSchemaType>({
        resolver: zodResolver(EditTaskSchema),
        mode: 'onChange',
        defaultValues: {
            description: task.description,
            priority: task.priority,
            title: task.title
        }
    })

    const onSubmit: SubmitHandler<EditTaskSchemaType> = (data) => {
        editTask(task.id, data)
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/75 backdrop-blur-sm p-4">
            <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white m-0">Edit Task</h2>
                    <button
                        className="px-2.5 py-1 text-xs font-semibold text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                        onClick={onClose}
                    >
                        ✕ Close
                    </button>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                            Title
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-950 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            {...register('title')}
                            placeholder="Task title"
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                            Description
                        </label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-950 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm resize-none h-24"
                            {...register('description')}
                            placeholder="Task description..."
                        />
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                            Priority (1 - 10)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-950 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            {...register('priority', { valueAsNumber: true })}
                            placeholder="1 - 10"
                        />
                        {errors.priority && <p className="text-red-400 text-xs mt-1">{errors.priority.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            className="w-1/2 py-2.5 text-gray-300 font-semibold bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors text-sm border border-gray-700"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 py-2.5 text-black font-semibold bg-white hover:bg-gray-200 rounded-lg cursor-pointer transition-colors text-sm shadow-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}