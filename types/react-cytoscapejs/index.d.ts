import type { ComponentType } from "react";

declare module "react-cytoscapejs" {
  interface CytoscapeComponentProps {
    elements?: unknown;
    stylesheet?: unknown;
    style?: Record<string, unknown>;
    layout?: unknown;
    cy?: (cytoscapeInstance: unknown) => void;
    [key: string]: unknown;
  }

  const CytoscapeComponent: ComponentType<CytoscapeComponentProps>;
  export default CytoscapeComponent;
}

