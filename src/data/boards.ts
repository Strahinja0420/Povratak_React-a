import * as z from 'zod';

export const BoardsSchema = z.object({
    id: z.string(),
    projectId: z.string(),
    name: z.string()

})

export const CreateBoardSchema = BoardsSchema
    .omit({ id: true,projectId:true})
    .extend({
        name: z.string()
            .trim()
            .min(1, { message: 'Please enter a board name' })
    });

export type Board = z.infer<typeof BoardsSchema>

export const boards = [
    { id: 'b1', projectId: 'p1', name: 'Board1' },
    { id: 'b2', projectId: 'p1', name: 'Board2' },
    { id: 'b3', projectId: 'p1', name: 'Board3' }
]