import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Projects from './pages/Projects.tsx'
import ProjectsLayout from './components/Projects/ProjectsLayout.tsx'
import ProjectDetails from './pages/ProjectDetails.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/projects' element={<ProjectsLayout />}>
          <Route index element={<Projects />}></Route>
          <Route path=':projectId' element={<ProjectDetails />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
