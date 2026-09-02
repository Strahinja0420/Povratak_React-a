import { Link } from "react-router";

export default function NotFound(){
    return(
        <div>
            <h1>NOT FOUND</h1>
        
        <Link to='/'>
            <h2>BACK</h2>
        </Link>
        </div>
    )
}