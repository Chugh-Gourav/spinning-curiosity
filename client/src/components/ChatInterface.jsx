import React, { useState, useRef, useEffect } from 'react';
import { Send, ShoppingBag, Camera } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export function ChatInterface({ user }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'system', content: `Hi ${user?.username || 'there'}! I'm VOTTAM. I can help you find products with the smartest value. Try searching for "vegan protein" or "peanut butter".` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userQuery = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userQuery })
            });
            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'system',
                content: data.message,
                products: data.products
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'system', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeProduct = async (product, messageIndex, productIndex) => {
        try {
            // Include user context from props
            const userProfile = user?.preferences || {};

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product, userProfile })
            });
            const analysis = await response.json();

            // Update the specific product in the specific message with analysis
            setMessages(prev => prev.map((msg, idx) => {
                if (idx !== messageIndex) return msg;
                const newProducts = [...msg.products];
                newProducts[productIndex] = { ...newProducts[productIndex], analysis };
                return { ...msg, products: newProducts };
            }));
        } catch (error) {
            console.error("Analysis failed", error);
        }
    };

    const filters = ['All', 'Dairy', 'Non-Dairy', 'Spreads', 'High Protein', 'Custom +'];

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 md:p-8 font-sans bg-background text-primary">
            {/* Header */}
            <header className="flex flex-col items-center gap-2 py-8 mb-4 relative">
                <button
                    onClick={() => navigate('/scan')}
                    className="absolute right-0 top-8 p-3 bg-black text-white rounded-full hover:scale-105 transition-transform shadow-lg z-10"
                    title="Scan Product"
                >
                    <Camera size={20} />
                </button>

                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag size={20} strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl font-display font-medium tracking-tight">VOTTAM</h1>
                <p className="text-sm text-secondary">The Smartest Way to Shop</p>
            </header>

            {/* Filter Bar */}
            <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto py-2 no-scrollbar">
                {filters.map((filter, i) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 whitespace-nowrap",
                            activeFilter === filter
                                ? "bg-primary text-white border-primary shadow-md"
                                : "bg-white text-secondary border-gray-200 hover:border-gray-300 hover:text-primary"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-12 pb-8 scroll-smooth no-scrollbar px-2">
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex flex-col gap-6 animate-in fade-in duration-500", msg.role === 'user' ? "items-center" : "items-stretch")}>

                        {/* Message Bubble */}
                        <div className={cn(
                            "max-w-xl text-center px-6 py-4 text-sm leading-relaxed",
                            msg.role === 'user'
                                ? "text-primary font-medium text-lg" // User query looks like a heading
                                : "text-secondary mx-auto"
                        )}>
                            {msg.content}
                        </div>

                        {/* Product Grid */}
                        {msg.products && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                                {msg.products.map((product, pIdx) => (
                                    <ProductCard
                                        key={product.food_id || pIdx}
                                        product={product}
                                        analysis={product.analysis}
                                        onAnalyze={(p) => handleAnalyzeProduct(p, idx, pIdx)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-center py-8">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="relative mt-auto pt-4 border-t border-gray-100">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search for a product..."
                    className="w-full bg-white border-none py-4 px-6 text-center text-lg placeholder:text-gray-300 focus:outline-none focus:ring-0 transition-all font-display"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-secondary hover:text-primary disabled:opacity-30 transition-colors"
                >
                    <Send size={20} strokeWidth={1.5} />
                </button>
            </form>
        </div>
    );
}
