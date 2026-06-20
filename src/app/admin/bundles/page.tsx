"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, EyeOff, Trash2, Edit2, Package, Layers } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminBundlesPage() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [itemsCount, setItemsCount] = useState("1");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    setLoading(true);
    if (!supabase) return setLoading(false);
    const { data, error } = await supabase.from("bundles").select("*").order("created_at", { ascending: false });
    if (data) setBundles(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!supabase) return setError("Supabase is not configured.");
    if (!name.trim() || !price || !itemsCount) {
      setError("Name, price, and items count are required.");
      return;
    }
    const { error: insertError } = await supabase.from("bundles").insert({
      name,
      description,
      price: parseFloat(price),
      items_count: parseInt(itemsCount),
      image_url: imageUrl,
      is_active: true
    });
    
    if (insertError) {
      setError(insertError.message);
    } else {
      setShowAddForm(false);
      setName("");
      setDescription("");
      setPrice("");
      setItemsCount("1");
      setImageUrl("");
      fetchBundles();
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    if (!supabase) return;
    await supabase.from("bundles").update({ is_active: !isActive }).eq("id", id);
    fetchBundles();
  };

  const handleDelete = async (id: string) => {
    if (!supabase) return;
    await supabase.from("bundles").delete().eq("id", id);
    setDeleteConfirm(null);
    fetchBundles();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-8 h-8 border-2 border-[var(--accent-1)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-serif">Bundles</h1>
          <p className="text-zinc-500 mt-1 text-sm">{bundles.length} bundles total</p>
        </div>
        <Link
          href="/admin/bundles/add"
          className="flex items-center justify-center gap-2 bg-[var(--accent-1)] text-black font-black uppercase tracking-widest text-xs px-5 py-3 rounded-xl hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Bundle
        </Link>
      </div>

      {bundles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Package className="w-12 h-12 mb-4 text-zinc-700" />
          <p className="text-sm">No bundles found</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#070707] border border-white/5 rounded-2xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-zinc-500 font-medium">Name</th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-zinc-500 font-medium">Items</th>
                <th className="text-left px-5 py-4 text-xs uppercase tracking-wider text-zinc-500 font-medium">Price</th>
                <th className="text-center px-5 py-4 text-xs uppercase tracking-wider text-zinc-500 font-medium">Status</th>
                <th className="text-right px-5 py-4 text-xs uppercase tracking-wider text-zinc-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((bundle) => (
                <tr key={bundle.id} className="hover:bg-white/[0.02] transition-colors border-b border-white/5">
                  <td className="px-5 py-4 text-sm font-semibold text-white">{bundle.name}</td>
                  <td className="px-5 py-4 text-sm text-zinc-400">{bundle.items_count} items</td>
                  <td className="px-5 py-4 text-sm text-[var(--accent-1)]">₹{bundle.price}</td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => handleToggleActive(bundle.id, bundle.is_active)}>
                      {bundle.is_active ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-zinc-500" />}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/bundles/${bundle.id}`} className="p-2 rounded-lg text-zinc-400 hover:text-[var(--accent-1)] hover:bg-white/5" title="Manage Products">
                        <Layers className="w-4 h-4" />
                      </Link>
                      {deleteConfirm === bundle.id ? (
                        <button onClick={() => handleDelete(bundle.id)} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">Confirm</button>
                      ) : (
                        <button onClick={() => setDeleteConfirm(bundle.id)} className="p-2 rounded-lg text-zinc-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
