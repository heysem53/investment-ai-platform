import PageMeta from "../../components/common/PageMeta";

export default function FinancialData() {
  return (
    <>
      <PageMeta
        title="البيانات المالية | خارطة الاستثمار الذكية"
        description="البيانات والمؤشرات المالية للفرص الاستثمارية"
      />

      <div dir="rtl" className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            البيانات المالية
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            استعراض وتحليل البيانات والمؤشرات المالية للفرص الاستثمارية
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            صفحة البيانات المالية قيد التطوير.
          </p>
        </div>
      </div>
    </>
  );
}