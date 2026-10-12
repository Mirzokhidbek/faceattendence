import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  RefreshCw, 
  UserCheck, 
  Scan,
  Sparkles,
  Zap
} from 'lucide-react';
import { attendanceApi } from '../services/attendanceApi';
import { audioCue } from './AudioCue';

export default function CameraScanner({ activeCourseId, onNewCheckIn }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraState, setCameraState] = useState('idle'); // idle, requesting_permission, camera_ready, scanning, processing, success, already_recorded, no_face, multiple_faces, unknown_face, camera_error
  const [statusMessage, setStatusMessage] = useState('Position your face in the frame');
  const [lastStudent, setLastStudent] = useState(null);
  const [lastAttendance, setLastAttendance] = useState(null);
  const [autoScan, setAutoScan] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Camera Start
  const startCamera = async () => {
    setCameraState('requesting_permission');
    setStatusMessage('Requesting camera permission...');

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
      console.error('Camera access failed:', err);
      setCameraState('camera_error');
      setStatusMessage('Camera access denied or unavailable.');
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
    setCameraState('idle');
    setStatusMessage('Camera stopped');
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
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

  // 3. Process Check-In API
  const triggerScan = useCallback(async () => {
    if (isProcessing || !activeCourseId || cameraState === 'success') return;

    const frame = captureFrame();
    if (!frame) return;

    setIsProcessing(true);
    setCameraState('processing');

    try {
      const response = await attendanceApi.checkIn(frame, activeCourseId);

      if (response.success && response.status === 'success') {
        // MATCH FOUND
        setCameraState('success');
        setStatusMessage('Student Recognized!');
        setLastStudent(response.student);
        setLastAttendance(response.attendance);
        audioCue.playSuccess();

        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }

        if (onNewCheckIn && response.attendance) {
          onNewCheckIn({
            id: response.attendance.id,
            student_id: response.student.student_id,
            student_name: response.student.full_name,
            student_group: response.student.group_name,
            photo_url: response.student.photo_url,
            course_id: response.attendance.course_id,
            course_name: response.attendance.course_name,
            timestamp: response.attendance.timestamp,
            status: response.attendance.status,
            confidence_score: response.attendance.confidence
          });
        }

        // Return to scanning after 3.5 seconds
        setTimeout(() => {
          setCameraState('scanning');
          setStatusMessage('Scanning...');
        }, 3500);

      } else if (response.status === 'already_recorded') {
        setCameraState('already_recorded');
        setStatusMessage('Attendance already recorded today');
        setLastStudent(response.student);
        setLastAttendance(response.attendance);
        audioCue.playWarning();

        setTimeout(() => {
          setCameraState('scanning');
          setStatusMessage('Scanning...');
        }, 3000);

      } else if (response.status === 'no_face') {
        setCameraState('scanning');
        setStatusMessage('Position your face in the frame');
      } else if (response.status === 'multiple_faces') {
        setCameraState('multiple_faces');
        setStatusMessage('Multiple faces detected. Please ensure only 1 person is in frame.');
        audioCue.playWarning();
      } else if (response.status === 'unknown_face') {
        setCameraState('unknown_face');
        setStatusMessage('Face not recognized. Please try again.');
        setTimeout(() => {
          setCameraState('scanning');
          setStatusMessage('Scanning...');
        }, 3000);
      } else {
        setStatusMessage(response.message || 'Error processing attendance');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setStatusMessage('Server connection error');
    } finally {
      setIsProcessing(false);
    }
  }, [activeCourseId, captureFrame, isProcessing, onNewCheckIn, cameraState]);

  // 4. Auto-Scan Timer
  useEffect(() => {
    if (autoScan && stream && cameraState !== 'idle' && cameraState !== 'camera_error') {
      intervalRef.current = setInterval(() => {
        triggerScan();
      }, 1600);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoScan, stream, cameraState, triggerScan]);

  const timeString = lastAttendance?.timestamp
    ? new Date(lastAttendance.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="hidden" />

      {/* Grid: Camera Viewport (Left) + Recognition Result Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Camera (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center">
            {/* Live Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${
                stream ? 'opacity-100' : 'opacity-20'
              }`}
            />

            {/* Biometric Face Target Reticle Overlay */}
            {stream && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className={`relative w-48 h-56 sm:w-60 sm:h-72 rounded-3xl border-2 transition-all duration-300 ${
                  cameraState === 'success'
                    ? 'border-emerald-500 scale-105'
                    : cameraState === 'unknown_face' || cameraState === 'multiple_faces'
                    ? 'border-rose-500'
                    : 'border-blue-500/80'
                }`}>
                  {/* High-tech corner brackets */}
                  <div className={`absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 rounded-tl-xl ${
                    cameraState === 'success' ? 'border-emerald-500' : 'border-blue-500'
                  }`} />
                  <div className={`absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 rounded-tr-xl ${
                    cameraState === 'success' ? 'border-emerald-500' : 'border-blue-500'
                  }`} />
                  <div className={`absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 rounded-bl-xl ${
                    cameraState === 'success' ? 'border-emerald-500' : 'border-blue-500'
                  }`} />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 rounded-br-xl ${
                    cameraState === 'success' ? 'border-emerald-500' : 'border-blue-500'
                  }`} />
                </div>
              </div>
            )}

            {/* Fallback Camera Off View */}
            {!stream && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 text-slate-400">
                <CameraOff className="w-12 h-12 mb-3 text-slate-600" />
                <h4 className="text-base font-bold text-white mb-1">Camera Inactive</h4>
                <p className="text-xs max-w-xs mb-5 text-slate-400">
                  Please enable camera access in your browser to start face recognition.
                </p>
                <button
                  onClick={startCamera}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all"
                >
                  Enable Camera
                </button>
              </div>
            )}
          </div>

          {/* Under Camera: Scanning Status with animated radar icon matching reference */}
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                <Scan className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {cameraState === 'processing' ? 'Recognizing...' : 'Scanning...'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {statusMessage}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerScan()}
                disabled={!stream || isProcessing}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                <span>Scan Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recognition Result Card (5 Columns) matching reference Screen 3 */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="h-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            {cameraState === 'success' && lastStudent ? (
              <div className="flex flex-col items-center text-center my-auto py-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Green Check circle header */}
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-6 tracking-tight">
                  Student Recognized!
                </h3>

                {/* Student Photo */}
                <div className="relative mb-4">
                  <img
                    src={lastStudent.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${lastStudent.student_id}`}
                    alt={lastStudent.full_name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                  />
                </div>

                {/* Student Info */}
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {lastStudent.full_name}
                </h4>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  ID: {lastStudent.student_id}
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                  Class: {lastStudent.group_name}
                </div>

                {/* Status Pill Badge */}
                <div className="mt-6">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50">
                    Present
                  </span>
                </div>

                {/* Time Display */}
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-3">
                  {timeString}
                </div>
              </div>
            ) : cameraState === 'already_recorded' && lastStudent ? (
              <div className="flex flex-col items-center text-center my-auto py-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-4">
                  Already Checked In!
                </h3>
                <img
                  src={lastStudent.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${lastStudent.student_id}`}
                  alt={lastStudent.full_name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 mb-3 shadow"
                />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {lastStudent.full_name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Attendance was already recorded for today.
                </p>
                <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-3">
                  {timeString}
                </div>
              </div>
            ) : cameraState === 'unknown_face' ? (
              <div className="flex flex-col items-center text-center my-auto py-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400 mb-1">
                  Face Not Recognized
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1 mb-5">
                  Please move closer to the camera or ensure you are registered in the student database.
                </p>
                <button
                  onClick={() => triggerScan()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center my-auto py-12 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-4 text-slate-300 dark:text-slate-600">
                  <Scan className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                  Ready for Student
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Position your face inside the camera frame. The system will automatically detect and verify attendance.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
