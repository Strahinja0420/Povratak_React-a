import { useNavigate, useOutletContext, useParams } from "react-router"
import Board from "../../pages/Board";
import type { ProjectsContext } from "../../pages/ProjectsLayout";
import { useTasksActions } from "../../context/TasksContext";

export default function ProjectDetails() {
    const { projects, deleteProject } = useOutletContext<ProjectsContext>()
    const { deleteProjectTasks } = useTasksActions()
    const { projectId } = useParams()

    let navigate = useNavigate();

    if (!projectId) {
        return <h1>Project not found</h1>
    }

    const currentProject = projects.find((project) => project.id === projectId)

    if (!currentProject) {
        return <h1>Project {projectId} not found!</h1>
    }

    function onDelete() {
        if (!projectId) {
            throw Error('Cannot delete project whose id doesnt exist')
        }
        deleteProject(projectId)
        deleteProjectTasks(projectId)
        navigate('/projects')
    }

    return (
        <>
            <div className="relative flex flex-col items-center justify-center w-full mb-15">
                <h1 className="text-center ">Project: {currentProject.name}</h1>
                <button onClick={onDelete} className="px-5 font-bold text-white uppercase bg-red-500 rounded-md cursor-pointer " >Delete project</button>
            </div>
            <Board projectId={projectId}></Board>
        </>
    )
}
