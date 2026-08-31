import { useForm, type SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Task } from '../../data/tasks';

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
    onSubmitEdit: (data: EditTaskSchemaType) => void;
}

export default function EditForm({ onClose, onSubmitEdit, task }: EditFormProps) {

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
        onSubmitEdit(data)
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/50">
                <div className="relative flex items-center justify-center bg-white min-h-100 min-w-100">
                    <button className="absolute bg-red-500 cursor-pointer top-2 right-2" onClick={onClose}>Close</button>
                    <form className='flex flex-col items-start justify-center gap-10' onSubmit={handleSubmit(onSubmit)}>
                        <label className='flex items-center w-full text-left'>
                            <span className='text-left w-28'>Title:</span>
                            <div className='flex flex-col items-start gap-1'>
                                <input className='border' {...register('title')} placeholder='' />
                                {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
                            </div>
                        </label>
                        <label className='flex items-center w-full text-left'>
                            <span className='text-left w-28'>Description:</span>
                            <div className='flex flex-col items-start gap-1'>
                                <textarea className='object-fill border' {...register('description')} placeholder='' />
                                {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
                            </div>
                        </label>
                        <label className='flex items-center w-full text-left'>
                            <span className='text-left w-28'>Priority:</span>
                            <div className='flex flex-col items-start gap-1'>
                                <input type='number' className='border' {...register('priority', { valueAsNumber: true })} placeholder='' />
                                {errors.priority && <p className='text-red-500'>{errors.priority.message}</p>}
                            </div>
                        </label>
                        <button className='self-center w-20 bg-black cursor-pointer' type='submit'>Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}