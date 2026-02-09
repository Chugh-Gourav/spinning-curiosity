/**
 * ProductSearch Component
 * 
 * The main interface for the VOTTAM shopping agent.
 * Features:
 * - Search bar with AI toggle (Personalized AI vs Standard Search)
 * - User selection dropdown for personalization context
 * - Category filters and price range slider
 * - Product list display with health scores
 * - "Find Better" smart swap functionality
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Yuka-inspired Health Badge
// Visual indicator of product health score (0-100)
// Red: Poor (<50), Orange: Good (50-74), Green: Excellent (75+)
const HealthBadge = ({ score }) => {
    let color = 'bg-red-500';
    let label = 'Poor';

    if (score >= 75) {
        color = 'bg-green-500';
        label = 'Excellent';
    } else if (score >= 50) {
        color = 'bg-orange-400';
        label = 'Good';
    }

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-bold ${color}`}>
            <span>{score}</span>
            <span>{label}</span>
        </div>
    );
};

export const ProductSearch = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [maxPrice, setMaxPrice] = useState(10);
    const [hasSearched, setHasSearched] = useState(false);
    const [swapSuggestion, setSwapSuggestion] = useState(null);
    const [isAiMode, setIsAiMode] = useState(false);
    const [aiMessage, setAiMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const filters = ['All', 'Spreads', 'Milk Alternatives', 'Vegan'];

    // Fetch available users on mount
    useEffect(() => {
        fetch('https://vottam-api-595396735241.us-central1.run.app/api/users')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setUsers(data);
                    if (data.length > 0) setSelectedUser(data[0]);
                } else {
                    console.error('VOTTAM: Invalid users data:', data);
                    setUsers([]);
                }
            })
            .catch(err => {
                console.error('VOTTAM: User fetch error:', err);
                setUsers([]); // Fallback to empty
            });
    }, []);

    const searchProducts = async (term, category) => {
        setLoading(true);
        setHasSearched(true);
        setAiMessage('');
        try {
            let url = isAiMode
                ? `https://vottam-api-595396735241.us-central1.run.app/api/chat`
                : `https://vottam-api-595396735241.us-central1.run.app/api/products?source=local`;

            let options = {};

            if (isAiMode) {
                // Use personalized AI endpoint with user context
                options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: term || 'healthy products',
                        userId: selectedUser?.id || 1
                    })
                };
                url = `https://vottam-api-595396735241.us-central1.run.app/api/chat/personalized`;
            } else {
                if (term) url += `&q=${encodeURIComponent(term)}`;
                if (category && category !== 'All') url += `&category=${encodeURIComponent(category)}`;
                url += `&maxPrice=${maxPrice}`;
            }

            const res = await fetch(url, options);
            const data = await res.json();

            if (isAiMode) {
                setProducts(data.products || []);
                setAiMessage(data.message || '');
            } else {
                setProducts(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const activeSwap = async (product) => {
        try {
            const res = await fetch(`https://vottam-api-595396735241.us-central1.run.app/api/products/${product.food_id}/swap`);
            const data = await res.json();
            if (data && data.id) {
                setSwapSuggestion({ original: product, better: data });
            } else {
                alert('This product is already the best choice!');
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (hasSearched || activeFilter !== 'All') {
            searchProducts(query, activeFilter);
        }
    }, [activeFilter, maxPrice, isAiMode]);

    const handleSearch = (e) => {
        e.preventDefault();
        searchProducts(query, activeFilter);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-20">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-green-600 tracking-tight">VOTTAM</h1>
                    {/* User Dropdown */}
                    <select
                        value={selectedUser?.id || ''}
                        onChange={(e) => {
                            const user = users.find(u => u.id === parseInt(e.target.value));
                            setSelectedUser(user);
                        }}
                        className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username} ({user.preferences?.diet})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search Bar */}
                <div className="max-w-md mx-auto px-4 pb-4">
                    <div className="flex justify-end mb-2">
                        <label className="flex items-center cursor-pointer gap-2">
                            <span className={`text-xs font-bold ${isAiMode ? 'text-purple-600' : 'text-gray-400'}`}>AI Search ✨</span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={isAiMode}
                                    onChange={() => setIsAiMode(!isAiMode)}
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${isAiMode ? 'bg-purple-100' : 'bg-gray-200'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isAiMode ? 'transform translate-x-4 bg-purple-600' : ''}`}></div>
                            </div>
                        </label>
                    </div>

                    <form onSubmit={handleSearch} className="relative flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search (e.g. Oatly)..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate('/scan')}
                            className="p-3 bg-gray-100 rounded-xl text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Filters */}
                <div className="max-w-md mx-auto px-4 pb-4 overflow-x-auto no-scrollbar">
                    <div className="flex gap-2 mb-4">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                  ${activeFilter === filter
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Price Filter */}
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-gray-500 uppercase">Max Price: £{maxPrice}</span>
                        <input
                            type="range"
                            min="0"
                            max="15"
                            step="0.5"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                    </div>
                </div>
            </header>

            {/* Product List */}
            <main className="max-w-md mx-auto px-4 py-6 space-y-4">
                {aiMessage && (
                    <div className="bg-purple-50 border border-purple-100 p-4 rounded-2xl mb-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-2 items-start">
                            <span className="text-xl">✨</span>
                            <p className="text-sm text-purple-800 font-medium leading-relaxed">{aiMessage}</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-10 text-gray-400 animate-pulse">Scanning database...</div>
                ) : !hasSearched && products.length === 0 ? (
                    <div className="text-center py-20 opacity-60">
                        <div className="text-6xl mb-4 grayscale">🥗</div>
                        <h2 className="text-xl font-bold text-gray-700">Find the best products</h2>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
                            Search or select a category to see health scores and smart alternatives.
                        </p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">No products found.</div>
                ) : (
                    products.map(product => {
                        // Normalize field names between different API responses
                        const name = product.food_name || product.name;
                        const brand = product.brand_name || product.brand;
                        const image = product.product_image || product.image_url;
                        const price = product.price_local_currency || 0;
                        const healthScore = product.scores?.health_score || product.health_score || 50;

                        return (
                            <div key={product.food_id || product.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow items-stretch">
                                <div className="w-24 h-24 bg-gray-50 rounded-xl flex-shrink-0 p-2 flex items-center justify-center self-center">
                                    <img
                                        src={image}
                                        alt={name}
                                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                                        onError={(e) => e.target.src = 'https://placehold.co/100?text=No+Image'}
                                    />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-gray-900 leading-tight text-lg truncate flex-1" title={name}>
                                                {name}
                                            </h3>
                                            <HealthBadge score={healthScore} />
                                        </div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{brand}</p>
                                    </div>

                                    <div className="flex items-end justify-between mt-3">
                                        <div>
                                            <div className="text-lg font-bold text-gray-900">£{price.toFixed(2)}</div>
                                            {/* Smart Value Display */}
                                            <div className="text-xs text-green-600 font-medium">
                                                {product.nutrition?.protein ? `${product.nutrition.protein}g Protein` : 'High Value'}
                                            </div>
                                        </div>

                                        {/* Smart Swap Trigger */}
                                        {(product.scores?.health_score < 75) && (
                                            <button
                                                onClick={() => activeSwap(product)}
                                                className="text-xs font-bold text-white bg-green-600 px-3 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                            >
                                                Find Better ➜
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </main>

            {/* Swap Modal */}
            {swapSuggestion && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                        <button
                            onClick={() => setSwapSuggestion(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 mb-1">Smart Swap found!</h3>
                        <p className="text-sm text-gray-500 mb-6">A healthier alternative for you.</p>

                        <div className="flex items-center gap-4 mb-6 relative">
                            {/* Better Product */}
                            <div className="flex-1 text-center bg-green-50 p-4 rounded-xl border border-green-100">
                                <img src={swapSuggestion.better.image_url} className="h-16 mx-auto mb-2 object-contain mix-blend-multiply" />
                                <div className="font-bold text-sm truncate">{swapSuggestion.better.brand}</div>
                                <div className="text-green-700 font-extrabold text-lg">{swapSuggestion.better.health_score}</div>
                            </div>

                            <div className="text-gray-300 font-bold">vs</div>

                            {/* Original Product */}
                            <div className="flex-1 text-center opacity-60 grayscale">
                                <img src={swapSuggestion.original.product_image} className="h-16 mx-auto mb-2 object-contain mix-blend-multiply" />
                                <div className="font-bold text-sm truncate">{swapSuggestion.original.brand_name}</div>
                                <div className="text-red-400 font-bold">{swapSuggestion.original.scores.health_score}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSwapSuggestion(null)}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all"
                        >
                            Switch to this Product
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
