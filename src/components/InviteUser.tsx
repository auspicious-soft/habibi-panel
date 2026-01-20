import { useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { postAPI } from '../services/api';
import { ADMIN_URLS } from '../constants/urls';
import { toast } from 'react-toastify';
import { motion, Variants } from 'framer-motion';

interface InviteFormData {
  name: string;
  email: string;
  instagram: string;
  tiktok: string;
  accessType: string;
  startDate: string;
  expiryDate: string;
}

interface InvitePayload {
  name: string;
  email: string;
  instagram: string;
  tiktok: string;
  accessType: string;
  startDate: string;
  expiryDate: string;
}

interface InviteResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    name: string;
    email: string;
    instagram: string;
    tiktok: string;
    accessType: string;
    startDate: string;
    expiryDate: string;
    inviteToken?: string;
  };
}

const cardVariants : Variants = {
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

const fieldVariants : Variants = {
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

const buttonVariants : Variants = {
  hover: { scale: 1.03, transition: { duration: 0.2 } },
  tap: { scale: 0.97 },
};

const InviteUser = () => {
  const [formData, setFormData] = useState<InviteFormData>({
    name: '',
    email: '',
    instagram: '',
    tiktok: '',
    accessType: '',
    startDate: '',
    expiryDate: ''
  });

  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.accessType) {
      toast.error('Please select an access type');
      return false;
    }
    if (formData.accessType === 'LIMITED') {
      if (!formData.startDate) {
        toast.error('Start date is required for limited access');
        return false;
      }
      if (!formData.expiryDate) {
        toast.error('Expiry date is required for limited access');
        return false;
      }
      if (new Date(formData.startDate) >= new Date(formData.expiryDate)) {
        toast.error('Expiry date must be after start date');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const payload: InvitePayload = {
        name: formData.name,
        email: formData.email,
        instagram: formData.instagram,
        tiktok: formData.tiktok,
        accessType: formData.accessType,
        startDate: formData.accessType === 'LIMITED' ? formData.startDate : '',
        expiryDate: formData.accessType === 'LIMITED' ? formData.expiryDate : ''
      };

      const response = await postAPI<InviteResponse, InvitePayload>(
        ADMIN_URLS.INVITE_INFLUENCER,
        payload
      );

      if (response.success) {
        toast.success(response.message || 'Invite sent successfully!');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          instagram: '',
          tiktok: '',
          accessType: '',
          startDate: '',
          expiryDate: ''
        });
      } else {
        toast.error(response.message || 'Failed to send invite');
      }
    } catch (err: any) {
      console.error('Error sending invite:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to send invite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[768px] mx-auto p-4 sm:p-6 bg-gray-800/90 rounded-xl shadow-xl border border-gray-700 backdrop-blur-sm"
    >
      <h1 className="text-center text-gray-100 text-xl sm:text-2xl font-bold mb-6">
        Invite User
      </h1>
      
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Name Field */}
        <motion.div 
          custom={0}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-1"
        >
          <label className="text-gray-300 text-sm font-semibold">
            Name Of User <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Type Name"
            disabled={loading}
            className="px-4 py-3.5 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </motion.div>

        {/* Email Field */}
        <motion.div 
          custom={1}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-1"
        >
          <label className="text-gray-300 text-sm font-semibold">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Type email address"
            disabled={loading}
            className="px-4 py-3.5 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed break-all"
          />
        </motion.div>

        {/* Instagram & TikTok Row */}
        <motion.div 
          custom={2}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm font-semibold">
              Instagram
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="Link"
              disabled={loading}
              className="px-4 py-3.5 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed break-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm font-semibold">
              TikTok
            </label>
            <input
              type="text"
              value={formData.tiktok}
              onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
              placeholder="Link"
              disabled={loading}
              className="px-4 py-3.5 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed break-all"
            />
          </div>
        </motion.div>

        {/* Access Type, Start Date & Expiry Date Row */}
        <motion.div 
          custom={3}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm font-semibold">
              Access Type <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.accessType}
                onChange={(e) => setFormData({ ...formData, accessType: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-3.5 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 text-sm appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Type</option>
                <option value="LIMITED">Limited</option>
                <option value="UNLIMITED">Unlimited</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm font-semibold">
              Start Date {formData.accessType === 'LIMITED' && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                disabled={formData.accessType !== 'LIMITED' || loading}
                className="w-full px-4 py-3.5 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-300 text-sm font-semibold">
              Expiry Date {formData.accessType === 'LIMITED' && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                disabled={formData.accessType !== 'LIMITED' || loading}
                className="w-full px-4 py-3.5 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 sm:h-14 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg border border-blue-600 flex justify-center items-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-white text-sm sm:text-base font-semibold">
            {loading ? 'Sending...' : 'Send Invite Link'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InviteUser;