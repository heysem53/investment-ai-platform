import { BrowserRouter as Router, Routes, Route } from "react-router";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";

import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";

import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";

import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";

import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import Opportunities from "./pages/Opportunities/Opportunities";

import OpportunityDetails from "./pages/Opportunities/OpportunityDetails";
import InvestmentMap from "./pages/InvestmentMap/InvestmentMap";

import ApiTest from "./pages/ApiTest";

import Sectors from "./pages/Sectors/Sectors";

import Locations from "./pages/Locations/Locations";

import Investors from "./pages/Investors/Investors";

import FinancialData from "./pages/FinancialData/FinancialData";

import Contracts from "./pages/Contracts/Contracts";

import Attachments from "./pages/Attachments/Attachments";

import AIAnalysis from "./pages/AIAnalysis/AIAnalysis";

import Reports from "./pages/Reports/Reports.tsx";

import TablesData from "./pages/TablesData/TablesData";


export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>

        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>

          {/* الرئيسية */}
          <Route index path="/" element={<Home />} />

          {/* منصة الاستثمار */}
          <Route
            path="/map"
            element={<InvestmentMap />}
          />

          <Route
            path="/sectors"
            element={<Sectors />}
          />

          <Route
            path="/opportunities"
            element={<Opportunities />}
          />

          <Route
          path="/opportunities/:code"
          element={<OpportunityDetails />}
          />

          <Route
            path="/opportunities/ready"
            element={<Blank />}
          />

          <Route
            path="/opportunities/new"
            element={<Blank />}
          />

          <Route
            path="/analytics"
            element={<Blank />}
          />

          <Route
            path="/investors"
            element={<Investors />}
          />

          <Route
            path="/financial-data"
            element={<FinancialData />}
          />

          <Route
            path="/entities"
            element={<Blank />}
          />

          <Route
            path="/locations"
            element={<Locations />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/contracts"
            element={<Contracts />}
          />

          <Route
            path="/attachments"
            element={<Attachments />}
          />

          {/* الذكاء الاصطناعي */}
          
          <Route
            path="/ai-analysis"
            element={<AIAnalysis />}
          />

          <Route
            path="/ai/opportunity-analysis"
            element={<Blank />}
          />

          <Route
            path="/ai/investment-evaluation"
            element={<Blank />}
          />

          <Route
            path="/ai/recommendations"
            element={<Blank />}
          />

          <Route
            path="/tables"
            element={<TablesData />}
          />

          {/* الإعدادات */}
          <Route
            path="/settings"
            element={<Blank />}
          />

          {/* صفحات TailAdmin الأصلية */}

          <Route
            path="/profile"
            element={<UserProfiles />}
          />

          <Route
            path="/calendar"
            element={<Calendar />}
          />

          <Route
            path="/blank"
            element={<Blank />}
          />

          {/* Forms */}
          <Route
            path="/form-elements"
            element={<FormElements />}
          />

          {/* Tables */}
          <Route
            path="/basic-tables"
            element={<BasicTables />}
          />

          {/* UI Elements */}
          <Route
            path="/alerts"
            element={<Alerts />}
          />

          <Route
            path="/avatars"
            element={<Avatars />}
          />

          <Route
            path="/badge"
            element={<Badges />}
          />

          <Route
            path="/buttons"
            element={<Buttons />}
          />

          <Route
            path="/images"
            element={<Images />}
          />

          <Route
            path="/videos"
            element={<Videos />}
          />

          {/* Charts */}
          <Route
            path="/line-chart"
            element={<LineChart />}
          />

          <Route
            path="/bar-chart"
            element={<BarChart />}
          />

        </Route>

        {/* Authentication */}
        <Route
          path="/signin"
          element={<SignIn />}
        />

        <Route
          path="/signup"
          element={<SignUp />}
        />
        
        <Route
  path="/api-test"
  element={<ApiTest />}
/>

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </Router>
  );
}
