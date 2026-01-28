import {  Edit, File, Trash2, Search } from "lucide-react";
import { Pagination } from "./Pagination";
import { useState, useEffect, useCallback } from "react";
import { deleteAPI, getAPI } from "../services/api";
import { ADMIN_URLS } from "../constants/urls";
import EditInfluencer from "./EditInfluencer";
import Loader from "./Loader";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { toast } from "react-toastify";

type SourceType = "INFLUENCER" | "INVITE";

interface UserData {
  deviceId: string;
  subscriptionStatus: string;
  preferredTone: string;
  preferredDialect: string;
  preferredLanguage: string;
  preferredGender: string;
  genZ: string;
}

interface InfluencerData extends UserData {
  status: string;
  name: string;
  email: string;
  instagram: string;
  tiktok: string;
  accessType: string;
  startDate: string;
  expiryDate: string;
  userId: string;
  influencerId: string;
  token: string | null;
 source: SourceType;

}

interface Influencer {
  _id: string;
  userId: string | null;
  name: string;
  email: string;
  instagram: string;
  tiktok: string;
  accessType: string;
  startDate: string | null;
  expiryDate: string | null;
  isActive: boolean;
  createdAt: string;
  revokeComment?: string;
  revokedAt?: string;
  revokedByAdminId?: string;
 source: SourceType;
  isInvited: boolean;
  isJoined: boolean;
  userData: {
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
    isInfluencer: boolean;
    createdAt: string;
    updatedAt: string;
  } | null;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface InfluencerAPIResponse {
  success: boolean;
  message: string;
  data: {
    influencers: Influencer[];
    pagination: PaginationData;
  };
}

const tableVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

  const useDebounce = (value: string, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
};

const InfluencerManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [influencerData, setInfluencerData] = useState<InfluencerData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingInfluencerId, setEditingInfluencerId] = useState<string | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

const fetchInfluencers = useCallback(
    async (page: number) => {
      try {
        setLoading(true);

        const res = await getAPI<InfluencerAPIResponse>(
          ADMIN_URLS.GET_ALL_INFLUENCERS,
          {
            page,
            limit,
            search: debouncedSearch || undefined,
          },
        );

        const mapped = res.data.influencers.map((inf: any) => {
          let status = "Active";
          if (!inf.isActive) {
            status =
              inf.revokeComment && inf.revokedAt ? "Revoked" : "Inactive";
          }

          return {
            influencerId: inf._id,
            userId: inf.userId || null,
            deviceId: inf.userData?.deviceId || "-",
            name: inf.name,
            email: inf.email,
            instagram: inf.instagram,
            tiktok: inf.tiktok,
            accessType: inf.accessType,
            startDate: inf.startDate
              ? new Date(inf.startDate).toLocaleDateString()
              : "-",
            expiryDate: inf.expiryDate
              ? new Date(inf.expiryDate).toLocaleDateString()
              : "-",
            subscriptionStatus: inf.userData?.isSubscribed
              ? "Subscribed"
              : "Not Subscribed",
            preferredTone: inf.userData?.rizzType || "-",
            preferredDialect: inf.userData?.dialect || "-",
            preferredLanguage: inf.userData?.language || "-",
            preferredGender: inf.userData?.gender || "-",
            genZ: inf.userData?.isGenz ? "Yes" : "No",
            status,
            token: inf.token || null,
            source: inf.source,
          };
        });

        setInfluencerData(mapped);
        setCurrentPage(res.data.pagination.page);
        setTotalPages(res.data.pagination.totalPages);
        setTotalCount(res.data.pagination.total);
      } catch (e) {
        toast.error("Failed to load influencers");
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, limit],
  );

  useEffect(() => {
    if (!editingInfluencerId) fetchInfluencers(currentPage);
  }, [currentPage, editingInfluencerId, fetchInfluencers]);

  useEffect(() => {
    // Reset to page 1 when search changes
    setCurrentPage(1);
  }, [debouncedSearch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (influencerId: string) => {
    setEditingInfluencerId(influencerId);
  };

  const handleBackFromEdit = () => {
    setEditingInfluencerId(null);
    fetchInfluencers(currentPage);
  };

  const startResult = (currentPage - 1) * limit + 1;
  const endResult = Math.min(currentPage * limit, totalCount);

  if (editingInfluencerId) {
    return (
      <EditInfluencer
        influencerId={editingInfluencerId}
        onBack={handleBackFromEdit}
      />
    );
  }

    const copyToClipboard = (inviteToken:any) => {
      const inviteLink = `habibiRizz://onboard/influencer?token=${inviteToken}`;
      navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied!");
    };

   const handleDelete = async (id: string, source: SourceType) => {
   

    try {
      await deleteAPI(
        `${ADMIN_URLS.DELETE_INFLUENCER}?id=${id}&source=${source}`
      );
      toast.success("Deleted successfully");
      fetchInfluencers(currentPage);
    } catch {
      toast.error("Delete failed");
    }
  };


  return (
    <>
      <div className="w-full mx-auto px-4">
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="rounded-md"
        >
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Scrollable Table View */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-[120px_180px_160px_120px_130px_160px_140px_80px_120px_1fr] gap-1 px-5 py-3 bg-gray-700 rounded-t-lg min-w-[1430px]">
              <div className="text-white text-sm font-semibold">Device ID</div>
                <div className="text-white text-sm font-semibold">Name</div>
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
              <div className="text-white text-sm font-semibold">Status</div>
              <div className="text-white text-sm font-semibold text-center">
                Action
              </div>
            </div>

            {/* Table Body */}
            <div className="min-w-[1430px]">
              {loading ? (
                <div className="px-5 py-10 text-center text-gray-400">
                  Loading influencers...
                </div>
              ) : error ? (
                <div className="px-5 py-10 text-center text-red-400">
                  {error}
                </div>
              ) : influencerData.length === 0 ? (
                <div className="px-5 py-10 text-center text-gray-400">
                  No influencers found
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {influencerData.map((influencer, index) => (
                    <motion.div
                      key={influencer.influencerId}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: 20 }}
                      className={`grid grid-cols-[120px_180px_160px_120px_130px_160px_140px_80px_120px_1fr] gap-1 px-5 py-3 items-center ${
                        index !== influencerData.length - 1
                          ? "border-b border-gray-100/5"
                          : ""
                      }`} 
                    >
                      <div className="text-gray-100 text-sm truncate">
                        {influencer.deviceId.slice(0,10)}
                      </div>
                       <div className="text-gray-100 text-sm">
                        {influencer.name}
                      </div>
                      <div className="text-gray-100 text-sm">
                        {influencer.subscriptionStatus}
                      </div>
                      <div className="text-gray-100 text-sm">
                        {influencer.preferredTone}
                      </div>
                      <div className="text-gray-100 text-sm">
                        {influencer.preferredDialect}
                      </div>
                      <div className="text-gray-100 text-sm">
                        {influencer.preferredLanguage}
                      </div>
                      <div className="text-gray-100 text-sm">
                        {influencer.preferredGender}
                      </div>
                      <div className="text-gray-100 text-sm">
                        {influencer.genZ}
                      </div>
                      <div className="text-gray-100 text-sm">
                        {influencer.status}
                      </div>
                      <div className="flex justify-center gap-2 pr-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(influencer.influencerId)}
                          className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-white" />
                        </motion.button>
                         <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                        handleDelete(influencer.influencerId, influencer.source)
                      }
                          className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </motion.button>

                          <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyToClipboard(influencer.token)}
                          className={`p-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors ${influencer.source === "INFLUENCER" ? "cursor-not-allowed" : "" } `}
                          disabled={influencer.source === "INFLUENCER"}
                        >
                          <File className="w-4 h-4 text-white" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
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
        </motion.div>
      </div>

      <Loader show={loading} />
    </>
  );
};

export default InfluencerManagement;