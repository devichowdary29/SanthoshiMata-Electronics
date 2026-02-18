'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

interface Enquiry {
    id: string;
    product_id: string | null;
    name: string;
    phone: string;
    message: string;
    created_at: string;
}

export default function AdminEnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEnquiries() {
            const { data } = await supabase
                .from('enquiries')
                .select('*')
                .order('created_at', { ascending: false });
            if (data) setEnquiries(data);
            setLoading(false);
        }
        fetchEnquiries();
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return enquiries;
        const q = search.toLowerCase();
        return enquiries.filter(
            (e) => e.name.toLowerCase().includes(q) || e.phone.includes(q)
        );
    }, [enquiries, search]);

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    }

    function exportCSV() {
        const headers = ['Name', 'Phone', 'Message', 'Product ID', 'Date'];
        const rows = filtered.map((e) => [
            `"${e.name.replace(/"/g, '""')}"`,
            e.phone,
            `"${e.message.replace(/"/g, '""')}"`,
            e.product_id || '',
            formatDate(e.created_at),
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        downloadFile(csv, 'enquiries.csv', 'text/csv');
    }

    function exportExcel() {
        // Simple HTML table approach for .xls (compatible with Excel)
        let html = '<html><head><meta charset="utf-8"></head><body>';
        html += '<table border="1"><thead><tr>';
        html += '<th>Name</th><th>Phone</th><th>Message</th><th>Product ID</th><th>Date</th>';
        html += '</tr></thead><tbody>';
        filtered.forEach((e) => {
            html += `<tr><td>${e.name}</td><td>${e.phone}</td><td>${e.message}</td><td>${e.product_id || '-'}</td><td>${formatDate(e.created_at)}</td></tr>`;
        });
        html += '</tbody></table></body></html>';
        downloadFile(html, 'enquiries.xls', 'application/vnd.ms-excel');
    }

    function downloadFile(content: string, filename: string, mimeType: string) {
        const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Enquiries</h1>
                    <p className="text-gray-400 text-sm mt-1">{filtered.length} enquir{filtered.length === 1 ? 'y' : 'ies'}</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or phone..."
                            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-sm w-56 focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>

                    {/* Export Buttons */}
                    <button onClick={exportCSV}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        CSV
                    </button>
                    <button onClick={exportExcel}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Excel
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1e2a4a]/40 rounded-xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">#</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">Name</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">Phone</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">Message</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">Product ID</th>
                                <th className="text-left text-gray-400 font-medium px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map((e, i) => (
                                <tr key={e.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3 text-gray-500 text-xs">{i + 1}</td>
                                    <td className="px-4 py-3 text-white font-medium">{e.name}</td>
                                    <td className="px-4 py-3">
                                        <a href={`tel:${e.phone}`} className="text-cyan-400 hover:underline">{e.phone}</a>
                                    </td>
                                    <td className="px-4 py-3 text-gray-300 max-w-xs">
                                        <p className="line-clamp-2 text-xs">{e.message}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{e.product_id ? e.product_id.slice(0, 8) + '...' : '-'}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(e.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loading && (
                    <div className="text-center py-10 text-gray-500 text-sm">Loading enquiries...</div>
                )}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        {search ? 'No enquiries match your search.' : 'No enquiries received yet.'}
                    </div>
                )}
            </div>
        </div>
    );
}
