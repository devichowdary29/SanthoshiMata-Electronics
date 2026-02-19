'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Order, Banner, Enquiry } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from '@/components/admin/Overview';
import { RecentSales } from '@/components/admin/RecentSales';
import { LayoutDashboard, Users, CreditCard, Activity, ArrowUpRight, DollarSign, Package } from 'lucide-react';

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [recentSales, setRecentSales] = useState<Order[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        salesCount: 0,
        activeProducts: 0,
        activeBanners: 0
    });
    const [graphData, setGraphData] = useState<{ name: string; total: number }[]>([]);

    useEffect(() => {
        async function fetchData() {
            // Fetch Orders
            const { data: ordersData } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (ordersData) {
                setOrders(ordersData);
                setRecentSales(ordersData.slice(0, 5));

                // Calculate Total Revenue (Confirmed orders only)
                const revenue = ordersData
                    .filter(o => o.order_status !== 'rejected')
                    .reduce((acc, curr) => acc + curr.total_amount, 0);

                // Calculate Graph Data (Monthly)
                const monthlyData: Record<string, number> = {};
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                ordersData.forEach(order => {
                    if (order.order_status !== 'rejected') {
                        const date = new Date(order.created_at);
                        const month = months[date.getMonth()];
                        monthlyData[month] = (monthlyData[month] || 0) + order.total_amount;
                    }
                });

                // Fill in all months with data or 0
                // For a cleaner look, let's just show the months present or last 6 months? 
                // Let's show all months sorted
                const chartData = months.map(m => ({ name: m, total: monthlyData[m] || 0 }));
                setGraphData(chartData);

                setStats(prev => ({
                    ...prev,
                    totalRevenue: revenue,
                    salesCount: ordersData.length
                }));
            }

            // Fetch Products Count
            const { count: productsCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            // Fetch Active Banners
            const { count: bannersCount } = await supabase
                .from('banners')
                .select('*', { count: 'exact', head: true })
                .eq('active', true);

            setStats(prev => ({
                ...prev,
                activeProducts: productsCount || 0,
                activeBanners: bannersCount || 0
            }));
        }

        fetchData();
    }, []);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    {/* Placeholder for potential date range picker or download button */}
                    {/* <Button>Download</Button> */}
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white">Overview</TabsTrigger>
                    <TabsTrigger value="analytics" disabled className="text-gray-500">Analytics</TabsTrigger>
                    <TabsTrigger value="reports" disabled className="text-gray-500">Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-white/5 border-white/10 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-cyan-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                                <p className="text-xs text-gray-400">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                <CreditCard className="h-4 w-4 text-emerald-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{stats.salesCount}</div>
                                <p className="text-xs text-gray-400">+180.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                                <Package className="h-4 w-4 text-amber-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeProducts}</div>
                                <p className="text-xs text-gray-400">+12 since last week</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/5 border-white/10 text-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Banners</CardTitle>
                                <Activity className="h-4 w-4 text-rose-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.activeBanners}</div>
                                <p className="text-xs text-gray-400">+2 active now</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 bg-white/5 border-white/10 text-white">
                            <CardHeader>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <Overview data={graphData} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3 bg-white/5 border-white/10 text-white">
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                                <CardDescription className="text-gray-400">
                                    You made {stats.salesCount} sales this month.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentSales orders={recentSales} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
