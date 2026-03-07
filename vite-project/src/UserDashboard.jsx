import React, { useState } from "react";
import LostFound from "./LostFound";
import Complaints from "./Complaints";
import Volunteers from "./Volunteers";

function UserDashboard({ session, handleLogout }) {
  const [activeView, setActiveView] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#0057a8] p-4 text-white flex justify-between items-center shadow-md border-b-4 border-[#66b032]">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setActiveView("dashboard")}
        >
          {/* Logo Container */}
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
            <img
              src="./saylani_logo.png"
              alt="Saylani Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>

          <h1 className="text-xl font-bold">Saylani IT Hub</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto p-8">
        {activeView !== "dashboard" && (
          <button
            onClick={() => setActiveView("dashboard")}
            className="mb-6 text-[#0057a8] font-bold flex items-center gap-2 hover:underline"
          >
            ← Back to Dashboard
          </button>
        )}

        {activeView === "dashboard" ? (
          <>
            <header className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-gray-800">
                Welcome Back! 👋
              </h2>
              <p className="text-gray-500">
                Student Portal: Manage your campus activities.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Lost & Found Card */}
              <div
                onClick={() => setActiveView("lostfound")}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#66b032] transition-colors">
                  <span className="text-2xl group-hover:grayscale-0">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-[#0057a8]">
                  Lost & Found
                </h3>
                <p className="text-gray-600 mt-2">
                  Post items you found or lost in campus.
                </p>
                <button className="mt-4 text-[#66b032] font-semibold hover:underline">
                  Open Module →
                </button>
              </div>

              {/* Complaints Card */}
              <div
                onClick={() => setActiveView("complaints")}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0057a8] transition-colors">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-[#0057a8]">Complaints</h3>
                <p className="text-gray-600 mt-2">
                  File complaints for IT, Water, or Power.
                </p>
                <button className="mt-4 text-[#66b032] font-semibold hover:underline">
                  Open Module →
                </button>
              </div>

              {/* Volunteers Card - Logged the onClick here */}
              <div
                onClick={() => setActiveView("volunteers")}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-colors">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-[#0057a8]">Volunteers</h3>
                <p className="text-gray-600 mt-2">
                  Sign up for Saylani Welfare events.
                </p>
                <button className="mt-4 text-[#66b032] font-semibold hover:underline">
                  Open Module →
                </button>
              </div>
            </div>
          </>
        ) : activeView === "lostfound" ? (
          <LostFound session={session} />
        ) : activeView === "complaints" ? (
          <Complaints session={session} />
        ) : (
          /* Volunteers View */
          <Volunteers session={session} />
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
