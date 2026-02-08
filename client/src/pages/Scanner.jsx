import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Scanner() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const navigate = useNavigate();

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);

        // In a full implementation, we would send this 'imageSrc' (base64) to the backend
        // For now, we simulate a successful scan and redirect
        setTimeout(() => {
            navigate('/home', { state: { scanned: true, query: 'Detected Product' } });
        }, 1500);
    }, [webcamRef, navigate]);

    return (
        <div className="h-screen bg-black flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                <h1 className="text-white font-display text-lg tracking-wide">Scan Product</h1>
                <button onClick={() => navigate('/home')} className="text-white/80 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
                {imgSrc ? (
                    <div className="relative w-full h-full">
                        <img src={imgSrc} alt="Captured" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col gap-4 animate-in fade-in zoom-in duration-300">
                            <CheckCircle size={48} className="text-green-400" />
                            <p className="text-white font-bold text-xl">Processing...</p>
                        </div>
                    </div>
                ) : (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: "environment" }}
                        onUserMedia={() => console.log("Webcam started")}
                        onUserMediaError={(err) => {
                            console.error("Webcam error:", err);
                            alert("Camera access denied or not available. Please allow camera permissions.");
                        }}
                    />
                )}

                {/* Overlay guides */}
                {!imgSrc && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-white/50 rounded-2xl relative">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {!imgSrc && (
                <div className="absolute bottom-0 left-0 right-0 p-10 flex justify-center pb-12 bg-gradient-to-t from-black/80 to-transparent">
                    <button
                        onClick={capture}
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group hover:scale-105 transition-transform"
                    >
                        <div className="w-16 h-16 bg-white rounded-full group-hover:bg-gray-200 transition-colors"></div>
                    </button>
                </div>
            )}
        </div>
    );
}
