import "@testing-library/jest-dom";

const realFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn(() => {
    throw new Error(
      "global.fetch foi chamado sem mock. Mocke @/utils/fetchData ou global.fetch no teste."
    );
  });
});

afterAll(() => {
  global.fetch = realFetch;
});
