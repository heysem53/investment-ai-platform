import PageMeta from "../../components/common/PageMeta";

export default function AIAnalysis() {
  return (
    <>
      <PageMeta
        title="التحليل والذكاء الاصطناعي | خارطة الاستثمار الذكية"
        description="تحليل الفرص الاستثمارية باستخدام الذكاء الاصطناعي"
      />

      <div dir="rtl" className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            التحليل والذكاء الاصطناعي
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            تحليل وتقييم الفرص الاستثمارية باستخدام البيانات والذكاء الاصطناعي
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            وحدة التحليل والذكاء الاصطناعي قيد التطوير.
          </p>
        </div>
      </div>
    </>
  );
}