import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Outlet } from "react-router";
import { projects as initialProjects, ProjectSchema, type Project } from "../../data/projects"

export type ProjectsContext = {
    projects: Project[];
    setProjects: Dispatch<SetStateAction<Project[]>>;
};

export default function ProjectsLayout() {
    const [projects, setProjects] = useState<Project[]>(() => {
        const projectsInStorage = localStorage.getItem('projects')

        if (!projectsInStorage) {
            return initialProjects
        }

        const parsedProjects = ProjectSchema.array().safeParse(JSON.parse(projectsInStorage))

        if (parsedProjects.success) {
            return parsedProjects.data
        }

        return initialProjects;
    });

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects))
    }, [projects])

    return (
        <Outlet context={{ projects, setProjects }} />
    )
}