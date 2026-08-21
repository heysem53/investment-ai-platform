from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text
from .database import engine


# =========================================================
# FastAPI
# =========================================================

app = FastAPI(
    title="Investment AI API",
    version="2.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Database Helper
# =========================================================

def fetch_all(query: str, params: dict | None = None):

    with engine.connect() as connection:

        result = connection.execute(
            text(query),
            params or {},
        )

        return [
            dict(row._mapping)
            for row in result.fetchall()
        ]


def fetch_one(query: str, params: dict | None = None):

    with engine.connect() as connection:

        result = connection.execute(
            text(query),
            params or {},
        )

        row = result.fetchone()

        if not row:
            return None

        return dict(row._mapping)


# =========================================================
# Root
# =========================================================

@app.get("/")
def root():

    return {
        "status": "ok",
        "message": "Investment AI API is running",
        "database": "PostgreSQL",
    }


# =========================================================
# Health
# =========================================================

@app.get("/api/health")
def health():

    try:

        database = fetch_one(
            """
            SELECT current_database() AS database
            """
        )

        return {
            "status": "ok",
            "message": "API is healthy",
            "database": database["database"],
        }

    except Exception as error:

        return {
            "status": "error",
            "message": str(error),
        }


# =========================================================
# Database Test
# =========================================================

@app.get("/api/db-test")
def db_test():

    try:

        row = fetch_one(
            """
            SELECT
                current_database() AS database,
                version() AS postgresql
            """
        )

        return {
            "status": "ok",
            "database": row["database"],
            "postgresql": row["postgresql"],
        }

    except Exception as error:

        return {
            "status": "error",
            "message": str(error),
        }


# =========================================================
# Database Statistics
# =========================================================

@app.get("/api/db-stats")
def db_stats():

    try:

        tables = [
            "investment_opportunities",
            "sectors",
            "sub_sectors",
            "locations",
            "project_details",
            "financial_data",
            "employment",
            "entities",
            "opportunity_approvals",
            "opportunity_infrastructure",
            "opportunity_site_features",
            "opportunity_attachments",
        ]

        result = {}

        for table in tables:

            row = fetch_one(
                f'''
                SELECT COUNT(*) AS count
                FROM "{table}"
                '''
            )

            result[table] = row["count"]

        return {
            "status": "ok",
            "tables": result,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# Reference Data
# =========================================================

@app.get("/api/sectors")
def get_sectors():

    try:

        return fetch_all(
            """
            SELECT
                sector_id,
                name_ar,
                name_en,
                description_ar,
                description_en,
                is_active
            FROM sectors
            WHERE is_active = TRUE
            ORDER BY sector_id
            """
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# All Opportunities
# =========================================================

@app.get("/api/opportunities")
def get_opportunities():

    try:

        rows = fetch_all(
            """
            SELECT

                o.opportunity_id,
                o.opportunity_code,
                o.name_ar,
                o.name_en,

                o.sector_id,
                s.name_ar AS sector_name_ar,
                s.name_en AS sector_name_en,

                o.sub_sector_id,
                ss.name_ar AS sub_sector_name_ar,
                ss.name_en AS sub_sector_name_en,

                o.location_id,

                o.ownership_id,
                ot.name_ar AS ownership_name_ar,
                ot.name_en AS ownership_name_en,

                o.project_type_id,
                pt.name_ar AS project_type_name_ar,
                pt.name_en AS project_type_name_en,

                o.investor_type_id,
                it.name_ar AS investor_type_name_ar,
                it.name_en AS investor_type_name_en,

                o.contract_type_id,
                ct.name_ar AS contract_type_name_ar,
                ct.name_en AS contract_type_name_en,

                o.provider_entity_id,
                e.name_ar AS provider_entity_name_ar,
                e.name_en AS provider_entity_name_en,

                o.project_scale_id,
                ps.name_ar AS project_scale_name_ar,
                ps.name_en AS project_scale_name_en,

                o.status_id,
                os.name_ar AS status_name_ar,
                os.name_en AS status_name_en,

                f.estimated_cost,
                f.currency_id,
                c.name_ar AS currency_name_ar,
                c.name_en AS currency_name_en,
                c.symbol AS currency_symbol,

                f.financing_model_id,
                fm.name_ar AS financing_model_name_ar,
                fm.name_en AS financing_model_name_en,

                l.description_ar AS location_description_ar,
                l.description_en AS location_description_en,
                l.area_value,
                l.area_unit_id,
                au.name_ar AS area_unit_name_ar,
                au.symbol AS area_unit_symbol,
                l.latitude,
                l.longitude,
                l.map_url,

                pd.description_ar AS project_description_ar,
                pd.description_en AS project_description_en,
                pd.main_product_ar,
                pd.main_product_en,

                emp.total_jobs

            FROM investment_opportunities o

            LEFT JOIN sectors s
                ON o.sector_id = s.sector_id

            LEFT JOIN sub_sectors ss
                ON o.sub_sector_id = ss.sub_sector_id

            LEFT JOIN ownership_types ot
                ON o.ownership_id = ot.ownership_id

            LEFT JOIN project_types pt
                ON o.project_type_id = pt.project_type_id

            LEFT JOIN investor_types it
                ON o.investor_type_id = it.investor_type_id

            LEFT JOIN contract_types ct
                ON o.contract_type_id = ct.contract_type_id

            LEFT JOIN entities e
                ON o.provider_entity_id = e.entity_id

            LEFT JOIN project_scales ps
                ON o.project_scale_id = ps.project_scale_id

            LEFT JOIN opportunity_statuses os
                ON o.status_id = os.status_id

            LEFT JOIN financial_data f
                ON o.opportunity_id = f.opportunity_id

            LEFT JOIN currencies c
                ON f.currency_id = c.currency_id

            LEFT JOIN financing_models fm
                ON f.financing_model_id = fm.financing_model_id

            LEFT JOIN locations l
                ON o.location_id = l.location_id

            LEFT JOIN area_units au
                ON l.area_unit_id = au.area_unit_id

            LEFT JOIN project_details pd
                ON o.opportunity_id = pd.opportunity_id

            LEFT JOIN employment emp
                ON o.opportunity_id = emp.opportunity_id

            WHERE o.is_active = TRUE

            ORDER BY o.opportunity_id
            """
        )

        result = []

        for row in rows:

            estimated_cost = (
                float(row["estimated_cost"])
                if row["estimated_cost"] is not None
                else 0
            )

            investment_value_million = (
                estimated_cost / 1_000_000
            )

            area = ""

            if row["area_value"] is not None:

                try:

                    area_value = float(
                        row["area_value"]
                    )

                    area = (
                        f"{area_value:,.0f} "
                        f"{row['area_unit_name_ar'] or ''}"
                    ).strip()

                except (
                    ValueError,
                    TypeError,
                ):

                    area = ""

            description = (
                row["project_description_ar"]
                or "لا يوجد وصف تفصيلي متوفر حاليًا لهذه الفرصة."
            )

            # -------------------------------------------------
            # Readiness
            # -------------------------------------------------

            opportunity_id = row[
                "opportunity_id"
            ]

            readiness_checks = fetch_one(
                """
                SELECT

                    EXISTS (
                        SELECT 1
                        FROM financial_data
                        WHERE opportunity_id = :id
                    ) AS has_financial,

                    EXISTS (
                        SELECT 1
                        FROM locations
                        WHERE opportunity_id = :id
                    ) AS has_location,

                    EXISTS (
                        SELECT 1
                        FROM project_details
                        WHERE opportunity_id = :id
                    ) AS has_details,

                    EXISTS (
                        SELECT 1
                        FROM employment
                        WHERE opportunity_id = :id
                    ) AS has_employment,

                    EXISTS (
                        SELECT 1
                        FROM opportunity_infrastructure
                        WHERE opportunity_id = :id
                    ) AS has_infrastructure,

                    EXISTS (
                        SELECT 1
                        FROM opportunity_site_features
                        WHERE opportunity_id = :id
                    ) AS has_site_features,

                    EXISTS (
                        SELECT 1
                        FROM opportunity_approvals
                        WHERE opportunity_id = :id
                    ) AS has_approvals,

                    EXISTS (
                        SELECT 1
                        FROM opportunity_attachments
                        WHERE opportunity_id = :id
                    ) AS has_attachments
                """,
                {
                    "id": opportunity_id
                },
            )

            readiness_fields = [
                readiness_checks["has_financial"],
                readiness_checks["has_location"],
                readiness_checks["has_details"],
                readiness_checks["has_employment"],
                readiness_checks["has_infrastructure"],
                readiness_checks["has_site_features"],
                readiness_checks["has_approvals"],
                readiness_checks["has_attachments"],
            ]

            readiness = round(
                (
                    sum(
                        1
                        for value in readiness_fields
                        if value
                    )
                    / len(readiness_fields)
                )
                * 100
            )

            result.append({

                "code":
                    row["opportunity_code"],

                "name":
                    row["name_ar"],

                "nameEn":
                    row["name_en"],

                "sector":
                    row["sector_name_ar"]
                    or "غير محدد",

                "subSector":
                    row["sub_sector_name_ar"]
                    or "غير محدد",

                "location":
                    row["location_description_ar"]
                    or "غير محدد",

                "status":
                    row["status_name_ar"]
                    or "غير محدد",

                "value":
                    investment_value_million,

                "estimatedCost":
                    estimated_cost,

                "currency":
                    row["currency_name_ar"]
                    or "",

                "description":
                    description,

                "projectType":
                    row["project_type_name_ar"]
                    or "غير محدد",

                "projectScale":
                    row["project_scale_name_ar"]
                    or "غير محدد",

                "ownership":
                    row["ownership_name_ar"]
                    or "غير محدد",

                "investorType":
                    row["investor_type_name_ar"]
                    or "غير محدد",

                "contractType":
                    row["contract_type_name_ar"]
                    or "غير محدد",

                "providerEntity":
                    row["provider_entity_name_ar"]
                    or "غير محدد",

                "area":
                    area,

                "latitude":
                    row["latitude"],

                "longitude":
                    row["longitude"],

                "mapUrl":
                    row["map_url"],

                "totalJobs":
                    row["total_jobs"] or 0,

                "readiness":
                    readiness,

                "investmentModel":
                    row["financing_model_name_ar"]
                    or "غير محدد",

            })

        return result

    except Exception as error:

        print(
            "ERROR loading opportunities:",
            str(error),
        )

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# Opportunity By Code
# =========================================================

def get_opportunity_by_code(
    code: str
):

    # =====================================================
    # Main Opportunity
    # =====================================================

    opportunity = fetch_one(
        """
        SELECT *
        FROM investment_opportunities
        WHERE opportunity_code = :code
          AND is_active = TRUE
        LIMIT 1
        """,
        {
            "code": code
        },
    )

    if not opportunity:
        return None

    opportunity_id = opportunity[
        "opportunity_id"
    ]

    # =====================================================
    # References
    # =====================================================

    references = fetch_one(
        """
        SELECT

            s.sector_id,
            s.name_ar AS sector_name_ar,
            s.name_en AS sector_name_en,

            ss.sub_sector_id,
            ss.name_ar AS sub_sector_name_ar,
            ss.name_en AS sub_sector_name_en,

            pt.project_type_id,
            pt.name_ar AS project_type_name_ar,
            pt.name_en AS project_type_name_en,

            ps.project_scale_id,
            ps.name_ar AS project_scale_name_ar,
            ps.name_en AS project_scale_name_en,

            it.investor_type_id,
            it.name_ar AS investor_type_name_ar,
            it.name_en AS investor_type_name_en,

            ct.contract_type_id,
            ct.name_ar AS contract_type_name_ar,
            ct.name_en AS contract_type_name_en,

            os.status_id,
            os.name_ar AS status_name_ar,
            os.name_en AS status_name_en,

            ot.ownership_id,
            ot.name_ar AS ownership_name_ar,
            ot.name_en AS ownership_name_en,

            e.entity_id AS provider_entity_id,
            e.name_ar AS provider_entity_name_ar,
            e.name_en AS provider_entity_name_en,

            et.entity_type_id,
            et.name_ar AS provider_entity_type_name_ar,
            et.name_en AS provider_entity_type_name_en

        FROM investment_opportunities o

        LEFT JOIN sectors s
            ON o.sector_id = s.sector_id

        LEFT JOIN sub_sectors ss
            ON o.sub_sector_id = ss.sub_sector_id

        LEFT JOIN project_types pt
            ON o.project_type_id = pt.project_type_id

        LEFT JOIN project_scales ps
            ON o.project_scale_id = ps.project_scale_id

        LEFT JOIN investor_types it
            ON o.investor_type_id = it.investor_type_id

        LEFT JOIN contract_types ct
            ON o.contract_type_id = ct.contract_type_id

        LEFT JOIN opportunity_statuses os
            ON o.status_id = os.status_id

        LEFT JOIN ownership_types ot
            ON o.ownership_id = ot.ownership_id

        LEFT JOIN entities e
            ON o.provider_entity_id = e.entity_id

        LEFT JOIN entity_types et
            ON e.entity_type_id = et.entity_type_id

        WHERE o.opportunity_id = :id
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Financial
    # =====================================================

    financial = fetch_one(
        """
        SELECT
            f.*,

            c.code AS currency_code,
            c.name_ar AS currency_name_ar,
            c.name_en AS currency_name_en,
            c.symbol AS currency_symbol,

            fm.name_ar AS financing_model_name_ar,
            fm.name_en AS financing_model_name_en

        FROM financial_data f

        LEFT JOIN currencies c
            ON f.currency_id = c.currency_id

        LEFT JOIN financing_models fm
            ON f.financing_model_id = fm.financing_model_id

        WHERE f.opportunity_id = :id
        LIMIT 1
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Location
    # =====================================================

    location = fetch_one(
        """
        SELECT
            l.*,

            au.name_ar AS area_unit_name_ar,
            au.name_en AS area_unit_name_en,
            au.symbol AS area_unit_symbol,

            ad.name_ar AS administrative_unit_name_ar,
            ad.name_en AS administrative_unit_name_en,

            adt.name_ar AS administrative_unit_type_name_ar,
            adt.name_en AS administrative_unit_type_name_en

        FROM locations l

        LEFT JOIN area_units au
            ON l.area_unit_id = au.area_unit_id

        LEFT JOIN administrative_units ad
            ON l.administrative_unit_id =
               ad.administrative_unit_id

        LEFT JOIN administrative_unit_types adt
            ON ad.unit_type_id =
               adt.unit_type_id

        WHERE l.opportunity_id = :id
        LIMIT 1
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Project Details
    # =====================================================

    project_details = fetch_one(
        """
        SELECT
            pd.*,

            cu.name_ar AS capacity_unit_name_ar,
            cu.name_en AS capacity_unit_name_en,
            cu.symbol AS capacity_unit_symbol

        FROM project_details pd

        LEFT JOIN capacity_units cu
            ON pd.capacity_unit_id =
               cu.capacity_unit_id

        WHERE pd.opportunity_id = :id
        LIMIT 1
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Employment
    # =====================================================

    employment = fetch_one(
        """
        SELECT *
        FROM employment
        WHERE opportunity_id = :id
        LIMIT 1
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Infrastructure
    # =====================================================

    infrastructure = fetch_all(
        """
        SELECT

            oi.*,

            it.name_ar AS infrastructure_type_name_ar,
            it.name_en AS infrastructure_type_name_en,
            it.category AS infrastructure_category

        FROM opportunity_infrastructure oi

        LEFT JOIN infrastructure_types it
            ON oi.infrastructure_type_id =
               it.infrastructure_type_id

        WHERE oi.opportunity_id = :id

        ORDER BY oi.opportunity_infrastructure_id
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Site Features
    # =====================================================

    site_features = fetch_all(
        """
        SELECT

            osf.*,

            sf.name_ar AS feature_name_ar,
            sf.name_en AS feature_name_en,
            sf.description_ar AS feature_description_ar,
            sf.description_en AS feature_description_en

        FROM opportunity_site_features osf

        LEFT JOIN site_features sf
            ON osf.site_feature_id =
               sf.feature_id

        WHERE osf.opportunity_id = :id

        ORDER BY osf.opportunity_site_feature_id
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Approvals
    # =====================================================

    approvals = fetch_all(
        """
        SELECT

            oa.*,

            at.name_ar AS approval_type_name_ar,
            at.name_en AS approval_type_name_en,

            e.name_ar AS issuing_entity_name_ar,
            e.name_en AS issuing_entity_name_en

        FROM opportunity_approvals oa

        LEFT JOIN approval_types at
            ON oa.approval_type_id =
               at.approval_type_id

        LEFT JOIN entities e
            ON oa.issuing_entity_id =
               e.entity_id

        WHERE oa.opportunity_id = :id

        ORDER BY oa.opportunity_approval_id
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Entities
    # =====================================================

    entities = fetch_all(
        """
        SELECT

            oe.*,

            e.name_ar AS entity_name_ar,
            e.name_en AS entity_name_en,
            e.phone AS entity_phone,
            e.email AS entity_email,

            et.name_ar AS entity_type_name_ar,
            et.name_en AS entity_type_name_en,

            ert.name_ar AS relation_type_name_ar,
            ert.name_en AS relation_type_name_en

        FROM opportunity_entities oe

        LEFT JOIN entities e
            ON oe.entity_id = e.entity_id

        LEFT JOIN entity_types et
            ON e.entity_type_id =
               et.entity_type_id

        LEFT JOIN entity_relation_types ert
            ON oe.relation_type_id =
               ert.relation_type_id

        WHERE oe.opportunity_id = :id

        ORDER BY oe.opportunity_entity_id
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Investors
    # =====================================================

    investors = fetch_all(
        """
        SELECT

            oi.*,

            it.name_ar AS investor_type_name_ar,
            it.name_en AS investor_type_name_en,

            e.name_ar AS entity_name_ar,
            e.name_en AS entity_name_en

        FROM opportunity_investors oi

        LEFT JOIN investor_types it
            ON oi.investor_type_id =
               it.investor_type_id

        LEFT JOIN entities e
            ON oi.entity_id =
               e.entity_id

        WHERE oi.opportunity_id = :id

        ORDER BY oi.opportunity_investor_id
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Contracts
    # =====================================================

    contracts = fetch_all(
        """
        SELECT

            oc.*,

            ct.name_ar AS contract_type_name_ar,
            ct.name_en AS contract_type_name_en

        FROM opportunity_contracts oc

        LEFT JOIN contract_types ct
            ON oc.contract_type_id =
               ct.contract_type_id

        WHERE oc.opportunity_id = :id

        ORDER BY oc.opportunity_contract_id
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Attachments
    # =====================================================

    attachments = fetch_all(
        """
        SELECT

            oa.*,

            at.name_ar AS attachment_type_name_ar,
            at.name_en AS attachment_type_name_en

        FROM opportunity_attachments oa

        LEFT JOIN attachment_types at
            ON oa.attachment_type_id =
               at.attachment_type_id

        WHERE oa.opportunity_id = :id

        ORDER BY oa.opportunity_attachment_id
        """,
        {
            "id": opportunity_id
        },
    )

    # =====================================================
    # Final Response
    # =====================================================

    return {

        "opportunity":
            opportunity,

        "references":
            references,

        "financial":
            financial,

        "location":
            location,

        "project_details":
            project_details,

        "employment":
            employment,

        "infrastructure":
            infrastructure,

        "site_features":
            site_features,

        "approvals":
            approvals,

        "entities":
            entities,

        "investors":
            investors,

        "contracts":
            contracts,

        "attachments":
            attachments,

    }


# =========================================================
# API: Opportunity By Code
# =========================================================

@app.get("/api/opportunities/{code}")
def get_opportunity(code: str):

    try:

        result = get_opportunity_by_code(
            code
        )

        if not result:

            raise HTTPException(
                status_code=404,
                detail="Opportunity not found",
            )

        return result

    except HTTPException:

        raise

    except Exception as error:

        print(
            "ERROR loading opportunity:",
            str(error),
        )

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# Financial Data
# =========================================================

@app.get("/api/financial-data")
def get_financial_data():

    try:

        return fetch_all(
            """
            SELECT
                f.*,

                c.code AS currency_code,
                c.name_ar AS currency_name_ar,
                c.name_en AS currency_name_en,
                c.symbol AS currency_symbol,

                fm.name_ar AS financing_model_name_ar,
                fm.name_en AS financing_model_name_en

            FROM financial_data f

            LEFT JOIN currencies c
                ON f.currency_id = c.currency_id

            LEFT JOIN financing_models fm
                ON f.financing_model_id =
                   fm.financing_model_id

            ORDER BY f.financial_id
            """
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# Financial By Opportunity ID
# =========================================================

@app.get("/api/financial/{opportunity_id}")
def get_financial(
    opportunity_id: str
):

    try:

        financial = fetch_one(
            """
            SELECT
                f.*,

                c.code AS currency_code,
                c.name_ar AS currency_name_ar,
                c.name_en AS currency_name_en,
                c.symbol AS currency_symbol,

                fm.name_ar AS financing_model_name_ar,
                fm.name_en AS financing_model_name_en

            FROM financial_data f

            LEFT JOIN currencies c
                ON f.currency_id = c.currency_id

            LEFT JOIN financing_models fm
                ON f.financing_model_id =
                   fm.financing_model_id

            WHERE f.opportunity_id = :id

            LIMIT 1
            """,
            {
                "id": opportunity_id
            },
        )

        if not financial:

            raise HTTPException(
                status_code=404,
                detail="Financial data not found",
            )

        return financial

    except HTTPException:

        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# Administrative Units
# =========================================================

@app.get("/api/administrative-units")
def get_administrative_units():

    try:

        return fetch_all(
            """
            SELECT

                au.*,

                aut.name_ar AS unit_type_name_ar,
                aut.name_en AS unit_type_name_en

            FROM administrative_units au

            LEFT JOIN administrative_unit_types aut
                ON au.unit_type_id =
                   aut.unit_type_id

            ORDER BY au.administrative_unit_id
            """
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# Infrastructure
# =========================================================

@app.get("/api/infrastructure")
def get_infrastructure():

    try:

        return fetch_all(
            """
            SELECT *
            FROM infrastructure_types
            WHERE is_active = TRUE
            ORDER BY infrastructure_type_id
            """
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# =========================================================
# Cache
# =========================================================
#
# Google Sheets cache لم يعد مستخدمًا.
# Endpoint محفوظ للتوافق مع النسخة السابقة.
# =========================================================

@app.get("/api/cache/clear")
def clear_sheet_cache():

    return {
        "status": "ok",
        "message": "PostgreSQL mode - no Google Sheets API cache is used",
    }