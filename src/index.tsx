import { createRoot } from "react-dom/client";
import { SpawnerFormProvider } from "./state";
import Form from "./ProfileForm";
import { FormCacheProvider } from "./context/FormCache";
import { PermalinkProvider } from "./context/Permalink";

const root = createRoot(document.getElementById("form"));
root.render(
  <PermalinkProvider>
    <SpawnerFormProvider>
      <FormCacheProvider>
        <Form />
      </FormCacheProvider>
    </SpawnerFormProvider>
  </PermalinkProvider>
);
