declare module "cytoscape-cose-bilkent" {
  import type cytoscape from "cytoscape";

  type CytoscapeNs = typeof cytoscape;
  type Register = (cytoscape: CytoscapeNs) => void;

  const register: Register & { register?: Register };
  export default register;
}

