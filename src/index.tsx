import { createRoot } from "react-dom/client";
import { SpawnerFormProvider } from "./state";
import Form from "./ProfileForm";
import { FormCacheProvider } from "./context/FormCache";

const root = createRoot(document.getElementById("form"));
root.render(
  <SpawnerFormProvider>
    <FormCacheProvider>
      <Form />
    </FormCacheProvider>
  </SpawnerFormProvider>,
);
