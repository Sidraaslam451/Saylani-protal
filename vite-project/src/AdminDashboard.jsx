// import React, { useState, useEffect } from "react";
// import { supabase } from "./supabaseClient.jsx";

// function AdminDashboard({ handleLogout }) {
//   const [activeTab, setActiveTab] = useState("complaints");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Database se data lane ka function
//   const fetchData = async (tab) => {
//     setLoading(true);
//     let tableName = tab === "complaints" ? "complaints" : "lost_found_items";
    
//     let query = supabase.from(tableName).select("*").order("created_at", { ascending: false });
    
//     // Agar Lost ya Found tab hai toh type ke hisab se filter karein
//     if (tab === "lost") query = query.eq("type", "lost");
//     if (tab === "found") query = query.eq("type", "found");

//     const { data: result, error } = await query;
//     if (!error) setData(result);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData(activeTab);
//   }, [activeTab]);

//   // CRUD: Delete Function
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this record?")) {
//       let tableName = activeTab === "complaints" ? "complaints" : "lost_found_items";
//       const { error } = await supabase.from(tableName).delete().eq("id", id);
//       if (!error) fetchData(activeTab);
//       else alert("Error deleting: " + error.message);
//     }
//   };

//   // CRUD: Update Status Function
//   const updateStatus = async (id, newStatus) => {
//     let tableName = activeTab === "complaints" ? "complaints" : "lost_found_items";
//     const { error } = await supabase.from(tableName).update({ status: newStatus }).eq("id", id);
//     if (!error) fetchData(activeTab);
//     else alert("Error updating status: " + error.message);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Admin Navbar */}
//       <nav className="bg-red-800 p-4 text-white flex justify-between items-center shadow-lg">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-white text-red-800 rounded-full flex items-center justify-center font-black">A</div>
//           <h1 className="text-xl font-bold tracking-tight">Saylani Admin Control</h1>
//         </div>
//         <button onClick={handleLogout} className="bg-white text-red-800 px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-all">
//           Logout
//         </button>
//       </nav>

//       <div className="max-w-6xl mx-auto p-6">
//         {/* Tabs Navigation */}
//         <div className="flex bg-white rounded-2xl p-2 shadow-sm mb-6 border border-gray-200">
//           {["complaints", "lost", "found"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all capitalize ${
//                 activeTab === tab ? "bg-red-700 text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
//               }`}
//             >
//               {tab === "complaints" ? "⚠️ Complaints" : tab === "lost" ? "🚩 Lost Items" : "✅ Found Items"}
//             </button>
//           ))}
//         </div>

//         {/* Data Table Container */}
//         <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
//           <div className="p-6 border-b border-gray-50 flex justify-between items-center">
//             <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab} List</h2>
//             <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-mono">Total: {data.length}</span>
//           </div>

//           <div className="p-0">
//             {loading ? (
//               <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Fetching Data...</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                   <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest border-b">
//                     <tr>
//                       <th className="py-4 px-6">User ID</th>
//                       <th className="py-4 px-6">Title / Item</th>
//                       <th className="py-4 px-6">Description</th>
//                       <th className="py-4 px-6">Status</th>
//                       <th className="py-4 px-6 text-right">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {data.map((item) => (
//                       <tr key={item.id} className="hover:bg-red-50/20 transition-colors">
//                         <td className="py-4 px-6 font-mono text-[9px] text-gray-400">{item.user_id?.slice(0, 8)}...</td>
//                         <td className="py-4 px-6 font-bold text-gray-800">{item.title}</td>
//                         <td className="py-4 px-6 text-gray-500 text-xs max-w-xs truncate">{item.description}</td>
//                         <td className="py-4 px-6">
//                           <select
//                             value={item.status || "pending"}
//                             onChange={(e) => updateStatus(item.id, e.target.value)}
//                             className={`text-[10px] font-bold border rounded-full px-3 py-1 outline-none cursor-pointer bg-white ${
//                               item.status === 'resolved' ? 'border-green-500 text-green-600' : 'border-orange-400 text-orange-600'
//                             }`}
//                           >
//                             <option value="pending">PENDING</option>
//                             <option value="in-progress">IN PROGRESS</option>
//                             <option value="resolved">RESOLVED</option>
//                           </select>
//                         </td>
//                         <td className="py-4 px-6 text-right">
//                           <button 
//                             onClick={() => handleDelete(item.id)}
//                             className="text-red-500 hover:text-red-700 font-bold text-xs hover:underline"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 {data.length === 0 && (
//                   <div className="text-center py-20">
//                     <p className="text-gray-400 italic">No {activeTab} records found in database.</p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;


import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient.jsx";

function AdminDashboard({ handleLogout }) {
  const [activeTab, setActiveTab] = useState("complaints");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Database se data lane ka function
  const fetchData = async (tab) => {
    setLoading(true);
    
    // Logic: Determine table name based on tab
    let tableName = tab === "volunteers" 
      ? "volunteers" 
      : (tab === "complaints" ? "complaints" : "lost_found_items");
    
    let query = supabase.from(tableName).select("*").order("created_at", { ascending: false });
    
    // Agar Lost ya Found tab hai toh type ke hisab se filter karein
    if (tab === "lost") query = query.eq("type", "lost");
    if (tab === "found") query = query.eq("type", "found");

    const { data: result, error } = await query;
    if (!error) setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  // CRUD: Delete Function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      let tableName = activeTab === "volunteers" 
        ? "volunteers" 
        : (activeTab === "complaints" ? "complaints" : "lost_found_items");
        
      const { error } = await supabase.from(tableName).delete().eq("id", id);
      if (!error) fetchData(activeTab);
      else alert("Error deleting: " + error.message);
    }
  };

  // CRUD: Update Status Function
  const updateStatus = async (id, newStatus) => {
    let tableName = activeTab === "volunteers" 
      ? "volunteers" 
      : (activeTab === "complaints" ? "complaints" : "lost_found_items");
      
    const { error } = await supabase.from(tableName).update({ status: newStatus }).eq("id", id);
    if (!error) fetchData(activeTab);
    else alert("Error updating status: " + error.message);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar */}
      <nav className="bg-red-800 p-4 text-white flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-red-800 rounded-full flex items-center justify-center font-black">A</div>
          <h1 className="text-xl font-bold tracking-tight">Saylani Admin Control</h1>
        </div>
        <button onClick={handleLogout} className="bg-white text-red-800 px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-all">
          Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs Navigation */}
        <div className="flex bg-white rounded-2xl p-2 shadow-sm mb-6 border border-gray-200">
          {["complaints", "lost", "found", "volunteers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all capitalize ${
                activeTab === tab ? "bg-red-700 text-white shadow-md" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab === "complaints" ? "⚠️ Complaints" : 
               tab === "lost" ? "🚩 Lost Items" : 
               tab === "found" ? "✅ Found Items" : "🤝 Volunteers"}
            </button>
          ))}
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 capitalize">{activeTab} List</h2>
            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-mono">Total: {data.length}</span>
          </div>

          <div className="p-0">
            {loading ? (
              <div className="text-center py-20 text-gray-400 font-medium animate-pulse">Fetching Data...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest border-b">
                    <tr>
                      <th className="py-4 px-6">{activeTab === "volunteers" ? "Name" : "User ID"}</th>
                      <th className="py-4 px-6">{activeTab === "volunteers" ? "Skills" : "Title / Item"}</th>
                      <th className="py-4 px-6">{activeTab === "volunteers" ? "Event" : "Description"}</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.map((item) => (
                      <tr key={item.id} className="hover:bg-red-50/20 transition-colors">
                        <td className="py-4 px-6 font-bold text-gray-800">
                           {activeTab === "volunteers" ? item.full_name : `${item.user_id?.slice(0, 8)}...`}
                        </td>
                        <td className="py-4 px-6 text-gray-700 text-sm font-medium">
                           {activeTab === "volunteers" ? item.skills : item.title}
                        </td>
                        <td className="py-4 px-6 text-gray-500 text-xs max-w-xs truncate">
                           {activeTab === "volunteers" ? item.event_interest : item.description}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={item.status || "pending"}
                            onChange={(e) => updateStatus(item.id, e.target.value)}
                            className={`text-[10px] font-bold border rounded-full px-3 py-1 outline-none cursor-pointer bg-white ${
                              item.status === 'resolved' ? 'border-green-500 text-green-600' : 'border-orange-400 text-orange-600'
                            }`}
                          >
                            <option value="pending">PENDING</option>
                            <option value="in-progress">IN PROGRESS</option>
                            <option value="resolved">RESOLVED</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-xs hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-gray-400 italic">No {activeTab} records found in database.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;