import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { CreateBoardSchema } from "../../data/boards"
import * as z from 'zod';
import { useOutletContext, useParams } from "react-router";
import type { ProjectDetailsContext } from "../Projects/ProjectDetails";

export default function BoardInputForm() {
    const { setBoards } = useOutletContext<ProjectDetailsContext>();
    const { projectId } = useParams();

    if (!projectId) {
        throw new Error('Wrong project')
    }


    type CreateBoardInput = z.infer<typeof CreateBoardSchema>

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateBoardInput>({
        resolver: zodResolver(CreateBoardSchema),
        defaultValues: {
            name: ' '
        }
    })

    const onSubmit: SubmitHandler<CreateBoardInput> = (data) => {
        const newBoard = {
            id: crypto.randomUUID(),
            projectId,
            name: data.name
        }

        setBoards((prevBoards) => [newBoard, ...prevBoards]);
        reset;
    }

    return (
        <>
            <div className="m-10">
                <h2>ADD NEW BOARD</h2>
                <form className="flex flex-col items-center justify-center gap-5 mt-5"
                    onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors)
                    )}>
                    <label >
                        Name:
                        <input type="text" className="border" {...register('name')} />
                    </label>
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    <button className="text-black bg-white rounded-md cursor-pointer w-15" type="submit">ADD</button>
                </form>
            </div >
        </>
    )
}