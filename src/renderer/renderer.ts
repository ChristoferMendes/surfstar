import { SurfstarError } from '../errors/SurfstarError';
import type { Node, Part, TemplateNode } from '../parser/ast';
import { handleError } from '../utils/error-handler';

export type TemplateDataValue = string | number | boolean | Date | null | undefined | TemplateDataObject | TemplateDataArray;
export interface TemplateDataObject {
  [key: string]: TemplateDataValue;
}
export interface TemplateDataArray extends Array<TemplateDataValue> {}
export type TemplateData = Record<string, TemplateDataValue>;

export function render(node: Node, data: TemplateData, filePath?: string): string {
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

function renderPart(part: Part, data: TemplateData, filePath?: string): string {
  try {
    switch (part.type) {
      case 'TEXT':
        return part.content;
      case 'VARIABLE':
        return renderVariable(part, data, filePath);
      case 'EACH':
        return renderEach(part, data, filePath);
      default:
        throw SurfstarError.rendererError(`Unknown node type: ${(part as Part).type}`, { filePath });
    }
  } catch (error) {
    return handleError(error, {
      filePath,
      defaultMessage: `Error rendering ${part.type} node`,
      errorFactory: SurfstarError.rendererError
    });
  }
}

function renderVariable(part: Part, data: TemplateData, filePath?: string): string {
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

function getNestedPropertyValue(data: TemplateData, variablePath: string[]): TemplateDataValue {
  try {
    return variablePath.reduce((value, key) => {
      if (value === undefined || value === null) {
        return undefined;
      }
      return (value as TemplateDataObject)[key];
    }, data as TemplateDataValue);
  } catch (error) {
    return undefined;
  }
}

function renderEach(part: Part, data: TemplateData, filePath?: string): string {
  if (part.type !== 'EACH') {
    throw SurfstarError.rendererError(`Expected each node but got ${part.type}`, { filePath });
  }

  try {
    const array = getNestedPropertyValue(data, part.arrayName.split('.'));
    
    // Return empty string for undefined or non-array values
    if (array === undefined || array === null || !Array.isArray(array)) {
      return '';
    }

    return array
      .map((item, index) => {
        const itemContext: TemplateData = {
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

function validateEachArray(array: TemplateDataArray, arrayName: string, filePath?: string): array is TemplateDataArray {
  if (array === undefined) {
    throw SurfstarError.rendererError(`Cannot find array '${arrayName}' in template data`, { filePath });
  }

  if (!Array.isArray(array)) {
    throw SurfstarError.rendererError(`Expected '${arrayName}' to be an array, but got ${typeof array}`, { filePath });
  }

  return true;
}
