import PageMeta from "../../components/common/PageMeta";

export default function Locations() {
  return (
    <>
      <PageMeta
        title="المواقع والمناطق | خارطة الاستثمار الذكية"
        description="المواقع والمناطق والوحدات الإدارية الاستثمارية"
      />

      <div dir="rtl" className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            المواقع والمناطق
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            إدارة واستعراض المواقع والمناطق والوحدات الإدارية المرتبطة بالفرص الاستثمارية
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            صفحة المواقع والمناطق قيد التطوير.
          </p>
        </div>
      </div>
    </>
  );
}