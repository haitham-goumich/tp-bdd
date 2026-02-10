
import React from 'react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in py-10 px-4 text-right" dir="rtl">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-slate-100">
        <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-orange-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">دليل الحصول على لقطات الشاشة للبحث</h2>
        
        <div className="space-y-10">
          {/* الخطوة 1 */}
          <section className="border-r-4 border-orange-500 pr-6">
            <h3 className="text-xl font-bold text-slate-800 mb-3">1. كيف تجد Project ID الخاص بك؟</h3>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              هو المعرف الفريد لمشروعك. ستجده في صفحة <b>Project Settings</b> (أيقونة الترس في القائمة الجانبية). ستحتاجه لوضع الرابط في المتصفح.
            </p>
          </section>

          {/* الخطوة 2 */}
          <section className="border-r-4 border-blue-500 pr-6">
            <h3 className="text-xl font-bold text-slate-800 mb-3 text-blue-600">2. لقطة شاشة Firestore (لقواعد البيانات)</h3>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              من القائمة الجانبية في Firebase Console، اختر <b>Build</b> ثم <b>Firestore Database</b>. 
              هذه الصورة تظهر هيكل "المجموعات والمستندات" (NoSQL) وهي ضرورية جداً لبحثك الأكاديمي.
            </p>
            <a href="https://console.firebase.google.com/" target="_blank" className="inline-flex items-center text-blue-600 font-bold hover:underline">
              انقر هنا لفتح لوحة التحكم ←
            </a>
          </section>

          {/* الخطوة 3 */}
          <section className="border-r-4 border-green-500 pr-6">
            <h3 className="text-xl font-bold text-slate-800 mb-3 text-green-600">3. لقطة شاشة Storage (لتخزين الصور)</h3>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              من القائمة الجانبية اختر <b>Storage</b>. بعد رفع أول صورة من خلال "المعرض التطبيقي" في هذا الموقع، ستظهر لك الصورة هناك.
              التقط لقطة شاشة لهذه الصفحة لتثبت أن البيانات تم تخزينها سحابياً.
            </p>
          </section>

          {/* تنبيه هام */}
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
            <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
              ⚠️ ملاحظة هامة جداً:
            </h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              لكي تعمل لقطات الشاشة وتظهر الصور، يجب عليك أولاً الذهاب لتبويب <b>Rules</b> داخل Storage في Firebase وتغييرها لتسمح بالقراءة والكتابة، أو اجعلها كالتالي:
              <br/>
              <code className="block bg-white p-2 mt-2 rounded font-mono text-[10px] dir-ltr text-left">
                allow read, write: if true;
              </code>
              (هذا للإصدار التجريبي فقط في مشروعك الأكاديمي).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
