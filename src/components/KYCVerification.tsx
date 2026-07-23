import React, { useState, useRef } from 'react';
import { 
  Check, 
  User, 
  Shield, 
  Lock, 
  FileText, 
  Upload, 
  Camera, 
  Trash2, 
  ChevronRight, 
  HelpCircle, 
  ExternalLink,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  FileCode,
  ArrowRight,
  Headphones,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KYCVerificationProps {
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

export default function KYCVerification({ onLogout, onNavigate }: KYCVerificationProps) {
  // Personal Details state
  const [personalDetails, setPersonalDetails] = useState({
    fullName: 'John Michael Trader',
    dob: '15 May 1988',
    nationality: 'United Kingdom',
    phone: '+44 7700 900123',
    email: 'john.trader@email.com'
  });
  
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editedDetails, setEditedDetails] = useState({ ...personalDetails });

  // Verification steps status
  const [isSelfieCaptured, setIsSelfieCaptured] = useState(false);
  const [isSelfieCapturing, setIsSelfieCapturing] = useState(false);
  const [selfieCountdown, setSelfieCountdown] = useState<number | null>(null);
  
  const [addressFile, setAddressFile] = useState<{ name: string; size: string; date: string } | null>(null);
  const [isAddressUploading, setIsAddressUploading] = useState(false);

  // Status badges
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleEditDetailsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalDetails({ ...editedDetails });
    setIsEditingDetails(false);
    triggerToast('Personal details updated successfully!');
  };

  const handleStartSelfie = () => {
    setIsSelfieCapturing(true);
    setSelfieCountdown(3);
    
    const interval = setInterval(() => {
      setSelfieCountdown(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          setIsSelfieCaptured(true);
          setIsSelfieCapturing(false);
          triggerToast('Selfie captured and verified successfully!');
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAddressUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAddressUploading(true);
      setTimeout(() => {
        setAddressFile({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        });
        setIsAddressUploading(false);
        triggerToast('Proof of Address document uploaded!');
      }, 1500);
    }
  };

  const handleDeleteAddressFile = () => {
    setAddressFile(null);
    triggerToast('Document removed.');
  };

  // Progress metrics
  const completedStepsCount = 2 + (isSelfieCaptured ? 1 : 0) + (addressFile ? 1 : 0);
  const progressPercentage = Math.round((completedStepsCount / 5) * 100);

  return (
    <div className="min-h-screen bg-[#020203] text-[#f4f4f6] font-sans flex flex-col overflow-x-hidden selection:bg-[#1e60ff]/30 selection:text-white animate-fade-in" id="kyc-root">
      
      {/* Toast alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 px-5 py-3.5 rounded-xl border border-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.8)] z-[100] flex items-center gap-3 backdrop-blur-md bg-[#09090c]/95 min-w-[320px] text-xs font-semibold text-white"
          >
            <CheckCircle className="w-4 h-4 text-[#1e60ff]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="flex-grow flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6" id="kyc-container">
        
        {/* HEADER ROW WITH TITLE */}
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight" id="kyc-title">KYC Verification</h1>
          <p className="text-[11px] sm:text-xs text-gray-500 font-semibold mt-1">
            Help us verify your identity. This ensures a secure trading experience and full platform access.
          </p>
        </div>

        {/* 5-STEP HORIZONTAL STEPPER - Exact Match to Screenshot */}
        <div className="bg-[#07070a]/60 border border-white/[0.04] rounded-2xl p-6 relative overflow-hidden" id="kyc-stepper-card">
          <div className="relative flex items-center justify-between max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10 w-28">
              <div className="w-8 h-8 rounded-full bg-[#1e60ff] border border-[#1e60ff]/50 flex items-center justify-center text-white shadow-[0_0_12px_rgba(30,96,255,0.4)]">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-2.5 text-center leading-tight">Personal Details</span>
            </div>

            {/* Step Line 1 to 2 */}
            <div className="absolute top-4 left-[11%] right-[72%] h-[2px] bg-[#1e60ff] z-0" />

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10 w-28">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                completedStepsCount >= 2 
                  ? 'bg-[#1e60ff] border-[#1e60ff] text-white shadow-[0_0_12px_rgba(30,96,255,0.4)]' 
                  : 'bg-white/[0.02] border-white/10 text-gray-500'
              }`}>
                {completedStepsCount > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
              </div>
              <span className="text-[10px] font-bold text-white mt-2.5 text-center leading-tight">Proof of Identity</span>
            </div>

            {/* Step Line 2 to 3 */}
            <div className={`absolute top-4 left-[34%] right-[49%] h-[2px] z-0 transition-colors duration-500 ${
              isSelfieCaptured ? 'bg-[#1e60ff]' : 'bg-white/10'
            }`} />

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10 w-28">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                isSelfieCaptured 
                  ? 'bg-[#1e60ff] border-[#1e60ff] text-white shadow-[0_0_12px_rgba(30,96,255,0.4)]' 
                  : 'bg-white/[0.01] border-white/10 text-gray-500'
              }`}>
                {isSelfieCaptured && completedStepsCount > 3 ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
              </div>
              <span className={`text-[10px] font-bold mt-2.5 text-center leading-tight ${isSelfieCaptured ? 'text-white' : 'text-gray-500'}`}>Selfie Verification</span>
            </div>

            {/* Step Line 3 to 4 */}
            <div className={`absolute top-4 left-[56%] right-[27%] h-[2px] z-0 transition-colors duration-500 ${
              addressFile ? 'bg-[#1e60ff]' : 'bg-white/10'
            }`} />

            {/* Step 4 */}
            <div className="flex flex-col items-center relative z-10 w-28">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all ${
                addressFile 
                  ? 'bg-[#1e60ff] border-[#1e60ff] text-white shadow-[0_0_12px_rgba(30,96,255,0.4)]' 
                  : 'bg-white/[0.01] border-white/10 text-gray-500'
              }`}>
                '4'
              </div>
              <span className={`text-[10px] font-bold mt-2.5 text-center leading-tight ${addressFile ? 'text-white' : 'text-gray-500'}`}>Proof of Address</span>
            </div>

            {/* Step Line 4 to 5 */}
            <div className="absolute top-4 left-[79%] right-[5%] h-[2px] bg-white/10 z-0" />

            {/* Step 5 */}
            <div className="flex flex-col items-center relative z-10 w-28">
              <div className="w-8 h-8 rounded-full bg-white/[0.01] border border-white/10 text-gray-500 flex items-center justify-center font-bold text-xs">
                5
              </div>
              <span className="text-[10px] font-bold text-gray-500 mt-2.5 text-center leading-tight">Review & Submit</span>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT: LEFT CONTENT CARDS + RIGHT PROGRESS COLUMN */}
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 items-stretch">
          
          {/* LEFT CONTENT AREA: occupying 7 columns */}
          <div className="xl:col-span-7 space-y-6">
            
            {/* SUB-GRID: 2 columns for the four widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD 1: Personal Details */}
              <div className="bg-[#07070a]/90 border border-white/[0.05] rounded-2xl p-5 text-left flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-white tracking-wide uppercase">Personal Details</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#1e60ff]/10 border border-[#1e60ff]/20 text-[#1e60ff]">
                      Completed
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isEditingDetails ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-12 text-[11px] py-1 border-b border-white/[0.02]">
                          <span className="col-span-5 text-gray-500 font-bold">Full Name</span>
                          <span className="col-span-7 text-gray-200 font-semibold">{personalDetails.fullName}</span>
                        </div>
                        <div className="grid grid-cols-12 text-[11px] py-1 border-b border-white/[0.02]">
                          <span className="col-span-5 text-gray-500 font-bold">Date of Birth</span>
                          <span className="col-span-7 text-gray-200 font-semibold">{personalDetails.dob}</span>
                        </div>
                        <div className="grid grid-cols-12 text-[11px] py-1 border-b border-white/[0.02]">
                          <span className="col-span-5 text-gray-500 font-bold">Nationality</span>
                          <span className="col-span-7 text-gray-200 font-semibold">{personalDetails.nationality}</span>
                        </div>
                        <div className="grid grid-cols-12 text-[11px] py-1 border-b border-white/[0.02]">
                          <span className="col-span-5 text-gray-500 font-bold">Phone Number</span>
                          <span className="col-span-7 text-gray-200 font-semibold font-mono">{personalDetails.phone}</span>
                        </div>
                        <div className="grid grid-cols-12 text-[11px] py-1">
                          <span className="col-span-5 text-gray-500 font-bold">Email Address</span>
                          <span className="col-span-7 text-gray-200 font-semibold truncate">{personalDetails.email}</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.form 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleEditDetailsSave}
                        className="space-y-2 text-xs"
                      >
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Full Name</label>
                          <input 
                            type="text" 
                            className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-white focus:outline-none focus:border-[#1e60ff] text-xs font-medium"
                            value={editedDetails.fullName}
                            onChange={e => setEditedDetails({ ...editedDetails, fullName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Date of Birth</label>
                          <input 
                            type="text" 
                            className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-white focus:outline-none focus:border-[#1e60ff] text-xs font-medium"
                            value={editedDetails.dob}
                            onChange={e => setEditedDetails({ ...editedDetails, dob: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Phone Number</label>
                          <input 
                            type="text" 
                            className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-white focus:outline-none focus:border-[#1e60ff] text-xs font-medium"
                            value={editedDetails.phone}
                            onChange={e => setEditedDetails({ ...editedDetails, phone: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button 
                            type="submit" 
                            className="px-3 py-1.5 bg-[#1e60ff] hover:bg-[#1e60ff]/90 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Save
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              setEditedDetails({ ...personalDetails });
                              setIsEditingDetails(false);
                            }}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {!isEditingDetails && (
                  <button 
                    onClick={() => {
                      setEditedDetails({ ...personalDetails });
                      setIsEditingDetails(true);
                    }}
                    className="mt-6 w-full py-2 border border-white/10 hover:border-white/20 hover:bg-white/[0.01] text-white text-[11px] font-bold rounded-xl transition-all cursor-pointer text-center"
                  >
                    Edit Details
                  </button>
                )}
              </div>

              {/* CARD 2: Proof of Identity (Government-issued photo ID) */}
              <div className="bg-[#07070a]/90 border border-white/[0.05] rounded-2xl p-5 text-left flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-black text-white tracking-wide uppercase">1. Proof of Identity</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold mb-4">
                    Upload a valid government-issued photo ID.
                  </p>

                  {/* Dual Grid Layout inside ID proof */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 mb-4">
                    
                    {/* Upload box */}
                    <div className="sm:col-span-7 border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-black/25 select-none hover:border-[#1e60ff]/45 transition-colors cursor-pointer group">
                      <div className="w-9 h-9 rounded-full bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] mb-2 group-hover:scale-105 transition-transform relative">
                        <User className="w-4.5 h-4.5" />
                        <span className="absolute -bottom-1 -right-1 bg-[#1e60ff] text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">+</span>
                      </div>
                      <span className="text-[10.5px] font-bold text-white block">Upload Front of ID</span>
                      <span className="text-[8px] text-gray-500 mt-0.5 block">JPG, PNG or PDF. Max size 10MB</span>
                    </div>

                    {/* Accepted Documents List */}
                    <div className="sm:col-span-5 space-y-2 text-[10px] text-gray-400 font-medium self-center pl-1">
                      <span className="text-[8.5px] text-gray-500 uppercase font-bold block mb-1">Accepted Documents</span>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Passport</span>
                        <span className="text-[7px] text-emerald-400 bg-emerald-500/5 px-1 py-0.2 rounded font-black uppercase">Recommended</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Driver's License</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>National ID Card</span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded File item below (glowing/verified) */}
                  <div className="p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        {/* Tiny document graphic */}
                        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="4" width="18" height="16" rx="2" />
                          <circle cx="9" cy="10" r="2" />
                          <path d="M15 13h2" />
                          <path d="M15 17h2" />
                        </svg>
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10.5px] font-bold text-white leading-none">passport_front.jpg</span>
                        <span className="text-[8px] text-gray-500 mt-1 leading-none">Uploaded on 20 May 2025</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        Verified
                      </span>
                      <button className="text-gray-600 hover:text-white transition-colors cursor-pointer p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 3: Selfie Verification */}
              <div className="bg-[#07070a]/90 border border-white/[0.05] rounded-2xl p-5 text-left flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-black text-white tracking-wide uppercase">2. Selfie Verification</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                      isSelfieCaptured 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                        : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                    }`}>
                      {isSelfieCaptured ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold mb-4">
                    Take a clear selfie to confirm your identity.
                  </p>

                  {/* Active/interactive widget capture box */}
                  <div 
                    onClick={!isSelfieCaptured && !isSelfieCapturing ? handleStartSelfie : undefined}
                    className={`border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-black/25 min-h-[140px] transition-all relative overflow-hidden select-none ${
                      !isSelfieCaptured && !isSelfieCapturing ? 'hover:border-[#1e60ff]/50 cursor-pointer group' : ''
                    }`}
                  >
                    {isSelfieCapturing ? (
                      <div className="flex flex-col items-center space-y-3">
                        <Camera className="w-8 h-8 text-[#1e60ff] animate-pulse" />
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                          <span className="text-[11px] font-black text-white uppercase tracking-wider">Capturing in {selfieCountdown}...</span>
                        </div>
                        <span className="text-[8.5px] text-gray-500">Hold still and look directly at your screen.</span>
                      </div>
                    ) : isSelfieCaptured ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 relative">
                          <Check className="w-6 h-6 stroke-[3]" />
                          <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
                        </div>
                        <span className="text-[11px] font-black text-white uppercase">Selfie Matched</span>
                        <span className="text-[8.5px] text-gray-500">Liveness verification passed instantly</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsSelfieCaptured(false);
                            triggerToast('Selfie cleared.');
                          }}
                          className="mt-2 text-[9px] text-[#1e60ff] font-bold hover:underline cursor-pointer"
                        >
                          Retake Selfie
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-full bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] mb-2.5 group-hover:scale-105 transition-transform relative">
                          <Camera className="w-5.5 h-5.5" />
                          <span className="absolute -bottom-1 -right-1 bg-[#1e60ff] text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[11px] font-black">+</span>
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">Take a Selfie</span>
                        <span className="text-[8.5px] text-gray-500 mt-1 max-w-[180px] leading-normal">Ensure your face is clearly visible</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD 4: Proof of Address */}
              <div className="bg-[#07070a]/90 border border-white/[0.05] rounded-2xl p-5 text-left flex flex-col justify-between hover:border-white/[0.08] transition-all relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-black text-white tracking-wide uppercase">3. Proof of Address</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                      addressFile 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                        : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                    }`}>
                      {addressFile ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold mb-4">
                    Upload a recent utility bill or bank statement.
                  </p>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleAddressUpload}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />

                  {/* Dual columns inside Address card */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                    
                    {/* Drag and drop upload zone */}
                    <div 
                      onClick={() => !addressFile && fileInputRef.current?.click()}
                      className={`sm:col-span-7 border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-black/25 select-none transition-colors ${
                        isAddressUploading 
                          ? 'border-[#1e60ff] animate-pulse' 
                          : addressFile 
                            ? 'opacity-60 cursor-not-allowed' 
                            : 'hover:border-[#1e60ff]/50 cursor-pointer group'
                      }`}
                    >
                      {isAddressUploading ? (
                        <div className="flex flex-col items-center space-y-1.5">
                          <RefreshCw className="w-5 h-5 text-[#1e60ff] animate-spin" />
                          <span className="text-[9.5px] font-bold text-white uppercase">Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-9 h-9 rounded-full bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] mb-2 group-hover:scale-105 transition-transform relative">
                            <Upload className="w-4.5 h-4.5" />
                            <span className="absolute -bottom-1 -right-1 bg-[#1e60ff] text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">+</span>
                          </div>
                          <span className="text-[10.5px] font-bold text-white block">Upload Document</span>
                          <span className="text-[8px] text-gray-500 mt-0.5 block">JPG, PNG or PDF. Max size 10MB</span>
                        </div>
                      )}
                    </div>

                    {/* Accepted Documents bullets */}
                    <div className="sm:col-span-5 space-y-2 text-[10px] text-gray-400 font-medium self-center pl-1">
                      <span className="text-[8.5px] text-gray-500 uppercase font-bold block mb-1">Accepted Documents</span>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                        <span>Utility Bill</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                        <span>Bank Statement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                        <span>Tax Document</span>
                      </div>
                    </div>
                  </div>

                  {/* Uploaded item indicator */}
                  {addressFile && (
                    <div className="mt-3.5 p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.04] flex items-center justify-between animate-fade-in">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#1e60ff]/10 border border-[#1e60ff]/20 flex items-center justify-center text-[#1e60ff]">
                          <FileText className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[10.5px] font-bold text-white leading-none truncate max-w-[120px]">{addressFile.name}</span>
                          <span className="text-[8px] text-gray-500 mt-1 leading-none">{addressFile.size} • Uploaded today</span>
                        </div>
                      </div>
                      <button 
                        onClick={handleDeleteAddressFile}
                        className="text-gray-600 hover:text-rose-400 transition-colors cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* LOWER BOTTOM BANNER ROW: Shield & lock notice with giant Review Button */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#07070a]/80 border border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#1e60ff]/10 border border-[#1e60ff]/25 flex items-center justify-center text-[#1e60ff] shrink-0 mt-0.5">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-xs font-black text-white uppercase tracking-wider">Your information is safe with us</span>
                  <p className="text-[10px] text-gray-500 font-semibold leading-normal mt-1 max-w-md">
                    We use advanced encryption and strict verification processes to ensure your data is always protected.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                <button 
                  onClick={() => {
                    if (completedStepsCount < 4) {
                      triggerToast('Please complete Selfie & Address steps first!');
                    } else {
                      triggerToast('Redirecting to manual verification console...');
                    }
                  }}
                  className={`px-6 py-3 text-white text-[12px] font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-[0_4px_20px_rgba(30,96,255,0.25)] ${
                    completedStepsCount >= 4 
                      ? 'bg-[#1e60ff] hover:bg-[#1e60ff]/90 hover:scale-[1.02]' 
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[8px] text-gray-500 mt-1.5 uppercase font-bold tracking-wider">You can review before final submission</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 3 columns for metrics & secure cards */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* BOX 1: Verification Progress with Circular Arc stroke */}
            <div className="bg-[#07070a]/90 border border-white/[0.05] rounded-2xl p-5 text-center flex flex-col items-center">
              <h3 className="text-[11.5px] font-black text-white uppercase tracking-wider self-start mb-6">Verification Progress</h3>
              
              {/* Radial Progress circle (Exactly like screenshot) */}
              <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                
                {/* Radial trail shadow & gradient background glow */}
                <div className="absolute inset-4 rounded-full bg-blue-500/2 blur-lg pointer-events-none" />

                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="5" 
                    opacity="0.03" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="url(#kycGrad)" 
                    strokeWidth="5.5" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * progressPercentage) / 100}
                    strokeLinecap="round" 
                  />
                  <defs>
                    <linearGradient id="kycGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e60ff" />
                      <stop offset="100%" stopColor="#00c8ff" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Central absolute labels */}
                <div className="absolute flex flex-col items-center justify-center select-none">
                  <span className="text-2xl font-black text-white tracking-tight">{progressPercentage}%</span>
                  <span className="text-[8.5px] text-gray-500 uppercase font-black tracking-widest mt-1">Completed</span>
                </div>
              </div>

              {/* Progress checklist matching Page 9 perfectly */}
              <div className="w-full space-y-3.5 text-left text-[11px] font-medium border-t border-white/[0.04] pt-4.5">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#1e60ff]/10 border border-[#1e60ff]/30 flex items-center justify-center text-[#1e60ff]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-white font-semibold">Personal Details</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Completed</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#1e60ff]/10 border border-[#1e60ff]/30 flex items-center justify-center text-[#1e60ff]">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-white font-semibold">Proof of Identity</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Completed</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                      isSelfieCaptured 
                        ? 'bg-[#1e60ff]/10 border-[#1e60ff]/30 text-[#1e60ff]' 
                        : 'bg-white/5 border-white/10 text-gray-600'
                    }`}>
                      {isSelfieCaptured ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <span className="w-1 h-1 rounded-full bg-gray-600" />}
                    </div>
                    <span className={isSelfieCaptured ? 'text-white font-semibold' : 'text-gray-400'}>Selfie Verification</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">{isSelfieCaptured ? 'Completed' : 'Pending'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                      addressFile 
                        ? 'bg-[#1e60ff]/10 border-[#1e60ff]/30 text-[#1e60ff]' 
                        : 'bg-white/5 border-white/10 text-gray-600'
                    }`}>
                      {addressFile ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <span className="w-1 h-1 rounded-full bg-gray-600" />}
                    </div>
                    <span className={addressFile ? 'text-white font-semibold' : 'text-gray-400'}>Proof of Address</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">{addressFile ? 'Completed' : 'Pending'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-white/5 border-white/10 flex items-center justify-center text-gray-600">
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                    </div>
                    <span className="text-gray-400">Review & Submit</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Pending</span>
                </div>

              </div>

            </div>

            {/* BOX 2: Secure. Regulated. Trusted. */}
            <div className="bg-[#07070a]/90 border border-white/[0.05] rounded-2xl p-5 text-left space-y-4">
              <h3 className="text-[11px] font-black text-white uppercase tracking-wider">Secure. Regulated. Trusted.</h3>
              
              <div className="space-y-4">
                
                {/* Check 1 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">256-bit SSL Encryption</span>
                    <span className="text-[9px] text-gray-500 mt-0.5 font-medium leading-normal">Your data is protected with bank-level security.</span>
                  </div>
                </div>

                {/* Check 2 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] shrink-0 mt-0.5">
                    {/* Temple icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M2 22h20" />
                      <path d="M4 22V10h16v12" />
                      <path d="M12 2L2 10h20L12 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">Regulatory Compliance</span>
                    <span className="text-[9px] text-gray-500 mt-0.5 font-medium leading-normal">We follow global KYC/AML regulations.</span>
                  </div>
                </div>

                {/* Check 3 */}
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1e60ff]/10 flex items-center justify-center text-[#1e60ff] shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">Data Privacy</span>
                    <span className="text-[9px] text-gray-500 mt-0.5 font-medium leading-normal">Your information is private and never shared.</span>
                  </div>
                </div>

              </div>
            </div>

            {/* BOX 3: Need Help? */}
            <div className="bg-[#07070a]/90 border border-white/[0.05] rounded-2xl p-5 text-left space-y-3.5">
              <h3 className="text-[11.5px] font-black text-white uppercase tracking-wider">Need Help?</h3>
              <p className="text-[10px] text-gray-500 font-semibold leading-normal">
                Our support team is here to help you complete your verification.
              </p>
              
              <button 
                onClick={() => triggerToast("Connecting to verification support agent...")}
                className="w-full py-2.5 bg-black border border-white/10 hover:border-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5 text-[#1e60ff]" />
                <span>Contact Support</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
