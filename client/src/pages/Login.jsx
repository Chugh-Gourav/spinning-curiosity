import React, { useState } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const user = await response.json();
                onLogin(user);
                navigate('/home');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Something went wrong. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
            <div className="w-full max-w-sm flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                        <ShoppingBag size={28} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-display font-medium tracking-tight text-primary">VOTTAM</h1>
                    <p className="text-secondary text-sm">Sign in to your personalized shopping AI</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-medium placeholder:text-gray-300 shadow-sm hover:border-gray-200"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full p-4 bg-white border border-gray-100 rounded-xl focus:outline-none focus:border-primary transition-all text-sm font-medium placeholder:text-gray-300 shadow-sm hover:border-gray-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Signing In...' : (
                            <>
                                Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-xs text-secondary">
                        Try <span className="font-bold text-primary">demo</span> / <span className="font-bold text-primary">demo123</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
