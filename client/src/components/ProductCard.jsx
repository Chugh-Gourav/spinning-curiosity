import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Star, TrendingUp, AlertCircle, Check } from 'lucide-react';

export function ProductCard({ product, analysis, onAnalyze }) {
    const [analyzing, setAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (analysis) return;
        setAnalyzing(true);
        await onAnalyze(product);
        setAnalyzing(false);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="group relative bg-white rounded-xl shadow-soft hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col h-full overflow-hidden">
            {/* Image Area */}
            <div className="relative aspect-square p-6 flex items-center justify-center bg-gray-50/50">
                {analysis?.score && (
                    <div className={cn(
                        "absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1",
                        analysis.score >= 80 ? "bg-accent text-white" :
                            analysis.score >= 50 ? "bg-yellow-400 text-black" : "bg-red-500 text-white"
                    )}>
                        {analysis.score} Score
                    </div>
                )}

                <img
                    src={product.product_image}
                    onError={(e) => {
                        console.log("Image load failed for:", product.product_image);
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/200x200?text=No+Image";
                    }}
                    alt={product.product_name}
                    referrerPolicy="no-referrer"
                    className="object-contain w-3/4 h-3/4 mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">{product.brand_name || 'Generic'}</p>
                    <h3 className="font-display font-medium text-primary text-lg leading-snug line-clamp-2">{product.product_name}</h3>
                </div>

                {analysis ? (
                    <div className="mt-auto space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Verdict</span>
                            <span className={cn("text-sm font-bold font-display", analysis.verdict === 'Excellent' ? 'text-accent' : 'text-primary')}>
                                {analysis.verdict}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {/* Concise Positives */}
                            {analysis.positives?.slice(0, 2).map((pos, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[10px] text-accent font-medium bg-green-50 px-2 py-1 rounded">
                                    <Check size={10} strokeWidth={3} /> {pos}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-auto pt-2">
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="w-full py-3 bg-primary hover:bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:shadow-lg disabled:opacity-50"
                        >
                            {analyzing ? (
                                <span className="animate-pulse">Analyzing...</span>
                            ) : (
                                "Analyze Value"
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
