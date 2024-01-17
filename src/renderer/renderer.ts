import { Node, Part } from '../parser/ast';

export function render(node: Node, data: Record<string, any>): string {
  if (node.type !== 'TEMPLATE') {
    return '';
  }

  return node.content.map(part => renderPart(part, data)).join('');
}

function renderPart(part: Part, data: Record<string, any>): string {
  if (part.type === 'TEXT') {
    return part.content;
  }

  if (part.type === 'VARIABLE') {
    return renderVariable(part, data);
  }

  return '';
}

function renderVariable(part: Part, data: Record<string, any>): string {
  if (part.type !== 'VARIABLE') {
    return '';
  }

  const variablePath = part.name.split('.');
  const variableValue = getNestedPropertyValue(data, variablePath);
  return variableValue ?? '';
}

function getNestedPropertyValue(data: Record<string, any>, variablePath: string[]): any {
  return variablePath.reduce((value, key) => value?.[key], data);
}