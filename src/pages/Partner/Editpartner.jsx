import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // remove if you use a different toast lib
import "./Editpartner.css";
import { updatePartner } from "../../api/Controller/partner";

const SPECIALTY_OPTIONS = [
  "Vedic Astrology",
  "Numerology",
  "Tarot Reading",
  "Palmistry",
  "Vastu Shastra",
  "KP Astrology",
  "Face Reading",
];

const LANGUAGE_OPTIONS = ["Hindi", "English", "Punjabi", "Gujarati", "Marathi", "Bengali", "Tamil", "Telugu"];

const EMPTY_FORM = {
  fullName: "",
  mobile: "",
  dateOfBirth: "",
  gender: "",
  city: "",
  specialties: [],
  languages: [],
  experience: "",
  qualification: "",
  expectedSalary: "",
  bio: "",
 profilePic: null,
  isVerified: false,
  isProfileComplete: false,
};

export default function EditPartnerModal({ isOpen, onClose, partner, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Load partner data into the form whenever a new partner is passed in / modal opens
  useEffect(() => {
    if (partner) {
      setFormData({
        fullName: partner.fullName || "",
        mobile: partner.mobile || "",
        dateOfBirth: partner.dateOfBirth ? partner.dateOfBirth.substring(0, 10) : "",
        gender: partner.gender || "",
        city: partner.city || "",
        specialties: partner.specialties || [],
        languages: partner.languages || [],
        experience: partner.experience ?? "",
        qualification: partner.qualification || "",
        expectedSalary: partner.expectedSalary ?? "",
        bio: partner.bio || "",
          profilePic: null,
        isVerified: !!partner.isVerified,
        isProfileComplete: !!partner.isProfileComplete,
      });
    }
  }, [partner, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
 const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profilePic: e.target.files[0] }));
  };
  const toggleMultiSelect = (field, value) => {
    setFormData((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("mobile", formData.mobile);
      payload.append("dateOfBirth", formData.dateOfBirth);
      payload.append("gender", formData.gender);
      payload.append("city", formData.city);
      payload.append("qualification", formData.qualification);
      payload.append("experience", Number(formData.experience));
      payload.append("expectedSalary", Number(formData.expectedSalary));
      payload.append("bio", formData.bio);
      payload.append("isVerified", formData.isVerified);
      payload.append("isProfileComplete", formData.isProfileComplete);
      payload.append("specialties", JSON.stringify(formData.specialties));
      payload.append("languages", JSON.stringify(formData.languages));
      if (formData.profilePic) {
        payload.append("profilePic", formData.profilePic);
      }

      await updatePartner(partner._id, payload);

      toast.success("Partner updated successfully");

      onUpdated?.();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update partner");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="epm-overlay" onClick={onClose}>
      <div className="epm-modal" onClick={(e) => e.stopPropagation()}>
        <header className="epm-header">
          <div>
            <h2>Edit Partner</h2>
            <p>Update partner profile details</p>
          </div>
          <button type="button" className="epm-close-btn" onClick={onClose}>
            &times;
          </button>
        </header>

        <form className="epm-body" onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="epm-section">
            <h3>Basic Information</h3>
            <div className="epm-grid">
              <div className="epm-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Peter Parker"
                  required
                />
              </div>

              <div className="epm-field">
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  required
                />
              </div>

              <div className="epm-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="epm-field">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="epm-field">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Dehradun"
                />
              </div>

              <div className="epm-field">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="B.Tech"
                />
              </div>

              <div className="epm-field">
                <label>Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  min="0"
                  value={formData.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="epm-field">
                <label>Expected Salary</label>
                <input
                  type="number"
                  name="expectedSalary"
                  min="0"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="epm-section">
            <h3>Specialties</h3>
            <div className="epm-chip-group">
              {SPECIALTY_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  className={`epm-chip ${formData.specialties.includes(s) ? "active" : ""}`}
                  onClick={() => toggleMultiSelect("specialties", s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="epm-section">
            <h3>Languages</h3>
            <div className="epm-chip-group">
              {LANGUAGE_OPTIONS.map((l) => (
                <button
                  type="button"
                  key={l}
                  className={`epm-chip ${formData.languages.includes(l) ? "active" : ""}`}
                  onClick={() => toggleMultiSelect("languages", l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
  <div className="epm-section">
            <h3>Profile Image</h3>
            {partner?.profilePic && !formData.profilePic && (
              <img
                src={partner.profilePic}
                alt="Current profile"
                style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 8 }}
              />
            )}
            <div className="epm-field">
              <label>Upload New Image</label>
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {/* Bio */}
          <div className="epm-section">
            <h3>Bio</h3>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Professional astrologer with 5 years of experience."
            />
          </div>

          {/* Status */}
          <div className="epm-section">
            <h3>Status</h3>
            <div className="epm-toggle-row">
              <label className="epm-switch-label">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleChange}
                />
                <span className="epm-switch"></span>
                Verified
              </label>

              <label className="epm-switch-label">
                <input
                  type="checkbox"
                  name="isProfileComplete"
                  checked={formData.isProfileComplete}
                  onChange={handleChange}
                />
                <span className="epm-switch"></span>
                Profile Complete
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="epm-actions">
            <button
              type="button"
              className="epm-btn epm-btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="epm-btn epm-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}