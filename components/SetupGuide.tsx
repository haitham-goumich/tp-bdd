
import React, { useState } from 'react';
import { initializeApp, getApps, deleteApp, FirebaseApp } from 'firebase/app';
import { getStorage, ref, listAll } from 'firebase/storage';
import { FirebaseConfig } from '../types';

interface InteractiveSetupProps {
  onConfigured: (config: FirebaseConfig) => void;
}

const placeholder = `{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "..."
}`;

// Extracted and corrected from user's RESEARCH.md file
const prefilledConfig = {
  apiKey: "AIzaSyBwwJt6wGgHdRrXnIjx7USsl-q4RurGRiY",
  authDomain: "tp-bdd-c0388.firebaseapp.com",
  projectId: "tp-bdd-c0388",
  storageBucket: "tp-bdd-c0388.appspot.com", // Corrected from .firebasestorage.app
  messagingSenderId: "697403129645",
  appId: "1:697403129645:web:f98ed76d15c8eee7995da4"
};

const storageRulesCode = `service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // For academic demo only
    }
  }
}`;

export const SetupGuide: React.FC<InteractiveSetupProps> = ({ onConfigured }) => {
  const [configInput, setConfigInput] = useState(JSON.stringify(prefilledConfig, null, 2));
  const [status, setStatus] = useState<'IDLE' | 'TESTING' | 'ERROR'>('IDLE');
  const [error, setError] = useState<{title: string, details: string, solution?: 'RULES' | 'CONFIG'} | null>(null);

  const handleTestConnection = async () => {
    setStatus('TESTING');
    setError(null);
    let config: FirebaseConfig;
    let tempApp: FirebaseApp | null = null;

    try {
      // 1. Parse Input
      try {
        config = JSON.parse(configInput);
        if (!config.projectId || !config.storageBucket) throw new Error();
      } catch (e) {
        setError({ title: "صيغة الإعدادات غير صحيحة", details: "تأكد من أنك نسخت الكائن (object) كاملاً من Firebase Console، بما في ذلك الأقواس {}.", solution: 'CONFIG' });
        setStatus('ERROR');
        return;
      }
      
      // 2. Test Initialization and Connection
      const appName = `test-${Date.now()}`;
      tempApp = initializeApp(config, appName);
      const storage = getStorage(tempApp);
      await listAll(ref(storage, '/')); // Test read access
      
      // 3. Success
      onConfigured(config);

    } catch (err: any) {
      console.error("Connection Test Failed:", err);
      if (err.code === 'storage/unauthorized') {
        setError({ title: "فشل الاتصال بسبب الصلاحيات", details: "تمكن التطبيق من الاتصال بمشروعك، لكن صلاحيات Storage تمنع قراءة الملفات.", solution: 'RULES' });
      } else {
        setError({ title: "فشل الاتصال بـ Firebase", details: "تأكد من أن البيانات التي أدخلتها صحيحة ومطابقة للمشروع الذي أنشأته. قد يكون هناك خطأ في apiKey أو projectId.", solution: 'CONFIG' });
      }
      setStatus('ERROR');
    } finally {
      if (tempApp) {
        deleteApp(tempApp).catch(console.error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in py-10 px-4 text-right" dir="rtl">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
        <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-orange-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">الخطوة الأخيرة: ربط مشروعك</h2>
        <p className="text-slate-500 text-center mb-10">لكي يعمل المعرض التطبيقي، يجب ربطه بمشروع Firebase الخاص بك.</p>
        
        <div className="space-y-6">
            <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg" role="alert">
                <p className="font-bold">مرحباً!</p>
                <p>لقد لاحظت أنك أضفت بيانات مشروعك في ملف البحث. لقد قمتُ بملء الحقل أدناه تلقائياً وتصحيح `storageBucket` لتسريع العملية. فقط اضغط على 'فحص واتصال' للمتابعة.</p>
            </div>

          <textarea
            value={configInput}
            onChange={(e) => setConfigInput(e.target.value)}
            className="w-full h-48 p-4 font-mono text-sm border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition dir-ltr text-left"
            placeholder={placeholder}
            disabled={status === 'TESTING'}
          />
          
          <button 
            onClick={handleTestConnection}
            disabled={status === 'TESTING' || !configInput}
            className="w-full bg-orange-600 text-white font-bold text-lg py-4 rounded-lg hover:bg-orange-700 transition disabled:bg-slate-400 flex items-center justify-center gap-3"
          >
            {status === 'TESTING' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  جاري الفحص...
                </>
            ) : "فحص واتصال"}
          </button>
        </div>

        {error && (
            <div className={`mt-6 bg-red-50 p-6 rounded-2xl border-2 border-dashed border-red-200 animate-fade-in`}>
                <div className="flex items-start gap-4">
                    <svg className="w-8 h-8 shrink-0 text-red-500 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
                    <div>
                        <h3 className="text-lg font-bold text-red-800 mb-2">{error.title}</h3>
                        <p className="text-sm text-red-700">{error.details}</p>
                        {error.solution === 'RULES' && (
                            <div className='mt-4'>
                                <p className='font-bold text-sm text-red-800 mb-2'>لحل المشكلة، اذهب إلى Storage &gt; Rules في مشروعك واستخدم الكود التالي:</p>
                                <div className="relative bg-slate-800 text-white p-4 pr-16 rounded-lg font-mono text-xs dir-ltr text-left tracking-wider">
                                    <button onClick={() => navigator.clipboard.writeText(storageRulesCode)} className="absolute top-2 right-2 bg-slate-600 hover:bg-slate-500 text-white p-2 rounded-md transition" aria-label="نسخ الكود"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                                    <pre><code>{storageRulesCode}</code></pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
