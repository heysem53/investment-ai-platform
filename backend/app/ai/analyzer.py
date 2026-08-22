from typing import Dict, Any

from .scoring import (
    calculate_investment_score,
    get_investment_grade,
    clamp_score,
)

from .schemas import (
    AIAnalysisResult,
    AIScoreBreakdown,
)


# =========================================================
# Helpers
# =========================================================

def normalize_text(value: Any) -> str:
    """
    Normalize text values for Arabic and English comparisons.
    """
    if value is None:
        return ""

    return " ".join(
        str(value).strip().lower().split()
    )


# =========================================================
# Financial Analysis
# =========================================================

def analyze_financial(data: Dict[str, Any]) -> float:
    """
    Calculate financial attractiveness score
    from real financial data.
    """

    financial = data.get("financial") or {}

    score = 50.0

    expected_return = financial.get(
        "expected_return_rate"
    )

    annual_return = financial.get(
        "annual_investment_return"
    )

    investment_period = financial.get(
        "investment_period_years"
    )

    if expected_return is not None:
        expected_return = float(expected_return)

        if expected_return >= 15:
            score += 25
        elif expected_return >= 12:
            score += 20
        elif expected_return >= 10:
            score += 15
        elif expected_return >= 7:
            score += 5
        else:
            score -= 10

    if annual_return is not None:
        annual_return = float(annual_return)

        if annual_return >= 15:
            score += 15
        elif annual_return >= 10:
            score += 10
        elif annual_return >= 7:
            score += 5

    if investment_period is not None:
        investment_period = float(
            investment_period
        )

        if investment_period <= 10:
            score += 10
        elif investment_period <= 20:
            score += 5
        elif investment_period > 30:
            score -= 5

    return clamp_score(score)


# =========================================================
# Location Analysis
# =========================================================

def analyze_location(data: Dict[str, Any]) -> float:
    """
    Calculate location attractiveness score.
    """

    location = data.get("location") or {}

    score = 50.0

    area = location.get("area_value")

    expandable = location.get("expandable")

    expansion_area = location.get(
        "expansion_area_value"
    )

    latitude = location.get("latitude")

    longitude = location.get("longitude")

    if area is not None:
        area = float(area)

        if area >= 100000:
            score += 20
        elif area >= 50000:
            score += 15
        elif area >= 10000:
            score += 10
        elif area > 0:
            score += 5

    if expandable is True:
        score += 15

        if expansion_area:
            score += 5

    if latitude is not None and longitude is not None:
        score += 10

    return clamp_score(score)


# =========================================================
# Market Analysis
# =========================================================

def analyze_market(data: Dict[str, Any]) -> float:
    """
    Calculate market potential from project details.
    """

    project = data.get(
        "project_details"
    ) or {}

    score = 50.0

    target_market = (
        project.get("target_market_en")
        or project.get("target_market_ar")
    )

    main_product = (
        project.get("main_product_en")
        or project.get("main_product_ar")
    )

    production_capacity = project.get(
        "production_capacity"
    )

    secondary_products = (
        project.get("secondary_products_en")
        or project.get("secondary_products_ar")
    )

    if target_market:
        score += 15

    if main_product:
        score += 10

    if secondary_products:
        score += 10

    if production_capacity:
        score += 10

    return clamp_score(score)


# =========================================================
# Infrastructure Analysis
# =========================================================

def analyze_infrastructure(
    data: Dict[str, Any]
) -> float:
    """
    Calculate infrastructure availability score.
    """

    infrastructure = (
        data.get("infrastructure")
        or []
    )

    if not infrastructure:
        return 30.0

    score = 40.0

    available_count = 0

    for item in infrastructure:

        status = normalize_text(
            item.get("availability_status_en")
            or item.get("availability_status_ar")
            or item.get("availability_status")
        )

        if status in {
            "available",
            "available now",
            "متوفر",
            "متاحة",
            "متاح",
            "متوفرة",
        }:
            available_count += 1

    score += min(
        available_count * 15,
        45,
    )

    if len(infrastructure) >= 3:
        score += 10

    return clamp_score(score)


# =========================================================
# Employment Analysis
# =========================================================

def analyze_employment(
    data: Dict[str, Any]
) -> float:
    """
    Calculate employment impact score.
    """

    employment = (
        data.get("employment")
        or {}
    )

    total_jobs = employment.get(
        "total_jobs"
    )

    local_jobs = employment.get(
        "local_total_workers"
    )

    score = 50.0

    if total_jobs is not None:
        total_jobs = float(total_jobs)

        if total_jobs >= 1000:
            score += 35
        elif total_jobs >= 500:
            score += 30
        elif total_jobs >= 250:
            score += 25
        elif total_jobs >= 100:
            score += 15
        elif total_jobs >= 50:
            score += 10

    if local_jobs is not None:
        local_jobs = float(local_jobs)

        if local_jobs >= 200:
            score += 15
        elif local_jobs >= 100:
            score += 10
        elif local_jobs >= 50:
            score += 5

    return clamp_score(score)


# =========================================================
# Readiness Analysis
# =========================================================

def analyze_readiness(
    data: Dict[str, Any]
) -> float:
    """
    Calculate investment readiness.

    Uses approvals, attachments and opportunity status.

    Supports both Arabic and English database values.
    """

    score = 50.0

    approvals = (
        data.get("approvals")
        or []
    )

    attachments = (
        data.get("attachments")
        or []
    )

    references = (
        data.get("references")
        or {}
    )

    status = normalize_text(
        references.get("status_name_en")
        or references.get("status_name_ar")
    )

    # -----------------------------------------------------
    # Approvals
    # -----------------------------------------------------

    if approvals:

        completed = 0

        for approval in approvals:

            approval_status = normalize_text(
                approval.get("approval_status_en")
                or approval.get("approval_status_ar")
                or approval.get("approval_status")
            )

            if approval_status in {
                "approved",
                "completed",
                "complete",
                "approved and completed",
                "موافق عليه",
                "معتمد",
                "مكتمل",
                "كامل",
            }:
                completed += 1

        if completed == len(approvals):
            score += 25

        elif completed > 0:
            score += 10

        else:
            score -= 10

    else:
        score -= 10

    # -----------------------------------------------------
    # Documents
    # -----------------------------------------------------

    available_documents = 0

    for attachment in attachments:

        document_status = normalize_text(
            attachment.get("document_status_en")
            or attachment.get("document_status_ar")
            or attachment.get("document_status")
        )

        if document_status in {
            "available",
            "available now",
            "available for review",
            "متوفر",
            "متاحة",
            "متاح",
            "متوفرة",
        }:
            available_documents += 1

    if available_documents >= 5:
        score += 15

    elif available_documents >= 3:
        score += 10

    elif available_documents >= 1:
        score += 5

    # -----------------------------------------------------
    # Strategic Opportunity
    # -----------------------------------------------------

    if (
        "strategic" in status
        or "استراتيجي" in status
    ):
        score += 10

    return clamp_score(score)


# =========================================================
# Risk Analysis
# =========================================================

def analyze_risk(
    data: Dict[str, Any]
) -> float:
    """
    Calculate risk score.

    Higher score = lower investment risk.

    Supports both Arabic and English database values.
    """

    score = 70.0

    financial = (
        data.get("financial")
        or {}
    )

    approvals = (
        data.get("approvals")
        or []
    )

    expandable = (
        data.get("location") or {}
    ).get("expandable")

    notes = normalize_text(
        financial.get("notes_en")
        or financial.get("notes_ar")
    )

    expected_return = financial.get(
        "expected_return_rate"
    )

    if expected_return is not None:

        expected_return = float(
            expected_return
        )

        if expected_return >= 12:
            score += 10

        elif expected_return < 7:
            score -= 15

    # -----------------------------------------------------
    # Pending Approvals
    # -----------------------------------------------------

    if approvals:

        for approval in approvals:

            status = normalize_text(
                approval.get("approval_status_en")
                or approval.get("approval_status_ar")
                or approval.get("approval_status")
            )

            if (
                "pending" in status
                or "قيد الانتظار" in status
                or "معلق" in status
                or "بانتظار" in status
            ):
                score -= 10

    # -----------------------------------------------------
    # Feasibility Requirement
    # -----------------------------------------------------

    if (
        "requires detailed feasibility" in notes
        or "requires feasibility" in notes
        or "يتطلب دراسة جدوى" in notes
        or "دراسة جدوى" in notes
    ):
        score -= 5

    # -----------------------------------------------------
    # Expansion Potential
    # -----------------------------------------------------

    if expandable is True:
        score += 5

    return clamp_score(score)


# =========================================================
# Strengths
# =========================================================

def generate_strengths(
    scores: Dict[str, float],
    data: Dict[str, Any],
):
    strengths = []

    if scores["market"] >= 70:
        strengths.append(
            "Strong market potential"
        )

    if scores["financial"] >= 70:
        strengths.append(
            "Good financial attractiveness"
        )

    if scores["location"] >= 70:
        strengths.append(
            "Strategic and expandable location"
        )

    if scores["infrastructure"] >= 70:
        strengths.append(
            "Good infrastructure availability"
        )

    if scores["employment"] >= 70:
        strengths.append(
            "Strong employment impact"
        )

    return strengths


# =========================================================
# Risks
# =========================================================

def generate_risks(
    scores: Dict[str, float],
    data: Dict[str, Any],
):
    risks = []

    if scores["market"] < 50:
        risks.append(
            "Limited market information"
        )

    if scores["financial"] < 50:
        risks.append(
            "Weak financial indicators"
        )

    if scores["location"] < 50:
        risks.append(
            "Location requires further assessment"
        )

    if scores["infrastructure"] < 50:
        risks.append(
            "Infrastructure limitations"
        )

    if scores["readiness"] < 50:
        risks.append(
            "Investment readiness is limited"
        )

    # -----------------------------------------------------
    # Pending Approvals
    # -----------------------------------------------------

    approvals = (
        data.get("approvals")
        or []
    )

    for approval in approvals:

        status = normalize_text(
            approval.get("approval_status_en")
            or approval.get("approval_status_ar")
            or approval.get("approval_status")
        )

        if (
            "pending" in status
            or "قيد الانتظار" in status
            or "معلق" in status
            or "بانتظار" in status
        ):
            risks.append(
                "Required approvals are still pending"
            )
            break

    # -----------------------------------------------------
    # Feasibility
    # -----------------------------------------------------

    financial = (
        data.get("financial")
        or {}
    )

    notes = normalize_text(
        financial.get("notes_en")
        or financial.get("notes_ar")
    )

    if (
        "feasibility" in notes
        or "دراسة جدوى" in notes
    ):
        risks.append(
            "Detailed feasibility study is required"
        )

    return risks


# =========================================================
# Recommendations
# =========================================================

def generate_recommendations(
    investment_score: float,
    readiness_score: float,
):
    recommendations = []

    if investment_score >= 70:
        recommendations.append(
            "The opportunity should be prioritized for investor promotion."
        )

    else:
        recommendations.append(
            "The opportunity requires further preparation before promotion."
        )

    if readiness_score < 60:
        recommendations.append(
            "Complete the required approvals and investment documentation."
        )

    if investment_score >= 80:
        recommendations.append(
            "The opportunity is suitable for targeted investor outreach."
        )

    recommendations.append(
        "A detailed feasibility study should be completed before final investment decision."
    )

    return recommendations


# =========================================================
# Suitable Investors
# =========================================================

def determine_suitable_investors(
    data: Dict[str, Any],
):
    references = (
        data.get("references")
        or {}
    )

    investor_type = (
        references.get(
            "investor_type_name_en"
        )
        or references.get(
            "investor_type_name_ar"
        )
    )

    contract_type = (
        references.get(
            "contract_type_name_en"
        )
        or references.get(
            "contract_type_name_ar"
        )
    )

    sector = (
        references.get(
            "sector_name_en"
        )
        or references.get(
            "sector_name_ar"
        )
    )

    investors = []

    if investor_type:
        investors.append(
            f"{investor_type} investors"
        )

    if contract_type:
        investors.append(
            f"Investors interested in {contract_type} projects"
        )

    if sector:
        investors.append(
            f"{sector} investors"
        )

    return investors


# =========================================================
# Main AI Analysis
# =========================================================

def analyze_opportunity(
    opportunity_id: int,
    data: Dict[str, Any],
) -> AIAnalysisResult:

    # -----------------------------------------------------
    # Calculate seven component scores
    # -----------------------------------------------------

    market_score = analyze_market(
        data
    )

    financial_score = analyze_financial(
        data
    )

    location_score = analyze_location(
        data
    )

    infrastructure_score = (
        analyze_infrastructure(data)
    )

    readiness_score = analyze_readiness(
        data
    )

    employment_score = analyze_employment(
        data
    )

    risk_score = analyze_risk(
        data
    )

    # -----------------------------------------------------
    # Score breakdown
    # -----------------------------------------------------

    scores = {
        "market": market_score,
        "financial": financial_score,
        "location": location_score,
        "infrastructure": infrastructure_score,
        "readiness": readiness_score,
        "employment": employment_score,
        "risk": risk_score,
    }

    # -----------------------------------------------------
    # Overall Investment Score
    # -----------------------------------------------------

    result = calculate_investment_score(
        market_score=market_score,
        financial_score=financial_score,
        location_score=location_score,
        infrastructure_score=infrastructure_score,
        readiness_score=readiness_score,
        employment_score=employment_score,
        risk_score=risk_score,
    )

    investment_score = result[
        "investment_score"
    ]

    investment_grade = get_investment_grade(
        investment_score
    )

    # -----------------------------------------------------
    # AI Interpretation
    # -----------------------------------------------------

    strengths = generate_strengths(
        scores,
        data,
    )

    risks = generate_risks(
        scores,
        data,
    )

    recommendations = generate_recommendations(
        investment_score,
        readiness_score,
    )

    suitable_investors = (
        determine_suitable_investors(
            data
        )
    )

    # -----------------------------------------------------
    # Summary
    # -----------------------------------------------------

    summary = (
        f"The opportunity received an "
        f"investment attractiveness score "
        f"of {investment_score}/100 and was "
        f"classified as {investment_grade}."
    )

    # -----------------------------------------------------
    # Final AI Analysis Result
    # -----------------------------------------------------

    return AIAnalysisResult(
        opportunity_id=opportunity_id,
        investment_score=investment_score,
        investment_grade=investment_grade,
        summary=summary,
        strengths=strengths,
        risks=risks,
        recommendations=recommendations,
        score_breakdown=AIScoreBreakdown(
            market_score=market_score,
            financial_score=financial_score,
            location_score=location_score,
            infrastructure_score=infrastructure_score,
            readiness_score=readiness_score,
            employment_score=employment_score,
            risk_score=risk_score,
        ),
        suitable_investors=suitable_investors,
        estimated_readiness=readiness_score,
    )