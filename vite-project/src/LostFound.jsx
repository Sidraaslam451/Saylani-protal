import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function LostFound({ session }) {
  const [title, setTitle] = useState('')
  const [description, setdescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  // 1. Data Fetch Karne Ka Function (Database se items mangwana)
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('lost_found_items')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error('Fetch Error:', error.message)
    else setItems(data)
  }

  // Page load hote hi items fetch karein
  useEffect(() => {
    fetchItems()
  }, [])

  // 2. Data Insert Karne Ka Function (Form submit hone par)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('lost_found_items')
      .insert([
        { 
          title, 
          description, 
          user_id: session.user.id, // Ye user ki ID database mein save hogi
          status: 'pending' 
        }
      ])

    if (error) {
      alert("Error: " + error.message)
    } else {
      alert('Success! Item posted to the community.')
      setTitle('') // Input clear karein
      setdescription('')
      fetchItems() // List ko foran update karein
    }
    setLoading(false)
  }

  return (
    <div className="mt-10 p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#0057a8] mb-6">Lost & Found Hub</h2>
      
      {/* --- FORM SECTION --- */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-[#66b032] mb-10">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Item Name</label>
            <input 
              type="text" 
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#0057a8] outline-none"
              placeholder="e.g. Blue Water Bottle, Keys, Wallet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Description & Location</label>
            <textarea 
              className="w-full mt-1 p-3 border rounded-lg h-24 focus:ring-2 focus:ring-[#0057a8] outline-none"
              placeholder="Where did you find/lose it? Any specific marks?"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#66b032] text-white p-3 rounded-lg font-bold hover:bg-[#589a2b] transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Posting...' : 'Post to Portal'}
          </button>
        </div>
      </form>

      {/* --- LIST SECTION --- */}
      <div className="grid gap-4">
        <h3 className="text-xl font-bold text-gray-800">Recent Posts</h3>
        {items.length === 0 ? <p className="text-gray-500 italic">No items posted yet.</p> : null}
        
        {items.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border-l-8 border-[#0057a8] flex flex-col sm:flex-row justify-between items-start">
            <div>
              <h4 className="font-bold text-lg text-[#0057a8] capitalize">{item.title}</h4>
              <p className="text-gray-600 mt-1">{item.description}</p>
            </div>
            <div className="mt-3 sm:mt-0 text-right">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">
                {item.status}
              </span>
              <p className="text-[10px] text-gray-400 mt-2">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LostFound