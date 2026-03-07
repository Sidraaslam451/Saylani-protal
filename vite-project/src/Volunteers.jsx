import React, { useState } from "react";
import { supabase } from "./supabaseClient.jsx";

function Volunteers({ session }) {
  const [formData, setFormData] = useState({
    full_name: "",
    skills: "",
    event_interest: "IT Workshop",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("volunteers").insert([
      {
        full_name: formData.full_name,
        skills: formData.skills,
        event_interest: formData.event_interest,
        user_id: session.user.id,
        status: "pending",
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Registration Successful! Admin will review your application.");
      setFormData({ full_name: "", skills: "", event_interest: "IT Workshop" });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#0057a8]">
          Volunteer Registration
        </h2>
        <p className="text-gray-500 mt-2">Join the Saylani team for upcoming events</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#66b032] focus:ring-2 focus:ring-[#66b032]/20 outline-none transition-all"
            placeholder="Enter your full name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
            Special Skills
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#66b032] focus:ring-2 focus:ring-[#66b032]/20 outline-none transition-all resize-none"
            placeholder="E.g. Web Development, Event Management, Photography"
            rows="3"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            required
          ></textarea>
        </div>

        {/* Event Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
            Select Event
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#66b032] focus:ring-2 focus:ring-[#66b032]/20 outline-none transition-all appearance-none bg-white"
            value={formData.event_interest}
            onChange={(e) => setFormData({ ...formData, event_interest: e.target.value })}
          >
            <option value="IT Workshop">IT Workshop</option>
            <option value="Blood Drive">Blood Drive</option>
            <option value="Seminar Management">Seminar Management</option>
            <option value="Welfare Distribution">Welfare Distribution</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-[#66b032]/30 transition-all active:scale-95 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#66b032] hover:bg-[#589a2b]"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Submit Application"
          )}
        </button>
      </form>
    </div>
  );
}

export default Volunteers;