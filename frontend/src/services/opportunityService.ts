import type {
  Opportunity,
  OpportunityStatus,
} from "../types/opportunity";

const API_BASE_URL = "http://127.0.0.1:8000";

/* =========================================================
   جميع الفرص من FastAPI
========================================================= */

export async function getOpportunities(): Promise<Opportunity[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/opportunities`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load opportunities: ${response.status}`
    );
  }

  return response.json();
}

/* =========================================================
   الحصول على فرصة حسب الرمز
========================================================= */

export async function getOpportunityByCode(
  code: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/api/opportunities/${code}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }

    throw new Error(
      `Failed to load opportunity: ${response.status}`
    );
  }

  return response.json();
}

/* =========================================================
   الفرص حسب القطاع
========================================================= */

export async function getOpportunitiesBySector(
  sector: string
): Promise<Opportunity[]> {
  const opportunities =
    await getOpportunities();

  return opportunities.filter(
    (opportunity) =>
      opportunity.sector === sector
  );
}

/* =========================================================
   الفرص حسب الحالة
========================================================= */

export async function getOpportunitiesByStatus(
  status: OpportunityStatus
): Promise<Opportunity[]> {
  const opportunities =
    await getOpportunities();

  return opportunities.filter(
    (opportunity) =>
      opportunity.status === status
  );
}

/* =========================================================
   إجمالي القيمة الاستثمارية
========================================================= */

export async function getTotalInvestment(
  items?: Opportunity[]
): Promise<number> {
  const opportunities =
    items ?? await getOpportunities();

  return opportunities.reduce(
    (total, opportunity) =>
      total + opportunity.value,
    0
  );
}

/* =========================================================
   الفرص النشطة
========================================================= */

export async function getActiveOpportunities(
  items?: Opportunity[]
): Promise<Opportunity[]> {
  const opportunities =
    items ?? await getOpportunities();

  return opportunities.filter(
    (opportunity) =>
      opportunity.status ===
        "فرصة استراتيجية" ||
      opportunity.status ===
        "فرصة جديدة" ||
      opportunity.status ===
        "إعادة تأهيل"
  );
}

/* =========================================================
   الفرص الجاهزة للاستثمار
========================================================= */

export async function getReadyOpportunities(
  items?: Opportunity[]
): Promise<Opportunity[]> {
  const opportunities =
    items ?? await getOpportunities();

  return opportunities.filter(
    (opportunity) =>
      opportunity.readiness >= 80
  );
}

/* =========================================================
   الفرص قيد الدراسة
========================================================= */

export async function getPendingOpportunities(
  items?: Opportunity[]
): Promise<Opportunity[]> {
  const opportunities =
    items ?? await getOpportunities();

  return opportunities.filter(
    (opportunity) =>
      opportunity.status ===
      "قيد الدراسة"
  );
}

/* =========================================================
   الفرص المغلقة
========================================================= */

export async function getClosedOpportunities(
  items?: Opportunity[]
): Promise<Opportunity[]> {
  const opportunities =
    items ?? await getOpportunities();

  return opportunities.filter(
    (opportunity) =>
      opportunity.status ===
      "مغلقة"
  );
}