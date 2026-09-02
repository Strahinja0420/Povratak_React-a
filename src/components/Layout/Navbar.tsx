import { NavLink } from "react-router";

export default function Navbar() {
    return (
        <>
            <nav className="flex items-center justify-center gap-4 pb-3 mb-6 border-b border-gray-200">
                <NavLink
                    to={'/'}
                    className={({ isActive }) =>
                        `text-sm font-medium transition-colors ${isActive ? 'text-red-500' : 'text-gray-500 hover:text-gray-800'
                        }`
                    }
                >
                    Home
                </NavLink>

                <NavLink
                    to={'/projects'}
                    className={({ isActive }) =>
                        `text-sm font-medium transition-colors ${isActive ? 'text-red-500' : 'text-gray-500 hover:text-gray-800'
                        }`
                    }
                >
                    Projects
                </NavLink>

            </nav>
        </>
    )
}