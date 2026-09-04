import * as z from 'zod';

export const TaskSchema = z.object({
    id: z.string(),
    projectId: z.string(),
    boardId:z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.number(),
    status: z.enum(['todo', 'in-progress', 'done'])
});

export type Task = z.infer<typeof TaskSchema>

export const tasks: Task[] = [{
    id: '0',
    projectId:'p1',
    boardId:'b1',
    title: 'Ucenje react-a',
    description: 'Kreni da ucis jebeni React',
    priority: 10,
    status: 'in-progress'
}, {
    id: '1',
    projectId:'p1',
    boardId:'b2',
    title: 'Pranje vesa',
    description: 'Odnesi ves u komsiluk da se opere',
    priority: 9,
    status: 'todo'
}, {
    id: '2',
    projectId:'p1',
    boardId:'b1',
    title: 'Citanje knjige',
    description: 'Citaj jebenu knjigu za koju si dao pare',
    priority: 6,
    status: 'in-progress'
}, {
    id: '3',
    boardId:'b1',
    projectId:'p1',
    title: 'Ciscenje kuce',
    description: 'Ocisti kucu',
    priority: 7,
    status: 'in-progress'
}, {
    id: '4',
    projectId:'p1',
    boardId:'b1',
    title: 'Dorucak',
    description: 'Skuvaj i pojedi dorucak',
    priority: 5,
    status: 'done'
}
]