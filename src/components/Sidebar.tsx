import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const username = localStorage.getItem('username') || 'admin';

  return (
    <aside className="w-66 bg-[#293a4b] border-r flex flex-col">
      <div className="py-8 flex items-center justify-center font-bold text-xl text-white border-b">
        Smart Restaurant
      </div>

      <nav className="flex-1 mt-10">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block px-4 py-4 text-white hover:bg-[#395068] ${
              isActive
                ? 'border-l-2 border-red-500 bg-[#31557c]'
                : ''
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/tables"
          className={({ isActive }) =>
            `block px-4 py-4 text-white hover:bg-[#395068] ${
              isActive
                ? 'border-l-2 border-red-500 bg-[#31557c]'
                : ''
            }`
          }
        >
          Tables
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          {username[0].toUpperCase()}
        </div>
        <div>
          <p className="text-sm text-white font-medium">{username}</p>
          <p className="text-xs text-gray-300">Restaurant Admin</p>
        </div>
      </div>
    </aside>
  );
}
