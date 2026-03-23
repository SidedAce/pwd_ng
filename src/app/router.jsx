import { Navigate, createBrowserRouter } from "react-router-dom";
import { routeManifestConfig } from "../config/routeManifest.config";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { ProtectedRoleRoute } from "../features/auth/ProtectedRoleRoute";
import { AppLayout, NationLayout, PublicLayout } from "../routes/layouts";
import {
  AccessRequestPage,
  ActionHistoryPage,
  AppHomePage,
  EventsPage,
  HomePage,
  LoginPage,
  NationAdminPage,
  NationAssetsPage,
  NationFormationsPage,
  NationOverviewPage,
  NationProductionPage,
  NationProvincesPage,
  NationReportsPage,
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
          {
            element: <ProtectedRoleRoute allow="gm" />,
            children: [{ path: "actions", element: <ActionHistoryPage /> }],
          },
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
              { path: "reports", element: <NationReportsPage /> },
              {
                element: <ProtectedRoleRoute allow="gm" />,
                children: [{ path: "admin", element: <NationAdminPage /> }],
              },
            ],
          },
          {
            element: <ProtectedRoleRoute allow="gm" />,
            children: [
              { path: "gm", element: <Navigate to="/app/actions" replace /> },
              { path: "gm/actions", element: <Navigate to="/app/actions" replace /> },
              { path: "gm/nations", element: <Navigate to="/app/nation/admin" replace /> },
              { path: "gm/reports", element: <Navigate to="/app/nation/reports" replace /> },
            ],
          },
        ],
      },
    ],
  },
]);
