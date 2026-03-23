import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { applyThemeVars } from "./app/theme";
import { AppDataProvider } from "./features/app/AppDataProvider";
import { AuthProvider } from "./features/auth/AuthProvider";

applyThemeVars();

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <RouterProvider router={router} />
      </AppDataProvider>
    </AuthProvider>
  );
}
