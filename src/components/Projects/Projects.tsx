import { Link, useOutletContext } from "react-router";
import { CreateProjectSchema, type Project } from "../../data/projects";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import type { ProjectsContext } from "../../pages/ProjectsLayout";
import { useState } from "react";
import EditProjectForm from "./EditProjectForm";
import { useTasksActions } from "../../context/TasksContext";

export default function Projects() {
    const { setProjects, editProject, filteredProjects, deleteProject, setSearch, search } = useOutletContext<ProjectsContext>();
    const { deleteProjectTasks } = useTasksActions();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

            <div className="flex flex-col w-62.5 mx-auto mb-10">
                <h2>SEARCH</h2>

                <input className="w-full text-center border" placeholder="Search" type="text" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <div>
                {filteredProjects.map(project =>
                    <div className="relative mx-auto border rounded-2xl w-50 h-25" key={project.id}>

                        <Link className="absolute inset-0 z-0" to={`/projects/${project.id}`}>
                            <span className="sr-only">{project.name}</span>
                        </Link>


                        <div className="relative z-0 px-2 pt-1 pointer-events-none">
                            {project.name}
                        </div>


                        <div className="relative z-10 flex justify-center gap-1 mt-10">
                            <button
                                className="w-10 text-black bg-white rounded-md cursor-pointer"
                                onClick={() => setSelectedProject(project)}
                            >
                                Edit
                            </button>
                            <button
                                className="text-black bg-white rounded-md cursor-pointer w-15"
                                onClick={() => {
                                    deleteProject(project.id)
                                    deleteProjectTasks(project.id)
                                }}
                            >
                                Delete
                            </button>
                        </div>
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

            {selectedProject && <EditProjectForm project={selectedProject} onClose={() => setSelectedProject(null)} onSubmitEdit={editProject} />}
        </>
    )
}
