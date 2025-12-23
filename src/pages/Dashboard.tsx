import { logoutApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
