import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
    Receipt, 
    Plus, 
    Search, 
    Filter,
    Eye,
    Calendar,
    User,
    DollarSign
} from 'lucide-react';

interface Sale {
    id: number;
    invoice_number: string;
    customer?: {
        name: string;
        type: string;
    };
    user: {
        name: string;
    };
    total_amount: number;
    payment_method: string;
    status: string;
    created_at: string;
    items_count: number;
}

interface Props {
    sales: {
        data: Sale[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    customers: Array<{
        id: number;
        name: string;
    }>;
    filters: {
        from_date?: string;
        to_date?: string;
        customer_id?: string;
        status?: string;
    };
    [key: string]: unknown;
}

export default function SalesIndex({ sales, customers, filters }: Props) {
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [selectedCustomer, setSelectedCustomer] = useState(filters.customer_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get('/sales', {
            from_date: fromDate || undefined,
            to_date: toDate || undefined,
            customer_id: selectedCustomer || undefined,
            status: selectedStatus || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setFromDate('');
        setToDate('');
        setSelectedCustomer('');
        setSelectedStatus('');
        router.get('/sales');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentMethodColor = (method: string) => {
        switch (method) {
            case 'cash':
                return 'bg-green-100 text-green-800';
            case 'card':
                return 'bg-blue-100 text-blue-800';
            case 'credit':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Head title="Sales" />
            <AppShell>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                🧾 Sales History
                            </h1>
                            <p className="text-gray-600 mt-1">
                                View and manage all sales transactions
                            </p>
                        </div>
                        <Link href="/pos">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Sale
                            </Button>
                        </Link>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">From Date</label>
                                    <Input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">To Date</label>
                                    <Input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Customer</label>
                                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All customers" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All customers</SelectItem>
                                            {customers.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                                    {customer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Status</label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All statuses</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button onClick={handleFilter}>
                                        <Search className="h-4 w-4 mr-2" />
                                        Search
                                    </Button>
                                    <Button variant="outline" onClick={clearFilters}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sales List */}
                    <div className="grid grid-cols-1 gap-4">
                        {sales.data.map((sale) => (
                            <Card key={sale.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-4">
                                                <h3 className="font-semibold text-lg">{sale.invoice_number}</h3>
                                                <Badge className={getStatusColor(sale.status)}>
                                                    {sale.status}
                                                </Badge>
                                                <Badge className={getPaymentMethodColor(sale.payment_method)}>
                                                    {sale.payment_method}
                                                </Badge>
                                            </div>
                                            
                                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-4 w-4" />
                                                    {sale.customer?.name || 'Walk-in Customer'}
                                                    {sale.customer?.type && (
                                                        <span className="text-xs text-gray-500">({sale.customer.type})</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(sale.created_at).toLocaleDateString()}
                                                </div>
                                                <div>
                                                    By: {sale.user.name}
                                                </div>
                                                <div>
                                                    {sale.items_count} item(s)
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right space-y-2">
                                            <div className="flex items-center gap-1 text-2xl font-bold text-green-600">
                                                <DollarSign className="h-6 w-6" />
                                                {sale.total_amount.toFixed(2)}
                                            </div>
                                            <Link href={`/sales/${sale.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {sales.meta.last_page > 1 && (
                        <div className="flex justify-center space-x-2">
                            {sales.links.map((link, index: number) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => link.url && router.visit(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {sales.data.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No sales found</h3>
                                <p className="text-gray-600 mb-4">
                                    {Object.values(filters).some(Boolean) 
                                        ? "Try adjusting your filters to see more results."
                                        : "No sales have been made yet."
                                    }
                                </p>
                                <Link href="/pos">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Make First Sale
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Summary Stats */}
                    {sales.data.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold">
                                            {sales.data.length}
                                        </p>
                                        <p className="text-sm text-gray-600">Total Sales</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">
                                            ${sales.data.reduce((sum, sale) => sum + sale.total_amount, 0).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600">Total Revenue</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            ${(sales.data.reduce((sum, sale) => sum + sale.total_amount, 0) / sales.data.length).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600">Average Sale</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </AppShell>
        </>
    );
}