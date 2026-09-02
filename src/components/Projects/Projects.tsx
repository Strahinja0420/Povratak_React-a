import { useOutletContext } from "react-router";
import { type Project } from "../../data/projects";
import type { ProjectsContext } from "../../pages/ProjectsLayout";
import { useState } from "react";
import EditProjectForm from "./EditProjectForm";
import ProjectCard from "./ProjectCard";
import ProjectInputForm from "./ProjectInputForm";

export default function Projects() {
    const { editProject, filteredProjects, setSearch, search } = useOutletContext<ProjectsContext>();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            <div className="relative flex items-center justify-center w-full my-6">
                <h1 className="m-0 text-center text-3xl font-bold">Projects</h1>
            </div>

            <div className="flex flex-col max-w-md w-full mx-auto mb-8">
                <input
                    className="w-full px-4 py-2 text-center rounded-lg border border-gray-700 bg-gray-900/60 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Search projects..."
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </div>

            {filteredProjects.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p>No projects found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProjects.map(project =>
                        <ProjectCard project={project} setSelectedProject={() => setSelectedProject(project)}></ProjectCard>
                    )}
                </div>
            )}

            <ProjectInputForm />

            {selectedProject && <EditProjectForm project={selectedProject} onClose={() => setSelectedProject(null)} onSubmitEdit={editProject} />}
        </div>
    )
}
