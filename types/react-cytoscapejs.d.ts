import type { ComponentType, CSSProperties } from "react";
import type {
  Core,
  ElementDefinition,
  LayoutOptions,
  StylesheetStyle,
} from "cytoscape";

declare module "react-cytoscapejs" {
  interface CytoscapeComponentProps {
    elements?: ElementDefinition[] | undefined;
    stylesheet?: StylesheetStyle[] | undefined;
    style?: CSSProperties | undefined;
    layout?: (LayoutOptions & Record<string, unknown>) | undefined;
    cy?: (cyInstance: Core) => void;
    [key: string]: unknown;
  }

  const CytoscapeComponent: ComponentType<CytoscapeComponentProps>;
  export default CytoscapeComponent;
}

