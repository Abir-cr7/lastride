import React, { useState } from 'react';
import { requestService } from '../../services/api';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Send,
  Fuel,
  ShieldAlert,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyRequestsList = ({ requests = [], loading = false, onRefresh }) => {
  const [submittingRatingId, setSubmittingRatingId] = useState(null);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [hoveredStars, setHoveredStars] = useState({});
  const [feedbackSuccess, setFeedbackSuccess] = useState({});

  const handleStarClick = (reqId, starVal) => {
    setRatings((prev) => ({ ...prev, [reqId]: starVal }));
  };

  const handleStarHover = (reqId, starVal) => {
    setHoveredStars((prev) => ({ ...prev, [reqId]: starVal }));
  };

  const handleReviewChange = (reqId, text) => {
    setReviews((prev) => ({ ...prev, [reqId]: text }));
  };

  const handleSubmitReview = async (reqId) => {
    const starCount = ratings[reqId];
    if (!starCount) return;

    setSubmittingRatingId(reqId);
    try {
      await requestService.rateAndReview(reqId, {
        rating: Number(starCount),
        review: reviews[reqId] || '',
      });
      setFeedbackSuccess((prev) => ({ ...prev, [reqId]: true }));
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error submitting review:', err.message);
      alert(err.message || 'Could not submit review.');
    } finally {
      setSubmittingRatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Accepted • Patrol En Route
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            Pending Dispatch
          </span>
        );
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              My Requests & SOS Activity
            </h3>
            <p className="text-xs text-slate-400">
              Live status tracking, dispatch progress and service review
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          title="Refresh requests"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="text-center py-12 rounded-2xl bg-white/5 border border-white/5">
          <Fuel className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-slate-300">No active dispatch requests</p>
          <p className="text-xs text-slate-500 mt-1">
            Order fuel or trigger an emergency SOS beacon to get roadside assistance.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const isAcceptedOrCompleted = ['accepted', 'completed'].includes(req.status);
            const hasReview = req.rating !== null && req.rating !== undefined;
            const activeStar = hoveredStars[req._id] || ratings[req._id] || 0;

            return (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-4"
              >
                {/* Top Row: Type & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl border ${
                        req.type === 'emergency_rescue'
                          ? 'bg-crimson-500/20 border-crimson-500/40 text-crimson-400'
                          : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      }`}
                    >
                      {req.type === 'emergency_rescue' ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : (
                        <Fuel className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        {req.type === 'emergency_rescue'
                          ? 'Emergency Roadside SOS'
                          : `${req.quantity}L ${req.fuelType} Delivery`}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        ID: {req._id.slice(-8)} • {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div>{getStatusBadge(req.status)}</div>
                </div>

                {/* Coordinates Row */}
                <div className="text-xs text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Coordinates: {req.lat?.toFixed(4)}, {req.lng?.toFixed(4)}
                  </span>
                  <span>Rider: {req.userName}</span>
                </div>

                {/* ========================================================
                    1–5 STAR RATING & REVIEW FORM (ONCE ACCEPTED / COMPLETED)
                   ======================================================== */}
                {isAcceptedOrCompleted && (
                  <div className="pt-3 border-t border-white/10 bg-white/5 p-4 rounded-xl space-y-3">
                    {hasReview ? (
                      /* Display Submitted Review */
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                            Your Rating & Review
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= req.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {req.review && (
                          <p className="text-xs text-slate-300 italic mt-1.5 bg-black/30 p-2 rounded-lg">
                            "{req.review}"
                          </p>
                        )}
                      </div>
                    ) : (
                      /* Interactive Rating Form */
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            Rate This Response (1–5 Stars)
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Help us evaluate the patrol squad
                          </span>
                        </div>

                        {/* Interactive Stars */}
                        <div className="flex items-center gap-2 my-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleStarClick(req._id, star)}
                              onMouseEnter={() => handleStarHover(req._id, star)}
                              onMouseLeave={() => handleStarHover(req._id, 0)}
                              className="p-1 transition-transform hover:scale-125 focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  star <= activeStar
                                    ? 'fill-amber-400 text-amber-400 shadow-[0_0_10px_#F59E0B]'
                                    : 'text-slate-600 hover:text-amber-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-mono text-amber-400 font-bold ml-2">
                            {activeStar > 0 ? `${activeStar} / 5 Stars` : 'Select rating'}
                          </span>
                        </div>

                        {/* Review Comment Input */}
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Write a brief review on patrol promptness & courtesy..."
                            value={reviews[req._id] || ''}
                            onChange={(e) => handleReviewChange(req._id, e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleSubmitReview(req._id)}
                            disabled={!ratings[req._id] || submittingRatingId === req._id}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5"
                          >
                            {submittingRatingId === req._id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <span>Submit</span>
                                <Send className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRequestsList;
