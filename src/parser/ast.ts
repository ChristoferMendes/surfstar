// src/parser/ast.ts

export interface TextNode {
  type: 'TEXT';
  content: string;
}

export interface VariableNode {
  type: 'VARIABLE';
  name: string;
}

export interface TemplateNode {
  type: 'TEMPLATE';
  content: Array<TextNode | VariableNode>;
}

export type Part = TextNode | VariableNode;
export type Node = TextNode | VariableNode | TemplateNode;
