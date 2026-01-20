import { useState, useEffect } from "react";
import { Pagination } from "./Pagination";
import { getAPI } from "../services/api";
import { ADMIN_URLS } from "../constants/urls";
import Loader from "./Loader";

interface UserData {
  deviceId: string;
  subscriptionStatus: string;
  preferredTone: string;
  preferredDialect: string;
  preferredLanguage: string;
  preferredGender: string;
  genZ: string;
}

interface User {
  _id: string;
  language: string;
  deviceId: string;
  gender: string;
  dialect: string;
  rizzType: string;
  fcmToken: string;
  isGenz: boolean;
  isDeleted: boolean;
  isSubscribed: boolean;
  isInfluencer?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PaginationData {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface UserAPIResponse {
  success: boolean;
  message: string;
  data: {
    data: User[];
    pagination: PaginationData;
  };
}

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchUsers = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAPI<UserAPIResponse>(ADMIN_URLS.GET_ALL_USERS, {
        page,
        limit: 10,
      });

      const mappedUsers: UserData[] = response.data.data.map((user) => ({
        deviceId: user.deviceId,
        subscriptionStatus: user.isSubscribed ? "Subscribed" : "Not Subscribed",
        preferredTone: user.rizzType || "-",
        preferredDialect: user.dialect || "-",
        preferredLanguage: user.language || "-",
        preferredGender: user.gender || "-",
        genZ: user.isGenz ? "True" : "False",
      }));

      setUserData(mappedUsers);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
      setLimit(response.data.pagination.limit);
      setCurrentPage(response.data.pagination.currentPage);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startResult = (currentPage - 1) * limit + 1;
  const endResult = Math.min(currentPage * limit, totalCount);

  return (
    <>

    <div className="w-full mx-auto px-4">
      <div className="rounded-md">
        {/* Scrollable Table View */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
          {/* Table Header */}
         <div
  className="grid gap-3 px-5 py-3 bg-gray-700 rounded-t-lg min-w-[900px]"
  style={{
    gridTemplateColumns: 
      "2.5fr 1.5fr 1.2fr 1.4fr 1.4fr 1.2fr 0.8fr",
  }}
>

            <div className="text-white text-sm font-semibold">Device ID</div>
            <div className="text-white text-sm font-semibold">
              Subscription Status
            </div>
            <div className="text-white text-sm font-semibold">
              Preferred Tone
            </div>
            <div className="text-white text-sm font-semibold">
              Preferred Dialect
            </div>
            <div className="text-white text-sm font-semibold">
              Preferred Language
            </div>
            <div className="text-white text-sm font-semibold">
              Preferred Gender
            </div>
            <div className="text-white text-sm font-semibold">Gen Z</div>
          </div>

          {/* Table Body */}
          <div className="min-w-[900px]">
            {loading ? (
              <div className="px-5 py-10 text-center text-gray-400">
                Loading users...
              </div>
            ) : error ? (
              <div className="px-5 py-10 text-center text-red-400">{error}</div>
            ) : userData.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400">
                No users found
              </div>
            ) : (
              userData.map((user, index) => (
                <div
                  key={user.deviceId || index}
                  className={`grid gap-3 px-5 py-5 items-center ${
    index !== userData.length - 1
      ? "border-b border-gray-100/5"
      : ""
  }`}
  style={{
    gridTemplateColumns: 
      "2.5fr 1.5fr 1.2fr 1.4fr 1.4fr 1.2fr 0.8fr",
  }}
                >
                  <div className="text-gray-100 text-sm truncate">
                    {user.deviceId}
                  </div>
                  <div className="text-gray-100 text-sm">
                    {user.subscriptionStatus}
                  </div>
                  <div className="text-gray-100 text-sm">
                    {user.preferredTone}
                  </div>
                  <div className="text-gray-100 text-sm">
                    {user.preferredDialect}
                  </div>
                  <div className="text-gray-100 text-sm">
                    {user.preferredLanguage}
                  </div>
                  <div className="text-gray-100 text-sm">
                    {user.preferredGender}
                  </div>
                  <div className="text-gray-100 text-sm">{user.genZ}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          startResult={startResult}
          endResult={endResult}
          onPageChange={handlePageChange}
        />
      </div>
    </div>

    <Loader show={loading} />
    </>
  );
};

export default UserManagement;
