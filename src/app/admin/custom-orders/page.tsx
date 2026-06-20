"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, Clock, CheckCircle, Package, Send, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function CustomOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const STATUS_COLORS: Record<string, string> = {
    'Pending': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'WhatsApp Sent': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'In Review': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    'Approved': 'text-green-500 bg-green-500/10 border-green-500/20',
    'In Production': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    'Completed': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  };

  const STATUS_OPTIONS = Object.keys(STATUS_COLORS);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("custom_orders")
      .select(`
        *,
        custom_clothing_types(name),
        custom_colors(name, hex_code)
      `)
      .order("created_at", { ascending: false });
      
    if (data) setOrders(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await supabase.from("custom_orders").update({ status: newStatus }).eq("id", id);
    fetchOrders();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-8 h-8 border-2 border-[var(--accent-1)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-serif text-white">Custom Orders</h1>
          <p className="text-zinc-500 mt-1 text-sm">{orders.length} design requests received</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Package className="w-12 h-12 mb-4 text-zinc-700" />
          <p className="text-sm">No custom orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#070707] border border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row gap-6">
              
              {/* Order Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">{order.customer_name}</h3>
                    <p className="text-sm text-zinc-400 mt-1">{order.phone} {order.email && `• ${order.email}`}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Status</p>
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border appearance-none cursor-pointer ${STATUS_COLORS[order.status] || STATUS_COLORS['Pending']}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-black text-white">{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-white/5 py-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Item</p>
                    <p className="text-sm text-white">{order.custom_clothing_types?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Color</p>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: order.custom_colors?.hex_code }} />
                      <p className="text-sm text-white">{order.custom_colors?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Size & Qty</p>
                    <p className="text-sm text-white">{order.size} (Qty: {order.quantity})</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Placement</p>
                    <p className="text-sm text-white">{order.placement}</p>
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Notes</p>
                    <p className="text-sm text-zinc-300 italic">"{order.notes}"</p>
                  </div>
                )}
                
                <p className="text-[10px] text-zinc-600">Ordered on: {new Date(order.created_at).toLocaleString()}</p>
              </div>

              {/* Design Image */}
              <div className="w-full lg:w-48 xl:w-64 flex flex-col items-center justify-center gap-3">
                <div className="w-full aspect-square bg-black border border-white/10 rounded-xl relative overflow-hidden group">
                  <Image src={order.design_url} alt="Design" fill className="object-contain p-2" />
                  <a 
                    href={order.design_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-6 h-6 text-white" />
                  </a>
                </div>
                <a 
                  href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=Hello ${order.customer_name}, we are reviewing your custom order...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black font-bold uppercase tracking-widest text-[10px] px-4 py-2.5 rounded-lg transition-colors border border-green-500/20"
                >
                  <Send className="w-3 h-3" /> Message Customer
                </a>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
