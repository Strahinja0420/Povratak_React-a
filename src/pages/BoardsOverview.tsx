import { useNavigate, useOutletContext } from "react-router"
import type { ProjectDetailsContext } from "../components/Projects/ProjectDetails";
import {  useTasksActions } from "../context/TasksContext";
import BoardCard from "../components/Boards/BoardCard";
import BoardInputForm from "../components/Boards/BoardInputForm";

export default function BoardsOverview() {
    const { currentProject, boards, deleteProject } = useOutletContext<ProjectDetailsContext>();
    let navigate = useNavigate();
    const { deleteProjectTasks } = useTasksActions()

    const visibleBoards = boards.filter(board => board.projectId === currentProject.id)


    function onDelete() {
        if (!currentProject.id) {
            throw Error('Cannot delete project whose id doesnt exist');
        }
        deleteProject(currentProject.id)
        deleteProjectTasks(currentProject.id)
        navigate('/projects')
    }
    return (
        <>
            <div className="relative flex flex-col items-center justify-center w-full mb-15">
                <h1 className="text-center ">Project: {currentProject.name}</h1>
                <button onClick={onDelete} className="px-5 font-bold text-white uppercase bg-red-500 rounded-md cursor-pointer " >Delete project</button>
            </div>
            {visibleBoards.map(board => <BoardCard key={board.id} board={board} />)}
             <BoardInputForm/>
        </>
    )
}