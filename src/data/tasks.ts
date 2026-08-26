export type Task ={
    
    id:number
    title:string
    description:string
    priority:number
    status: 'todo' | 'in-progress' | 'done' 

}

export const tasks: Task[] = [{
    id:0,
    title: 'Ucenje react-a',
    description: 'Kreni da ucis jebeni React',
    priority: 10,
    status: 'in-progress'
},{
    id:1,
    title: 'Pranje vesa',
    description: 'Odnesi ves u komsiluk da se opere',
    priority: 9,
    status: 'todo'
},{
    id:2,
    title: 'Citanje knjige',
    description: 'Citaj jebenu knjigu za koju si dao pare',
    priority: 6,
    status: 'in-progress'
},{
    id:3,
    title: 'Ciscenje kuce',
    description: 'Ocisti kucu',
    priority: 7,
    status: 'in-progress'
},{
    id:4,
    title: 'Dorucak',
    description: 'Skuvaj i pojedi dorucak',
    priority: 5,
    status: 'done'
}
]