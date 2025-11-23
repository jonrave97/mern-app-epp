import { usePageTitle } from '@hooks/page/usePageTitle';

function AdminDashboardPage() {
    usePageTitle('Dashboard');

    return (
        /*
            admin dashboard content goes here
        */
        <div className="p-4 border-2 border-gray-50 shadow-lg rounded-lg mt-5">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p>Welcome to the admin dashboard! Here you can manage your application.</p>
        </div>
    );
}
export default AdminDashboardPage;