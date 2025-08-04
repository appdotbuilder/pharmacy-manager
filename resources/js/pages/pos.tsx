import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
    Search, 
    Plus, 
    Minus, 
    Trash2, 
    ShoppingCart, 
    Calculator,
    CreditCard,
    Banknote,
    User
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
    doctor_price: number;
    prescription_price: number;
    units_per_strip: number;
    strips_per_box: number;
    batches: Array<{
        id: number;
        batch_number: string;
        expiry_date: string;
        current_quantity: number;
    }>;
}

interface Customer {
    id: number;
    name: string;
    type: string;
    discount_percentage: number;
}

interface CartItem {
    medicine: Medicine;
    batch_id: number;
    quantity: number;
    unit_type: 'piece' | 'strip' | 'box';
    unit_price: number;
    total_price: number;
}

interface Props {
    medicines: Medicine[];
    customers: Customer[];
    [key: string]: unknown;
}

export default function POS({ medicines, customers }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(medicines);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'credit'>('cash');
    const [paidAmount, setPaidAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Filter medicines based on search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredMedicines(medicines.slice(0, 20)); // Show first 20 by default
        } else {
            const filtered = medicines.filter(medicine =>
                medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                medicine.generic_name?.toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 20);
            setFilteredMedicines(filtered);
        }
    }, [searchQuery, medicines]);

    const getPrice = (medicine: Medicine, unitType: string) => {
        const customerType = selectedCustomer?.type || 'general';
        let basePrice = medicine.general_price;
        
        if (customerType === 'doctor' || customerType === 'clinic') {
            basePrice = medicine.doctor_price;
        } else if (customerType === 'prescription') {
            basePrice = medicine.prescription_price;
        }

        switch (unitType) {
            case 'strip':
                return basePrice * medicine.units_per_strip;
            case 'box':
                return basePrice * medicine.units_per_strip * medicine.strips_per_box;
            default:
                return basePrice;
        }
    };

    const addToCart = (medicine: Medicine, unitType: 'piece' | 'strip' | 'box' = 'piece') => {
        if (!medicine.batches || medicine.batches.length === 0) {
            alert('No stock available for this medicine');
            return;
        }

        // Use the batch with earliest expiry date
        const batch = medicine.batches[0];
        const unitPrice = getPrice(medicine, unitType);
        
        const existingItem = cart.find(item => 
            item.medicine.id === medicine.id && 
            item.batch_id === batch.id && 
            item.unit_type === unitType
        );

        if (existingItem) {
            updateCartItem(cart.indexOf(existingItem), existingItem.quantity + 1);
        } else {
            const newItem: CartItem = {
                medicine,
                batch_id: batch.id,
                quantity: 1,
                unit_type: unitType,
                unit_price: unitPrice,
                total_price: unitPrice
            };
            setCart([...cart, newItem]);
        }
    };

    const updateCartItem = (index: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(index);
            return;
        }

        const updatedCart = [...cart];
        updatedCart[index].quantity = newQuantity;
        updatedCart[index].total_price = updatedCart[index].unit_price * newQuantity;
        setCart(updatedCart);
    };

    const removeFromCart = (index: number) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
        const discountPercentage = selectedCustomer?.discount_percentage || 0;
        const discountAmount = (subtotal * discountPercentage) / 100;
        const total = subtotal - discountAmount;
        
        return {
            subtotal: subtotal,
            discountAmount: discountAmount,
            total: total
        };
    };

    const totals = calculateTotals();
    const changeAmount = paidAmount ? Math.max(0, parseFloat(paidAmount) - totals.total) : 0;

    const processSale = async () => {
        if (cart.length === 0) {
            alert('Cart is empty');
            return;
        }

        if (paymentMethod !== 'credit' && (!paidAmount || parseFloat(paidAmount) < totals.total)) {
            alert('Insufficient payment amount');
            return;
        }

        setIsProcessing(true);

        const saleData = {
            customer_id: selectedCustomer?.id || null,
            items: cart.map(item => ({
                medicine_id: item.medicine.id,
                batch_id: item.batch_id,
                quantity: item.quantity,
                unit_type: item.unit_type,
                unit_price: item.unit_price,
                total_price: item.total_price
            })),
            subtotal: totals.subtotal,
            discount_amount: totals.discountAmount,
            total_amount: totals.total,
            paid_amount: paymentMethod === 'credit' ? 0 : parseFloat(paidAmount),
            change_amount: paymentMethod === 'credit' ? 0 : changeAmount,
            payment_method: paymentMethod
        };

        try {
            const response = await fetch('/api/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify(saleData)
            });

            const result = await response.json();

            if (result.success) {
                alert(`Sale completed successfully! Invoice: ${result.invoice_number}`);
                // Reset form
                setCart([]);
                setSelectedCustomer(null);
                setPaidAmount('');
                setPaymentMethod('cash');
                
                // Optionally redirect to sales page or print receipt
                router.visit(`/sales/${result.sale_id}`);
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert('Error processing sale. Please try again.');
            console.error('Sale error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Head title="Point of Sale" />
            <AppShell>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            🛒 Point of Sale
                        </h1>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setCart([])}>
                                Clear Cart
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Medicine Search & Selection */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Search */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Search className="h-5 w-5" />
                                        Search Medicines
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Input
                                        placeholder="Search by medicine name or generic name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </CardContent>
                            </Card>

                            {/* Medicine Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredMedicines.map((medicine) => (
                                    <Card key={medicine.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <div>
                                                    <h3 className="font-semibold">{medicine.name}</h3>
                                                    {medicine.generic_name && (
                                                        <p className="text-sm text-gray-600">{medicine.generic_name}</p>
                                                    )}
                                                    <p className="text-sm text-gray-500">
                                                        {medicine.strength} • {medicine.form} • {medicine.manufacturer.name}
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            ${getPrice(medicine, 'piece').toFixed(2)}/pc
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Stock: {medicine.batches.reduce((sum, batch) => sum + batch.current_quantity, 0)} pcs
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => addToCart(medicine, 'piece')}
                                                            disabled={medicine.batches.length === 0}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {medicine.batches.length > 0 && (
                                                    <div className="text-xs text-gray-500">
                                                        Next expiry: {new Date(medicine.batches[0].expiry_date).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Cart & Checkout */}
                        <div className="space-y-4">
                            {/* Customer Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Customer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Select
                                        value={selectedCustomer?.id.toString() || ''}
                                        onValueChange={(value) => {
                                            const customer = customers.find(c => c.id.toString() === value);
                                            setSelectedCustomer(customer || null);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select customer (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Walk-in Customer</SelectItem>
                                            {customers.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                                    {customer.name} ({customer.type})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>

                            {/* Cart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5" />
                                        Cart ({cart.length} items)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {cart.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between border-b pb-2">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.medicine.name}</p>
                                                    <p className="text-xs text-gray-600">
                                                        ${item.unit_price.toFixed(2)} × {item.quantity} {item.unit_type}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateCartItem(index, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateCartItem(index, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => removeFromCart(index)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {cart.length === 0 && (
                                            <p className="text-gray-500 text-center py-8">Cart is empty</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Totals */}
                            {cart.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calculator className="h-5 w-5" />
                                            Order Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>${totals.subtotal.toFixed(2)}</span>
                                        </div>
                                        {totals.discountAmount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount ({selectedCustomer?.discount_percentage}%):</span>
                                                <span>-${totals.discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total:</span>
                                            <span>${totals.total.toFixed(2)}</span>
                                        </div>

                                        {/* Payment */}
                                        <div className="space-y-3 pt-4">
                                            <div>
                                                <label className="text-sm font-medium">Payment Method</label>
                                                <Select
                                                    value={paymentMethod}
                                                    onValueChange={(value: 'cash' | 'card' | 'credit') => setPaymentMethod(value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="cash">
                                                            <div className="flex items-center gap-2">
                                                                <Banknote className="h-4 w-4" />
                                                                Cash
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="card">
                                                            <div className="flex items-center gap-2">
                                                                <CreditCard className="h-4 w-4" />
                                                                Card
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="credit">Credit</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {paymentMethod !== 'credit' && (
                                                <div>
                                                    <label className="text-sm font-medium">Amount Paid</label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={paidAmount}
                                                        onChange={(e) => setPaidAmount(e.target.value)}
                                                        placeholder="0.00"
                                                    />
                                                    {changeAmount > 0 && (
                                                        <p className="text-sm text-green-600 mt-1">
                                                            Change: ${changeAmount.toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <Button
                                                className="w-full"
                                                size="lg"
                                                onClick={processSale}
                                                disabled={isProcessing || cart.length === 0}
                                            >
                                                {isProcessing ? 'Processing...' : 'Complete Sale'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </AppShell>
        </>
    );
}