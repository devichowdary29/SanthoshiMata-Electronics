'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

const BRANDS = ['Sony', 'Samsung', 'LG', 'Mi', 'OnePlus', 'TCL', 'Speedcon'];
const SCREEN_SIZES = ['32"', '43"', '50"', '55"', '65"', '75"'];
const DISPLAY_TYPES = ['LED', 'OLED', 'QLED'];
const STOCK_OPTIONS = [
    { value: 'available', label: 'Available Today', color: 'bg-emerald-500/20 text-emerald-400' },
    { value: 'out_of_stock', label: 'Out of Stock', color: 'bg-red-500/20 text-red-400' },
    { value: 'limited', label: 'Limited Pieces', color: 'bg-amber-500/20 text-amber-400' },
];

const emptyProduct: {
    name: string; brand: string; screen_size: string; display_type: string;
    price: number; emi_available: boolean; specs: string; warranty_info: string;
    stock_status: 'available' | 'out_of_stock' | 'limited'; image_url: string;
} = {
    name: '', brand: 'Sony', screen_size: '55"', display_type: 'LED',
    price: 0, emi_available: false, specs: '', warranty_info: '', stock_status: 'available', image_url: '',
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form, setForm] = useState(emptyProduct);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => { fetchProducts(); }, []);

    async function fetchProducts() {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_archived', false) // Only fetch active products
            .order('created_at', { ascending: false });
        if (data) setProducts(data);
    }

    useEffect(() => {
        // Real-time subscription for admin panel
        const channel = supabase
            .channel('admin-products-realtime')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'products'
            }, (payload) => {
                // If it's a direct stock update from THIS client, we might have handled it optimistically
                // But generally safer to just re-fetch or merge
                // For simplicity and correctness:
                fetchProducts();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    function showToast(msg: string, type: 'success' | 'error' = 'success') {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }

    function openAdd() {
        setEditing(null);
        setForm(emptyProduct);
        setImageFile(null);
        setShowModal(true);
    }

    function openEdit(product: Product) {
        setEditing(product);
        setForm({
            name: product.name, brand: product.brand, screen_size: product.screen_size,
            display_type: product.display_type, price: product.price, emi_available: product.emi_available,
            specs: product.specs || '', warranty_info: product.warranty_info || '',
            stock_status: product.stock_status, image_url: product.image_url || '',
        });
        setImageFile(null);
        setShowModal(true);
    }

    function getStorageFileName(url: string): string | null {
        if (!url || !url.startsWith('http')) return null;
        const parts = url.split('/product-images/');
        return parts.length > 1 ? parts[parts.length - 1] : null;
    }

    async function deleteFromStorage(url: string) {
        const fileName = getStorageFileName(url);
        if (fileName) {
            await supabase.storage.from('product-images').remove([fileName]);
        }
    }

    async function uploadImage(file: File): Promise<string> {
        const ext = file.name.split('.').pop() || 'png';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
        const { error } = await supabase.storage.from('product-images').upload(fileName, file);
        if (error) throw error;
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        return data.publicUrl;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = form.image_url;
            if (imageFile) {
                // Delete old image from storage when replacing during edit
                if (editing && editing.image_url) {
                    await deleteFromStorage(editing.image_url);
                }
                imageUrl = await uploadImage(imageFile);
            }

            const payload = { ...form, image_url: imageUrl };

            if (editing) {
                const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
                if (error) {
                    console.error('Update error:', error);
                    throw error;
                }
                showToast('Product updated successfully!');
            } else {
                const { error } = await supabase.from('products').insert(payload);
                if (error) {
                    console.error('Insert error:', error);
                    throw error;
                }
                showToast('Product added successfully!');
            }

            setShowModal(false);
            fetchProducts();
        } catch {
            showToast('Something went wrong. Please try again.', 'error');
        }
        setLoading(false);
    }

    async function handleDelete(id: string) {
        const productToDelete = products.find(p => p.id === id);

        // Try hard delete first
        const { error } = await supabase.from('products').delete().eq('id', id);

        if (error) {
            console.error('Delete error:', error);

            // Check for foreign key constraint violation (Postgres code 23503)
            if (error.code === '23503') {
                const confirmed = window.confirm('This product is part of existing orders and cannot be permanently deleted. Do you want to archive it instead?');
                if (confirmed) {
                    const { error: archiveError } = await supabase
                        .from('products')
                        .update({ is_archived: true })
                        .eq('id', id);

                    if (archiveError) {
                        showToast(`Failed to archive product: ${archiveError.message}`, 'error');
                    } else {
                        showToast('Product archived successfully');
                        fetchProducts();
                    }
                }
            } else {
                showToast(`Failed to delete product: ${error.message}`, 'error');
            }
        } else {
            console.log('Product deleted, now submitting storage delete for', productToDelete?.image_url);
            if (productToDelete?.image_url) {
                await deleteFromStorage(productToDelete.image_url);
            }
            showToast('Product deleted');
            fetchProducts();
        }
        setDeleteId(null);
    }

    async function quickStockUpdate(id: string, newStatus: string) {
        // Optimistic update
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_status: newStatus as Product['stock_status'] } : p));

        console.log(`Updating stock for ${id} to ${newStatus}`);
        const { error } = await supabase.from('products').update({ stock_status: newStatus }).eq('id', id);

        if (error) {
            console.error('Stock update error:', error);
            showToast(`Failed to update stock: ${error.message}`, 'error');
            // Revert by fetching fresh data
            fetchProducts();
        } else {
            showToast('Stock status updated!');
        }
    }

    async function quickPriceUpdate(id: string, newPrice: number) {
        if (newPrice <= 0) return;
        const { error } = await supabase.from('products').update({ price: newPrice }).eq('id', id);
        if (error) {
            showToast('Failed to update price', 'error');
        } else {
            showToast('Price updated!');
            fetchProducts();
        }
    }

    return (
        <div>
            {/* Toast */}
            {toast && (
                <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg border text-sm font-medium shadow-xl animate-fade-in-up ${toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/30 text-red-400'
                    }`}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Products</h1>
                    <p className="text-gray-400 text-sm mt-1">{products.length} products total</p>
                </div>
                <button
                    onClick={openAdd}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-[#1e2a4a]/40 rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">Product</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">Brand</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">Size</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">Price (₹)</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">Stock</th>
                                <th className="text-right text-gray-400 font-medium px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {products.map((p, index) => (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                                    {p.image_url && p.image_url.startsWith('http') ? (
                                                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <span className="text-white font-medium text-xs line-clamp-2 max-w-[200px]">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">{p.brand}</td>
                                        <td className="px-4 py-3 text-gray-300">{p.screen_size}</td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="number"
                                                defaultValue={p.price}
                                                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs w-24 focus:outline-none focus:border-cyan-500/50"
                                                onBlur={(e) => {
                                                    const val = Number(e.target.value);
                                                    if (val !== p.price && val > 0) quickPriceUpdate(p.id, val);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        (e.target as HTMLInputElement).blur();
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={p.stock_status}
                                                onChange={(e) => quickStockUpdate(p.id, e.target.value)}
                                                className={`text-xs rounded-full px-2 py-1 border-0 focus:outline-none cursor-pointer ${STOCK_OPTIONS.find(s => s.value === p.stock_status)?.color || ''
                                                    } bg-opacity-20`}
                                            >
                                                {STOCK_OPTIONS.map(s => (
                                                    <option key={s.value} value={s.value} className="bg-[#1e2a4a] text-white">{s.label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-cyan-400 transition-colors p-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => setDeleteId(p.id)} className="text-gray-400 hover:text-red-400 transition-colors p-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-sm">No products yet. Add your first product!</div>
                )}
            </div>

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
                    <div className="relative bg-[#1e2a4a] border border-white/10 rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Product?</h3>
                        <p className="text-gray-400 text-sm mb-5">This action cannot be undone. The product will be permanently removed.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/15 transition-all">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-500 transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-[#1e2a4a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#1e2a4a] px-6 py-4 border-b border-white/10 flex items-center justify-between z-10">
                            <h2 className="text-lg font-bold text-white">{editing ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1 font-medium">Product Name *</label>
                                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1 font-medium">Brand *</label>
                                    <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50">
                                        {BRANDS.map(b => <option key={b} value={b} className="bg-[#1e2a4a]">{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1 font-medium">Screen Size *</label>
                                    <select value={form.screen_size} onChange={(e) => setForm({ ...form, screen_size: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50">
                                        {SCREEN_SIZES.map(s => <option key={s} value={s} className="bg-[#1e2a4a]">{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1 font-medium">Display Type *</label>
                                    <select value={form.display_type} onChange={(e) => setForm({ ...form, display_type: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50">
                                        {DISPLAY_TYPES.map(d => <option key={d} value={d} className="bg-[#1e2a4a]">{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1 font-medium">Price (₹) *</label>
                                    <input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1 font-medium">Stock Status</label>
                                    <select value={form.stock_status} onChange={(e) => setForm({ ...form, stock_status: e.target.value as 'available' | 'out_of_stock' | 'limited' })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50">
                                        {STOCK_OPTIONS.map(s => <option key={s.value} value={s.value} className="bg-[#1e2a4a]">{s.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.emi_available} onChange={(e) => setForm({ ...form, emi_available: e.target.checked })}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/30" />
                                    <span className="text-sm text-gray-300">EMI Available</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1 font-medium">Specifications</label>
                                <textarea value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} rows={2} placeholder="4K UHD | HDR10 | Smart TV | Dolby Audio"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50 resize-none" />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1 font-medium">Warranty Info</label>
                                <input type="text" value={form.warranty_info} onChange={(e) => setForm({ ...form, warranty_info: e.target.value })} placeholder="2 Years Manufacturer Warranty"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1 font-medium">Product Image {editing ? '(optional — leave empty to keep current)' : ''}</label>
                                {/* Current image preview */}
                                {form.image_url && form.image_url.startsWith('http') && !imageFile && (
                                    <div className="mb-2 relative inline-block">
                                        <img src={form.image_url} alt="Current" className="w-24 h-24 object-cover rounded-lg border border-white/10" />
                                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">Current</span>
                                    </div>
                                )}
                                {/* New file preview */}
                                {imageFile && (
                                    <div className="mb-2 relative inline-block">
                                        <img src={URL.createObjectURL(imageFile)} alt="New" className="w-24 h-24 object-cover rounded-lg border border-cyan-500/30" />
                                        <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">New</span>
                                    </div>
                                )}
                                <input id="product-file-input" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-cyan-500/20 file:text-cyan-400 file:text-xs file:font-medium file:cursor-pointer" />
                                {imageFile && (
                                    <button type="button" onClick={() => {
                                        setImageFile(null);
                                        const fileInput = document.querySelector<HTMLInputElement>('#product-file-input');
                                        if (fileInput) fileInput.value = '';
                                    }}
                                        className="mt-1 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Remove selected image
                                    </button>
                                )}
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50">
                                {loading ? 'Saving...' : (editing ? 'Update Product' : 'Add Product')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
