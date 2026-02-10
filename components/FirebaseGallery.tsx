
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { FirebaseConfig, FirebaseImage } from '../types';

interface GalleryProps {
  config: FirebaseConfig;
}

export const FirebaseGallery: React.FC<GalleryProps> = ({ config }) => {
  const [images, setImages] = useState<FirebaseImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const app = getApps().length === 0 ? initializeApp(config) : getApp();
  const storage = getStorage(app);

  const fetchImages = async () => {
    setError(null);
    try {
      const storageRef = ref(storage, 'gallery/');
      const result = await listAll(storageRef);
      
      const imagePromises = result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return { id: item.fullPath, url, name: item.name, createdAt: Date.now() };
      });

      const fetchedImages = await Promise.all(imagePromises);
      setImages(fetchedImages.sort((a, b) => b.createdAt - a.createdAt));
    } catch (err: any) {
      console.error("Fetch Error:", err.code, err.message);
      if (err.code === 'storage/unauthorized') {
        setError(`فشل الاتصال: لا توجد صلاحيات لقراءة الملفات.\nاذهب إلى Firebase Console > Storage > Rules وحدثها.\nللتجربة، يمكنك استخدام القاعدة التالية:`);
      } else if (err.code === 'storage/object-not-found') {
        setImages([]); // Not an error, just an empty bucket
      } else {
        setError("خطأ في الاتصال: تأكد من صحة بيانات Firebase في ملف firebaseConfig.ts.");
      }
    }
  };

  useEffect(() => {
    fetchImages();
  }, [config]);
  
  const uploadFile = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError("الرجاء اختيار ملف صورة صالح.");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (err: any) => {
        console.error("Upload Error:", err.code, err.message);
        let detailedError = "فشل الرفع: خطأ غير معروف.";
        if (err.code === 'storage/unauthorized') {
            detailedError = `فشل الرفع بسبب الصلاحيات.\nاذهب إلى Firebase Console > Storage > Rules وحدثها.\nللتجربة، يمكنك استخدام القاعدة التالية:`;
        }
        setError(detailedError);
        setUploading(false);
      },
      () => {
        setUploading(false);
        fetchImages();
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    );
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!uploading) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (uploading) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleDelete = async (imagePath: string) => {
    if (!window.confirm("هل تريد حذف هذه الصورة نهائياً من السحاب؟")) return;
    try {
      await deleteObject(ref(storage, imagePath));
      fetchImages();
    } catch (err) {
      setError("فشل الحذف. قد تحتاج لمراجعة صلاحيات الوصول.");
    }
  };

  const storageRulesCode = `service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // For academic demo only
    }
  }
}`;

  return (
    <div className="space-y-8">
      {/* منطقة الرفع */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && !error && fileInputRef.current?.click()}
        className={`relative border-4 border-dashed rounded-3xl p-8 text-center transition-all duration-300 group ${
          isDragging ? 'border-orange-500 bg-orange-50 scale-105' : 'border-slate-300 bg-slate-50 hover:border-orange-400'
        } ${uploading || error ? 'cursor-not-allowed bg-slate-100 opacity-70' : 'cursor-pointer'}`}
      >
        <input type="file" accept="image/*" onChange={handleFileSelect} ref={fileInputRef} className="hidden" id="file-upload" disabled={uploading || !!error} />
        <div className="flex flex-col items-center justify-center space-y-4 text-slate-500">
          <svg className={`w-16 h-16 transition-transform group-hover:scale-110 ${isDragging ? 'text-orange-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          <p className="font-bold text-lg">اسحب وأفلت الصور هنا، أو انقر للاختيار</p>
          <p className="text-sm">للحصول على أفضل نتيجة، استخدم صوراً عالية الجودة</p>
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl">
            <p className="font-bold text-orange-600 mb-2">جاري الرفع...</p>
            <div className="w-1/2 bg-slate-200 rounded-full h-2.5">
              <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-slate-500 mt-1">{Math.round(progress)}%</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 p-6 rounded-2xl border-2 border-dashed border-red-200 shadow-lg">
          <div className="flex items-start gap-4">
            <svg className="w-8 h-8 shrink-0 text-red-500 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-2">{error.split('\n')[0]}</h3>
              <p className="text-sm text-red-700">{error.split('\n')[1]}</p>
              {(error.includes('storage/unauthorized') || error.includes('صلاحيات')) && (
                  <div className='mt-4'>
                      <p className='font-bold text-sm text-red-800 mb-2'>{error.split('\n')[2]}</p>
                      <div className="relative bg-slate-800 text-white p-4 pr-16 rounded-lg font-mono text-xs dir-ltr text-left tracking-wider">
                          <button 
                              onClick={() => navigator.clipboard.writeText(storageRulesCode)}
                              className="absolute top-2 right-2 bg-slate-600 hover:bg-slate-500 text-white p-2 rounded-md transition"
                              aria-label="نسخ الكود"
                          >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                          </button>
                          <pre><code>{storageRulesCode}</code></pre>
                      </div>
                  </div>
              )}
              <button 
                onClick={fetchImages}
                className="mt-6 bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 11a9 9 0 0114.65-4.65l1.35 1.35M20 13a9 9 0 01-14.65 4.65l-1.35-1.35" /></svg>
                  إعادة محاولة الاتصال
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
            <img src={img.url} alt={img.name} className="w-full h-56 object-cover transition duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-white text-xs truncate mb-3">{img.name}</p>
              <button onClick={() => handleDelete(img.id)} className="w-full bg-red-500/80 hover:bg-red-600 text-white py-2 rounded-lg text-xs backdrop-blur-sm transition">
                حذف من السحاب
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && !uploading && !error && (
          <div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">لا يوجد صور مرفوعة حالياً في حسابك</p>
            <p className="text-slate-400 text-sm mt-1">ابدأ برفع أول صورة!</p>
          </div>
        )}
      </div>
    </div>
  );
};
