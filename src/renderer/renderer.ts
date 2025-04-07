import type { Node, Part, TemplateNode } from '../parser/ast';
import { SurfstarError } from '../errors/SurfstarError';
import { handleError } from '../utils/error-handler';

export function render(node: Node, data: Record<string, any>, filePath?: string): string {
  try {
    validateTemplateNode(node, filePath);
    return node.content.map((part) => renderPart(part, data, filePath)).join('');
  } catch (error) {
    return handleError(error, {
      filePath,
      defaultMessage: 'Error rendering template',
      errorFactory: SurfstarError.rendererError
    });
  }
}

function validateTemplateNode(node: Node, filePath?: string): asserts node is TemplateNode {
  if (node.type !== 'TEMPLATE') {
    throw SurfstarError.rendererError(`Expected template node but got ${node.type}`, { filePath });
  }
}

function renderPart(part: Part, data: Record<string, any>, filePath?: string): string {
  try {
    switch (part.type) {
      case 'TEXT':
        return part.content;
      case 'VARIABLE':
        return renderVariable(part, data, filePath);
      case 'EACH':
        return renderEach(part, data, filePath);
      default:
        throw SurfstarError.rendererError(`Unknown node type: ${(part as any).type}`, { filePath });
    }
  } catch (error) {
    return handleError(error, {
      filePath,
      defaultMessage: `Error rendering ${part.type} node`,
      errorFactory: SurfstarError.rendererError
    });
  }
}

function renderVariable(part: Part, data: Record<string, any>, filePath?: string): string {
  if (part.type !== 'VARIABLE') {
    throw SurfstarError.rendererError(`Expected variable node but got ${part.type}`, { filePath });
  }

  try {
    const variablePath = part.name.split('.');
    const variableValue = getNestedPropertyValue(data, variablePath);
    return variableValue !== undefined && variableValue !== null ? String(variableValue) : '';
  } catch (error) {
    return handleError(error, {
      filePath,
      defaultMessage: `Error accessing variable '${part.name}'`,
      errorFactory: SurfstarError.rendererError
    });
  }
}

function getNestedPropertyValue(data: Record<string, any>, variablePath: string[]): any {
  try {
    return variablePath.reduce((value, key) => {
      if (value === undefined || value === null) {
        return undefined;
      }
      return value[key];
    }, data);
  } catch (error) {
    return undefined;
  }
}

function renderEach(part: Part, data: Record<string, any>, filePath?: string): string {
  if (part.type !== 'EACH') {
    throw SurfstarError.rendererError(`Expected each node but got ${part.type}`, { filePath });
  }

  try {
    const array = getNestedPropertyValue(data, part.arrayName.split('.'));
    const isValid = validateEachArray(array, part.arrayName, filePath);

    if (!isValid) return '';

    return array
      .map((item, index) => {
        const itemContext = {
          ...data,
          this: item,
          '@index': index
        };
        return part.content.map((node) => renderPart(node, itemContext, filePath)).join('');
      })
      .join('');
  } catch (error) {
    return handleError(error, {
      filePath,
      defaultMessage: `Error rendering each block for '${part.arrayName}'`,
      errorFactory: SurfstarError.rendererError
    });
  }
}

function validateEachArray(array: any[], arrayName: string, filePath?: string): array is any[] {
  if (array === undefined) {
    throw SurfstarError.rendererError(`Cannot find array '${arrayName}' in template data`, { filePath });
  }

  if (!Array.isArray(array)) {
    throw SurfstarError.rendererError(`Expected '${arrayName}' to be an array, but got ${typeof array}`, { filePath });
  }

  return true;
}
