import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";

import {
  getOpportunityByCodeApi,
  type OpportunityApiResponse,
} from "../../services/opportunityApi";

/* =========================================================
   Types
========================================================= */

type OpportunityDetailsData = {
  opportunity: {
    opportunity_id: number;
    opportunity_code: string;
    name_ar: string;
    name_en?: string | null;
    sector_id?: number | null;
    sub_sector_id?: number | null;
    location_id?: number | null;
    ownership_id?: number | null;
    project_type_id?: number | null;
    investor_type_id?: number | null;
    contract_type_id?: number | null;
    provider_entity_id?: number | null;
    project_scale_id?: number | null;
    status_id?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
    is_active?: boolean | null;
  };

  references: {
    sector_id?: number | null;
    sector_name_ar?: string | null;
    sector_name_en?: string | null;

    sub_sector_id?: number | null;
    sub_sector_name_ar?: string | null;
    sub_sector_name_en?: string | null;

    project_type_id?: number | null;
    project_type_name_ar?: string | null;
    project_type_name_en?: string | null;

    project_scale_id?: number | null;
    project_scale_name_ar?: string | null;
    project_scale_name_en?: string | null;

    investor_type_id?: number | null;
    investor_type_name_ar?: string | null;
    investor_type_name_en?: string | null;

    contract_type_id?: number | null;
    contract_type_name_ar?: string | null;
    contract_type_name_en?: string | null;

    status_id?: number | null;
    status_name_ar?: string | null;
    status_name_en?: string | null;

    ownership_id?: number | null;
    ownership_name_ar?: string | null;
    ownership_name_en?: string | null;

    provider_entity_id?: number | null;
    provider_entity_name_ar?: string | null;
    provider_entity_name_en?: string | null;

    entity_type_id?: number | null;
    provider_entity_type_name_ar?: string | null;
    provider_entity_type_name_en?: string | null;
  };

  financial?: {
    financial_id?: number | null;
    opportunity_id?: number | null;
    estimated_cost?: number | null;
    currency_id?: number | null;
    estimation_source_ar?: string | null;
    estimation_source_en?: string | null;
    annual_investment_return?: number | null;
    investment_period_years?: number | null;
    construction_period_years?: number | null;
    grace_period_years?: number | null;
    financing_model_id?: number | null;
    expected_return_rate?: number | null;
    notes_ar?: string | null;
    notes_en?: string | null;
    currency_code?: string | null;
    currency_name_ar?: string | null;
    currency_name_en?: string | null;
    currency_symbol?: string | null;
    financing_model_name_ar?: string | null;
    financing_model_name_en?: string | null;
  } | null;

  location?: {
    location_id?: number | null;
    opportunity_id?: number | null;
    description_ar?: string | null;
    description_en?: string | null;
    administrative_unit_id?: number | null;
    ownership_id?: number | null;
    property_numbers?: string | null;
    area_value?: number | null;
    area_unit_id?: number | null;
    expandable?: boolean | string | null;
    expansion_area_value?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    map_url?: string | null;
    notes_ar?: string | null;
    notes_en?: string | null;
    area_unit_name_ar?: string | null;
    area_unit_name_en?: string | null;
    area_unit_symbol?: string | null;
    administrative_unit_name_ar?: string | null;
    administrative_unit_name_en?: string | null;
    administrative_unit_type_name_ar?: string | null;
    administrative_unit_type_name_en?: string | null;
  } | null;

  project_details?: {
    project_detail_id?: number | null;
    opportunity_id?: number | null;
    description_ar?: string | null;
    description_en?: string | null;
    main_product_ar?: string | null;
    main_product_en?: string | null;
    main_product_specifications_ar?: string | null;
    main_product_specifications_en?: string | null;
    secondary_products_ar?: string | null;
    secondary_products_en?: string | null;
    production_capacity?: number | null;
    capacity_unit_id?: number | null;
    target_market_ar?: string | null;
    target_market_en?: string | null;
    economic_social_justification_ar?: string | null;
    economic_social_justification_en?: string | null;
    capacity_unit_name_ar?: string | null;
    capacity_unit_name_en?: string | null;
    capacity_unit_symbol?: string | null;
  } | null;

  employment?: {
    employment_id?: number | null;
    opportunity_id?: number | null;
    local_specialized_workers?: number | null;
    local_unskilled_workers?: number | null;
    local_total_workers?: number | null;
    foreign_specialized_workers?: number | null;
    foreign_unskilled_workers?: number | null;
    foreign_total_workers?: number | null;
    total_jobs?: number | null;
    required_skills_ar?: string | null;
    required_skills_en?: string | null;
    notes_ar?: string | null;
    notes_en?: string | null;
  } | null;

  infrastructure: Array<{
    opportunity_infrastructure_id?: number | null;
    opportunity_id?: number | null;
    infrastructure_type_id?: number | null;
    availability_status?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    is_active?: boolean | null;
    infrastructure_type_name_ar?: string | null;
    infrastructure_type_name_en?: string | null;
    infrastructure_category?: string | null;
  }>;

  site_features: Array<{
    opportunity_site_feature_id?: number | null;
    opportunity_id?: number | null;
    site_feature_id?: number | null;
    feature_value_ar?: string | null;
    feature_value_en?: string | null;
    notes_ar?: string | null;
    notes_en?: string | null;
    is_active?: boolean | null;
    feature_name_ar?: string | null;
    feature_name_en?: string | null;
    feature_description_ar?: string | null;
    feature_description_en?: string | null;
  }>;

  approvals: Array<{
    opportunity_approval_id?: number | null;
    opportunity_id?: number | null;
    approval_type_id?: number | null;
    approval_name_ar?: string | null;
    approval_name_en?: string | null;
    approval_status_ar?: string | null;
    approval_status_en?: string | null;
    issuing_entity_id?: number | null;
    notes_ar?: string | null;
    notes_en?: string | null;
    approval_type_name_ar?: string | null;
    approval_type_name_en?: string | null;
    issuing_entity_name_ar?: string | null;
    issuing_entity_name_en?: string | null;
  }>;

  entities: Array<{
    opportunity_entity_id?: number | null;
    opportunity_id?: number | null;
    entity_id?: number | null;
    relation_type_id?: number | null;
    notes_ar?: string | null;
    notes_en?: string | null;
    created_at?: string | null;
    is_active?: boolean | null;
    entity_name_ar?: string | null;
    entity_name_en?: string | null;
    entity_phone?: string | null;
    entity_email?: string | null;
    entity_type_name_ar?: string | null;
    entity_type_name_en?: string | null;
    relation_type_name_ar?: string | null;
    relation_type_name_en?: string | null;
  }>;

  investors: Array<{
    opportunity_investor_id?: number | null;
    opportunity_id?: number | null;
    investor_type_id?: number | null;
    entity_id?: number | null;
    notes_ar?: string | null;
    notes_en?: string | null;
    investor_type_name_ar?: string | null;
    investor_type_name_en?: string | null;
    entity_name_ar?: string | null;
    entity_name_en?: string | null;
  }>;

  contracts: Array<{
    opportunity_contract_id?: number | null;
    opportunity_id?: number | null;
    contract_type_id?: number | null;
    notes_ar?: string | null;
    notes_en?: string | null;
    contract_type_name_ar?: string | null;
    contract_type_name_en?: string | null;
  }>;

  attachments: Array<{
    opportunity_attachment_id?: number | null;
    opportunity_id?: number | null;
    attachment_type_id?: number | null;
    file_name?: string | null;
    file_url?: string | null;
    document_status?: string | null;
    uploaded_date?: string | null;
    notes_ar?: string | null;
    notes_en?: string | null;
    attachment_type_name_ar?: string | null;
    attachment_type_name_en?: string | null;
  }>;
};

/* =========================================================
   Main Component
========================================================= */

export default function OpportunityDetails() {
  const { code } = useParams();

  const [data, setData] =
    useState<OpportunityDetailsData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) {
      setLoading(false);
      return;
    }

    getOpportunityByCodeApi(code)
      .then((result: OpportunityApiResponse) => {
        setData(
          result as unknown as OpportunityDetailsData
        );
      })
      .catch((error) => {
        console.error(
          "Failed to load opportunity:",
          error
        );
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
        <p className="text-sm text-gray-500">
          جاري تحميل بيانات الفرصة...
        </p>
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
  const references = data.references;
  const financial = data.financial;
  const location = data.location;
  const projectDetails = data.project_details;
  const employment = data.employment;

  /* =========================================================
     البيانات المرجعية
  ========================================================= */

  const statusName = String(
    references.status_name_ar ?? "غير محدد"
  );

  const sectorName = String(
    references.sector_name_ar ?? "غير محدد"
  );

  const subSectorName = String(
    references.sub_sector_name_ar ?? "غير محدد"
  );

  const projectTypeName = String(
    references.project_type_name_ar ?? "غير محدد"
  );

  const projectScaleName = String(
    references.project_scale_name_ar ?? "غير محدد"
  );

  const investorTypeName = String(
    references.investor_type_name_ar ?? "غير محدد"
  );

  const contractTypeName = String(
    references.contract_type_name_ar ?? "غير محدد"
  );

  const ownershipName = String(
    references.ownership_name_ar ?? "غير محدد"
  );

  const providerEntityName = String(
    references.provider_entity_name_ar ?? "غير محدد"
  );

  const financingModelName = String(
    financial?.financing_model_name_ar ?? "غير محدد"
  );

  const currencyName = String(
    financial?.currency_name_ar ?? "غير محدد"
  );

  const currencyCode = String(
    financial?.currency_code ?? ""
  );

  /* =========================================================
     الموقع
  ========================================================= */

  const locationDescription = String(
    location?.description_ar ?? "غير محدد"
  );

  const administrativeUnitName = String(
    location?.administrative_unit_name_ar ??
      "غير محدد"
  );

  const administrativeUnitTypeName = String(
    location?.administrative_unit_type_name_ar ??
      "غير محدد"
  );

  const areaValue = Number(
    location?.area_value ?? 0
  );

  const areaUnitName = String(
    location?.area_unit_name_ar ?? "غير محدد"
  );

  const propertyNumbers = String(
    location?.property_numbers ?? "غير محدد"
  );

  const expandable =
    location?.expandable === true ||
    String(location?.expandable ?? "")
      .toUpperCase()
      .trim() === "TRUE";

  const expansionAreaValue = Number(
    location?.expansion_area_value ?? 0
  );

  const latitude = String(
    location?.latitude ?? ""
  );

  const longitude = String(
    location?.longitude ?? ""
  );

  const mapUrl = String(
    location?.map_url ?? ""
  );

  const locationNotes = String(
    location?.notes_ar ?? ""
  );

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
    projectDetails?.main_product_specifications_ar ??
      "غير محدد"
  );

  const secondaryProducts = String(
    projectDetails?.secondary_products_ar ??
      "غير محدد"
  );

  const productionCapacity = Number(
    projectDetails?.production_capacity ?? 0
  );

  const capacityUnitName = String(
    projectDetails?.capacity_unit_name_ar ??
      "غير محدد"
  );

  const capacityUnitSymbol = String(
    projectDetails?.capacity_unit_symbol ?? ""
  );

  const targetMarket = String(
    projectDetails?.target_market_ar ??
      "غير محدد"
  );

  const economicSocialJustification =
    String(
      projectDetails?.economic_social_justification_ar ??
        "غير محدد"
    );

  /* =========================================================
     العمالة
  ========================================================= */

  const totalJobs = Number(
    employment?.total_jobs ?? 0
  );

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

  const investmentValueMillion =
    estimatedCost / 1000000;

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
  ========================================================= */

  const readiness = (() => {
    let score = 0;

    /* ---------------------------------------------------------
       1. البيانات الأساسية — 10%
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

    const completedBasic = basicFields.filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    ).length;

    score +=
      (completedBasic / basicFields.length) * 10;

    /* ---------------------------------------------------------
       2. الموقع — 15%
    --------------------------------------------------------- */

    if (location) {
      let locationScore = 0;

      if (location.description_ar)
        locationScore += 3;

      if (location.administrative_unit_id)
        locationScore += 2;

      if (location.area_value)
        locationScore += 2;

      if (location.area_unit_id)
        locationScore += 1;

      if (
        location.latitude !== null &&
        location.latitude !== undefined &&
        location.longitude !== null &&
        location.longitude !== undefined
      ) {
        locationScore += 3;
      }

      if (location.map_url)
        locationScore += 1;

      if (
        location.expandable !== null &&
        location.expandable !== undefined
      ) {
        locationScore += 1;
      }

      if (
        expandable &&
        location.expansion_area_value
      ) {
        locationScore += 2;
      }

      score += Math.min(
        locationScore,
        15
      );
    }

    /* ---------------------------------------------------------
       3. البيانات المالية — 20%
    --------------------------------------------------------- */

    if (financial) {
      let financialScore = 0;

      if (financial.estimated_cost)
        financialScore += 5;

      if (financial.currency_id)
        financialScore += 2;

      if (financial.estimation_source_ar)
        financialScore += 2;

      if (financial.annual_investment_return)
        financialScore += 2;

      if (financial.investment_period_years)
        financialScore += 3;

      if (financial.construction_period_years)
        financialScore += 2;

      if (financial.financing_model_id)
        financialScore += 2;

      if (financial.expected_return_rate)
        financialScore += 2;

      score += Math.min(
        financialScore,
        20
      );
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

      if (
        projectDetails.main_product_specifications_ar
      )
        projectScore += 2;

      if (
        projectDetails.production_capacity
      )
        projectScore += 2;

      if (
        projectDetails.capacity_unit_id
      )
        projectScore += 1;

      if (
        projectDetails.target_market_ar
      )
        projectScore += 2;

      if (
        projectDetails.economic_social_justification_ar
      )
        projectScore += 2;

      score += Math.min(
        projectScore,
        15
      );
    }

    /* ---------------------------------------------------------
       5. البنية التحتية — 10%
    --------------------------------------------------------- */

    if (
      Array.isArray(data.infrastructure) &&
      data.infrastructure.length > 0
    ) {
      const available =
        data.infrastructure.filter((item) => {
          const status = String(
            item.availability_status ?? ""
          )
            .toLowerCase()
            .trim();

          return (
            status === "available" ||
            status === "متوفر" ||
            status === "متاحة" ||
            status === "متاح"
          );
        }).length;

      score +=
        (available /
          data.infrastructure.length) *
        10;
    }

    /* ---------------------------------------------------------
       6. الموافقات — 15%
    --------------------------------------------------------- */

    if (
      Array.isArray(data.approvals) &&
      data.approvals.length > 0
    ) {
      const approved =
        data.approvals.filter((item) => {
          const status = String(
            item.approval_status_ar ??
              item.approval_status_en ??
              ""
          )
            .toLowerCase()
            .trim();

          return (
            status.includes("مكتمل") ||
            status.includes("موافق") ||
            status.includes("معتمد") ||
            status.includes("approved") ||
            status.includes("complete")
          );
        }).length;

      score +=
        (approved /
          data.approvals.length) *
        15;
    }

    /* ---------------------------------------------------------
       7. الوثائق — 5%
    --------------------------------------------------------- */

    if (
      Array.isArray(data.attachments) &&
      data.attachments.length > 0
    ) {
      score += 5;
    }

    /* ---------------------------------------------------------
       8. العمالة والتشغيل — 5%
    --------------------------------------------------------- */

    if (employment?.total_jobs) {
      score += 5;
    }

    /* ---------------------------------------------------------
       9. خصائص الموقع — 5%
    --------------------------------------------------------- */

    if (
      Array.isArray(data.site_features) &&
      data.site_features.length > 0
    ) {
      score += 5;
    }

    return Math.round(
      Math.min(
        Math.max(score, 0),
        100
      )
    );
  })();

  /* =========================================================
     البنية التحتية
  ========================================================= */

  const infrastructureStatus = (
    value: unknown
  ): "متوفر" | "متوفر جزئيًا" | "غير متوفر" => {
    const statusValue = String(
      value ?? ""
    )
      .toLowerCase()
      .trim();

    if (
      statusValue === "available" ||
      statusValue === "متوفر" ||
      statusValue === "متاح" ||
      statusValue === "متاحة"
    ) {
      return "متوفر";
    }

    if (
      statusValue ===
        "partially_available" ||
      statusValue === "partial" ||
      statusValue === "متوفر جزئيًا" ||
      statusValue === "متاح جزئيًا"
    ) {
      return "متوفر جزئيًا";
    }

    return "غير متوفر";
  };

  /* =========================================================
     Render
  ========================================================= */

  return (
    <>
      <PageMeta
        title={`${opportunity.name_ar} | خارطة الاستثمار الذكية`}
        description={`الملف الاستثماري للفرصة ${opportunity.opportunity_code}`}
      />

      <div
        dir="rtl"
        className="space-y-6"
      >
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

                <span>
                  {opportunity.opportunity_code}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {opportunity.name_ar}
                </h1>

                <StatusBadge
                  status={statusName}
                />
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
            <ReadinessCard
              readiness={readiness}
            />
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
                value={
                  administrativeUnitName
                }
              />

              <DataRow
                label="المستوى الإداري"
                value={
                  administrativeUnitTypeName
                }
              />

              <DataRow
                label="وصف الموقع"
                value={
                  locationDescription
                }
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
                value={
                  expandable
                    ? "نعم"
                    : "لا"
                }
              />

              {expandable && (
                <DataRow
                  label="مساحة التوسع"
                  value={`${expansionAreaValue.toLocaleString()} ${areaUnitName}`}
                />
              )}

              <DataRow
                label="الجهة المقدمة"
                value={
                  providerEntityName
                }
              />

              <DataRow
                label="نوع المستثمر"
                value={
                  investorTypeName
                }
              />
            </div>

            <div className="space-y-4">
              <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-500 dark:bg-white/[0.04] dark:text-gray-400">
                {latitude &&
                longitude ? (
                  <div className="text-center">
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      الموقع الجغرافي
                    </p>

                    <p className="mt-2">
                      خط العرض:{" "}
                      {latitude}
                    </p>

                    <p>
                      خط الطول:{" "}
                      {longitude}
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
              value={
                mainProductSpecifications
              }
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
              value={
                economicSocialJustification
              }
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
                  value={
                    financingModelName
                  }
                />

                <DataRow
                  label="العملة"
                  value={`${currencyName} ${
                    currencyCode
                      ? `(${currencyCode})`
                      : ""
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
              value={
                currencyCode ||
                currencyName
              }
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
          {data.infrastructure.length >
          0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.infrastructure.map(
                (item, index) => (
                  <InfrastructureCard
                    key={String(
                      item.opportunity_infrastructure_id ??
                        index
                    )}
                    title={String(
                      item.infrastructure_type_name_ar ??
                        "بنية تحتية"
                    )}
                    status={infrastructureStatus(
                      item.availability_status
                    )}
                    description={String(
                      item.description_ar ??
                        "لا يوجد وصف"
                    )}
                  />
                )
              )}
            </div>
          ) : (
            <EmptyState text="لا توجد بيانات للبنية التحتية لهذه الفرصة." />
          )}
        </SectionCard>

        {/* خصائص الموقع */}

        {data.site_features.length >
          0 && (
          <SectionCard
            title="خصائص الموقع"
            description="المزايا والخصائص الاستثمارية المرتبطة بموقع المشروع"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.site_features.map(
                (item, index) => (
                  <div
                    key={String(
                      item.opportunity_site_feature_id ??
                        index
                    )}
                    className="rounded-xl border border-gray-100 p-5 dark:border-gray-800"
                  >
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {String(
                        item.feature_name_ar ??
                          "خاصية الموقع"
                      )}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {String(
                        item.feature_value_ar ??
                          "غير محدد"
                      )}
                    </p>
                  </div>
                )
              )}
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
                  value={
                    providerEntityName
                  }
                />

                {data.entities.map(
                  (item, index) => (
                    <EntityRow
                      key={String(
                        item.opportunity_entity_id ??
                          index
                      )}
                      name={String(
                        item.relation_type_name_ar ??
                          "جهة مرتبطة"
                      )}
                      value={String(
                        item.entity_name_ar ??
                          "غير محدد"
                      )}
                    />
                  )
                )}
              </div>
            </SectionCard>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <SectionCard
              title="الموافقات"
              description="حالة الموافقات والإجراءات المرتبطة بالمشروع"
            >
              {data.approvals.length >
              0 ? (
                <div className="space-y-3">
                  {data.approvals.map(
                    (item, index) => (
                      <ApprovalRow
                        key={String(
                          item.opportunity_approval_id ??
                            index
                        )}
                        name={String(
                          item.approval_name_ar ??
                            item.approval_type_name_ar ??
                            "موافقة"
                        )}
                        status={String(
                          item.approval_status_ar ??
                            "غير محدد"
                        )}
                      />
                    )
                  )}
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
              {data.investors.length >
              0 ? (
                <div className="space-y-3">
                  {data.investors.map(
                    (item, index) => (
                      <EntityRow
                        key={String(
                          item.opportunity_investor_id ??
                            index
                        )}
                        name={String(
                          item.investor_type_name_ar ??
                            "نوع المستثمر"
                        )}
                        value={String(
                          item.entity_name_ar ??
                            "غير محدد"
                        )}
                      />
                    )
                  )}
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
              {data.contracts.length >
              0 ? (
                <div className="space-y-3">
                  {data.contracts.map(
                    (item, index) => (
                      <div
                        key={String(
                          item.opportunity_contract_id ??
                            index
                        )}
                        className="rounded-xl border border-gray-100 p-4 dark:border-gray-800"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-semibold text-gray-800 dark:text-white">
                            {String(
                              item.contract_type_name_ar ??
                                contractTypeName
                            )}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                          {String(
                            item.notes_ar ??
                              "لا توجد ملاحظات"
                          )}
                        </p>
                      </div>
                    )
                  )}
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
          {data.attachments.length >
          0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {data.attachments.map(
                (item, index) => (
                  <DocumentCard
                    key={String(
                      item.opportunity_attachment_id ??
                        index
                    )}
                    title={String(
                      item.file_name ??
                        item.attachment_type_name_ar ??
                        "وثيقة"
                    )}
                    type={getFileType(
                      String(
                        item.file_name ?? ""
                      )
                    )}
                    url={String(
                      item.file_url ?? ""
                    )}
                  />
                )
              )}
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
              to={`/ai/opportunity-analysis/${opportunity.opportunity_code}`}
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
  const statusStyles: Record<
    string,
    string
  > = {
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
  children: ReactNode;
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
  const level =
    readiness >= 80
      ? "جاهزية مرتفعة"
      : readiness >= 50
      ? "جاهزية متوسطة"
      : "تحتاج استكمال البيانات";

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        مؤشر جاهزية الفرصة
      </h2>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        يعتمد على اكتمال البيانات الاستثمارية المتوفرة
      </p>

      <div className="mt-7 flex items-end justify-between">
        <span className="text-4xl font-bold text-gray-800 dark:text-white">
          {readiness}%
        </span>

        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {level}
        </span>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{
            width: `${readiness}%`,
          }}
        />
      </div>

      <div className="mt-5 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          منخفضة
        </span>

        <span>
          متوسطة
        </span>

        <span>
          مرتفعة
        </span>
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
  status:
    | "متوفر"
    | "متوفر جزئيًا"
    | "غير متوفر";
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

function getFileType(
  fileName: string
) {
  const extension =
    fileName.split(".").pop();

  if (!extension) {
    return "ملف";
  }

  return extension.toUpperCase();
}