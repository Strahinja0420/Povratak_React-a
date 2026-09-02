import { useForm, type SubmitHandler } from "react-hook-form";
import { CreateProjectSchema } from "../../data/projects";
import type { ProjectsContext } from "../../pages/ProjectsLayout";
import { useOutletContext } from "react-router";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProjectInputForm() {
    const { setProjects } = useOutletContext<ProjectsContext>()

    type CreateProjectInput = z.infer<typeof CreateProjectSchema>

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateProjectInput>({
        resolver: zodResolver(CreateProjectSchema)
    })

    const onSubmit: SubmitHandler<CreateProjectInput> = (data) => {
        const newProject = {
            id: crypto.randomUUID(),
            name: data.name,
        };

        setProjects((prevProject) => [newProject, ...prevProject]);
        reset();
    }

    return (
        <>
            <div className="mt-14 mb-16 max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4 text-center">Add new project</h2>
                <form className="flex flex-col sm:flex-row items-center gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-full">
                        <input
                            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900/60 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Enter project name"
                            type="text"
                            {...register('name')}
                        />
                        {errors.name && (
                            <div className="text-red-400 text-xs mt-1 text-left">{errors.name.message}</div>
                        )}
                    </div>
                    <button
                        className="w-full sm:w-auto px-6 py-2 text-black font-semibold bg-white hover:bg-gray-200 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                        type="submit"
                    >
                        Add
                    </button>
                </form>
            </div>
        </>
    )
}