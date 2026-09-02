import { useForm, type SubmitHandler } from "react-hook-form"
import * as z from 'zod';
import {  CreateProjectSchema, type Project } from "../../data/projects";
import { zodResolver } from "@hookform/resolvers/zod";

type EditProjectType = z.infer<typeof CreateProjectSchema>;

type EditProjectFormProps = {
    onSubmitEdit: (projectId:Project['id'],newName:string) => void;
    project: Project;
    onClose:() => void;
}

export default function EditProjectForm({ onSubmitEdit,onClose,project }: EditProjectFormProps) {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<EditProjectType>({
        resolver: zodResolver(CreateProjectSchema),
        mode:'onChange',
        defaultValues:
        {
            name:project.name
        }
    })

    const onSubmit: SubmitHandler<EditProjectType> = (data) => {
        onSubmitEdit(project.id,data.name)
        onClose()
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 ">
                <div className="relative w-full max-w-md p-6 bg-white border shadow-xl rounded-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute text-lg font-bold text-gray-600 cursor-pointer right-3 top-3 hover:text-black"
                    >
                        ×
                    </button>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                        <label className="flex flex-col gap-2 font-medium text-gray-700">
                            Name:
                            <input
                                type="text"
                                className="px-3 py-2 border border-gray-300 rounded"
                                {...register('name')}
                            />
                            {errors.name && <div className="text-red-500">{errors.name.message}</div>}
                        </label>
                        <button className="w-full px-4 py-2 text-white bg-black rounded-md cursor-pointer" type="submit">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}