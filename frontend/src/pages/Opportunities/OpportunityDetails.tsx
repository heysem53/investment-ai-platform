import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";

import {
  getOpportunityByCodeApi,
  type OpportunityApiResponse,
} from "../../services/opportunityApi";

export default function OpportunityDetails() {
  const { code } = useParams();

  const [data, setData] = useState<OpportunityApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) {
      setLoading(false);
      return;
    }

    getOpportunityByCodeApi(code)
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        console.error("Failed to load opportunity:", error);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code]);

  if (loading) {
    return (
      <div
        dir="rtl"
        className="flex min-h-[400px] items-center justify-center"
      >
        <p className="text-sm text-gray-500">جاري تحميل بيانات الفرصة...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div dir="rtl" className="space-y-6">
        <PageMeta
          title="الفرصة غير موجودة | خارطة الاستثمار الذكية"
          description="الفرصة الاستثمارية المطلوبة غير موجودة"
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-500 dark:bg-white/[0.05]">
            ?
          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-800 dark:text-white">
            الفرصة غير موجودة
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            لم يتم العثور على فرصة استثمارية بهذا الرمز.
          </p>

          <Link
            to="/opportunities"
            className="mt-6 inline-flex rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            العودة إلى الفرص الاستثمارية
          </Link>
        </div>
      </div>
    );
  }

  const opportunity = data.opportunity;
  const financial = data.financial;

  const references = data.references;
  const location = data.location;
  const locationReference = data.location_reference;
  const projectDetails = data.project_details;
  const capacityUnit = data.capacity_unit;
  const employment = data.employment;

  /* =========================================================
     الحالة
  ========================================================= */

  const statusName = String(
    references.status?.name_ar ?? "غير محدد"
  );

  /* =========================================================
     البيانات المرجعية
  ========================================================= */

  const sectorName = String(
    references.sector?.name_ar ?? "غير محدد"
  );

  const subSectorName = String(
    references.sub_sector?.name_ar ?? "غير محدد"
  );

  const projectTypeName = String(
    references.project_type?.name_ar ?? "غير محدد"
  );

  const projectScaleName = String(
    references.project_scale?.name_ar ?? "غير محدد"
  );

  const investorTypeName = String(
    references.investor_type?.name_ar ?? "غير محدد"
  );

  const contractTypeName = String(
    references.contract_type?.name_ar ?? "غير محدد"
  );

  const ownershipName = String(
    references.ownership?.name_ar ?? "غير محدد"
  );

  const providerEntityName = String(
    references.provider_entity?.name_ar ?? "غير محدد"
  );

  const financingModelName = String(
    data.financial_reference?.financing_model?.name_ar ?? "غير محدد"
  );

  const currencyName = String(
    data.financial_reference?.currency?.name_ar ?? "غير محدد"
  );

  const currencyCode = String(
    data.financial_reference?.currency?.code ?? ""
  );

  /* =========================================================
     الموقع
  ========================================================= */

  const locationDescription = String(
    location?.description_ar ?? "غير محدد"
  );

  const administrativeUnitName = String(
    locationReference?.administrative_unit?.name_ar ?? "غير محدد"
  );

  const administrativeUnitTypeName = String(
    locationReference?.administrative_unit_type?.name_ar ?? "غير محدد"
  );

  const areaValue = Number(location?.area_value ?? 0);

  const areaUnitName = String(
    locationReference?.area_unit?.name_ar ?? "غير محدد"
  );

  const propertyNumbers = String(
    location?.property_numbers ?? "غير محدد"
  );

  const expandable =
    String(location?.expandable ?? "").toUpperCase() === "TRUE";

  const expansionAreaValue = Number(
    location?.expansion_area_value ?? 0
  );

  const latitude = String(location?.latitude ?? "");
  const longitude = String(location?.longitude ?? "");
  const mapUrl = String(location?.map_url ?? "");
  const locationNotes = String(location?.notes_ar ?? "");

  /* =========================================================
     تفاصيل المشروع
  ========================================================= */

  const projectDescription = String(
    projectDetails?.description_ar ??
      financial?.notes_ar ??
      "لا يوجد وصف تفصيلي متوفر حاليًا لهذه الفرصة."
  );

  const mainProduct = String(
    projectDetails?.main_product_ar ?? "غير محدد"
  );

  const mainProductSpecifications = String(
    projectDetails?.main_product_specifications_ar ?? "غير محدد"
  );

  const secondaryProducts = String(
    projectDetails?.secondary_products_ar ?? "غير محدد"
  );

  const productionCapacity = Number(
    projectDetails?.production_capacity ?? 0
  );

  const capacityUnitName = String(
    capacityUnit?.name_ar ?? "غير محدد"
  );

  const capacityUnitSymbol = String(
    capacityUnit?.symbol ?? ""
  );

  const targetMarket = String(
    projectDetails?.target_market_ar ?? "غير محدد"
  );

  const economicSocialJustification = String(
    projectDetails?.economic_social_justification_ar ?? "غير محدد"
  );

  /* =========================================================
     العمالة
  ========================================================= */

  const totalJobs = Number(employment?.total_jobs ?? 0);

  const localTotalWorkers = Number(
    employment?.local_total_workers ?? 0
  );

  const foreignTotalWorkers = Number(
    employment?.foreign_total_workers ?? 0
  );

  const requiredSkills = String(
    employment?.required_skills_ar ?? "غير محدد"
  );

  /* =========================================================
     البيانات المالية
  ========================================================= */

  const estimatedCost = Number(
    financial?.estimated_cost ?? 0
  );

  const annualReturn = Number(
    financial?.annual_investment_return ?? 0
  );

  const investmentValueMillion = estimatedCost / 1000000;

  const expectedReturnRate = Number(
    financial?.expected_return_rate ?? 0
  );

  const investmentPeriodYears = Number(
    financial?.investment_period_years ?? 0
  );

  const constructionPeriodYears = Number(
    financial?.construction_period_years ?? 0
  );

  const gracePeriodYears = Number(
    financial?.grace_period_years ?? 0
  );

 /* =========================================================
   الجاهزية الاستثمارية
   مؤشر محسوب من اكتمال وجودة بيانات الفرصة
========================================================= */

const readiness = (() => {
  let score = 0;

  /* ---------------------------------------------------------
     1. المعلومات الأساسية — 10%
  --------------------------------------------------------- */

  const basicFields = [
    opportunity.opportunity_code,
    opportunity.name_ar,
    opportunity.sector_id,
    opportunity.sub_sector_id,
    opportunity.project_type_id,
    opportunity.investor_type_id,
    opportunity.contract_type_id,
    opportunity.provider_entity_id,
    opportunity.ownership_id,
  ];

  const basicCompleted = basicFields.filter(
    (value) =>
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ""
  ).length;

  score += (basicCompleted / basicFields.length) * 10;


  /* ---------------------------------------------------------
     2. الموقع والعقار — 15%
  --------------------------------------------------------- */

  if (location) {
    let locationScore = 0;

    if (location.description_ar) locationScore += 3;
    if (location.administrative_unit_id) locationScore += 2;
    if (location.area_value) locationScore += 2;
    if (location.area_unit_id) locationScore += 1;
    if (location.property_numbers) locationScore += 1;
    if (location.latitude && location.longitude)
      locationScore += 3;
    if (location.map_url) locationScore += 1;
    if (location.expandable !== null && location.expandable !== undefined)
      locationScore += 1;
    if (
      location.expandable === "TRUE" &&
      location.expansion_area_value
    )
      locationScore += 1;

    score += Math.min(locationScore, 15);
  }


  /* ---------------------------------------------------------
     3. البيانات المالية — 20%
  --------------------------------------------------------- */

  if (financial) {
    let financialScore = 0;

    if (financial.estimated_cost) financialScore += 5;
    if (financial.currency_id) financialScore += 2;
    if (financial.estimation_source_ar) financialScore += 2;
    if (financial.annual_investment_return) financialScore += 2;
    if (financial.investment_period_years) financialScore += 2;
    if (financial.construction_period_years) financialScore += 2;
    if (financial.grace_period_years) financialScore += 1;
    if (financial.financing_model_id) financialScore += 2;
    if (financial.expected_return_rate) financialScore += 2;

    score += Math.min(financialScore, 20);
  }


  /* ---------------------------------------------------------
     4. تفاصيل المشروع — 15%
  --------------------------------------------------------- */

  if (projectDetails) {
    let projectScore = 0;

    if (projectDetails.description_ar)
      projectScore += 4;

    if (projectDetails.main_product_ar)
      projectScore += 2;

    if (projectDetails.main_product_specifications_ar)
      projectScore += 2;

    if (projectDetails.secondary_products_ar)
      projectScore += 1;

    if (projectDetails.production_capacity)
      projectScore += 2;

    if (projectDetails.capacity_unit_id)
      projectScore += 1;

    if (projectDetails.target_market_ar)
      projectScore += 1;

    if (projectDetails.economic_social_justification_ar)
      projectScore += 2;

    score += Math.min(projectScore, 15);
  }


  /* ---------------------------------------------------------
     5. البنية التحتية — 10%
  --------------------------------------------------------- */

  if (
    Array.isArray(data.infrastructure) &&
    data.infrastructure.length > 0
  ) {
    const totalInfrastructure =
      data.infrastructure.length;

    const availableInfrastructure =
      data.infrastructure.filter((item) => {
        const statusValue = String(
          item.data.availability_status ?? ""
        )
          .toLowerCase()
          .trim();

        return (
          statusValue === "available" ||
          statusValue === "متوفر"
        );
      }).length;

    const infrastructureRatio =
      availableInfrastructure / totalInfrastructure;

    score += infrastructureRatio * 10;
  }


  /* ---------------------------------------------------------
     6. الموافقات — 15%
  --------------------------------------------------------- */

  if (
    Array.isArray(data.approvals) &&
    data.approvals.length > 0
  ) {
    const totalApprovals = data.approvals.length;

    const completedApprovals =
      data.approvals.filter((item) => {
        const statusValue = String(
          item.data.approval_status_ar ?? ""
        ).trim();

        return (
          statusValue.includes("مكتمل") ||
          statusValue.includes("موافق") ||
          statusValue.includes("معتمد") ||
          statusValue.toLowerCase() === "approved"
        );
      }).length;

    score +=
      (completedApprovals / totalApprovals) * 15;
  }


  /* ---------------------------------------------------------
     7. الوثائق — 10%
  --------------------------------------------------------- */

  if (
    Array.isArray(data.attachments) &&
    data.attachments.length > 0
  ) {
    const totalAttachments =
      data.attachments.length;

    const availableAttachments =
      data.attachments.filter((item) => {
        const statusValue = String(
          item.data.document_status ?? ""
        )
          .toLowerCase()
          .trim();

        return (
          statusValue === "available" ||
          statusValue === "متوفر"
        );
      }).length;

    score +=
      (availableAttachments / totalAttachments) * 10;
  }


  /* ---------------------------------------------------------
     8. العمالة والتشغيل — 5%
  --------------------------------------------------------- */

  if (employment) {
    let employmentScore = 0;

    if (employment.total_jobs)
      employmentScore += 2;

    if (employment.local_total_workers)
      employmentScore += 1;

    if (employment.foreign_total_workers)
      employmentScore += 1;

    if (employment.required_skills_ar)
      employmentScore += 1;

    score += Math.min(employmentScore, 5);
  }


  /* ---------------------------------------------------------
     النتيجة النهائية
  --------------------------------------------------------- */

  return Math.round(
    Math.min(Math.max(score, 0), 100)
  );
})();
  /* =========================================================
     البنية التحتية
  ========================================================= */

  const infrastructureStatus = (
    value: unknown
  ): "متوفر" | "متوفر جزئيًا" | "غير متوفر" => {
    const statusValue = String(value ?? "")
      .toLowerCase()
      .trim();

    if (
      statusValue === "available" ||
      statusValue === "متوفر"
    ) {
      return "متوفر";
    }

    if (
      statusValue === "partially_available" ||
      statusValue === "partial" ||
      statusValue === "متوفر جزئيًا"
    ) {
      return "متوفر جزئيًا";
    }

    return "غير متوفر";
  };

  return (
    <>
      <PageMeta
        title={`${opportunity.name_ar} | خارطة الاستثمار الذكية`}
        description={`الملف الاستثماري للفرصة ${opportunity.opportunity_code}`}
      />

      <div dir="rtl" className="space-y-6">

        {/* رأس الصفحة */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Link
                  to="/opportunities"
                  className="transition hover:text-brand-500"
                >
                  الفرص الاستثمارية
                </Link>

                <span>/</span>

                <span>{opportunity.opportunity_code}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {opportunity.name_ar}
                </h1>

                <StatusBadge status={statusName} />
              </div>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                الحالة: {statusName}
              </p>
            </div>

            <Link
              to="/opportunities"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03]"
            >
              ← العودة إلى الفرص
            </Link>
          </div>
        </div>

        {/* المؤشرات الرئيسية */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            title="القيمة الاستثمارية"
            value={`${investmentValueMillion.toLocaleString()} مليون ${
              currencyCode || currencyName
            }`}
          />

          <InfoCard
            title="نوع المشروع"
            value={projectTypeName}
          />

          <InfoCard
            title="حجم المشروع"
            value={projectScaleName}
          />

          <InfoCard
            title="نموذج الاستثمار"
            value={financingModelName}
          />
        </div>

        {/* نبذة + الجاهزية */}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8">
            <SectionCard
              title="نبذة عن الفرصة"
              description="وصف مختصر للمشروع والفرصة الاستثمارية"
            >
              <p className="leading-8 text-gray-600 dark:text-gray-400">
                {projectDescription}
              </p>
            </SectionCard>
          </div>

          <div className="col-span-12 xl:col-span-4">
            <ReadinessCard readiness={readiness} />
          </div>
        </div>

        {/* معلومات المشروع */}

        <SectionCard
          title="معلومات المشروع"
          description="البيانات الأساسية المتعلقة بطبيعة وحجم وموقع المشروع"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DataItem
              label="رمز الفرصة"
              value={opportunity.opportunity_code}
            />

            <DataItem
              label="القطاع"
              value={sectorName}
            />

            <DataItem
              label="القطاع الفرعي"
              value={subSectorName}
            />

            <DataItem
              label="نوع المشروع"
              value={projectTypeName}
            />

            <DataItem
              label="حجم المشروع"
              value={projectScaleName}
            />

            <DataItem
              label="الملكية"
              value={ownershipName}
            />

            <DataItem
              label="الموقع"
              value={locationDescription}
            />

            <DataItem
              label="نموذج العقد"
              value={contractTypeName}
            />
          </div>
        </SectionCard>

        {/* الموقع */}

        <SectionCard
          title="الموقع"
          description="المعلومات الجغرافية والمكانية للفرصة الاستثمارية"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <DataRow
                label="الوحدة الإدارية"
                value={administrativeUnitName}
              />

              <DataRow
                label="المستوى الإداري"
                value={administrativeUnitTypeName}
              />

              <DataRow
                label="وصف الموقع"
                value={locationDescription}
              />

              <DataRow
                label="المساحة"
                value={`${areaValue.toLocaleString()} ${areaUnitName}`}
              />

              <DataRow
                label="أرقام العقارات"
                value={propertyNumbers}
              />

              <DataRow
                label="قابلية التوسع"
                value={expandable ? "نعم" : "لا"}
              />

              {expandable && (
                <DataRow
                  label="مساحة التوسع"
                  value={`${expansionAreaValue.toLocaleString()} ${areaUnitName}`}
                />
              )}

              <DataRow
                label="الجهة المقدمة"
                value={providerEntityName}
              />

              <DataRow
                label="نوع المستثمر"
                value={investorTypeName}
              />
            </div>

            <div className="space-y-4">
              <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500 dark:bg-white/[0.04] dark:text-gray-400">
                {latitude && longitude ? (
                  <div className="text-center">
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      الموقع الجغرافي
                    </p>

                    <p className="mt-2">
                      خط العرض: {latitude}
                    </p>

                    <p>
                      خط الطول: {longitude}
                    </p>

                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white hover:bg-brand-600"
                      >
                        فتح الموقع على الخريطة
                      </a>
                    )}
                  </div>
                ) : (
                  "لا تتوفر إحداثيات جغرافية"
                )}
              </div>

              {locationNotes && (
                <div className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ملاحظات الموقع
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {locationNotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* تفاصيل المشروع */}

        <SectionCard
          title="تفاصيل المشروع"
          description="الوصف والمنتجات والطاقة الإنتاجية والأسواق المستهدفة"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <DataItem
              label="المنتج الرئيسي"
              value={mainProduct}
            />

            <DataItem
              label="مواصفات المنتج الرئيسي"
              value={mainProductSpecifications}
            />

            <DataItem
              label="المنتجات الثانوية"
              value={secondaryProducts}
            />

            <DataItem
              label="الطاقة الإنتاجية"
              value={`${productionCapacity.toLocaleString()} ${capacityUnitName} ${capacityUnitSymbol}`}
            />

            <DataItem
              label="السوق المستهدف"
              value={targetMarket}
            />

            <DataItem
              label="المبرر الاقتصادي والاجتماعي"
              value={economicSocialJustification}
            />
          </div>
        </SectionCard>

        {/* البيانات المالية */}

        <SectionCard
          title="البيانات المالية والاستثمارية"
          description="البيانات المالية الفعلية المرتبطة بالفرصة من جدول financial_data"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FinancialCard
              title="التكلفة الاستثمارية"
              value={`${investmentValueMillion.toLocaleString()} مليون`}
              subtitle={currencyName}
            />

            <FinancialCard
              title="العائد السنوي"
              value={`${annualReturn}%`}
              subtitle="حسب البيانات المالية"
            />

            <FinancialCard
              title="معدل العائد المتوقع"
              value={`${expectedReturnRate}%`}
              subtitle="Expected Return Rate"
            />

            <FinancialCard
              title="فترة الاستثمار"
              value={`${investmentPeriodYears} سنة`}
              subtitle="Investment Period"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-5 dark:border-gray-800">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                هيكل الاستثمار والتمويل
              </h3>

              <div className="mt-5 space-y-4">
                <DataRow
                  label="نموذج التمويل"
                  value={financingModelName}
                />

                <DataRow
                  label="العملة"
                  value={`${currencyName} ${
                    currencyCode ? `(${currencyCode})` : ""
                  }`}
                />

                <DataRow
                  label="مصدر التقدير"
                  value={
                    financial?.estimation_source_ar ||
                    "غير محدد"
                  }
                />

                <DataRow
                  label="فترة السماح"
                  value={`${gracePeriodYears} سنة`}
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-5 dark:border-gray-800">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                مؤشرات الجدوى الاستثمارية
              </h3>

              <div className="mt-5 space-y-4">
                <DataRow
                  label="العائد المتوقع"
                  value={`${expectedReturnRate}%`}
                />

                <DataRow
                  label="العائد السنوي"
                  value={`${annualReturn}%`}
                />

                <DataRow
                  label="فترة الاستثمار"
                  value={`${investmentPeriodYears} سنوات`}
                />

                <DataRow
                  label="مدة التنفيذ"
                  value={`${constructionPeriodYears} سنوات`}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FinancialCard
              title="نموذج التمويل"
              value={financingModelName}
              subtitle="من البيانات المالية"
            />

            <FinancialCard
              title="فترة التنفيذ"
              value={`${constructionPeriodYears} سنوات`}
              subtitle="Construction Period"
            />

            <FinancialCard
              title="فترة السماح"
              value={`${gracePeriodYears} سنوات`}
              subtitle="Grace Period"
            />

            <FinancialCard
              title="العملة"
              value={currencyCode || currencyName}
              subtitle="Currency"
            />
          </div>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                i
              </div>

              <div>
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                  ملاحظة مالية
                </h4>

                <p className="mt-1 text-sm leading-6 text-blue-700 dark:text-blue-400">
                  {financial?.notes_ar ||
                    "لا توجد ملاحظات مالية إضافية لهذه الفرصة."}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* العمالة */}

        <SectionCard
          title="العمالة وفرص العمل"
          description="الاحتياجات البشرية وفرص العمل المتوقعة للمشروع"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FinancialCard
              title="إجمالي فرص العمل"
              value={totalJobs.toLocaleString()}
              subtitle="وظيفة"
            />

            <FinancialCard
              title="العمالة المحلية"
              value={localTotalWorkers.toLocaleString()}
              subtitle="عامل"
            />

            <FinancialCard
              title="العمالة الأجنبية"
              value={foreignTotalWorkers.toLocaleString()}
              subtitle="عامل"
            />
          </div>

          <div className="mt-6 rounded-xl border border-gray-100 p-5 dark:border-gray-800">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              المهارات المطلوبة
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
              {requiredSkills}
            </p>
          </div>
        </SectionCard>

        {/* البنية التحتية */}

        <SectionCard
          title="البنية التحتية"
          description="حالة البنية التحتية والخدمات المتوفرة في موقع الفرصة"
        >
          {data.infrastructure.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.infrastructure.map((item, index) => (
                <InfrastructureCard
                  key={String(
                    item.data.opportunity_infrastructure_id ??
                      index
                  )}
                  title={String(
                    item.type?.name_ar ?? "بنية تحتية"
                  )}
                  status={infrastructureStatus(
                    item.data.availability_status
                  )}
                  description={String(
                    item.data.description_ar ??
                      item.type?.description_ar ??
                      "لا يوجد وصف"
                  )}
                />
              ))}
            </div>
          ) : (
            <EmptyState text="لا توجد بيانات للبنية التحتية لهذه الفرصة." />
          )}
        </SectionCard>

        {/* خصائص الموقع */}

        {data.site_features.length > 0 && (
          <SectionCard
            title="خصائص الموقع"
            description="المزايا والخصائص الاستثمارية المرتبطة بموقع المشروع"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.site_features.map((item, index) => (
                <div
                  key={String(
                    item.data.opportunity_site_feature_id ??
                      index
                  )}
                  className="rounded-xl border border-gray-100 p-5 dark:border-gray-800"
                >
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {String(
                      item.feature?.name_ar ?? "خاصية الموقع"
                    )}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {String(
                      item.data.feature_value_ar ?? "غير محدد"
                    )}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* الجهات والموافقات */}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <SectionCard
              title="الجهات المرتبطة"
              description="الجهات المالكة أو المقدمة أو المرتبطة بالفرصة"
            >
              <div className="space-y-3">
                <EntityRow
                  name="الجهة المالكة"
                  value={ownershipName}
                />

                <EntityRow
                  name="الجهة المقدمة"
                  value={providerEntityName}
                />

                {data.entities.map((item, index) => (
                  <EntityRow
                    key={String(
                      item.data.opportunity_entity_id ??
                        index
                    )}
                    name={String(
                      item.relation_type?.name_ar ??
                        "جهة مرتبطة"
                    )}
                    value={String(
                      item.entity?.name_ar ?? "غير محدد"
                    )}
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <SectionCard
              title="الموافقات"
              description="حالة الموافقات والإجراءات المرتبطة بالمشروع"
            >
              {data.approvals.length > 0 ? (
                <div className="space-y-3">
                  {data.approvals.map((item, index) => (
                    <ApprovalRow
                      key={String(
                        item.data.opportunity_approval_id ??
                          index
                      )}
                      name={String(
                        item.data.approval_name_ar ??
                          item.type?.name_ar ??
                          "موافقة"
                      )}
                      status={String(
                        item.data.approval_status_ar ??
                          "غير محدد"
                      )}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState text="لا توجد بيانات للموافقات لهذه الفرصة." />
              )}
            </SectionCard>
          </div>
        </div>

        {/* المستثمرون والعقود */}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6">
            <SectionCard
              title="المستثمرون"
              description="المستثمرون أو الجهات الاستثمارية المرتبطة بالفرصة"
            >
              {data.investors.length > 0 ? (
                <div className="space-y-3">
                  {data.investors.map((item, index) => (
                    <EntityRow
                      key={String(
                        item.data.opportunity_investor_id ??
                          index
                      )}
                      name={String(
                        item.investor_type?.name_ar ??
                          "نوع المستثمر"
                      )}
                      value={String(
                        item.entity?.name_ar ?? "غير محدد"
                      )}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState text="لا توجد بيانات مستثمرين مرتبطة حاليًا." />
              )}
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <SectionCard
              title="العقود"
              description="أنواع العقود المرتبطة بالفرصة الاستثمارية"
            >
              {data.contracts.length > 0 ? (
                <div className="space-y-3">
                  {data.contracts.map((item, index) => (
                    <div
                      key={String(
                        item.data.opportunity_contract_id ??
                          index
                      )}
                      className="rounded-xl border border-gray-100 p-4 dark:border-gray-800"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">
                          {String(
                            item.contract_type?.name_ar ??
                              contractTypeName
                          )}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        {String(
                          item.data.notes_ar ?? "لا توجد ملاحظات"
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState text="لا توجد بيانات للعقود لهذه الفرصة." />
              )}
            </SectionCard>
          </div>
        </div>

        {/* الوثائق */}

        <SectionCard
          title="الوثائق والعقود"
          description="المستندات والملفات المرتبطة بالفرصة الاستثمارية"
        >
          {data.attachments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {data.attachments.map((item, index) => (
                <DocumentCard
                  key={String(
                    item.data.opportunity_attachment_id ??
                      index
                  )}
                  title={String(
                    item.data.file_name ??
                      item.type?.name_ar ??
                      "وثيقة"
                  )}
                  type={getFileType(
                    String(item.data.file_name ?? "")
                  )}
                  url={String(item.data.file_url ?? "")}
                />
              ))}
            </div>
          ) : (
            <EmptyState text="لا توجد وثائق مرفقة بهذه الفرصة." />
          )}
        </SectionCard>

        {/* AI */}

        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-500/20 dark:bg-brand-500/5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">
                AI
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  التحليل الذكي للفرصة
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  تحليل الاستثمار والمخاطر والجدوى باستخدام الذكاء الاصطناعي
                </p>
              </div>
            </div>

            <Link
              to="/ai/opportunity-analysis"
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600"
            >
              بدء التحليل الذكي
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   Components
========================================================= */

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-200 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/30">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <p className="mt-3 text-lg font-bold text-gray-800 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const statusStyles: Record<string, string> = {
    "فرصة استراتيجية":
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",

    "فرصة جديدة":
      "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",

    "إعادة تأهيل":
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  };

  const style =
    statusStyles[status] ??
    "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${style}`}
    >
      {status}
    </span>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

function DataItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/[0.03]">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function DataRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 dark:border-gray-800">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {label}
      </span>

      <span className="text-left text-sm font-medium text-gray-800 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function ReadinessCard({
  readiness,
}: {
  readiness: number;
}) {
  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        جاهزية الفرصة للاستثمار
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        مؤشر الجاهزية الاستثماري
      </p>

      <div className="mt-7 flex items-end justify-between">
        <span className="text-4xl font-bold text-gray-800 dark:text-white">
          {readiness}%
        </span>

        <span className="text-sm text-gray-500 dark:text-gray-400">
          جاهزية
        </span>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${readiness}%` }}
        />
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>منخفضة</span>
        <span>متوسطة</span>
        <span>مرتفعة</span>
      </div>
    </div>
  );
}

function FinancialCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 p-5 dark:border-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <p className="mt-3 text-xl font-bold text-gray-800 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}

function InfrastructureCard({
  title,
  status,
  description,
}: {
  title: string;
  status: "متوفر" | "متوفر جزئيًا" | "غير متوفر";
  description: string;
}) {
  const statusStyles: Record<
    "متوفر" | "متوفر جزئيًا" | "غير متوفر",
    string
  > = {
    متوفر:
      "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",

    "متوفر جزئيًا":
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",

    "غير متوفر":
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <div className="rounded-xl border border-gray-100 p-5 dark:border-gray-800">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

function EntityRow({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {name}
      </span>

      <span className="text-left text-sm font-semibold text-gray-800 dark:text-white">
        {value}
      </span>
    </div>
  );
}

function ApprovalRow({
  name,
  status,
}: {
  name: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3 dark:border-gray-800">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {name}
      </span>

      <span className="text-xs font-medium text-green-600 dark:text-green-400">
        {status}
      </span>
    </div>
  );
}

function DocumentCard({
  title,
  type,
  url,
}: {
  title: string;
  type: string;
  url: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition hover:border-brand-300 dark:border-gray-800">
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          ملف {type}
        </p>
      </div>

      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          عرض
        </a>
      ) : (
        <span className="text-sm text-gray-400">
          غير متوفر
        </span>
      )}
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-6 text-center text-sm text-gray-500 dark:bg-white/[0.03] dark:text-gray-400">
      {text}
    </div>
  );
}

function getFileType(fileName: string) {
  const extension = fileName.split(".").pop();

  if (!extension) {
    return "ملف";
  }

  return extension.toUpperCase();
}