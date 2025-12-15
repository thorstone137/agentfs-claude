import { expect, test } from "vitest";
import { parseFile } from "./llamacloud";

test("Correctly lists all paths within a directory", async () => {
  const skipIfNoApiKey =
    !process.env.LLAMA_CLOUD_API_KEY ||
    process.env.LLAMA_CLOUD_API_KEY == "not-an-api-key";
  if (skipIfNoApiKey) return;
  const content = await parseFile("data/testdata/test.md");
  expect(content).toBe("This is a test.");
});
