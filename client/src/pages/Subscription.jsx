import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
    { icon: '🧠', title: 'AI-Powered Search', desc: 'Get personalized product recommendations based on your health goals and dietary preferences.' },
    { icon: '🔄', title: 'Smart Swaps', desc: 'Instantly find healthier and cheaper alternatives for any product you scan or search.' },
    { icon: '📊', title: 'Deep Score Breakdown', desc: 'Understand exactly why a product scores the way it does — sugar, salt, protein, fiber, additives.' },
    { icon: '🏷️', title: 'Price Tracking', desc: 'Track price changes over time and get alerts when your favorite healthy products go on sale.' },
    { icon: '👨‍👩‍👧‍👦', title: 'Family Profiles', desc: 'Create profiles for each family member with unique health goals and dietary needs.' },
    { icon: '📷', title: 'Barcode Scanner', desc: 'Scan any product barcode in-store for instant health scores and better alternatives.' },
];

export function Subscription() {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState('monthly');

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50 text-gray-800 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button onClick={() => navigate('/home')} className="text-green-600 font-bold text-lg flex items-center gap-2">
                        ← VOTTAM
                    </button>
                    <span className="text-xs text-gray-400 font-medium">Premium</span>
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 py-8">
                {/* Hero */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">✨</div>
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Upgrade to Premium</h1>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                        Unlock the full power of VOTTAM — AI-driven insights, unlimited swaps, and personalized health coaching.
                    </p>
                </div>

                {/* Pricing Toggle */}
                <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 rounded-full p-1 flex gap-1">
                        <button
                            onClick={() => setSelectedPlan('monthly')}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${selectedPlan === 'monthly' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setSelectedPlan('yearly')}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${selectedPlan === 'yearly' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Yearly <span className="text-green-400 text-xs ml-1">Save 40%</span>
                        </button>
                    </div>
                </div>

                {/* Price Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 mb-8 text-center">
                    <div className="flex items-baseline justify-center gap-1 mb-1">
                        <span className="text-4xl font-extrabold text-gray-900">
                            {selectedPlan === 'monthly' ? '£4.99' : '£35.99'}
                        </span>
                        <span className="text-gray-400 text-sm">
                            /{selectedPlan === 'monthly' ? 'month' : 'year'}
                        </span>
                    </div>
                    {selectedPlan === 'yearly' && (
                        <p className="text-green-600 text-xs font-semibold mb-3">That's just £3.00/month!</p>
                    )}
                    <p className="text-gray-400 text-xs mb-5">Cancel anytime. No commitment.</p>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-base shadow-md transition-colors">
                        Start 7-Day Free Trial
                    </button>
                    <p className="text-gray-300 text-[10px] mt-2">You won't be charged until your trial ends.</p>
                </div>

                {/* Feature List */}
                <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Everything in Premium</h2>
                <div className="grid gap-3 mb-10">
                    {features.map((f, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 flex gap-3 items-start shadow-sm border border-gray-50">
                            <span className="text-2xl">{f.icon}</span>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">{f.title}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Guarantee */}
                <div className="text-center text-gray-400 text-xs pb-8">
                    <p>🔒 Secure payment • 30 day money-back guarantee</p>
                    <p className="mt-1">Built with ❤️ by Gourav</p>
                </div>
            </main>
        </div>
    );
}
