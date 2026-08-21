import type {
  Opportunity,
  OpportunityStatus,
} from "../types/opportunity";

import { opportunities } from "../data/opportunities";

/* =========================================================
   جميع الفرص
========================================================= */

export function getOpportunities(): Opportunity[] {
  return opportunities;
}

/* =========================================================
   الحصول على فرصة حسب الرمز
========================================================= */

export function getOpportunityByCode(
  code: string
): Opportunity | undefined {
  return opportunities.find(
    (opportunity) =>
      opportunity.code === code
  );
}

/* =========================================================
   الفرص حسب القطاع
========================================================= */

export function getOpportunitiesBySector(
  sector: string
): Opportunity[] {
  return opportunities.filter(
    (opportunity) =>
      opportunity.sector === sector
  );
}

/* =========================================================
   الفرص حسب الحالة
========================================================= */

export function getOpportunitiesByStatus(
  status: OpportunityStatus
): Opportunity[] {
  return opportunities.filter(
    (opportunity) =>
      opportunity.status === status
  );
}

/* =========================================================
   إجمالي القيمة الاستثمارية
========================================================= */

export function getTotalInvestment(
  items: Opportunity[] = opportunities
): number {
  return items.reduce(
    (total, opportunity) =>
      total + opportunity.value,
    0
  );
}

/* =========================================================
   الفرص النشطة
=========================================================

   الحالات الحالية في البيانات:

   - فرصة استراتيجية
   - فرصة جديدة
   - إعادة تأهيل

   جميعها تعتبر فرصاً نشطة ما لم تكن:
   - قيد الدراسة
   - مغلقة

========================================================= */

export function getActiveOpportunities(
  items: Opportunity[] = opportunities
): Opportunity[] {
  return items.filter(
    (opportunity) =>
      opportunity.status === "فرصة استراتيجية" ||
      opportunity.status === "فرصة جديدة" ||
      opportunity.status === "إعادة تأهيل"
  );
}

/* =========================================================
   الفرص الجاهزة للاستثمار
=========================================================

   الجاهزية تعتمد على readiness وليس على status.

   >= 80%  → جاهزة

========================================================= */

export function getReadyOpportunities(
  items: Opportunity[] = opportunities
): Opportunity[] {
  return items.filter(
    (opportunity) =>
      opportunity.readiness >= 80
  );
}

/* =========================================================
   الفرص قيد الدراسة
========================================================= */

export function getPendingOpportunities(
  items: Opportunity[] = opportunities
): Opportunity[] {
  return items.filter(
    (opportunity) =>
      opportunity.status ===
      "قيد الدراسة"
  );
}

/* =========================================================
   الفرص المغلقة
========================================================= */

export function getClosedOpportunities(
  items: Opportunity[] = opportunities
): Opportunity[] {
  return items.filter(
    (opportunity) =>
      opportunity.status ===
      "مغلقة"
  );
}