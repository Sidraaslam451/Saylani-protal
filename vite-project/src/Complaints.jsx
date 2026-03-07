import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function Complaints({ session }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("IT Support");
  const [urgency, setUrgency] = useState("Medium Priority");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const fetchComplaints = async () => {
    const { data } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("complaints").insert([
      {
        title,
        category,
        urgency,
        location,
        details,
        user_id: session.user.id,
        status: "Pending Review",
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Complaint Registered Successfully!");
      setTitle("");
      setDetails("");
      setLocation("");
      fetchComplaints();
    }
    setLoading(false);
  };

  const getStatusStyle = (status) => {
    if (status === "Resolved") return "bg-green-100 text-green-700 border-green-200";
    if (status === "In Progress") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* --- HEADER SECTION --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="p-2 bg-red-50 rounded-lg text-lg">🛠️</span> 
          Support Desk
        </h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            System Online
          </span>
        </div>
      </div>

      {/* --- FORM SECTION --- */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Issue Subject</label>
            <input
              className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-400"
              placeholder="e.g., Portal login issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Department</label>
            <select
              className="w-full p-2 border rounded-lg text-sm bg-gray-50 outline-none cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>IT Support</option>
              <option>Building Maintenance</option>
              <option>Electricity & Power</option>
              <option>Security Services</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Location / Room</label>
            <input
              className="w-full p-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-400"
              placeholder="e.g., Lab 4, 2nd Floor"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Priority Level</label>
            <select
              className="w-full p-2 border rounded-lg text-sm bg-gray-50 outline-none"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
            >
              <option>Low Priority</option>
              <option>Medium Priority</option>
              <option>High Priority (Emergency)</option>
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Description</label>
          <textarea
            className="w-full p-2 border rounded-lg text-sm h-20 outline-none focus:ring-1 focus:ring-red-400"
            placeholder="Provide specific details about the problem..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            disabled={loading}
            className="bg-red-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-red-700 shadow-md transition-all active:scale-95 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Lodge Complaint"}
          </button>
        </div>
      </form>

      {/* --- LIST SECTION --- */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-4">
          Recent Tickets <div className="h-[1px] flex-grow bg-gray-100"></div>
        </h3>

        {list.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:border-red-200 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <div className="flex gap-2 mb-2">
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${getStatusStyle(c.status)}`}>
                    ● {c.status}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-100 uppercase">
                    {c.urgency}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-gray-800">{c.title}</h4>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-500">
                  <p>📍 <span className="font-medium">{c.location}</span></p>
                  <p>🕒 {new Date(c.created_at).toLocaleDateString()} at {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded text-[10px] font-mono text-gray-400 border border-gray-100">
                #{c.id.slice(0, 6)}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-600 leading-relaxed bg-red-50/30 p-2 rounded-md italic">
                "{c.details}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Complaints;