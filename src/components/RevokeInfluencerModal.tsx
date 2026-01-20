import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface RevokeInfluencerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  loading?: boolean;
}

const RevokeInfluencerModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: RevokeInfluencerModalProps) => {
  const [comment, setComment] = useState("");

  // 🔒 Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ⌨️ ESC close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modal = (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-[620px] bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <h2 className="text-center text-gray-100 text-lg sm:text-2xl font-bold mb-4 sm:mb-6">
            Add Comments
          </h2>

          {/* Textarea */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type comments here"
            rows={4}
            className="w-full px-3 sm:px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 text-gray-100 text-sm sm:text-base resize-none focus:outline-none focus:border-blue-500"
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 sm:mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-1/2 h-11 sm:h-12 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600/10 disabled:opacity-50 text-sm sm:text-base"
            >
              Cancel
            </button>

            <button
              onClick={() => onConfirm(comment)}
              disabled={loading || !comment.trim()}
              className="w-full sm:w-1/2 h-11 sm:h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "Revoking..." : "Revoke Access"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default RevokeInfluencerModal;
