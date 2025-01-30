import { createRoot } from "react-dom/client";
import { SpawnerFormProvider } from "./state";
import Form from "./ProfileForm";

const root = createRoot(document.getElementById("form"));
root.render(
  <SpawnerFormProvider>
    <Form />
  </SpawnerFormProvider>,
);
