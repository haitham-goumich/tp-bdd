
import React from 'react';

interface ResearchPaperProps {
  projectId: string;
}

export const ResearchPaper: React.FC<ResearchPaperProps> = ({ projectId }) => {
  const isLinked = projectId !== "غير مربوط";

  return (
    <div className="bg-white shadow-xl max-w-4xl mx-auto p-12 my-8 rounded-sm leading-relaxed text-justify border-t-8 border-orange-600 animate-fade-in relative overflow-hidden">
      {/* علامة مائية تقنية */}
      {isLinked && (
        <div className="absolute top-5 left-5 opacity-10 rotate-12 pointer-events-none hidden md:block">
          <p className="text-xs font-mono text-slate-500 uppercase">Cloud Connected: {projectId}</p>
        </div>
      )}

      {/* Title Page */}
      <section className="text-center mb-16 min-h-[70vh] flex flex-col justify-center">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800">جامعة المستقبل</h2>
          <h3 className="text-lg text-slate-500">كلية تكنولوجيا المعلومات - قسم علوم الحاسوب</h3>
        </div>
        
        <div className="py-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            بنية قواعد البيانات المتقدمة <br/>
            <span className="text-orange-600">في بيئات الحوسبة السحابية</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            دراسة تطبيقية على منصة Firebase كنموذج لقواعد بيانات الـ NoSQL وإدارة الوسائط
          </p>
          {isLinked && (
            <div className="mt-4 inline-block bg-green-50 text-green-700 px-4 py-1 rounded-full text-xs font-mono border border-green-100">
              ID المشروق المربوط: {projectId}
            </div>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-8 border-t pt-12 text-right">
          <div>
            <p className="text-slate-400 text-sm">إعداد الطالب:</p>
            <p className="font-bold text-lg text-slate-800">[اسمك الكريم]</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">بإشراف الدكتور الفاضل:</p>
            <p className="font-bold text-lg text-slate-800">[اسم الأستاذ]</p>
          </div>
        </div>
      </section>

      <div className="page-break" />

      {/* Introduction */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-orange-600 mb-8 flex items-center gap-3">
          <span className="bg-orange-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          المقدمة والهدف من البحث
        </h2>
        <p className="text-lg mb-6">
          مع تطور الأنظمة الموزعة وضخامة البيانات (Big Data)، انتقل تركيز هندسة قواعد البيانات من النماذج العلائقية التقليدية إلى نماذج أكثر مرونة وتوسعاً. تمثل منصة Firebase نقلة نوعية في مفهوم "الخلفية كخدمة" (Backend as a Service).
        </p>
      </section>

      {/* Screenshot 1 Area */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-orange-600 mb-8">2. بنية NoSQL في Firebase</h2>
        <p className="text-slate-700 mb-4">
          يعتمد نظام التخزين في <span className="font-mono text-blue-600 font-bold">{isLinked ? projectId : 'مشروعك'}</span> على هيكلية Firestore التي تسمح بالاستعلامات المعقدة في زمن حقيقي.
        </p>
        <div className="bg-slate-50 border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center my-6">
          <p className="text-orange-800 font-bold mb-2">📸 موقع لقطة الشاشة رقم 1</p>
          <p className="text-slate-500 text-sm mb-4">اذهب إلى Firebase Console > Firestore Database والتقط صورة للهيكل.</p>
          <div className="bg-white h-48 rounded border border-slate-200 flex items-center justify-center text-slate-300">
            [مكان الصورة في البحث المطبوع]
          </div>
        </div>
      </section>

      {/* Screenshot 2 Area */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-orange-600 mb-8">3. إدارة الوسائط (Storage)</h2>
        <div className="bg-slate-50 border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center my-6">
          <p className="text-orange-800 font-bold mb-2">📸 موقع لقطة الشاشة رقم 2</p>
          <p className="text-slate-500 text-sm mb-4">اذهب إلى Firebase Console > Storage والتقط صورة للملفات المرفوعة في الـ Bucket الخاص بك.</p>
          <div className="bg-white h-48 rounded border border-slate-200 flex items-center justify-center text-slate-300">
            [مكان الصورة في البحث المطبوع]
          </div>
        </div>
      </section>

      {isLinked && (
        <div className="mt-20 border-t pt-8">
          <p className="text-sm text-slate-500 italic">ملاحظة: تم التحقق من ربط المشروع بنجاح مع {projectId}.</p>
        </div>
      )}
    </div>
  );
};
