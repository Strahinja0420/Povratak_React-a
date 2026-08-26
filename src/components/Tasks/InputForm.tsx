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
            <form onSubmit={handleSubmit(onSubmit)}>
                <label >
                    Title:
                    <input {...register('title')} placeholder="Title" />
                </label>
                <p>{errors.title?.message}</p>
                <label>
                    Description:
                    <input {...register('description')} placeholder="Description" />
                </label>
                <p>{errors.description?.message}</p>
                <label>
                    Priority:
                    <input type="number" {...register('priority', { valueAsNumber: true })} placeholder="1-10" />
                </label>
                <p>{errors.priority?.message}</p>
                <button className="h-10 text-center border border-white cursor-pointer w-50" type="submit"  >
                    Submit
                </button>
            </form>
        </>
    )
}