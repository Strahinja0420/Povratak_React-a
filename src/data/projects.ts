import * as z from 'zod';

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string()

})

export const CreateProjectSchema = ProjectSchema.omit({ id: true })

export type Project = z.infer<typeof ProjectSchema>

export const projects = [
    { id: 'p1', name: 'Random shit' },
    { id: 'p2', name: 'Mobile App' },
    { id: 'p3', name: 'Marketing Dashboard' }
]