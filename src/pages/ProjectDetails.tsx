import { useNavigate, useOutletContext, useParams } from "react-router"
import Board from "../components/Tasks/Board";
import type { ProjectsContext } from "../components/Projects/ProjectsLayout";


export default function ProjectDetails() {
    const { projects } = useOutletContext<ProjectsContext>()
    const {projectId} = useParams()

    let navigate = useNavigate();

    if (!projectId) {
        return <h1>Project not found</h1>
    }

    const currentProject = projects.find((project) => project.id === projectId)

    if (!currentProject) {
        return <h1>Project {projectId} not found!</h1>
    }

    return (
        <>
            <div className="relative flex items-center justify-center w-full">
                <h1 className="m-0 text-center">Project: {currentProject.name}</h1>
                <button onClick={() => navigate('/projects')} className="absolute right-0 px-4 py-2 bg-white cursor-pointer">Back</button>
            </div>
            <Board projectId={projectId}></Board>
        </>
    )
}