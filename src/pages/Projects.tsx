import { Link, useOutletContext } from "react-router";
import { CreateProjectSchema } from "../data/projects";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import type { ProjectsContext } from "../components/Projects/ProjectsLayout";

//<button onClick={() => navigate('/')} className="absolute right-0 px-4 py-2 bg-white cursor-pointer">Back</button>

export default function Projects() {
    const { projects, setProjects } = useOutletContext<ProjectsContext>();

    type CreateProjectInput = z.infer<typeof CreateProjectSchema>

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateProjectInput>({
        resolver: zodResolver(CreateProjectSchema)
    })

    const onSubmit: SubmitHandler<CreateProjectInput> = (data) => {
        const newProject = {
            id: crypto.randomUUID(),
            name: data.name,
        };

        setProjects((prevProject) => [newProject, ...prevProject])
    }

    return (
        <>
            <div className="relative flex items-center justify-center w-full">
                <h1 className="m-0 text-center">Projects</h1>

            </div>
            <div>
                {projects.map(project =>
                    <div key={project.id}>
                        <Link to={`/projects/${project.id}`}>
                            {project.name}
                        </Link>
                        <br />
                    </div>
                )}
            </div>
            <div className="mt-10">
                <h2>Add new project</h2>
                <form className="flex justify-center gap-10" onSubmit={handleSubmit(onSubmit)}>
                    <label >
                        Name:
                        <input className="border" type="text" {...register('name')} />
                        {errors.name && (
                            <div className="text-red-500">{errors.name.message}</div>
                        )}
                    </label>
                    <button className="text-black bg-white cursor-pointer" type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}