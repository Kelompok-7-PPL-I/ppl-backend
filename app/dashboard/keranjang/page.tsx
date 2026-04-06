import Link from 'next/link';

export default function CartPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm">
            <Link href="/dashboard" className="text-red-500 font-bold mb-6 inline-block">Back</Link>
            
            {/* Cart Item */}
            {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 border border-gray-200 p-4 rounded-xl mb-4 shadow-sm">
                <input type="checkbox" className="w-5 h-5 accent-green-700" defaultChecked />
                <div className="w-32 h-24 bg-gray-200 rounded-lg"></div> {/* Image Placeholder */}
                
                <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">Jagung Susu Keju</h3>
                <div className="flex items-center gap-4">
                    {/* Plus Minus */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                    <button className="px-3 py-1 text-gray-500 hover:bg-gray-100">-</button>
                    <span className="px-3 py-1 text-sm">1</span>
                    <button className="px-3 py-1 text-gray-500 hover:bg-gray-100">+</button>
                    </div>
                    <p className="text-gray-400 text-sm">Rp 10.000</p>
                </div>
                </div>
            </div>
            ))}

            {/* Footer Checkout */}
            <div className="flex justify-between items-center mt-8 border-t pt-6">
            <div className="flex items-center gap-2">
                <input type="checkbox" className="w-5 h-5 accent-green-700" />
                <span className="font-bold">All Checkout</span>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="text-right">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="font-bold text-green-700 text-xl">Rp 30.000</p>
                </div>
                <Link href="/dashboard/checkout">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-bold">
                    Checkout
                </button>
                </Link>
            </div>
            </div>
        </div>
        </div>
    );
}