import { Outlet, useOutletContext, useParams } from "react-router"
import type { ProjectsContext } from "../../pages/ProjectsLayout";
import type { Project } from "../../data/projects";
import type { Board } from "../../data/boards";
import type { Dispatch, SetStateAction } from "react";

export type ProjectDetailsContext = {
    currentProject: Project;
    boards: Board[];
    deleteProject: (projectId: Project['id']) => void;
    setBoards: Dispatch<SetStateAction<Board[]>>
    deleteBoard: (boardId: Board['id']) => void;
}

export default function ProjectDetails() {
    const { projects, deleteProject, boards, setBoards, deleteBoard } = useOutletContext<ProjectsContext>()
    const { projectId } = useParams()

    if (!projectId) {
        return <h1>Project not found</h1>
    }

    const currentProject = projects.find((project) => project.id === projectId)

    if (!currentProject) {
        return <h1>Project {projectId} not found!</h1>
    }



    return (
        <>
            <Outlet context={{ currentProject, boards, deleteProject, setBoards, deleteBoard }} />
        </>
    )
}
