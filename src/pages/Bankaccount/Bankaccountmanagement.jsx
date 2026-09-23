import React, { useState, useEffect, useMemo } from "react";
import { getAllPartnerBankAccounts } from "../../api/Controller/bankaccount";
import "./Bankaccountmanagement.css";
import { toast } from "react-toastify";
import {
  FaCrown,
  FaUniversity,
  FaSearch,
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const PAGE_SIZE = 10;

// Profile picture with fallback to first letter of name
function Avatar({ src, name }) {
  const [error, setError] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  if (!src || error) {
    return <span className="bank-avatar bank-avatar-fallback">{initial}</span>;
  }
  return (
    <img
      className="bank-avatar"
      src={src}
      alt={name}
      onError={() => setError(true)}
    />
  );
}

export default function BankAccountManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FILTER / SEARCH / PAGINATION (client side, API returns full list) ---
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | added | notAdded
  const [currentPage, setCurrentPage] = useState(1);

  // Account numbers revealed by admin (default masked)
  const [revealed, setRevealed] = useState({});

  // Load Partners + Bank Accounts from API (GET only)
  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      const res = await getAllPartnerBankAccounts();

      // API shape:
      // { success, count, data: [ { ...partner, bankAccount: {...} | null } ] }
      const rawData = res?.data || [];

      const data = rawData.map((item) => ({
        _id: item._id,

        partnerName: item.fullName || "N/A",
        mobile: item.mobile || "N/A",
        city: item.city || "",
        profilePic: item.profilePic || "",
        isActive: item.isActive !== false,

        hasBank: !!item.bankAccount,
        accountHolderName: item.bankAccount?.accountHolderName || "",
        bankName: item.bankAccount?.bankName || "",
        accountNumber: item.bankAccount?.accountNumber || "",
        ifscCode: item.bankAccount?.ifscCode || "",
        aadhaarNumber: item.bankAccount?.aadhaarNumber || "",
        branchName: item.bankAccount?.branchName || "",
        updatedAt: item.bankAccount?.updatedAt || null,
      }));

      setRows(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bank accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBankAccounts();
  }, []);

  // Reset to first page whenever search / filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // --- Stats ---
  const totalPartners = rows.length;
  const addedCount = rows.filter((r) => r.hasBank).length;
  const notAddedCount = totalPartners - addedCount;

  // --- Filtered rows ---
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((r) => {
      if (filter === "added" && !r.hasBank) return false;
      if (filter === "notAdded" && r.hasBank) return false;

      if (!q) return true;

      return [
        r.partnerName,
        r.mobile,
        r.accountHolderName,
        r.bankName,
        r.accountNumber,
        r.ifscCode,
        r.branchName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, search, filter]);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const pagedRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // --- Helpers ---
  const maskAccount = (num) => {
    if (!num) return "N/A";
    if (num.length <= 4) return num;
    return "X".repeat(num.length - 4) + num.slice(-4);
  };

  const toggleReveal = (id) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyText = async (text, label) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch (err) {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="bank-page">
      <div className="bank-header">
        <div className="bank-header-left">
          <span className="bank-header-tag">
            <FaCrown /> COSMIC INVENTORY HUB
          </span>

          <h1>Bank Account Management</h1>

          <p>View bank account details of all partners.</p>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="bank-stats">
          <div className="bank-stat-card">
            <span className="bank-stat-label">TOTAL PARTNERS</span>
            <span className="bank-stat-value">{totalPartners}</span>
          </div>
          <div className="bank-stat-card">
            <span className="bank-stat-label">BANK ADDED</span>
            <span className="bank-stat-value bank-green">{addedCount}</span>
          </div>
          <div className="bank-stat-card">
            <span className="bank-stat-label">NOT ADDED</span>
            <span className="bank-stat-value bank-red">{notAddedCount}</span>
          </div>
        </div>
      )}

      <div className="bank-card">
        {/* Toolbar */}
        <div className="bank-toolbar">
          <div className="bank-search">
            <FaSearch className="bank-search-icon" />
            <input
              type="text"
              placeholder="Search partner, mobile, bank, account, IFSC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bank-tabs">
            <button
              className={`bank-tab ${filter === "all" ? "active-tab" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({totalPartners})
            </button>
            <button
              className={`bank-tab ${filter === "added" ? "active-tab" : ""}`}
              onClick={() => setFilter("added")}
            >
              Added ({addedCount})
            </button>
            <button
              className={`bank-tab ${filter === "notAdded" ? "active-tab" : ""}`}
              onClick={() => setFilter("notAdded")}
            >
              Not Added ({notAddedCount})
            </button>
          </div>
        </div>

        <div className="bank-table-responsive">
          {loading ? (
            <div className="bank-table-loading">
              <div className="bank-spinner" />
              <p>Loading bank accounts...</p>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="bank-table-empty">No bank accounts found.</div>
          ) : (
            <table className="bank-table">
              <thead>
                <tr>
                  <th>PARTNER</th>
                  <th>ACCOUNT HOLDER</th>
                  <th>BANK</th>
                  <th>ACCOUNT NO.</th>
                  <th>IFSC</th>
                  <th>AADHAAR NO.</th>
                  <th>BRANCH</th>
                  <th>STATUS</th>
                  <th>UPDATED</th>
                </tr>
              </thead>
              <tbody>
                {pagedRows.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="bank-partner-cell">
                        <Avatar src={item.profilePic} name={item.partnerName} />
                        <div className="bank-partner-info">
                          <span className="bank-cell-title">
                            {item.partnerName}
                          </span>
                          <span className="bank-cell-sub">
                            {item.mobile}
                            {item.city ? ` • ${item.city}` : ""}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="bank-cell-text">
                        {item.accountHolderName || "N/A"}
                      </span>
                    </td>

                    <td>
                      {item.bankName ? (
                        <span className="bank-name-chip">
                          <FaUniversity /> {item.bankName}
                        </span>
                      ) : (
                        <span className="bank-cell-text">N/A</span>
                      )}
                    </td>

                    <td>
                      {item.accountNumber ? (
                        <div className="bank-account-cell">
                          <span className="bank-mono">
                            {revealed[item._id]
                              ? item.accountNumber
                              : maskAccount(item.accountNumber)}
                          </span>
                          <button
                            className="bank-icon-btn"
                            title={revealed[item._id] ? "Hide" : "Show"}
                            onClick={() => toggleReveal(item._id)}
                          >
                            {revealed[item._id] ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button
                            className="bank-icon-btn"
                            title="Copy account number"
                            onClick={() =>
                              copyText(item.accountNumber, "Account number")
                            }
                          >
                            <FaCopy />
                          </button>
                        </div>
                      ) : (
                        <span className="bank-cell-text">N/A</span>
                      )}
                    </td>

                    <td>
                      {item.ifscCode ? (
                        <div className="bank-account-cell">
                          <span className="bank-mono">{item.ifscCode}</span>
                          <button
                            className="bank-icon-btn"
                            title="Copy IFSC"
                            onClick={() => copyText(item.ifscCode, "IFSC")}
                          >
                            <FaCopy />
                          </button>
                        </div>
                      ) : (
                        <span className="bank-cell-text">N/A</span>
                      )}
                    </td>
                    <td>
                      <span className="bank-cell-text">
                        {item.aadhaarNumber || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span className="bank-cell-text">
                        {item.branchName || "N/A"}
                      </span>
                    </td>

                    <td>
                      <div className="bank-badges">
                        <span
                          className={`bank-badge ${
                            item.hasBank ? "badge-green" : "badge-red"
                          }`}
                        >
                          {item.hasBank ? "Added" : "Not Added"}
                        </span>
                        {!item.isActive && (
                          <span className="bank-badge badge-gray">
                            Deactivated
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="bank-cell-date">
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- PAGINATION UI --- */}
        {!loading && totalPages > 1 && (
          <div className="bank-pagination">
            <button
              className="bank-pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FaChevronLeft /> Prev
            </button>

            <div className="bank-pagination-numbers">
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    className={`bank-page-num-btn ${
                      currentPage === pageNum ? "active-page" : ""
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="bank-pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}

        {!loading && (
          <div className="bank-total-note">
            Showing <strong>{filteredRows.length}</strong> of{" "}
            <strong>{totalPartners}</strong> partners
          </div>
        )}
      </div>
    </div>
  );
}
