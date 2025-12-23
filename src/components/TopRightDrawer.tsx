import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const MENU_SECTIONS = [
  {
    title: 'Customer app',
    items: [
      { label: 'Login', to: '/user/login' },
      { label: 'Register', to: '/user/register' },
    ],
  },
  {
    title: 'Admin panel',
    items: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Tables', to: '/tables' },
    ],
  },
];

export default function TopRightDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 rounded-full bg-gray-800 text-medium text-white cursor-pointer px-4 py-2 shadow hover:bg-[#e74c3c]"
      >
        ☰
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-76 bg-white z-50
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-5 bg-[#293a4b]">
          <h2 className="font-bold text-white text-lg">All Mockups</h2>
          <button
            className="cursor-pointer text-white"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="p-4 space-y-6">
          {MENU_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-400 tracking-wider">
                {section.title}
              </p>

              <div className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block p-2 rounded transition
                      hover:bg-gray-100 hover:text-[#e74c3c]
                      ${isActive ? 'text-white bg-[#e74c3c]' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
