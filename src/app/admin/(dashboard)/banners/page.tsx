'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Banner } from '@/lib/types';

export default function AdminBannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Edit state
    const [editing, setEditing] = useState<Banner | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editSubtitle, setEditSubtitle] = useState('');
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => { fetchBanners(); }, []);

    async function fetchBanners() {
        const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false });
        if (data) setBanners(data);
    }

    function showToast(msg: string, type: 'success' | 'error' = 'success') {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }

    /** Extract the file name from a Supabase storage public URL */
    function getStorageFileName(url: string): string | null {
        if (!url || !url.startsWith('http')) return null;
        const parts = url.split('/banners/');
        return parts.length > 1 ? parts[parts.length - 1] : null;
    }

    /** Delete a file from the banners storage bucket */
    async function deleteFromStorage(url: string) {
        const fileName = getStorageFileName(url);
        if (fileName) {
            await supabase.storage.from('banners').remove([fileName]);
        }
    }

    async function uploadToStorage(file: File, prefix: string): Promise<string> {
        const ext = file.name.split('.').pop() || 'png';
        const fileName = `${prefix}_${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('banners').upload(fileName, file);
        if (error) throw error;
        const { data } = supabase.storage.from('banners').getPublicUrl(fileName);
        return data.publicUrl;
    }

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        if (!imageFile) return;
        setUploading(true);

        try {
            const publicUrl = await uploadToStorage(imageFile, 'banner');

            const { error } = await supabase.from('banners').insert({
                image_url: publicUrl,
                title: title || null,
                subtitle: subtitle || null,
                active: true,
            });
            if (error) throw error;

            showToast('Banner uploaded successfully!');
            setImageFile(null);
            setTitle('');
            setSubtitle('');
            // Reset file input
            const fileInput = document.querySelector<HTMLInputElement>('#banner-file-input');
            if (fileInput) fileInput.value = '';
            fetchBanners();
        } catch {
            showToast('Upload failed. Please try again.', 'error');
        }
        setUploading(false);
    }

    function openEdit(banner: Banner) {
        setEditing(banner);
        setEditTitle(banner.title || '');
        setEditSubtitle(banner.subtitle || '');
        setEditImageFile(null);
    }

    async function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!editing) return;
        setEditLoading(true);

        try {
            let imageUrl = editing.image_url;
            if (editImageFile) {
                // Delete old image from storage before uploading new one
                if (editing.image_url) {
                    await deleteFromStorage(editing.image_url);
                }
                imageUrl = await uploadToStorage(editImageFile, 'banner');
            }

            const { error } = await supabase.from('banners').update({
                title: editTitle || null,
                subtitle: editSubtitle || null,
                image_url: imageUrl,
            }).eq('id', editing.id);
            if (error) throw error;

            showToast('Banner updated successfully!');
            setEditing(null);
            fetchBanners();
        } catch {
            showToast('Update failed. Please try again.', 'error');
        }
        setEditLoading(false);
    }

    async function toggleActive(id: string, currentActive: boolean) {
        const { error } = await supabase.from('banners').update({ active: !currentActive }).eq('id', id);
        if (error) {
            showToast('Failed to update', 'error');
        } else {
            showToast(`Banner ${!currentActive ? 'activated' : 'deactivated'}`);
            fetchBanners();
        }
    }

    async function handleDelete(id: string) {
        // Find the banner to get its image URL for storage cleanup
        const bannerToDelete = banners.find(b => b.id === id);
        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (error) {
            showToast('Failed to delete banner', 'error');
        } else {
            // Delete image from storage to keep it clean
            if (bannerToDelete?.image_url) {
                await deleteFromStorage(bannerToDelete.image_url);
            }
            showToast('Banner deleted');
            fetchBanners();
        }
        setDeleteId(null);
    }

    return (
        <div>
            {/* Toast */}
            {toast && (
                <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg border text-sm font-medium shadow-xl ${toast.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-red-500/20 border-red-500/30 text-red-400'
                    }`}>{toast.msg}</div>
            )}

            <h1 className="text-2xl font-bold text-white mb-6">Banners</h1>

            {/* Upload Form */}
            <div className="bg-[#1e2a4a]/40 rounded-xl border border-white/10 p-6 mb-8">
                <h2 className="text-white font-semibold mb-4">Upload New Banner</h2>
                <p className="text-gray-500 text-xs mb-3">Images are uploaded at <span className="text-cyan-400 font-medium">full resolution</span> — no compression. The banner will dynamically fit any screen size.</p>
                <form onSubmit={handleUpload} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Title (optional)</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summer Sale!"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Subtitle (optional)</label>
                            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Up to 50% off"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                        </div>
                    </div>
                    {/* Preview */}
                    {imageFile && (
                        <div className="rounded-lg overflow-hidden border border-white/10 max-w-md">
                            <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full aspect-[16/5] object-cover" />
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <input id="banner-file-input" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-cyan-500/20 file:text-cyan-400 file:text-xs file:font-medium file:cursor-pointer" />
                        {imageFile && (
                            <button type="button" onClick={() => {
                                setImageFile(null);
                                const fileInput = document.querySelector<HTMLInputElement>('#banner-file-input');
                                if (fileInput) fileInput.value = '';
                            }}
                                className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all" title="Remove selected image">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <button type="submit" disabled={!imageFile || uploading}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 hover:from-cyan-400 hover:to-blue-500 transition-all">
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-[#1e2a4a]/40 rounded-xl border border-white/10 overflow-hidden group">
                        {/* Preview */}
                        <div className="aspect-[16/5] bg-gray-800 relative overflow-hidden">
                            {banner.image_url && banner.image_url.startsWith('http') ? (
                                <img src={banner.image_url} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            {/* Status badge */}
                            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${banner.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                {banner.active ? 'Active' : 'Inactive'}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            {banner.title && <p className="text-white font-medium text-sm mb-1">{banner.title}</p>}
                            {banner.subtitle && <p className="text-gray-400 text-xs">{banner.subtitle}</p>}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleActive(banner.id, banner.active)}
                                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${banner.active
                                            ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                            }`}
                                    >
                                        {banner.active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button onClick={() => openEdit(banner)} className="text-gray-400 hover:text-cyan-400 transition-colors p-1" title="Edit">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                                <button onClick={() => setDeleteId(banner.id)} className="text-gray-400 hover:text-red-400 transition-colors p-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {banners.length === 0 && (
                <div className="text-center py-10 text-gray-500 text-sm">No banners uploaded yet.</div>
            )}

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(null)}></div>
                    <div className="relative bg-[#1e2a4a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#1e2a4a] px-6 py-4 border-b border-white/10 flex items-center justify-between z-10">
                            <h2 className="text-lg font-bold text-white">Edit Banner</h2>
                            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            {/* Current image preview */}
                            <div>
                                <label className="block text-xs text-gray-400 mb-2 font-medium">Current Image</label>
                                {editing.image_url && editing.image_url.startsWith('http') && !editImageFile && (
                                    <div className="rounded-lg overflow-hidden border border-white/10">
                                        <img src={editing.image_url} alt="Current banner" className="w-full aspect-[16/5] object-cover" />
                                    </div>
                                )}
                                {editImageFile && (
                                    <div className="rounded-lg overflow-hidden border border-cyan-500/30">
                                        <img src={URL.createObjectURL(editImageFile)} alt="New banner" className="w-full aspect-[16/5] object-cover" />
                                        <div className="bg-cyan-500/10 text-cyan-400 text-xs text-center py-1 font-medium">New image selected</div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1 font-medium">Replace Image (optional)</label>
                                <p className="text-gray-600 text-[10px] mb-1">Full resolution — no compression</p>
                                <input type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-cyan-500/20 file:text-cyan-400 file:text-xs file:font-medium file:cursor-pointer" />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1 font-medium">Title</label>
                                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Banner title"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1 font-medium">Subtitle</label>
                                <input type="text" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} placeholder="Banner subtitle"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50" />
                            </div>

                            <button type="submit" disabled={editLoading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50">
                                {editLoading ? 'Saving...' : 'Update Banner'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
                    <div className="relative bg-[#1e2a4a] border border-white/10 rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Banner?</h3>
                        <p className="text-gray-400 text-sm mb-5">This banner will be permanently removed from the homepage.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/15 transition-all">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-500 transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
