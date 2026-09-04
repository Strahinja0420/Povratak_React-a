import {  useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Outlet,  useSearchParams } from "react-router";
import { projects as initialProjects, ProjectSchema, type Project } from "../data/projects";
import Navbar from "../components/Layout/Navbar";
import { BoardsSchema, boards as initialBoards, type Board } from "../data/boards";
import {  useTasksActions } from "../context/TasksContext";

export type ProjectsContext = {
    projects: Project[];
    boards: Board[];
    setBoards: Dispatch<SetStateAction<Board[]>>;
    search: string;
    filteredProjects: Project[];
    handleSearchChange: Dispatch<SetStateAction<string>>;
    setProjects: Dispatch<SetStateAction<Project[]>>;
    editProject: (projectId: Project['id'], newName: Project['name']) => void;
    deleteProject: (projectId: Project['id']) => void;
    deleteBoard: (boardId: Board['id']) => void;
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
    const [boards, setBoards] = useState<Board[]>(() => {
        const boardsInStorage = localStorage.getItem('boards');

        if (!boardsInStorage) {
            return initialBoards
        }

        const parsedBoards = BoardsSchema.array().safeParse(JSON.parse(boardsInStorage))

        if (parsedBoards.success) {
            return parsedBoards.data
        }

        return initialBoards
    })
    const [searchParams, setSearchParams] = useSearchParams('');
    const search = searchParams.get('search') || '';
    const { deleteBoardTasks } = useTasksActions();

    function handleSearchChange(value: string) {
        setSearchParams(prev => {
            if (!value) {
                prev.delete('search');
            } else {
                prev.set('search', value)
            }
            return prev
        }, { replace: true })
    }

    useEffect(() => {
        localStorage.setItem('projects', JSON.stringify(projects))
        localStorage.setItem('boards', JSON.stringify(boards))
    }, [projects, boards])

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
        setBoards(boards => boards.filter(board => board.projectId !== projectId));
    }

    function deleteBoard(boardId: Board['id']) {
        setBoards((currentBoards) =>
            currentBoards.filter(board => board.id !== boardId)
        )
        deleteBoardTasks(boardId)
    }


    const filteredProjects = projects
        .filter(project => project.name.toLowerCase().includes(search))

    return (
        <>
            <Navbar></Navbar>
            <Outlet context={{ projects, filteredProjects, handleSearchChange, setProjects, editProject, deleteProject, search, boards, setBoards, deleteBoard }} />
        </>
    )
}
