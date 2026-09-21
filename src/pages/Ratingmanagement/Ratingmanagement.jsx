import React, { useState, useEffect } from "react";
import { getAllConsultationRatings } from "../../api/Controller/rating";
import "./Ratingmanagement.css";
import { toast } from "react-toastify";
import { FaStar, FaCrown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function RatingManagement() {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- SERVER SIDE PAGINATION STATES (driven by API response) ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  // Load Ratings from API (GET only)
  const loadRatings = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getAllConsultationRatings(page);

      // API shape:
      // { success, total, currentPage, totalPages, data: [] }
      const rawData = res?.data || [];

      const data = rawData.map((item) => ({
        _id: item._id,

        userName:
          item.user?.fullName || item.user?.name || "N/A",

        partnerName:
          item.partner?.fullName || item.partner?.name || "N/A",

        rating: item.rating || 0,

        feedback: item.feedback || "",

        serviceType: item.serviceType || "N/A",

        createdAt: item.createdAt,
      }));

      setRatings(data);
      setTotal(res?.total || 0);
      setTotalPages(res?.totalPages || 0);
      setCurrentPage(res?.currentPage || page);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load ratings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRatings(1);
  }, []);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    loadRatings(pageNumber);
  };

  const renderStars = (value) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= value ? "star-filled" : "star-empty"}
        />
      );
    }
    return <span className="stars-wrap">{stars}</span>;
  };

  return (
    <div className="rating-page">
      <div className="product-header">
        <div className="product-header-left">
          <span className="header-tag">
            <FaCrown /> COSMIC INVENTORY HUB
          </span>

          <h1>Rating Management</h1>

          <p>View all customer ratings and reviews.</p>
        </div>
      </div>

      <div className="rating-card">
        <div className="table-responsive">
          {loading ? (
            <div className="table-loading">
              <div className="spinner" />
              <p>Loading ratings...</p>
            </div>
          ) : ratings.length === 0 ? (
            <div className="table-empty">No ratings found.</div>
          ) : (
            <table className="rating-table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>PARTNER</th>
                  <th>RATING</th>
                  <th>FEEDBACK</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span className="cell-title">{item.userName}</span>
                    </td>

                    <td>
                      <span className="cell-category">{item.partnerName}</span>
                    </td>

                    <td>
                      {renderStars(item.rating)}
                      <span className="rating-number">
                        {item.rating}/5
                      </span>
                    </td>

                    <td>
                      <span className="cell-review">
                        {item.feedback || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="cell-date">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- PAGINATION UI (server-driven) --- */}
        {!loading && totalPages > 1 && (
          <div className="custom-pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FaChevronLeft /> Prev
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    className={`page-num-btn ${currentPage === pageNum ? "active-page" : ""
                      }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}

        {!loading && (
          <div className="total-count-note">
            Total Ratings: <strong>{total}</strong>
          </div>
        )}
      </div>
    </div>
  );
}