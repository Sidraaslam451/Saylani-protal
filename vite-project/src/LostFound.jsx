import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

function LostFound({ session }) {
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [type, setType] = useState("lost");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 🔹 New State for Edit Mode
  const [editingId, setEditingId] = useState(null);

  // FETCH ITEMS
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("lost_found_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Fetch Error:", error.message);
    else setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 🔹 EDIT HANDLER (Pre-fills form and scrolls up)
  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setdescription(item.description);
    setType(item.type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // DELETE FUNCTION
  const handleDelete = async (itemId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setLoading(true);
    try {
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        await supabase.storage.from('item-images').remove([fileName]);
      }
      const { error } = await supabase.from("lost_found_items").delete().eq("id", itemId);
      if (error) throw error;
      fetchItems();
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  // IMAGE UPLOAD
  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('item-images').upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from('item-images').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // SUBMIT OR UPDATE POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let publicUrl = null;
    if (selectedFile) {
      publicUrl = await uploadImage(selectedFile);
    }

    if (editingId) {
      // 📝 UPDATE LOGIC
      const updatePayload = {
        title,
        description,
        type,
      };
      if (publicUrl) updatePayload.image_url = publicUrl;

      const { error } = await supabase
        .from("lost_found_items")
        .update(updatePayload)
        .eq("id", editingId);

      if (!error) {
        alert("Post Updated Successfully!");
        setEditingId(null);
      } else {
        alert(error.message);
      }
    } else {
      // ➕ INSERT LOGIC
      const { error } = await supabase.from("lost_found_items").insert([
        {
          title,
          description,
          type,
          user_id: session.user.id,
          status: "pending",
          image_url: publicUrl,
        }
      ]);
      if (!error) alert("Success! Item posted.");
      else alert(error.message);
    }

    // Reset Form
    setTitle("");
    setdescription("");
    setSelectedFile(null);
    setLoading(false);
    fetchItems();
  };

  // FILTER ITEMS
  const lostItems = items.filter((item) => item.type === "lost");
  const foundItems = items.filter((item) => item.type === "found");

  // CARD COMPONENT
  const ItemCard = ({ item }) => (
    <div className={`bg-white p-4 rounded-xl shadow-sm border-l-4 mb-4 ${item.type === 'lost' ? 'border-red-500' : 'border-green-500'} hover:shadow-md transition-shadow`}>
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-44 object-cover rounded-lg mb-3 border border-gray-100"
        />
      )}
      <h4 className="font-bold text-[#0057a8] capitalize">{item.title}</h4>
      <p className="text-gray-600 text-sm mt-1 leading-relaxed">{item.description}</p>

      <div className="mt-3 flex justify-between items-center text-[10px] text-gray-400 border-t pt-2 border-gray-50">
        <span className={`px-2 py-0.5 rounded font-black uppercase tracking-tighter ${item.status === 'resolved' ? 'bg-blue-100 text-blue-600' : item.type === 'lost' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {item.status}
        </span>
        <span>📅 {new Date(item.created_at).toLocaleDateString()}</span>
      </div>

      {item.user_id === session.user.id && (
        <div className="flex gap-2 mt-3 pt-2 border-t border-gray-50">
          <button
            onClick={() => handleEdit(item)}
            className="text-[10px] font-bold bg-blue-50 text-[#0057a8] px-3 py-1 rounded hover:bg-[#0057a8] hover:text-white transition-all"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => handleDelete(item.id, item.image_url)}
            className="text-[10px] font-bold bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition-all"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-10 p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-[#0057a8] mb-6 tracking-tight">Lost & Found Hub</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-[#66b032] mb-12 max-w-4xl mx-auto">
        <div className="space-y-4">
          {/* Edit Mode Indicator */}
          {editingId && (
            <div className="flex justify-between items-center bg-blue-50 p-2 rounded text-blue-700 text-xs font-bold border border-blue-100">
              <span>Mode: Editing "{title}"</span>
              <button type="button" onClick={() => { setEditingId(null); setTitle(""); setdescription(""); }} className="underline">Cancel Edit</button>
            </div>
          )}

          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => setType("lost")}
              className={`flex-1 p-2 rounded-lg font-bold text-sm transition-all ${type === "lost" ? "bg-red-100 text-red-600 border-2 border-red-600" : "bg-gray-50 text-gray-400 border-2 border-transparent"}`}
            >
              🚩 I Lost Something
            </button>
            <button
              type="button"
              onClick={() => setType("found")}
              className={`flex-1 p-2 rounded-lg font-bold text-sm transition-all ${type === "found" ? "bg-green-100 text-green-600 border-2 border-green-600" : "bg-gray-50 text-gray-400 border-2 border-transparent"}`}
            >
              ✅ I Found Something
            </button>
          </div>

          <input
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#0057a8]"
            placeholder="Item Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="w-full p-3 border rounded-lg h-24 outline-none focus:ring-2 focus:ring-[#0057a8]"
            placeholder="Description & Location"
            value={description}
            onChange={(e) => setdescription(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Attach Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#0057a8] file:text-white"
            />
            {uploading && <p className="text-xs text-blue-500 animate-pulse">Uploading...</p>}
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className={`w-full text-white p-3 rounded-lg font-bold shadow-md active:scale-95 ${type === "lost" ? "bg-red-500 hover:bg-red-600" : "bg-[#66b032] hover:bg-[#589a2b]"} disabled:bg-gray-300`}
          >
            {loading ? "Processing..." : editingId ? "Update This Post" : `Confirm & Post ${type.toUpperCase()}`}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-red-600 border-b-2 border-red-100 pb-2 flex items-center gap-2">🚩 Lost Items</h3>
          {lostItems.length === 0 && <p className="text-gray-400 text-sm italic">No items reported lost.</p>}
          {lostItems.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-green-600 border-b-2 border-green-100 pb-2 flex items-center gap-2">✅ Found Items</h3>
          {foundItems.length === 0 && <p className="text-gray-400 text-sm italic">No items reported found.</p>}
          {foundItems.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}

export default LostFound;