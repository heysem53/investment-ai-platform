import type { OpportunityStatus } from "../types/opportunity";

/* =========================================================
الأنواع العامة
========================================================= */

export type ReferenceItem = {
[key: string]: string | boolean | null;
};

/* =========================================================
بيانات الفرصة الرئيسية
========================================================= */

export type OpportunityData = {
opportunity_id: string;
opportunity_code: string;
name_ar: string;
name_en: string;
sector_id: string;
sub_sector_id: string;
location_id: string;
ownership_id: string;
project_type_id: string;
investor_type_id: string;
contract_type_id: string;
provider_entity_id: string;
project_scale_id: string | null;
status_id: string;
created_at: string;
updated_at: string;
is_active: string;
};

/* =========================================================
البيانات المالية
========================================================= */

export type FinancialData = {
financial_id: string;
opportunity_id: string;
estimated_cost: string;
currency_id: string;
estimation_source_ar: string;
estimation_source_en: string;
annual_investment_return: string;
investment_period_years: string;
construction_period_years: string;
grace_period_years: string;
financing_model_id: string;
expected_return_rate: string;
notes_ar: string;
notes_en: string;
};

/* =========================================================
البيانات المرتبطة
========================================================= */

export type InfrastructureItem = {
data: ReferenceItem;
type: ReferenceItem | null;
};

export type SiteFeatureItem = {
data: ReferenceItem;
feature: ReferenceItem | null;
};

export type ApprovalItem = {
data: ReferenceItem;
type: ReferenceItem | null;
issuing_entity: ReferenceItem | null;
};

export type EntityItem = {
data: ReferenceItem;
entity: ReferenceItem | null;
entity_type: ReferenceItem | null;
relation_type: ReferenceItem | null;
};

export type InvestorItem = {
data: ReferenceItem;
investor_type: ReferenceItem | null;
entity: ReferenceItem | null;
};

export type ContractItem = {
data: ReferenceItem;
contract_type: ReferenceItem | null;
};

export type AttachmentItem = {
data: ReferenceItem;
type: ReferenceItem | null;
};

/* =========================================================
استجابة API الكاملة
========================================================= */

export type OpportunityApiResponse = {
opportunity: OpportunityData;

references: {
sector: ReferenceItem | null;
sub_sector: ReferenceItem | null;
project_type: ReferenceItem | null;
project_scale: ReferenceItem | null;
investor_type: ReferenceItem | null;
contract_type: ReferenceItem | null;
status: ReferenceItem | null;
ownership: ReferenceItem | null;
provider_entity: ReferenceItem | null;
provider_entity_type: ReferenceItem | null;
};

financial: FinancialData | null;

financial_reference: {
currency: ReferenceItem | null;
financing_model: ReferenceItem | null;
};

location: ReferenceItem | null;

location_reference: {
administrative_unit: ReferenceItem | null;
administrative_unit_type: ReferenceItem | null;
area_unit: ReferenceItem | null;
};

project_details: ReferenceItem | null;

capacity_unit: ReferenceItem | null;

employment: ReferenceItem | null;

infrastructure: InfrastructureItem[];

site_features: SiteFeatureItem[];

approvals: ApprovalItem[];

entities: EntityItem[];

investors: InvestorItem[];

contracts: ContractItem[];

attachments: AttachmentItem[];
};

/* =========================================================
إعدادات API
========================================================= */

const API_BASE_URL = "http://127.0.0.1:8000/api";

/* =========================================================
جلب فرصة واحدة حسب الرمز
========================================================= */

export async function getOpportunityByCodeApi(
code: string
): Promise<OpportunityApiResponse> {
const response = await fetch(
`${API_BASE_URL}/opportunities/${encodeURIComponent(code)}`
);

if (!response.ok) {
throw new Error(
`Failed to fetch opportunity: ${response.status}`
);
}

const result = await response.json();

if (result?.detail) {
throw new Error(result.detail);
}

return result as OpportunityApiResponse;
}

/* =========================================================
   جلب جميع الفرص
========================================================= */

export async function getOpportunitiesApi(): Promise<
  OpportunityApiResponse[]
> {
  const response = await fetch(
    `${API_BASE_URL}/opportunities`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch opportunities: ${response.status}`
    );
  }

  const result = await response.json();

  const data = Array.isArray(result)
    ? result
    : result?.opportunities;

  if (!Array.isArray(data)) {
    throw new Error(
      "Invalid opportunities response format"
    );
  }

  return data as OpportunityApiResponse[];
}