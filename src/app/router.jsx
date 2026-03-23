import { createBrowserRouter } from "react-router-dom";
import { routeManifestConfig } from "../config/routeManifest.config";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { ProtectedRoleRoute } from "../features/auth/ProtectedRoleRoute";
import { AppLayout, GmLayout, NationLayout, PublicLayout } from "../routes/layouts";
import {
  AccessRequestPage,
  ActionHistoryPage,
  AppHomePage,
  EventsPage,
  GmActionsPage,
  GmDashboardPage,
  GmNationsPage,
  GmReportsPage,
  HomePage,
  LoginPage,
  NationAssetsPage,
  NationFormationsPage,
  NationOverviewPage,
  NationProductionPage,
  NationProvincesPage,
  NationStructuresPage,
  ProfilePage,
  SessionSelectPage,
} from "../routes/pages";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: routeManifestConfig.public.home, element: <HomePage /> },
      { path: routeManifestConfig.public.login, element: <LoginPage /> },
      { path: routeManifestConfig.public.requestAccess, element: <AccessRequestPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: routeManifestConfig.shared.appHome,
        element: <AppLayout />,
        children: [
          { index: true, element: <AppHomePage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "session-select", element: <SessionSelectPage /> },
          { path: "events", element: <EventsPage /> },
          { path: "actions", element: <ActionHistoryPage /> },
          {
            path: "nation",
            element: <NationLayout />,
            children: [
              { index: true, element: <NationOverviewPage /> },
              { path: "overview", element: <NationOverviewPage /> },
              { path: "provinces", element: <NationProvincesPage /> },
              { path: "structures", element: <NationStructuresPage /> },
              { path: "production", element: <NationProductionPage /> },
              { path: "assets", element: <NationAssetsPage /> },
              { path: "formations", element: <NationFormationsPage /> },
            ],
          },
          {
            element: <ProtectedRoleRoute allow="gm" />,
            children: [
              {
                path: "gm",
                element: <GmLayout />,
                children: [
                  { index: true, element: <GmDashboardPage /> },
                  { path: "actions", element: <GmActionsPage /> },
                  { path: "nations", element: <GmNationsPage /> },
                  { path: "reports", element: <GmReportsPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
