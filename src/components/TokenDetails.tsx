import { useState, useEffect } from "react";
import { Pagination } from "./Pagination";
import { getAPI } from "../services/api";
import { ADMIN_URLS } from "../constants/urls";
import Loader from "./Loader";
import { motion, Variants } from "framer-motion";

interface TokenRow {
  type: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  temperature: number;
  usedBy: string;
  modelName: string;
  createdAt: string;
}

interface Token {
  _id: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  temperature: number;
  usedByType: string;
  callType: string;
  modelName: string;
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

interface TokenAPIResponse {
  success: boolean;
  message: string;
  data: {
    data: Token[];
    pagination: PaginationData;
  };
}

const tableVariants : Variants = {
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

const rowVariants : Variants = {
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

const TokenDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tokenData, setTokenData] = useState<TokenRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAPI<TokenAPIResponse>(
        ADMIN_URLS.GET_ALL_TOKENS,
        {
          page,
          limit: 20,
        }
      );

      const mappedTokens: TokenRow[] = response.data.data.map((token) => ({
        type: token.callType,
        inputTokens: token.inputTokens,
        outputTokens: token.outputTokens,
        totalTokens: token.totalTokens,
        temperature: token.temperature,
        usedBy: token.usedByType,
        modelName: token.modelName,
        createdAt: new Date(token.createdAt).toLocaleString(),
      }));

      setTokenData(mappedTokens);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
      setLimit(response.data.pagination.limit);
      setCurrentPage(response.data.pagination.currentPage);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setError("Failed to load token details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startResult = (currentPage - 1) * limit + 1;
  const endResult = Math.min(currentPage * limit, totalCount);

  return (
    <>
      <div className="w-full mx-auto px-4">
        <motion.div 
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="rounded-md"
        >
          {/* Scrollable Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
            {/* Header */}
            <div className="grid grid-cols-7 gap-3 px-5 py-3 bg-gray-700 rounded-t-lg min-w-[1000px]">
              <div className="text-white text-sm font-semibold">Type</div>
              <div className="text-white text-sm font-semibold">Input Tokens</div>
              <div className="text-white text-sm font-semibold">Output Tokens</div>
              <div className="text-white text-sm font-semibold">Total Tokens</div>
              <div className="text-white text-sm font-semibold">Temperature</div>
              <div className="text-white text-sm font-semibold">Used By</div>
              <div className="text-white text-sm font-semibold">Model Name</div>
            </div>

            {/* Body */}
            <div className="min-w-[1000px]">
              {loading ? (
                <div className="px-5 py-10 text-center text-gray-400">
                  Loading token details...
                </div>
              ) : error ? (
                <div className="px-5 py-10 text-center text-red-400">
                  {error}
                </div>
              ) : tokenData.length === 0 ? (
                <div className="px-5 py-10 text-center text-gray-400">
                  No token details found
                </div>
              ) : (
                tokenData.map((row, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    className={`grid grid-cols-7 gap-3 px-5 py-5 items-center ${
                      index !== tokenData.length - 1
                        ? "border-b border-gray-100/5"
                        : ""
                    }`}
                  >
                    <div className="text-gray-100 text-sm">{row.type}</div>
                    <div className="text-gray-100 text-sm">{row.inputTokens}</div>
                    <div className="text-gray-100 text-sm">{row.outputTokens}</div>
                    <div className="text-gray-100 text-sm">{row.totalTokens}</div>
                    <div className="text-gray-100 text-sm">{row.temperature}</div>
                    <div className="text-gray-100 text-sm">{row.usedBy}</div>
                    <div className="text-gray-100 text-sm">{row.modelName}</div>
                  </motion.div>
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
        </motion.div>
      </div>

      <Loader show={loading} />
    </>
  );
};

export default TokenDetails;