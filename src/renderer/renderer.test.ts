import { describe, expect, it } from "bun:test";
import { render } from "./renderer";
import { Node } from "../parser/ast";

describe("Renderer Tests", () => {
  it("should render a variable with valid data", () => {
    const node: Node = {
      type: "TEMPLATE",
      content: [
        {
          type: "VARIABLE",
          name: "name",
        },
      ],
    };
    const data = { name: "John" };
    const expectedResult = "John";

    const result = render(node, data);

    expect(result).toEqual(expectedResult);
  });

  it("should render a variable with nested data", () => {
    const node: Node = {
      type: "TEMPLATE",
      content: [
        {
          type: "VARIABLE",
          name: "person.name",
        },
      ],
    };
    const data = { person: { name: "John" } };
    const expectedResult = "John";

    const result = render(node, data);

    expect(result).toEqual(expectedResult);
  });

  it("should render an empty string for non-existent variable", () => {
    const node: Node = {
      type: "TEMPLATE",
      content: [
        {
          type: "VARIABLE",
          name: "age",
        },
      ],
    };

    const data = { name: "John" };

    const expectedResult = "";

    const result = render(node, data);

    expect(result).toEqual(expectedResult);
  });
});
