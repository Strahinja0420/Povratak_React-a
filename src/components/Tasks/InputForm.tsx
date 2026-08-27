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
    ;

    return (
        <>
            <form className="flex flex-col h-auto gap-3 py-10 mx-auto border w-md" onSubmit={handleSubmit(onSubmit)}>
                <label className='flex items-center w-full ml-2 text-left'>
                    <span className='w-28'>Title:</span>
                    <div className='flex flex-col items-start gap-1'>
                        <input className='border' {...register('title')} placeholder="Title" />
                        {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
                    </div>
                </label>
                <label className='flex items-center w-full ml-2 text-left'>
                    <span className='w-28'>Description:</span>
                    <div className='flex flex-col items-start gap-1'>
                        <textarea className='border resize-none' {...register('description')} placeholder="Description" />
                        {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
                    </div>
                </label>
                <label className='flex items-center w-full ml-2 text-left'>
                    <span className='w-28'>Priority:</span>
                    <div className='flex flex-col items-start gap-1'>
                        <input type="number" className='border' {...register('priority', { valueAsNumber: true })} placeholder="1-10" />
                        {errors.priority && <p className='text-red-500'>{errors.priority.message}</p>}
                    </div>
                </label>
                <button className="self-center h-10 text-center border border-white cursor-pointer w-50" type="submit"  >
                    Submit
                </button>
            </form>
        </>
    )
}