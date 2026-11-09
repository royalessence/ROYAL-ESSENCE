import React, { useState } from 'react';
import { Review, Perfume } from '../types';
import { Star, CheckCircle, MessageSquarePlus, X } from 'lucide-react';
import { Islamic8PointStar } from './ArabianDecorations';

interface CustomerReviewsProps {
  reviews: Review[];
  perfumes: Perfume[];
  onAddReview: (review: Review) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  perfumes,
  onAddReview,
}) => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  // Form state
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [rating, setRating] = useState(5);
  const [perfumeId, setPerfumeId] = useState(perfumes[0]?.id || '');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const averageRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
  ).toFixed(1);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !title.trim() || !comment.trim()) return;

    const selectedPerfume = perfumes.find((p) => p.id === perfumeId);

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      location: location.trim() || 'Bangladesh',
      rating,
      date: 'Just now',
      perfumeId,
      perfumeName: selectedPerfume ? selectedPerfume.name : 'Royal Essence Creation',
      title: title.trim(),
      comment: comment.trim(),
      verified: true,
    };

    onAddReview(newRev);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsWriteModalOpen(false);
      // Reset form
      setAuthor('');
      setTitle('');
      setComment('');
    }, 1200);
  };

  return (
    <section className="py-12 sm:py-20 lg:py-24 relative overflow-hidden bg-gradient-to-b from-[#070709] via-[#0E0E12] to-[#0A0A0C]">
      {/* Subtle Girih Pattern */}
      <div className="absolute inset-0 bg-islamic-girih opacity-15 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />

      {/* Ambient Gold Radial Glows */}
      <div className="absolute top-1/3 left-10 w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#231A15]/40 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3.5 py-1 bg-[#121217] border border-[#D4AF37]/40 rounded-full">
              <Islamic8PointStar size={12} className="text-[#F3CD68]" />
              <span className="font-serif-royal text-[11px] uppercase tracking-[0.25em] text-[#F3CD68] font-bold">
                Royal Arabian Connoisseurs
              </span>
            </div>
            <h2 className="font-serif-royal text-3xl sm:text-4xl text-[#FAF6F0] font-bold tracking-wide">
              <span className="text-gold-gradient">Customer Reviews & Experiences</span>
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center text-[#F3CD68]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F3CD68] stroke-none" />
                ))}
              </div>
              <span className="font-serif-royal text-lg font-bold text-[#FAF6F0] tabular-nums">
                {averageRating} / 5.0
              </span>
              <span className="text-xs text-[#D4C3B3]">
                · Based on {reviews.length} verified Royal Essence clients
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="flex items-center gap-1 bg-[#121217] p-1 border border-[#D4AF37]/35 rounded-full text-xs">
              <button
                onClick={() => setFilterRating('all')}
                className={`px-4 py-1.5 font-medium rounded-full transition-colors ${
                  filterRating === 'all'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-[#070709] font-bold shadow'
                    : 'text-[#D4C3B3]/75 hover:text-[#FAF6F0]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterRating(5)}
                className={`px-4 py-1.5 font-medium rounded-full transition-colors ${
                  filterRating === 5
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8435] text-[#070709] font-bold shadow'
                    : 'text-[#D4C3B3]/75 hover:text-[#FAF6F0]'
                }`}
              >
                5 Stars
              </button>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="flex items-center gap-2 bg-[#121217] hover:bg-[#1A120E] hover:border-[#F3CD68] border border-[#D4AF37]/50 text-[#F3CD68] px-5 py-2.5 text-xs font-serif-royal font-semibold uppercase tracking-wider rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.6)] transition-all"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Share Experience</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-gradient-to-b from-[#121217] via-[#0E0E12] to-[#0A0A0C] border border-[#D4AF37]/25 rounded-t-[22px] rounded-b-xs flex flex-col justify-between hover:border-[#F3CD68] hover:shadow-[0_8px_30px_rgba(212,175,55,0.18)] transition-all backdrop-blur-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-[#D4AF37]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] stroke-none" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#D4C3B3]/60 font-sans-body">
                    {rev.date}
                  </span>
                </div>

                <h4 className="font-serif-royal text-sm sm:text-base font-bold text-[#FAF6F0] mb-1">
                  &ldquo;{rev.title}&rdquo;
                </h4>

                <p className="font-editorial text-sm sm:text-base text-[#E2D6C9]/90 leading-relaxed mb-4 italic">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/15">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans-body text-xs font-bold text-[#FAF6F0]">
                        {rev.author}
                      </span>
                      {rev.verified && (
                        <span title="Verified Client">
                          <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#AA8435] block">
                      {rev.location}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#F3CD68] font-serif-royal uppercase tracking-wider bg-[#1A120E] px-2 py-0.5 border border-[#D4AF37]/25 rounded-xs font-bold">
                    {rev.perfumeName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070709]/85 backdrop-blur-md">
          <div className="bg-[#0E0E12] border border-[#D4AF37]/50 max-w-lg w-full p-6 sm:p-8 rounded-xs relative shadow-[0_15px_50px_rgba(0,0,0,0.95)] animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-4 right-4 text-[#FAF6F0]/60 hover:text-[#D4AF37] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-royal text-xl text-[#FAF6F0] font-bold mb-1">
              Share Your Royal Experience
            </h3>
            <p className="text-xs text-[#D4C3B3]/80 mb-6">
              Your feedback is celebrated by our master perfumers.
            </p>

            {submittedMessage ? (
              <div className="py-8 text-center text-[#D4AF37]">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-[#D4AF37]" />
                <p className="font-serif-royal font-bold text-lg">Thank You, Royal Patron</p>
                <p className="text-xs text-[#FAF6F0]/80 mt-1">Your review has been verified and published.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-1 font-serif-royal">
                    Select Fragrance
                  </label>
                  <select
                    value={perfumeId}
                    onChange={(e) => setPerfumeId(e.target.value)}
                    className="w-full bg-[#121217] border border-[#D4AF37]/35 text-xs text-[#FAF6F0] p-2.5 rounded-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    {perfumes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-1 font-serif-royal">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asif Mahmud"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-[#121217] border border-[#D4AF37]/35 text-xs text-[#FAF6F0] p-2.5 rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-1 font-serif-royal">
                      Location (City/Area)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gulshan, Dhaka"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-[#121217] border border-[#D4AF37]/35 text-xs text-[#FAF6F0] p-2.5 rounded-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-1 font-serif-royal">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-[#D4AF37] text-[#D4AF37]'
                              : 'text-[#444]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-[#D4AF37] font-bold ml-2">
                      {rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-1 font-serif-royal">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Majestic projection and lasting oud"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#121217] border border-[#D4AF37]/35 text-xs text-[#FAF6F0] p-2.5 rounded-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-1 font-serif-royal">
                    Your Olfactory Impression
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe how the notes, sillage, longevity and flacon felt..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#121217] border border-[#D4AF37]/35 text-xs text-[#FAF6F0] p-2.5 rounded-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F3CD68] to-[#AA8435] text-[#070709] font-serif-royal font-bold text-xs uppercase tracking-wider py-3 rounded-xs hover:shadow-[0_4px_18px_rgba(212,175,55,0.4)] transition-all"
                >
                  Publish Royal Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
