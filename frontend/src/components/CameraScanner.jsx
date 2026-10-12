import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  UserCheck, 
  Scan,
  Circle
} from 'lucide-react';
import { attendanceApi } from '../services/attendanceApi';
import { audioCue } from './AudioCue';

export default function CameraScanner({ activeCourseId, onNewCheckIn }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraState, setCameraState] = useState('scanning'); // scanning, processing, success, camera_error
  const [statusMessage, setStatusMessage] = useState('Position face inside frame');
  const [lastRecognized, setLastRecognized] = useState({
    name: 'Mirzohid Nurmuhammadov',
    department: 'Development',
    time: '09:24 AM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  });
  const [recentDetections, setRecentDetections] = useState([
    { id: 1, name: 'Mirzohid Nurmuhammadov', time: '09:24 AM', status: 'present', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Azizbek Karimov', time: '09:22 AM', status: 'present', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Sevinch Rasulova', time: '08:20 AM', status: 'present', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { id: 4, name: 'Jamshid Abdullaev', time: '08:18 AM', status: 'present', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
    { id: 5, name: 'Sarvarbek Tursunov', time: '08:16 AM', status: 'late', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Camera Initialization
  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setCameraState('scanning');
      setStatusMessage('Scanning...');
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      setCameraState('camera_error');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // 2. Capture Frame
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState < 2) {
      return null;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  }, []);

  // 3. Trigger Scan / Check-In
  const triggerScan = useCallback(async () => {
    if (isProcessing || !activeCourseId) return;

    const frame = captureFrame();
    if (!frame) return;

    setIsProcessing(true);
    setCameraState('processing');

    try {
      const response = await attendanceApi.checkIn(frame, activeCourseId);

      if (response.success && response.status === 'success') {
        const student = response.student;
        const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        const newRecord = {
          id: Date.now(),
          name: student.full_name,
          department: student.group_name || 'Development',
          time: nowTime,
          status: response.attendance?.status || 'present',
          avatar: student.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.student_id}`
        };

        setLastRecognized(newRecord);
        setRecentDetections(prev => [newRecord, ...prev.slice(0, 4)]);
        setCameraState('success');
        setStatusMessage('Recognised');
        audioCue.playSuccess();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });

        if (onNewCheckIn) onNewCheckIn(response);

        setTimeout(() => {
          setCameraState('scanning');
          setStatusMessage('Scanning...');
        }, 3000);
      } else {
        setCameraState('scanning');
      }
    } catch {
      setCameraState('scanning');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, activeCourseId, captureFrame, onNewCheckIn]);

  // Periodic automatic scan loop
  useEffect(() => {
    if (!stream) return;

    intervalRef.current = setInterval(() => {
      if (cameraState !== 'processing' && cameraState !== 'success') {
        triggerScan();
      }
    }, 2800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stream, cameraState, triggerScan]);

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="hidden" />

      {/* 2-Column Grid matching reference Screen 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Main Camera Viewport */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center justify-center">
            {/* Live Video Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${
                stream ? 'opacity-100' : 'opacity-25'
              }`}
            />

            {/* Fallback image when camera is disabled / simulated */}
            {!stream && (
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
                alt="Camera feed"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            )}

            {/* Green rounded face tracking bounding box overlay around face */}
            <div className="absolute inset-x-20 inset-y-14 pointer-events-none flex items-center justify-center">
              <div className="w-52 h-60 rounded-3xl border-2 border-emerald-500/90 relative shadow-xs">
                {/* Modern rounded corner accent guides */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-xl" />
              </div>
            </div>

            {/* In-viewport Bottom Bar Overlay matching Screen 4 */}
            <div className="absolute bottom-5 inset-x-5 p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Recognised
                </span>

                <div className="flex items-center gap-2.5">
                  <img
                    src={lastRecognized.avatar}
                    alt={lastRecognized.name}
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {lastRecognized.name}
                    </h4>
                    <p className="text-[11px] text-slate-300 font-mono">
                      {lastRecognized.department} - {lastRecognized.time}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => triggerScan()}
                disabled={isProcessing}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Scan Face"
              >
                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Recent Detections List matching reference Screen 4 */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Recent Detections
          </h3>

          <div className="space-y-3">
            {recentDetections.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {item.time}
                    </p>
                  </div>
                </div>

                <div>
                  {item.status === 'present' ? (
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60">
                      Present
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60">
                      Late
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
