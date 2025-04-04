export interface TextNode {
  type: 'TEXT';
  content: string;
}

export interface VariableNode {
  type: 'VARIABLE';
  name: string;
}

export interface EachNode {
  type: 'EACH';
  arrayName: string;
  content: Array<TextNode | VariableNode | EachNode>;
}

export interface TemplateNode {
  type: 'TEMPLATE';
  content: Array<TextNode | VariableNode | EachNode>;
}

export type Part = TextNode | VariableNode | EachNode;
export type Node = TextNode | VariableNode | TemplateNode | EachNode;
