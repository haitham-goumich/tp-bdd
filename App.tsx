
import React, { useState } from 'react';
import { ResearchPaper } from './components/ResearchPaper';
import { FirebaseGallery } from './components/FirebaseGallery';
import { SetupGuide } from './components/SetupGuide';
import { firebaseConfig } from './firebaseConfig';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('RESEARCH');

  // التحقق مما إذا كانت الإعدادات تخص مشروع المستخدم tp-bdd-c0388
  const isConfigured = firebaseConfig.projectId === "tp-bdd-c0388";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
      {/* Navigation Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-orange-600 p-1.5 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">مشروع Firebase الأكاديمي</h1>
            <span className="text-slate-300 hidden sm:block">|</span>
            <nav className="flex space-x-2 space-x-reverse">
              <button 
                onClick={() => setMode('RESEARCH')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'RESEARCH' ? 'bg-orange-50 text-orange-700' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                البحث
              </button>
              <button 
                onClick={() => setMode('GALLERY')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${mode === 'GALLERY' ? 'bg-orange-50 text-orange-700' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                المعرض التطبيقي
              </button>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`flex h-2 w-2 rounded-full ${isConfigured ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`text-xs font-bold ${isConfigured ? 'text-green-600' : 'text-red-500'}`}>
              {isConfigured ? `متصل بـ ${firebaseConfig.projectId}` : 'بانتظار الربط'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl mx-auto w-full p-6">
        {mode === 'RESEARCH' && <ResearchPaper />}
        
        {mode === 'GALLERY' && (
          isConfigured ? (
            <FirebaseGallery config={firebaseConfig} />
          ) : (
            <SetupGuide />
          )
        )}
      </main>

      <footer className="bg-white border-t py-8 text-center">
        <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">
          Cloud Infrastructure: {firebaseConfig.storageBucket}
        </p>
      </footer>
    </div>
  );
};

export default App;
