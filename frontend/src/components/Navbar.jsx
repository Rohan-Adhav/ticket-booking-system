import { NavLink, Link, useNavigate } from "react-router-dom";
import { getRole } from "../utils/auth.js";
import { logout } from "../services/auth.api.js";

export default function Navbar() {
    const role = getRole();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        localStorage.clear();
        navigate("/login");
    };

    const baseLink =
        "relative text-sm font-medium transition-colors duration-200";

    const underlineBase =
        "absolute left-0 -bottom-1 h-[2px] w-full origin-left transition-transform duration-300 bg-gradient-to-r from-purple-500 to-blue-500";

    const getLinkClass = ({ isActive }) =>
        `${baseLink} ${
            isActive ? "text-white" : "text-gray-400 hover:text-white"
        }`;

    const renderLink = (to, label) => (
        <NavLink to={to} className={getLinkClass}>
            {({ isActive }) => (
                <span className="group relative">
                    {label}
                    <span
                        className={`${underlineBase} ${
                            isActive
                                ? "scale-x-100"
                                : "scale-x-0 group-hover:scale-x-100"
                        }`}
                    />
                </span>
            )}
        </NavLink>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f1a]/80 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* LEFT */}
                <Link to="/" className="flex items-center">
                    <h1 className="text-white font-bold text-lg sm:text-xl">
                        SortMyScene
                    </h1>
                </Link>

                {/* CENTER */}
                <div className="flex items-center gap-4 sm:gap-8">
                    {renderLink("/", "Events")}

                    {role === "admin" && renderLink("/admin", "Add Event")}
                </div>

                {/* RIGHT */}
                <button
                    onClick={handleLogout}
                    className="
                        text-xs sm:text-sm font-semibold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg
                        text-red-400 border border-red-500/20
                        bg-white/5 hover:bg-red-500/10
                        transition active:scale-95
                    "
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}