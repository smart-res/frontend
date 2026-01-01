import { UtensilsCrossed } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function CustomRegister() {
  const nav = useNavigate();

  return (
    <div className="min-h-[100svh] bg-[#EEF1F5] flex flex-col font-sans">
      {/* Main Canvas */}
      <div className="mx-auto w-full max-w-[400px] pt-4 flex flex-col min-h-[100svh]">
        
        {/* Header Section */}
        <div className="rounded-t-[28px] bg-slate-900 px-6 pt-12 pb-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-inner">
            <UtensilsCrossed className="text-[#E2B13C] h-8 w-8" />
          </div>
          <h1 className="text-[#E2B13C] text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-[#E2B13C] text-sm mt-1">Join the Smart Restaurant community</p>
        </div>

        {/* Form Card Panel */}
        <div className="-mt-8 rounded-t-[32px] bg-white px-6 pt-8 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex-1 z-10">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-600 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className= "w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-[15px] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#E64B3C]/10 focus:border-[#E2B13C]"
              />
            </div>

            {/* Email with Validation Hint */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-600 ml-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-[15px] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#E64B3C]/10 focus:border-[#E2B13C]"
              />
              <p className="text-[12px] text-red-600 font-semibold flex items-center gap-1 ml-1">
                <span className="text-[10px]">●</span> Email is available
              </p>
            </div>

            {/* Password with Guidance & Strength Bar */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-600 ml-1">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-[15px] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#E64B3C]/10 focus:border-[#E2B13C]"
              />
              
              <p className="text-[11px] text-red-600/80 leading-tight ml-1 font-medium">
                Min 8 characters with uppercase, lowercase, and number
              </p>

              {/* Password Strength Indicator */}
              <div className="flex items-center gap-3 pt-2 px-1">
                <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[65%] bg-[#E2B13C] rounded-full transition-all duration-500" />
                </div>
                <span className="text-[11px] font-bold text-[#E2B13C] uppercase tracking-tighter">Medium</span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-600 ml-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full h-12 rounded-2xl border border-slate-100 bg-slate-50 px-5 text-[15px] outline-none transition-all focus:bg-white focus:ring-4 focus:ring-[#E64B3C]/10 focus:border-[#E2B13C]"
              />
            </div>

            {/* Terms & Conditions */}
            <label className="flex items-start gap-3 pt-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  className="peer h-5 w-5 rounded-md border-slate-300 text-[#E2B13C] focus:ring-[#E2B13C]/20 transition-all cursor-pointer" 
                />
              </div>
              <span className="text-[13px] text-slate-500 leading-snug">
                I agree to the{" "}
                <button type="button" className="text-[#E2B13C] font-bold hover:underline">Terms of Service</button>
                {" "}and{" "}
                <button type="button" className="text-[#E2B13C] font-bold hover:underline">Privacy Policy</button>.
              </span>
            </label>

            {/* Primary CTA */}
            <button
              onClick={() => nav('/customer/login')}
              type="submit"
              className="mt-4 w-full h-14 rounded-2xl bg-slate-900 text-[#E2B13C] text-[16px] cursor-pointer font-bold shadow-lg shadow-[#E64B3C]/20 hover:bg-slate-700 active:scale-[0.98] transition-transform duration-100"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-slate-100" />
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">or</div>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Social Sign Up */}
            <button
              onClick={() => nav('/customer/menu')}
              type="button"
              className="w-full h-13 rounded-2xl border border-slate-200 bg-white cursor-pointer shadow-sm flex items-center justify-center gap-3 text-[15px] font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            {/* Footer */}
            <div className="pt-2 text-center text-[14px] text-slate-500 font-medium">
              Already have an account?{" "}
              <button 
                onClick={() => nav('/customer/login')}
                type="button" 
                className="font-bold text-[#E2B13C] cursor-pointer hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}