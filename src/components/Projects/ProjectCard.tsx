import { Link, useOutletContext } from "react-router";
import { useTasks, useTasksActions } from "../../context/TasksContext";
import type { Project } from "../../data/projects";
import type { ProjectsContext } from "../../pages/ProjectsLayout";

type ProjectCardProps = {
    project: Project;
    setSelectedProject: (project: Project) => void;
}

export default function ProjectCard({ project, setSelectedProject }: ProjectCardProps) {
    const tasks = useTasks()
    const { deleteProject } = useOutletContext<ProjectsContext>()
    const { deleteProjectTasks } = useTasksActions();

    function showNumberOfTasks(project: Project) {
        const projectTasks = tasks.filter(task => task.projectId === project.id);
        const numOfTasks = projectTasks.length;
        const numOfTasksDone = projectTasks.filter(task => task.status === 'done').length;
        const numOfTasksDonePercentage = numOfTasks > 0 ? Math.round((numOfTasksDone / numOfTasks) * 100) : 0;

        return (
            <div className="flex flex-col gap-1.5 my-3 text-sm">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Tasks: <strong className="text-gray-200">{numOfTasks}</strong></span>
                    <span>Done: <strong className="text-gray-200">{numOfTasksDone}</strong></span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${numOfTasksDonePercentage}%` }}
                    />
                </div>
                <div className="text-right text-xs text-purple-400 font-medium">
                    {numOfTasksDonePercentage}% completed
                </div>
            </div>
        )
    }

    return (
        <>
            <div
                className="relative flex flex-col justify-between p-5 border border-gray-700 hover:border-purple-500/60 bg-gray-900/40 rounded-xl transition-all duration-200 shadow-md text-left"
                key={project.id}
            >
                <Link className="absolute inset-0 z-0 rounded-xl" to={`/projects/${project.id}`}>
                    <span className="sr-only">{project.name}</span>
                </Link>

                <div className="relative z-0 pointer-events-none">
                    <h3 className="text-lg font-semibold text-white truncate mb-1">
                        {project.name}
                    </h3>
                    {showNumberOfTasks(project)}
                </div>

                <div className="relative z-10 flex justify-end gap-2 pt-3 border-t border-gray-800">
                    <button
                        className="px-3 py-1 text-xs font-medium text-black bg-white hover:bg-gray-200 rounded-md cursor-pointer transition-colors"
                        onClick={() => setSelectedProject(project)}
                    >
                        Edit
                    </button>
                    <button
                        className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer transition-colors"
                        onClick={() => {
                            deleteProject(project.id)
                            deleteProjectTasks(project.id)
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </>
    )
}