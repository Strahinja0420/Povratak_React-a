import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Outlet } from "react-router";
import { projects as initialProjects, ProjectSchema, type Project } from "../data/projects";
import Navbar from "../components/Layout/Navbar";

export type ProjectsContext = {
    projects: Project[];
    search: string;
    filteredProjects: Project[];
    setSearch: Dispatch<SetStateAction<string>>;
    setProjects: Dispatch<SetStateAction<Project[]>>;
    editProject: (projectId: Project['id'], newName: Project['name']) => void;
    deleteProject: (projectId: Project['id']) => void;
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
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects))
    }, [projects])

    function editProject(projectId: Project['id'], newName: Project['name']) {
        setProjects((currentProjects) =>
            currentProjects.map((project) =>
                project.id === projectId ? { ...project, name: newName } : project
            )
        )
    }

    function deleteProject(projectId: Project['id']) {
        setProjects((currentProjects) =>
            currentProjects.filter(project => project.id !== projectId)
        )
    }

    const filteredProjects = projects
        .filter(project => project.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <>
            <Navbar></Navbar>
            <Outlet context={{ projects, filteredProjects, setSearch, setProjects, editProject, deleteProject, search }} />
        </>
    )
}
