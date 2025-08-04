import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
    Package, 
    Plus, 
    Search, 
    Filter,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';

interface Medicine {
    id: number;
    name: string;
    generic_name?: string;
    strength?: string;
    form: string;
    manufacturer: {
        name: string;
    };
    general_price: number;
    prescription_required: string;
    is_active: boolean;
    total_stock: number;
    batches: Array<{
        current_quantity: number;
    }>;
}

interface Props {
    medicines: {
        data: Medicine[];
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
    manufacturers: Array<{
        id: number;
        name: string;
    }>;
    forms: string[];
    filters: {
        search?: string;
        form?: string;
        manufacturer_id?: string;
    };
    [key: string]: unknown;
}

export default function MedicinesIndex({ medicines, manufacturers, forms, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedForm, setSelectedForm] = useState(filters.form || '');
    const [selectedManufacturer, setSelectedManufacturer] = useState(filters.manufacturer_id || '');

    const handleFilter = () => {
        router.get('/medicines', {
            search: search || undefined,
            form: selectedForm || undefined,
            manufacturer_id: selectedManufacturer || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedForm('');
        setSelectedManufacturer('');
        router.get('/medicines');
    };

    const deleteMedicine = (medicine: Medicine) => {
        if (confirm(`Are you sure you want to delete ${medicine.name}?`)) {
            router.delete(`/medicines/${medicine.id}`);
        }
    };

    return (
        <>
            <Head title="Medicines" />
            <AppShell>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                💊 Medicines Management
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Manage your medicine inventory and pricing
                            </p>
                        </div>
                        <Link href="/medicines/create">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Medicine
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
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Search</label>
                                    <Input
                                        placeholder="Medicine name or generic name..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Form</label>
                                    <Select value={selectedForm} onValueChange={setSelectedForm}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All forms" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All forms</SelectItem>
                                            {forms.map((form) => (
                                                <SelectItem key={form} value={form}>
                                                    {form}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Manufacturer</label>
                                    <Select value={selectedManufacturer} onValueChange={setSelectedManufacturer}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All manufacturers" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All manufacturers</SelectItem>
                                            {manufacturers.map((manufacturer) => (
                                                <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                                                    {manufacturer.name}
                                                </SelectItem>
                                            ))}
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

                    {/* Medicine List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {medicines.data.map((medicine) => (
                            <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {/* Medicine Info */}
                                        <div>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">{medicine.name}</h3>
                                                    {medicine.generic_name && (
                                                        <p className="text-sm text-gray-600">{medicine.generic_name}</p>
                                                    )}
                                                    <p className="text-sm text-gray-500">
                                                        {medicine.strength} • {medicine.form}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    {!medicine.is_active && (
                                                        <Badge variant="secondary">Inactive</Badge>
                                                    )}
                                                    {medicine.prescription_required === 'yes' && (
                                                        <Badge variant="destructive">Rx</Badge>
                                                    )}
                                                    {medicine.prescription_required === 'controlled' && (
                                                        <Badge variant="destructive">Controlled</Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {medicine.manufacturer.name}
                                            </p>
                                        </div>

                                        {/* Pricing & Stock */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">General Price:</span>
                                                <span className="font-medium">${medicine.general_price.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Stock:</span>
                                                <span className={`font-medium ${medicine.total_stock < 50 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {medicine.total_stock} pcs
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2">
                                            <Link href={`/medicines/${medicine.id}`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={`/medicines/${medicine.id}/edit`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => deleteMedicine(medicine)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {medicines.meta.last_page > 1 && (
                        <div className="flex justify-center space-x-2">
                            {medicines.links.map((link, index: number) => (
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
                    {medicines.data.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No medicines found</h3>
                                <p className="text-gray-600 mb-4">
                                    {Object.values(filters).some(Boolean) 
                                        ? "Try adjusting your filters to see more results."
                                        : "Get started by adding your first medicine."
                                    }
                                </p>
                                <Link href="/medicines/create">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Medicine
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </AppShell>
        </>
    );
}