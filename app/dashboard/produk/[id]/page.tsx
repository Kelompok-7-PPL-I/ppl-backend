import Link from 'next/link';

export default function DetailProductPage() {
    return (
        <div className="min-h-screen bg-white p-8">
        <div className="max-w-2xl mx-auto">
            <Link href="/dashboard" className="text-red-500 font-bold mb-6 inline-block">Back</Link>
            
            <div className="bg-white rounded-xl shadow-md border p-6 flex gap-6">
            <div className="w-1/2 h-64 bg-gray-200 rounded-lg"></div>
            <div className="w-1/2 flex flex-col justify-center">
                <h1 className="text-3xl font-bold mb-2">Jagung Manis</h1>
                <p className="text-xl text-green-700 font-bold mb-6">Rp 10.000</p>
                
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-full mb-3">
                Add to Cart
                </button>
                <button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-full">
                Buy Now
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}