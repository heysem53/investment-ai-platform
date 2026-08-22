from pydantic import BaseModel, Field
from typing import List, Optional


class AIAnalysisRequest(BaseModel):
    opportunity_id: int


class AIScoreBreakdown(BaseModel):
    market_score: float = Field(ge=0, le=100)
    financial_score: float = Field(ge=0, le=100)
    location_score: float = Field(ge=0, le=100)
    infrastructure_score: float = Field(ge=0, le=100)
    readiness_score: float = Field(ge=0, le=100)
    employment_score: float = Field(ge=0, le=100)
    risk_score: float = Field(ge=0, le=100)


class AIAnalysisResult(BaseModel):
    opportunity_id: int

    investment_score: float = Field(ge=0, le=100)

    investment_grade: str

    summary: str

    strengths: List[str]

    risks: List[str]

    recommendations: List[str]

    score_breakdown: AIScoreBreakdown

    suitable_investors: List[str]

    estimated_readiness: Optional[float] = Field(
        default=None,
        ge=0,
        le=100,
    )