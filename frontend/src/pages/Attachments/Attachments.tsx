import PageMeta from "../../components/common/PageMeta";

export default function Attachments() {
  return (
    <>
      <PageMeta
        title="الوثائق والمرفقات | خارطة الاستثمار الذكية"
        description="إدارة الوثائق والمرفقات المرتبطة بالفرص الاستثمارية"
      />

      <div dir="rtl" className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            الوثائق والمرفقات
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            استعراض وإدارة الوثائق والمرفقات الخاصة بالفرص الاستثمارية
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            صفحة الوثائق والمرفقات قيد التطوير.
          </p>
        </div>
      </div>
    </>
  );
}