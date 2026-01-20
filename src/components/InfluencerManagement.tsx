import { Edit } from "lucide-react";
import { Pagination } from "./Pagination";
import { useState, useEffect } from "react";
import { getAPI } from "../services/api";
import { ADMIN_URLS } from "../constants/urls";
import EditInfluencer from "./EditInfluencer";
import Loader from "./Loader";
import { AnimatePresence, motion, Variants } from "framer-motion";

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
  source: string;
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

  const fetchInfluencers = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAPI<InfluencerAPIResponse>(
        ADMIN_URLS.GET_ALL_INFLUENCERS,
        {
          page,
          limit: 10,
        },
      );

      const mappedInfluencers: InfluencerData[] = response.data.influencers.map(
        (influencer: any) => {
          let status = "Active";
          if (!influencer.isActive) {
            if (
              influencer.revokeComment &&
              influencer.revokedAt &&
              influencer.revokedByAdminId
            ) {
              status = "Revoked";
            } else {
              status = "Inactive";
            }
          }

          return {
            influencerId: influencer._id,
            userId: influencer.userId || influencer._id,
            deviceId: influencer.userData?.deviceId || "-",
            name: influencer.name,
            email: influencer.email,
            instagram: influencer.instagram,
            tiktok: influencer.tiktok,
            accessType: influencer.accessType,
            startDate: influencer.startDate
              ? new Date(influencer.startDate).toLocaleDateString()
              : "-",
            expiryDate: influencer.expiryDate
              ? new Date(influencer.expiryDate).toLocaleDateString()
              : "-",
            subscriptionStatus: influencer.userData?.isSubscribed
              ? "Subscribed"
              : "Not Subscribed",
            preferredTone: influencer.userData?.rizzType || "-",
            preferredDialect: influencer.userData?.dialect || "-",
            preferredLanguage: influencer.userData?.language || "-",
            preferredGender: influencer.userData?.gender || "-",
            genZ: influencer.userData?.isGenz ? "Yes" : "No",
            status: status,
          };
        },
      );

      setInfluencerData(mappedInfluencers);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.total);
      setLimit(response.data.pagination.limit);
      setCurrentPage(response.data.pagination.page);
    } catch (err) {
      console.error("Error fetching influencers:", err);
      setError("Failed to load influencers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!editingInfluencerId) {
      fetchInfluencers(currentPage);
    }
  }, [currentPage, editingInfluencerId]);

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

  return (
    <>
      <div className="w-full mx-auto px-4">
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="rounded-md"
        >
          {/* Scrollable Table View */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-[100px_160px_120px_130px_160px_140px_80px_80px_1fr] gap-3 px-5 py-3 bg-gray-700 rounded-t-lg min-w-[1070px]">
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
              <div className="text-white text-sm font-semibold">Status</div>
              <div className="text-white text-sm font-semibold text-center">
                Action
              </div>
            </div>

            {/* Table Body */}
            <div className="min-w-[1070px]">
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
                      className={`grid grid-cols-[100px_160px_120px_130px_160px_140px_80px_80px_1fr] gap-3 px-5 py-3 items-center ${
                        index !== influencerData.length - 1
                          ? "border-b border-gray-100/5"
                          : ""
                      }`}
                    >
                      <div className="text-gray-100 text-sm truncate">
                        {influencer.deviceId}
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
                      <div className="flex justify-center pr-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(influencer.influencerId)}
                          className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-white" />
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
