import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UsersIcon } from "lucide-react";
import api from "src/api";

const fetchAdminDashboardData = async () => {
  const response = await api.get("/api/users/all-users");
  return response.data;
};

const AdminDashboardPage = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboardData,
  });
  const queryClient = useQueryClient();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong...</div>;
  }

  const roleCounts = data?.roleCounts;
  const users = data?.users;

  const handleDeleteUser = (userId: string) => {
    try {
      api.delete(`/api/users/delete/${userId}`);
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-4">
        <div className="relative w-56 overflow-hidden rounded-lg bg-blue-500 p-6 text-white shadow-lg">
          {/* Background Design */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-20"></div>

          <div className="relative z-10">
            {/* Title */}
            <h2 className="text-lg font-semibold">Total admins</h2>

            {/* Value */}
            <p className="my-2 text-4xl font-bold">{roleCounts.Admin || 0}</p>
          </div>

          {/* Icon */}
          <div className="absolute right-4 top-4 z-0 text-white opacity-50">
            <UsersIcon />
          </div>
        </div>

        <div className="relative w-56 overflow-hidden rounded-lg bg-blue-500 p-6 text-white shadow-lg">
          {/* Background Design */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-20"></div>

          <div className="relative z-10">
            {/* Title */}
            <h2 className="text-lg font-semibold">Total Business Owners</h2>

            {/* Value */}
            <p className="my-2 text-4xl font-bold">
              {roleCounts.BusinessOwner || 0}
            </p>
          </div>

          {/* Icon */}
          <div className="absolute right-4 top-4 z-0 text-white opacity-50">
            <UsersIcon />
          </div>
        </div>

        <div className="relative w-56 overflow-hidden rounded-lg bg-blue-500 p-6 text-white shadow-lg">
          {/* Background Design */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-20"></div>

          <div className="relative z-10">
            {/* Title */}
            <h2 className="text-lg font-semibold">Total Community Admins</h2>

            {/* Value */}
            <p className="my-2 text-4xl font-bold">
              {roleCounts.CommunityAdmin || 0}
            </p>
          </div>

          {/* Icon */}
          <div className="absolute right-4 top-4 z-0 text-white opacity-50">
            <UsersIcon />
          </div>
        </div>

        <div className="relative w-56 overflow-hidden rounded-lg bg-blue-500 p-6 text-white shadow-lg">
          {/* Background Design */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-20"></div>

          <div className="relative z-10">
            {/* Title */}
            <h2 className="text-lg font-semibold">Total Users</h2>

            {/* Value */}
            <p className="my-2 text-4xl font-bold">{roleCounts.User || 0}</p>
          </div>

          {/* Icon */}
          <div className="absolute right-4 top-4 z-0 text-white opacity-50">
            <UsersIcon />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border border-gray-300 shadow md:w-[80%]">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b px-4 py-2 text-left">ID</th>
              <th className="border-b px-4 py-2 text-left">Name</th>
              <th className="border-b px-4 py-2 text-left">Email</th>
              <th className="border-b px-4 py-2 text-left">Role</th>
              <th className="border-b px-4 py-2 text-left">Remove</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="rounded-sm hover:bg-gray-50">
                <td className="border-b px-4 py-2">{user?._id}</td>
                <td className="border-b px-4 py-2">{user.name}</td>
                <td className="border-b px-4 py-2">{user.email}</td>
                <td className="border-b px-4 py-2">{user.role}</td>
                <tr className="border-b px-4 py-2">
                  {user.role !== "Admin" && (
                    <div
                      className="m-4 cursor-pointer rounded-sm bg-red-500 p-2 text-white hover:bg-red-600"
                      onClick={() => {
                        handleDeleteUser(user?._id);
                      }}
                    >
                      Remove User
                    </div>
                  )}
                </tr>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
