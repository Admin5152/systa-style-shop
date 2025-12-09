import { createRoot } from "react-dom/client";
import "./index.css";

// Check if Supabase environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  const root = document.getElementById("root")!;
  root.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; padding: 20px; text-align: center; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white;">
      <h1 style="font-size: 2rem; margin-bottom: 1rem;">SYSTA | SYSTA</h1>
      <p style="color: #a0a0a0; max-width: 500px;">
        Configuration Required: Please ensure the Supabase environment variables are properly set in your GitHub repository secrets.
      </p>
      <p style="color: #707070; font-size: 0.875rem; margin-top: 1rem;">
        Required secrets: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID
      </p>
    </div>
  `;
} else {
  // Only import App when env vars are available to prevent Supabase init error
  import("./App.tsx").then(({ default: App }) => {
    createRoot(document.getElementById("root")!).render(<App />);
  });
}
