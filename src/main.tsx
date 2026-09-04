import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import ProjectsOverview from './components/Projects/ProjectsOverview.tsx'
import ProjectsLayout from './pages/ProjectsLayout.tsx'
import ProjectDetails from './components/Projects/ProjectDetails.tsx'
import App from './App.tsx'
import NotFound from './pages/NotFound.tsx'
import TasksProvider from './context/TasksContext.tsx'
import BoardsOverview from './pages/BoardsOverview.tsx'
import Board from "./components/Boards/Board";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TasksProvider>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<NotFound />}></Route>
          <Route path='/' element={<App />}></Route>
          <Route path='/projects' element={<ProjectsLayout />}>
            <Route index element={<ProjectsOverview />}></Route>
            <Route path=':projectId' element={<ProjectDetails />}>
              <Route path='overview' element={<BoardsOverview />} />
              <Route path='boards/:boardId' element={<Board />}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TasksProvider>
  </StrictMode>
)
