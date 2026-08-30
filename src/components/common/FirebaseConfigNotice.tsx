import React, { useState } from 'react';
import { Database, CheckCircle2, ChevronDown, ChevronUp, Copy, Sparkles, Key } from 'lucide-react';
import { isFirebaseConfigured } from '../../firebase/config';
import { useToast } from '../../context/ToastContext';

export const FirebaseConfigNotice: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { success } = useToast();

  const envSample = `VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-app-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envSample);
    success('Copied .env template to clipboard!');
  };

  if (isFirebaseConfigured) {
    if (compact) return null;
    return (
      <div className="bg-emerald-50/80 border border-emerald-200 text-emerald-900 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">Firebase Live Sync Connected (Authentication & Cloud Firestore Active)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-xl p-3 text-slate-800 text-xs shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>Interactive Demo Mode Active</span>
              <span className="bg-amber-200/70 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-md font-semibold">Local Persistence</span>
            </div>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Full features (search, filtering, dual-role auth, property listing, visits & enquiries) work seamlessly in browser storage.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-amber-900 hover:text-amber-700 font-semibold px-2 py-1 rounded-md hover:bg-amber-100/50 transition-colors ml-2 shrink-0 cursor-pointer"
        >
          <span>{isOpen ? 'Hide' : 'Firebase Setup'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-amber-200/60 space-y-2.5 text-xs">
          <p className="text-slate-700 leading-relaxed">
            To connect your live Google Firebase project, provide these variables in your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900 font-semibold">.env</code> file:
          </p>

          <div className="relative bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
            <button
              onClick={copyEnv}
              className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Copy snippet"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <pre className="pr-8">{envSample}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
