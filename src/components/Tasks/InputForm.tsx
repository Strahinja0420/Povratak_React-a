import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form"
import * as z from 'zod';

const AddNewTaskSchema = z.object({
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

export type AddNewTaskSchemaType = z.infer<typeof AddNewTaskSchema>;

type InputFormProps = {
    onAddTask: (data: AddNewTaskSchemaType) => void;
}

export default function InputForm({ onAddTask }: InputFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AddNewTaskSchemaType>({
        resolver: zodResolver(AddNewTaskSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            description: '',
            priority: 1
        }
    })

    const onSubmit: SubmitHandler<AddNewTaskSchemaType> = (data) => {
        onAddTask(data);
        reset({
            title: '',
            description: '',
            priority: 1
        });
    };

    return (
        <div className="p-6 bg-gray-900/40 border border-gray-700 rounded-2xl shadow-md text-left">
            <h2 className="text-xl font-bold text-white mb-5 text-center">Add New Task</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                        Title
                    </label>
                    <input
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900/80 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
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
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900/80 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm resize-none h-20"
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
                        className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900/80 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        {...register('priority', { valueAsNumber: true })}
                        placeholder="1 - 10"
                    />
                    {errors.priority && <p className="text-red-400 text-xs mt-1">{errors.priority.message}</p>}
                </div>

                <button
                    className="w-full py-2.5 mt-2 text-black font-semibold bg-white hover:bg-gray-200 rounded-lg cursor-pointer transition-colors text-sm shadow-sm"
                    type="submit"
                >
                    Create Task
                </button>
            </form>
        </div>
    )
}