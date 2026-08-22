import { Link } from "react-router";
import { useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";

import type {
  Opportunity,
  OpportunityStatus,
} from "../../types/opportunity";

import {
  getOpportunities,
} from "../../services/opportunityService";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =========================================================
   القطاعات
========================================================= */

const sectors = [
  "الكل",
  "عقاري",
  "سياحي",
  "زراعي",
  "تعدين",
  "صناعي",
  "بيئي",
  "بنية تحتية",
  "خدمي",
  "نقل",
  "صحي",
];

/* =========================================================
   الحالات
========================================================= */

const statuses: Array<
  "الكل" | OpportunityStatus
> = [
  "الكل",
  "فرصة استراتيجية",
  "فرصة جديدة",
  "إعادة تأهيل",
  "نشطة",
  "جاهزة",
  "قيد الدراسة",
  "مغلقة",
];

/* =========================================================
   إحداثيات الخريطة المؤقتة
   سيتم لاحقًا استبدالها بإحداثيات GIS حقيقية
========================================================= */

const markerPositions: Record<
  string,
  { x: number; y: number }
> = {
  "DZ-001": { x: 48, y: 42 },
  "DZ-002": { x: 55, y: 35 },
  "DZ-003": { x: 61, y: 48 },
  "DZ-004": { x: 67, y: 30 },
  "DZ-005": { x: 38, y: 58 },
  "DZ-006": { x: 73, y: 58 },
  "DZ-007": { x: 28, y: 36 },
  "DZ-008": { x: 25, y: 70 },
  "DZ-009": { x: 52, y: 68 },
  "DZ-010": { x: 78, y: 42 },
  "DZ-011": { x: 70, y: 24 },
  "DZ-012": { x: 43, y: 22 },
  "DZ-013": { x: 58, y: 55 },
  "DZ-014": { x: 35, y: 32 },
  "DZ-015": { x: 63, y: 65 },
  "DZ-016": { x: 82, y: 52 },
  "DZ-017": { x: 46, y: 74 },
  "DZ-018": { x: 32, y: 62 },
  "DZ-019": { x: 57, y: 76 },
  "DZ-020": { x: 22, y: 50 },
  "DZ-021": { x: 30, y: 78 },
  "DZ-022": { x: 37, y: 82 },
  "DZ-023": { x: 68, y: 73 },
  "DZ-024": { x: 75, y: 78 },
  "DZ-025": { x: 62, y: 35 },
  "DZ-026": { x: 72, y: 68 },
  "DZ-027": { x: 50, y: 25 },
  "DZ-028": { x: 44, y: 64 },
  "DZ-029": { x: 20, y: 66 },
  "DZ-030": { x: 66, y: 82 },
  "DZ-031": { x: 40, y: 45 },
  "DZ-032": { x: 53, y: 88 },
  "DZ-033": { x: 60, y: 60 },
  "DZ-034": { x: 34, y: 48 },
  "DZ-035": { x: 76, y: 58 },
  "DZ-036": { x: 58, y: 42 },
};

/* =========================================================
   الصفحة
========================================================= */

export default function InvestmentMap() {
  const [search, setSearch] = useState("");

  const [sector, setSector] =
    useState("الكل");

  const [status, setStatus] =
    useState<"الكل" | OpportunityStatus>("الكل");

  const [opportunities, setOpportunities] =
    useState<Opportunity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     تحميل الفرص من API
  ======================================================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getOpportunities();

        setOpportunities(data);
      } catch (err) {
        console.error(
          "Failed to load opportunities:",
          err
        );

        setError(
          "تعذر تحميل بيانات الفرص الاستثمارية من الخادم."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =======================================================
     البحث والتصفية
  ======================================================= */

  const filteredOpportunities = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return opportunities.filter((opportunity) => {
      const matchesSearch =
        searchValue === "" ||
        opportunity.name
          .toLowerCase()
          .includes(searchValue) ||
        opportunity.code
          .toLowerCase()
          .includes(searchValue) ||
        opportunity.sector
          .toLowerCase()
          .includes(searchValue) ||
        opportunity.location
          .toLowerCase()
          .includes(searchValue);

      const matchesSector =
        sector === "الكل" ||
        opportunity.sector === sector;

      const matchesStatus =
        status === "الكل" ||
        opportunity.status === status;

      return (
        matchesSearch &&
        matchesSector &&
        matchesStatus
      );
    });
  }, [
    opportunities,
    search,
    sector,
    status,
  ]);

  /* =======================================================
     المؤشرات
  ======================================================= */

  const activeCount =
    filteredOpportunities.filter(
      (item) => item.status === "نشطة"
    ).length;

  const readyCount =
    filteredOpportunities.filter(
      (item) => item.status === "جاهزة"
    ).length;

  const totalValue =
    filteredOpportunities.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

  /* =======================================================
     العرض
  ======================================================= */

  return (
    <>
      <PageMeta
        title="خارطة الاستثمار | خارطة الاستثمار الذكية"
        description="الخارطة الجغرافية للفرص الاستثمارية"
      />

      <div
        dir="rtl"
        className="space-y-6"
      >

        {/* =================================================
            عنوان الصفحة
        ================================================= */}

        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            خارطة الاستثمار
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            استكشاف وتوزيع الفرص الاستثمارية جغرافيًا
          </p>
        </div>

        {/* =================================================
            المؤشرات
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MapMetric
            title="الفرص الظاهرة"
            value={filteredOpportunities.length.toString()}
          />

          <MapMetric
            title="الفرص النشطة"
            value={activeCount.toString()}
          />

          <MapMetric
            title="الفرص الجاهزة"
            value={readyCount.toString()}
          />

          <MapMetric
            title="القيمة الاستثمارية"
            value={`${totalValue.toLocaleString(
              "en-US",
              {
                maximumFractionDigits: 2,
              }
            )} مليون`}
            suffix="دولار"
          />

        </div>

        {/* =================================================
            البحث والتصفية
        ================================================= */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* البحث */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                البحث
              </label>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="ابحث عن فرصة أو موقع..."
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  text-sm
                  text-gray-800
                  outline-none
                  transition
                  focus:border-brand-500
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-white
                "
              />
            </div>

            {/* القطاع */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                القطاع
              </label>

              <select
                value={sector}
                onChange={(event) =>
                  setSector(
                    event.target.value
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  text-sm
                  text-gray-800
                  outline-none
                  focus:border-brand-500
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-white
                "
              >
                {sectors.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* الحالة */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                الحالة
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "الكل"
                      | OpportunityStatus
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  text-sm
                  text-gray-800
                  outline-none
                  focus:border-brand-500
                  dark:border-gray-700
                  dark:bg-gray-900
                  dark:text-white
                "
              >
                {statuses.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* =================================================
            الخريطة والقائمة
        ================================================= */}

        <div className="grid grid-cols-12 gap-6">

          {/* =================================================
              الخريطة
          ================================================= */}

          <div className="col-span-12 xl:col-span-9">

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    التوزيع الجغرافي للفرص
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    دير الزور والمناطق المحيطة
                  </p>
                </div>

                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  {filteredOpportunities.length} فرصة
                </span>

              </div>

              {/* =================================================
                  تحميل
              ================================================= */}

              {loading && (
                <div className="flex h-[620px] items-center justify-center bg-gray-100 dark:bg-gray-950">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    جاري تحميل الفرص الاستثمارية...
                  </div>
                </div>
              )}

              {/* =================================================
                  خطأ
              ================================================= */}

              {!loading && error && (
                <div className="flex h-[620px] items-center justify-center bg-gray-100 dark:bg-gray-950">
                  <div className="rounded-xl bg-white px-6 py-4 text-sm text-red-500 shadow-lg dark:bg-gray-900">
                    {error}
                  </div>
                </div>
              )}

              {/* =================================================
                  الخريطة
              ================================================= */}

              {!loading && !error && (
                <div className="relative h-[620px] overflow-hidden bg-gray-100 dark:bg-gray-950">

                  {/* شبكة الخريطة */}

                  <div
                    className="absolute inset-0 opacity-60 dark:opacity-30"
                    style={{
                      backgroundImage: `
                        linear-gradient(
                          to right,
                          rgba(148,163,184,0.18) 1px,
                          transparent 1px
                        ),
                        linear-gradient(
                          to bottom,
                          rgba(148,163,184,0.18) 1px,
                          transparent 1px
                        )
                      `,
                      backgroundSize:
                        "50px 50px",
                    }}
                  />

                  {/* منطقة الخريطة */}

                  <div className="absolute left-[12%] top-[10%] h-[75%] w-[75%] rounded-[45%] border-2 border-dashed border-gray-300 bg-white/40 dark:border-gray-700 dark:bg-white/[0.02]" />

                  {/* عنوان المحافظة */}

                  <div className="absolute left-1/2 top-5 -translate-x-1/2">
                    <div className="rounded-lg bg-white/90 px-4 py-2 text-xs font-medium text-gray-600 shadow-sm dark:bg-gray-900/90 dark:text-gray-300">
                      محافظة دير الزور
                    </div>
                  </div>

                  {/* نهر الفرات - تمثيل بصري مؤقت */}

                  <div className="absolute left-[47%] top-[5%] h-[90%] w-[70px] -rotate-[8deg] rounded-[50%] bg-blue-200/50 blur-sm dark:bg-blue-900/20" />

                  {/* =================================================
                      نقاط الفرص
                  ================================================= */}

                  {filteredOpportunities.map(
                    (opportunity) => {

                      const position =
                        markerPositions[
                          opportunity.code
                        ] ?? {
                          x: 50,
                          y: 50,
                        };

                      return (
                        <Link
                          key={opportunity.code}
                          to={`/opportunities/${opportunity.code}`}
                          className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                          }}
                          title={`عرض ${opportunity.name}`}
                          aria-label={`عرض تفاصيل ${opportunity.name}`}
                        >

                          <span
                            className={`
                              relative
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-full
                              border-4
                              border-white
                              text-[10px]
                              font-bold
                              text-white
                              shadow-lg
                              transition
                              duration-200
                              group-hover:scale-125
                              group-focus:scale-125
                              dark:border-gray-900
                              ${getMarkerColor(
                                opportunity.status
                              )}
                            `}
                          >

                            {opportunity.code.replace(
                              "DZ-",
                              ""
                            )}

                            <span
                              className={`
                                absolute
                                inset-[-6px]
                                -z-10
                                animate-ping
                                rounded-full
                                opacity-20
                                ${getMarkerColor(
                                  opportunity.status
                                )}
                              `}
                            />

                          </span>

                        </Link>
                      );
                    }
                  )}

                  {/* لا توجد نتائج */}

                  {filteredOpportunities.length ===
                    0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-500 shadow-lg dark:bg-gray-900 dark:text-gray-400">
                        لا توجد فرص تطابق معايير البحث.
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      مفتاح الخريطة
                  ================================================= */}

                  <div className="absolute bottom-5 right-5 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900/95">

                    <p className="mb-3 text-xs font-semibold text-gray-700 dark:text-gray-300">
                      حالة الفرصة
                    </p>

                    <div className="space-y-2">

                      <LegendItem
                        color="bg-green-500"
                        label="نشطة"
                      />

                      <LegendItem
                        color="bg-blue-500"
                        label="جاهزة"
                      />

                      <LegendItem
                        color="bg-yellow-500"
                        label="قيد الدراسة"
                      />

                      <LegendItem
                        color="bg-purple-500"
                        label="فرصة استراتيجية"
                      />

                      <LegendItem
                        color="bg-gray-500"
                        label="حالات أخرى"
                      />

                    </div>

                  </div>

                  {/* =================================================
                      التحكم بالتكبير
                  ================================================= */}

                  <div className="absolute bottom-5 left-5 flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">

                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center border-b border-gray-200 text-lg text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center text-lg text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      −
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* =================================================
              قائمة الفرص
          ================================================= */}

          <div className="col-span-12 xl:col-span-3">

            <div className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

              <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">

                <h2 className="font-semibold text-gray-800 dark:text-white">
                  الفرص على الخريطة
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  اختر فرصة لعرض تفاصيلها
                </p>

              </div>

              <div className="max-h-[620px] overflow-y-auto">

                {!loading &&
                  !error &&
                  filteredOpportunities.map(
                    (opportunity) => (
                      <Link
                        key={opportunity.code}
                        to={`/opportunities/${opportunity.code}`}
                        className="flex w-full items-start gap-3 border-b border-gray-100 p-4 text-right transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.03]"
                      >

                        <span
                          className={`
                            mt-1
                            h-3
                            w-3
                            shrink-0
                            rounded-full
                            ${getMarkerColor(
                              opportunity.status
                            )}
                          `}
                        />

                        <span className="min-w-0 flex-1">

                          <span className="block text-xs font-semibold text-brand-600">
                            {opportunity.code}
                          </span>

                          <span className="mt-1 block truncate text-sm font-medium text-gray-800 dark:text-white">
                            {opportunity.name}
                          </span>

                          <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                            {opportunity.location}
                          </span>

                          <span className="mt-1 block text-xs text-gray-400">
                            {opportunity.status}
                          </span>

                        </span>

                      </Link>
                    )
                  )}

                {!loading &&
                  !error &&
                  filteredOpportunities.length ===
                    0 && (
                    <div className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      لا توجد فرص مطابقة.
                    </div>
                  )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

/* =========================================================
   بطاقة المؤشر
========================================================= */

function MapMetric({
  title,
  value,
  suffix,
}: {
  title: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <div className="mt-3 flex items-end gap-2">

        <span className="text-3xl font-bold text-gray-800 dark:text-white">
          {value}
        </span>

        {suffix && (
          <span className="mb-1 text-sm text-gray-500">
            {suffix}
          </span>
        )}

      </div>

    </div>
  );
}

/* =========================================================
   لون نقطة الخريطة
========================================================= */

function getMarkerColor(
  status: OpportunityStatus
) {
  switch (status) {
    case "نشطة":
      return "bg-green-500";

    case "جاهزة":
      return "bg-blue-500";

    case "قيد الدراسة":
      return "bg-yellow-500";

    case "فرصة استراتيجية":
      return "bg-purple-500";

    case "فرصة جديدة":
      return "bg-blue-500";

    case "إعادة تأهيل":
      return "bg-orange-500";

    case "مغلقة":
      return "bg-gray-500";

    default:
      return "bg-gray-500";
  }
}

/* =========================================================
   مفتاح الخريطة
========================================================= */

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`h-2.5 w-2.5 rounded-full ${color}`}
      />

      <span className="text-xs text-gray-600 dark:text-gray-400">
        {label}
      </span>

    </div>
  );
}