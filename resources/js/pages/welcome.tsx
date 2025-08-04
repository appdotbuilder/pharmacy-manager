import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
    Package, 
    ShoppingCart, 
    TrendingUp, 
    AlertTriangle,
    Clock,
    DollarSign,
    Users,
    Activity,
    Plus,
    Search,
    BarChart,
    FileText,
    Settings
} from 'lucide-react';

interface Props {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    stats?: {
        totalMedicines: number;
        totalStock: number;
        todaySales: number;
        expiredBatches: number;
        nearExpiryBatches: number;
    };
    recentSales?: Array<{
        id: number;
        invoice_number: string;
        total_amount: number;
        status: string;
        customer?: { name: string };
    }>;
    lowStockMedicines?: Array<{
        id: number;
        name: string;
        total_stock: number;
        manufacturer?: { name: string };
    }>;
    expiringSoon?: Array<{
        id: number;
        batch_number: string;
        expiry_date: string;
        current_quantity: number;
        medicine?: { name: string };
    }>;
    monthlySales?: Array<{
        month: string;
        sales: number;
    }>;
    [key: string]: unknown;
}

export default function Welcome({ auth, stats, recentSales, lowStockMedicines, expiringSoon, monthlySales }: Props) {
    const isAuthenticated = !!auth?.user;

    if (!isAuthenticated) {
        return (
            <>
                <Head title="Pharmacy Management System" />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="container mx-auto px-4 py-16">
                        {/* Hero Section */}
                        <div className="text-center mb-16">
                            <div className="flex justify-center mb-6">
                                <div className="bg-blue-600 text-white p-4 rounded-full">
                                    <Package className="h-12 w-12" />
                                </div>
                            </div>
                            <h1 className="text-5xl font-bold text-gray-900 mb-6">
                                💊 PharmaCare Management
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                Complete pharmacy management solution with advanced inventory tracking, 
                                flexible pricing, batch management, and comprehensive reporting for modern pharmacies.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Link href="/login">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                        Login to Dashboard
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="lg" variant="outline">
                                        Create Account
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-6 w-6 text-blue-600" />
                                        <CardTitle>Medicine Management</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Complete medicine database with manufacturer details, usage instructions, 
                                        and multi-tier pricing for different customer types.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-6 w-6 text-green-600" />
                                        <CardTitle>Batch System</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Advanced batch tracking with expiry date monitoring, automatic alerts, 
                                        and FIFO inventory management to minimize waste.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-6 w-6 text-purple-600" />
                                        <CardTitle>Flexible Pricing</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Three-tier pricing system supporting general customers, doctors/clinics, 
                                        and prescription-based pricing with automatic calculations.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <ShoppingCart className="h-6 w-6 text-orange-600" />
                                        <CardTitle>Point of Sale</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Intuitive POS interface with barcode scanning, multiple payment methods, 
                                        and support for piece, strip, and box-level sales.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-6 w-6 text-red-600" />
                                        <CardTitle>Consignment Management</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Track consigned inventory separately, manage supplier relationships, 
                                        and handle complex procurement scenarios.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <BarChart className="h-6 w-6 text-indigo-600" />
                                        <CardTitle>Comprehensive Reports</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Detailed reporting for sales, stock levels, financial overview, 
                                        expired items, and business analytics.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* System Highlights */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                            <h2 className="text-3xl font-bold text-center mb-8">🏥 Key System Highlights</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-green-600" />
                                        Advanced Features
                                    </h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>✓ Multi-unit sales (piece, strip, box)</li>
                                        <li>✓ Automatic expiry date tracking</li>
                                        <li>✓ Customer credit management</li>
                                        <li>✓ Supplier relationship management</li>
                                        <li>✓ Real-time inventory updates</li>
                                        <li>✓ Prescription requirement tracking</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-blue-600" />
                                        System Benefits
                                    </h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>✓ Reduce medicine waste and losses</li>
                                        <li>✓ Improve customer service speed</li>
                                        <li>✓ Accurate financial tracking</li>
                                        <li>✓ Automated low stock alerts</li>
                                        <li>✓ Regulatory compliance support</li>
                                        <li>✓ Complete offline functionality</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Call to Action */}
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Pharmacy?</h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Join thousands of pharmacies using PharmaCare Management to streamline operations and improve patient care.
                            </p>
                            <Link href="/register">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                    Get Started Today
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Authenticated dashboard
    return (
        <>
            <Head title="Pharmacy Dashboard" />
            <AppShell>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                💊 PharmaCare Dashboard
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Welcome back! Here's what's happening in your pharmacy today.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/pos">
                                <Button className="bg-green-600 hover:bg-green-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    New Sale
                                </Button>
                            </Link>
                            <Link href="/medicines">
                                <Button variant="outline">
                                    <Package className="h-4 w-4 mr-2" />
                                    Medicines
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalMedicines || 0}</div>
                                <p className="text-xs text-muted-foreground">Active in inventory</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.totalStock?.toLocaleString() || 0}</div>
                                <p className="text-xs text-muted-foreground">Pieces in stock</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${stats?.todaySales?.toFixed(2) || '0.00'}</div>
                                <p className="text-xs text-muted-foreground">Revenue today</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Expired Batches</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{stats?.expiredBatches || 0}</div>
                                <p className="text-xs text-muted-foreground">Needs attention</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Near Expiry</CardTitle>
                                <Clock className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">{stats?.nearExpiryBatches || 0}</div>
                                <p className="text-xs text-muted-foreground">Within 30 days</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Sales */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Recent Sales
                                </CardTitle>
                                <CardDescription>Latest transactions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentSales?.slice(0, 5).map((sale) => (
                                        <div key={sale.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{sale.invoice_number}</p>
                                                <p className="text-sm text-gray-600">
                                                    {sale.customer?.name || 'Walk-in Customer'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">${sale.total_amount}</p>
                                                <Badge variant={sale.status === 'completed' ? 'default' : 'secondary'}>
                                                    {sale.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {(!recentSales || recentSales.length === 0) && (
                                        <p className="text-gray-500 text-center py-4">No recent sales</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Low Stock Alert */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                                    Low Stock Alert
                                </CardTitle>
                                <CardDescription>Medicines running low</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {lowStockMedicines?.slice(0, 5).map((medicine) => (
                                        <div key={medicine.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{medicine.name}</p>
                                                <p className="text-sm text-gray-600">{medicine.manufacturer?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-orange-600">{medicine.total_stock} pcs</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!lowStockMedicines || lowStockMedicines.length === 0) && (
                                        <p className="text-gray-500 text-center py-4">All medicines well stocked</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Expiring Soon */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-red-500" />
                                    Expiring Soon
                                </CardTitle>
                                <CardDescription>Batches expiring within 30 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {expiringSoon?.slice(0, 5).map((batch) => (
                                        <div key={batch.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{batch.medicine?.name}</p>
                                                <p className="text-sm text-gray-600">Batch: {batch.batch_number}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-red-600">
                                                    {new Date(batch.expiry_date).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-600">{batch.current_quantity} pcs</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!expiringSoon || expiringSoon.length === 0) && (
                                        <p className="text-gray-500 text-center py-4">No batches expiring soon</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sales Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    Sales Trend
                                </CardTitle>
                                <CardDescription>Last 6 months performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {monthlySales?.map((month, index: number) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <p className="text-sm font-medium">{month.month}</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20">
                                                    <Progress 
                                                        value={(month.sales / Math.max(...(monthlySales?.map(m => m.sales) || [1]))) * 100} 
                                                        className="h-2"
                                                    />
                                                </div>
                                                <p className="text-sm font-medium w-16 text-right">
                                                    ${month.sales.toFixed(0)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common pharmacy management tasks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Link href="/pos">
                                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                                        <ShoppingCart className="h-6 w-6" />
                                        <span>New Sale</span>
                                    </Button>
                                </Link>
                                <Link href="/medicines/create">
                                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                                        <Plus className="h-6 w-6" />
                                        <span>Add Medicine</span>
                                    </Button>
                                </Link>
                                <Link href="/medicines">
                                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                                        <Search className="h-6 w-6" />
                                        <span>Search Inventory</span>
                                    </Button>
                                </Link>
                                <Link href="/sales">
                                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                                        <FileText className="h-6 w-6" />
                                        <span>View Reports</span>
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppShell>
        </>
    );
}