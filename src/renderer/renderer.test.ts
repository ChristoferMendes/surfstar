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

  it("should render an array using #each", () => {
    const node: Node = {
      type: "TEMPLATE",
      content: [
        {
          type: "EACH",
          arrayName: "items",
          content: [
            {
              type: "VARIABLE",
              name: "this",
            },
          ],
        },
      ],
    };
    const data = { items: ["a", "b", "c"] };
    const expectedResult = "abc";

    const result = render(node, data);

    expect(result).toEqual(expectedResult);
  });

  it("should render nested properties in #each", () => {
    const node: Node = {
      type: "TEMPLATE",
      content: [
        {
          type: "EACH",
          arrayName: "users",
          content: [
            {
              type: "VARIABLE",
              name: "this.name",
            },
          ],
        },
      ],
    };
    const data = { users: [{ name: "John" }, { name: "Jane" }] };
    const expectedResult = "JohnJane";

    const result = render(node, data);

    expect(result).toEqual(expectedResult);
  });

  it("should render @index in #each", () => {
    const node: Node = {
      type: "TEMPLATE",
      content: [
        {
          type: "EACH",
          arrayName: "items",
          content: [
            {
              type: "VARIABLE",
              name: "@index",
            },
          ],
        },
      ],
    };
    const data = { items: ["a", "b", "c"] };
    const expectedResult = "012";

    const result = render(node, data);

    expect(result).toEqual(expectedResult);
  });

  it("should render empty string for non-array in #each", () => {
    const node: Node = {
      type: "TEMPLATE",
      content: [
        {
          type: "EACH",
          arrayName: "items",
          content: [
            {
              type: "VARIABLE",
              name: "this",
            },
          ],
        },
      ],
    };
    const data = { items: "not an array" };
    const expectedResult = "";

    const result = render(node, data);

    expect(result).toEqual(expectedResult);
  });
});
