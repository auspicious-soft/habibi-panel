import { useState, useEffect } from "react";
import { ChevronDown, Calendar, ArrowLeft, Copy, Check } from "lucide-react";
import { getAPI, putAPI, postAPI } from "../services/api";
import { ADMIN_URLS } from "../constants/urls";
import RevokeInfluencerModal from "./RevokeInfluencerModal";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { motion, AnimatePresence, Variants } from "framer-motion";
interface EditFormData {
  name: string;
  email: string;
  instagram: string;
  tiktok: string;
  accessType: string;
  startDate: string;
  expiryDate: string;
}

interface UserData {
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
}

interface InfluencerDetailResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId?: string;
    name: string;
    email: string;
    instagram: string;
    tiktok: string;
    accessType: string;
    startDate: string | null;
    expiryDate: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    revokeComment?: string;
    revokedAt?: string;
    revokedByAdminId?: string;
    userData: UserData | null;
    source: string;
    token?: string;
    isUsed?: boolean;
    isRevoked?: boolean;
    createdByAdminId?: string;
  };
}

interface UpdatePayload {
  inviteId: string;
  accessType: string;
  startDate?: string;
  expiryDate?: string;
  source: string;
}

interface RevokePayload {
  influencerId: string;
  comment: string;
}

interface RegenerateLinkPayload {
  influencerId: string;
}

interface UpdateResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface EditInfluencerProps {
  influencerId: string;
  onBack: () => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1], // ← cubic-bezier values are always safe
    },
  },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1 + 0.2,
      duration: 0.45,
      ease: "easeOut",
    },
  }),
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const buttonVariants = {
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};

const EditInfluencer = ({ influencerId, onBack }: EditInfluencerProps) => {
  const [formData, setFormData] = useState<EditFormData>({
    name: "",
    email: "",
    instagram: "",
    tiktok: "",
    accessType: "",
    startDate: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [isInvited, setIsInvited] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isRevoked, setIsRevoked] = useState<boolean>(false);
  const [inviteToken, setInviteToken] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [revokeInfo, setRevokeInfo] = useState<{
    comment?: string;
    revokedAt?: string;
    revokedBy?: string;
  }>({});
  const [showRevokeModal, setShowRevokeModal] = useState<boolean>(false);
  const [revokeComment, setRevokeComment] = useState<string>("");

  // Fetch influencer details
  useEffect(() => {
    const fetchInfluencerDetails = async () => {
      try {
        setLoading(true);

        const response = await getAPI<InfluencerDetailResponse>(
          `${ADMIN_URLS.GET_INFLUENCER_BY_ID}?id=${influencerId}`,
        );

        if (response.success && response.data) {
          const influencer = response.data;

          // Check if user is invited (hasn't accepted yet)
          setIsInvited(influencer.source === "INVITE" && !influencer.userData);

          // Set active status
          setIsActive(influencer.isActive);

          // Store invite token if available
          if (influencer.token) {
            setInviteToken(influencer.token);
          }

          // Check if revoked
          const hasRevokeInfo = !!(
            influencer.revokeComment &&
            influencer.revokedAt &&
            influencer.revokedByAdminId
          );
          setIsRevoked(hasRevokeInfo);

          if (hasRevokeInfo) {
            setRevokeInfo({
              comment: influencer.revokeComment,
              revokedAt: influencer.revokedAt,
              revokedBy: influencer.revokedByAdminId,
            });
          }

          // Format dates for input fields
          const formatDate = (date: string | null) => {
            if (!date) return "";
            return new Date(date).toISOString().split("T")[0];
          };

          setFormData({
            name: influencer.name || "",
            email: influencer.email || "",
            instagram: influencer.instagram || "",
            tiktok: influencer.tiktok || "",
            accessType: influencer.accessType || "",
            startDate: formatDate(influencer.startDate),
            expiryDate: formatDate(influencer.expiryDate),
          });
        }
      } catch (err: any) {
        console.error("Error fetching influencer details:", err);
        toast.error(
          err.response?.data?.message || "Failed to load influencer details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (influencerId) {
      fetchInfluencerDetails();
    }
  }, [influencerId]);

  const validateForm = (): boolean => {
    if (!formData.accessType) {
      toast.error("Please select an access type");
      return false;
    }
    if (formData.accessType === "LIMITED") {
      if (!formData.startDate) {
        toast.error("Start date is required for limited access");
        return false;
      }
      if (!formData.expiryDate) {
        toast.error("Expiry date is required for limited access");
        return false;
      }
      if (new Date(formData.startDate) >= new Date(formData.expiryDate)) {
        toast.error("Expiry date must be after start date");
        return false;
      }
    }
    return true;
  };

  const handleUpdate = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }
    setSaving(true);
    try {
      // Determine source based on whether influencer is active and has accepted
      const updateSource = isActive || !isInvited ? "INFLUENCER" : "INVITE";

      const payload: UpdatePayload = {
        inviteId: influencerId,
        accessType: formData.accessType,
        source: updateSource,
      };

      if (formData.accessType === "LIMITED") {
        payload.startDate = formData.startDate;
        payload.expiryDate = formData.expiryDate;
      }

      const response = await putAPI<UpdateResponse, UpdatePayload>(
        `${ADMIN_URLS.UPDATE_INFLUENCER}`,
        payload,
      );

      if (response.success) {
        toast.success(response.message || "Influencer updated successfully!");

        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        toast.error(response.message || "Failed to update influencer");
      }
    } catch (err: any) {
      console.error("Error updating influencer:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update influencer. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeAccess = async (): Promise<void> => {
    if (!revokeComment.trim()) {
      toast.error("Please provide a comment for revoking access");
      return;
    }
    setSaving(true);

    try {
      const payload: RevokePayload = {
        influencerId: influencerId,
        comment: revokeComment,
      };

      const response = await postAPI<UpdateResponse, RevokePayload>(
        ADMIN_URLS.REVOKE_INFLUENCER,
        payload,
      );

      if (response.success) {
        toast.success(response.message || "Access revoked successfully!");
        setShowRevokeModal(false);

        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        toast.error(response.message || "Failed to revoke access");
      }
    } catch (err: any) {
      console.error("Error revoking access:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to revoke access. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateLink = async (): Promise<void> => {
    setSaving(true);

    try {
      const payload: RegenerateLinkPayload = {
        influencerId: influencerId,
      };

      const response = await postAPI<UpdateResponse, RegenerateLinkPayload>(
        ADMIN_URLS.REGENERATE_INVITE_LINK,
        payload,
      );

      if (response.success) {
        toast.success(
          response.message || "Invite link regenerated successfully!",
        );

        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        toast.error(response.message || "Failed to regenerate link");
      }
    } catch (err: any) {
      console.error("Error regenerating link:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to regenerate link. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    const inviteLink = `habibiRizz://onboard/influencer?token=${inviteToken}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <Loader show={loading} />;
  }

  const isEditable = !isRevoked;
  const inviteLink = `habibiRizz://onboard/influencer?token=${inviteToken}`;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[768px] mx-auto p-4 sm:p-6 bg-gray-800/90 rounded-xl shadow-xl border border-gray-700 backdrop-blur-sm"
    >
      {/* Back button */}
      <motion.button
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.96 }}
        onClick={onBack}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-5 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Influencers</span>
      </motion.button>

      <motion.h1
        variants={sectionVariants}
        custom={0}
        className="text-center text-gray-100 text-xl sm:text-2xl font-bold mb-6"
      >
        {isRevoked ? "View Influencer" : "Edit Influencer"}
      </motion.h1>

      {/* Banners with AnimatePresence */}
      <AnimatePresence>
        {isInvited && !isRevoked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 p-4 bg-blue-900/30 border border-blue-700/60 rounded-lg overflow-hidden"
          >
            <p className="text-blue-300 text-sm">
              This influencer has been invited but hasn't accepted yet.
            </p>
          </motion.div>
        )}

        {isRevoked && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/30 border border-red-700/60 rounded-lg"
          >
            <h3 className="text-red-400 font-semibold mb-2">Access Revoked</h3>
            <div className="space-y-1.5 text-sm text-red-200/90">
              <p>
                <strong>Comment:</strong> {revokeInfo.comment}
              </p>
              <p>
                <strong>Revoked At:</strong>{" "}
                {revokeInfo.revokedAt
                  ? new Date(revokeInfo.revokedAt).toLocaleString()
                  : "N/A"}
              </p>
              <p className="break-all">
                <strong>Revoked By Admin ID:</strong> {revokeInfo.revokedBy}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite link section */}
      {isInvited && !isActive && inviteToken && (
        <motion.div variants={sectionVariants} custom={1} className="mb-7">
          <label className="text-gray-300 text-sm font-semibold mb-2 block">
            Invite Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 px-4 py-3.5 bg-gray-800/40 rounded-lg border border-gray-600 text-gray-300 text-sm break-all focus:outline-none cursor-not-allowed"
            />
            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={copyToClipboard}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center gap-2 transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="font-medium text-sm hidden sm:inline">
                    Copied
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="font-medium text-sm hidden sm:inline">
                    Copy
                  </span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-6">
        {/* Read-only fields */}
        {["name", "email", "instagram", "tiktok"].map((key, i) => (
          <motion.div
            key={key}
            custom={i}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-1.5"
          >
            <label className="text-gray-300 text-sm font-medium">
              {key === "name"
                ? "Name of User"
                : key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type={key === "email" ? "email" : "text"}
              value={(formData as any)[key] || ""}
              readOnly
              className="px-4 py-3.5 bg-gray-800/40 rounded-lg border border-gray-600 text-gray-300 text-sm cursor-not-allowed focus:outline-none"
            />
          </motion.div>
        ))}

        {/* Access controls row – this motion.div must stay open */}
        <motion.div
          variants={sectionVariants}
          custom={2}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {/* Access Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-sm font-medium">
              Access Type{" "}
              {isEditable && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
              <select
                value={formData.accessType}
                onChange={(e) =>
                  setFormData({ ...formData, accessType: e.target.value })
                }
                disabled={!isEditable || saving}
                className={`w-full px-4 py-3.5 rounded-lg border text-sm focus:outline-none appearance-none cursor-pointer disabled:cursor-not-allowed ${
                  isEditable
                    ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
                    : "bg-gray-800/40 border-gray-600 text-gray-400"
                }`}
              >
                <option value="">Select type</option>
                <option value="LIMITED">Limited</option>
                <option value="UNLIMITED">Unlimited</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-sm font-medium">
              Start Date{" "}
              {isEditable && formData.accessType === "LIMITED" && (
                <span className="text-red-400">*</span>
              )}
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                disabled={
                  !isEditable || formData.accessType !== "LIMITED" || saving
                }
                className={`w-full px-4 py-3.5 rounded-lg border text-sm focus:outline-none transition-colors cursor-pointer disabled:cursor-not-allowed ${
                  isEditable && formData.accessType === "LIMITED"
                    ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
                    : "bg-gray-800/40 border-gray-600 text-gray-400"
                }`}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Expiry Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-300 text-sm font-medium">
              Expiry Date{" "}
              {isEditable && formData.accessType === "LIMITED" && (
                <span className="text-red-400">*</span>
              )}
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                disabled={
                  !isEditable || formData.accessType !== "LIMITED" || saving
                }
                className={`w-full px-4 py-3.5 rounded-lg border text-sm focus:outline-none transition-colors cursor-pointer disabled:cursor-not-allowed ${
                  isEditable && formData.accessType === "LIMITED"
                    ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
                    : "bg-gray-800/40 border-gray-600 text-gray-400"
                }`}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons – now correctly inside the card */}
        {!isRevoked && (
          <motion.div
            variants={sectionVariants}
            custom={3}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6"
          >
            {isActive && (
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={() => setShowRevokeModal(true)}
                disabled={saving}
                className="h-14 bg-[#1e2736] hover:bg-[#1e2736] border border-blue-600 text-blue-600 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                Revoke Access
              </motion.button>
            )}

            {!isActive && isInvited && (
              <motion.button
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleRegenerateLink}
                disabled={saving}
                className="h-14 bg-[#1e2736] hover:bg-[#1e2736] border border-blue-600 text-blue-600 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {saving ? "Regenerating..." : "Regenerate Link"}
              </motion.button>
            )}

            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={handleUpdate}
              disabled={saving}
              className="h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Influencer"}
            </motion.button>
          </motion.div>
        )}
      </div>

      {showRevokeModal && (
        <RevokeInfluencerModal
          isOpen={showRevokeModal}
          loading={saving}
          onClose={() => {
            setShowRevokeModal(false);
            setRevokeComment("");
          }}
          onConfirm={(comment) => {
            setRevokeComment(comment);
            handleRevokeAccess();
          }}
        />
      )}
    </motion.div>
  );
};

export default EditInfluencer;
