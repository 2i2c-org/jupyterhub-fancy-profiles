import { render } from "@testing-library/react";

import { SpawnerFormProvider } from "../state";
import { FormCacheProvider } from "../context/FormCache";
import { FormStateProvider } from "../context/FormState";
import { PermalinkProvider } from "../context/Permalink";

function renderWithContext(children: React.ReactNode) {
  return render(
    <PermalinkProvider>
      <SpawnerFormProvider>
        <FormCacheProvider>
          <FormStateProvider>
            {children}
          </FormStateProvider>
        </FormCacheProvider>
      </SpawnerFormProvider>
    </PermalinkProvider>
  );
}

export function renderWithJupyterForm(children: React.ReactNode) {
  return renderWithContext(<form>{children}</form>);
}

export default renderWithContext;
