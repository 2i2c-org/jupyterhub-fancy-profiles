import { render } from "@testing-library/react";

import { SpawnerFormProvider } from "../state";
import { FormCacheProvider } from "../context/FormCache";
import { PermalinkProvider } from "../context/Permalink";

function renderWithContext(children: React.ReactNode) {
  return render(
    <PermalinkProvider>
      <SpawnerFormProvider>
        <FormCacheProvider>
          {children}
        </FormCacheProvider>
      </SpawnerFormProvider>
    </PermalinkProvider>
  );
}

export default renderWithContext;
