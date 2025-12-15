import { expect, test } from "vitest";
import {
  getFilesInDir,
  writeFile,
  readFile,
  fileExists,
  listFiles,
  editFile,
} from "./filesystem";
import { getAgentFS } from "./mcp";
import * as fs from "fs";

test("Correctly lists all paths within a directory", async () => {
  const skipIfNoApiKey = !process.env.LLAMA_CLOUD_API_KEY;
  if (skipIfNoApiKey) return;
  const files = await getFilesInDir({ dirPath: "./data/testdata" });
  expect(files.length).toBe(1);
  expect(files[0].filePath == "./data/testdata/test.md");
  expect(files[0].content.trim() == "This is a test.");
});

test("Correctly creates an AgentFS database", async () => {
  await getAgentFS({ filePath: "test.db" });
  expect(fs.existsSync("test.db")).toBeTruthy();
});

test("Correctly writes to an AgentFS database", async () => {
  const agentFs = await getAgentFS({ filePath: "test.db" });
  await writeFile("/test.md", "this is a test.", agentFs);
  const content = (await agentFs.fs.readFile("/test.md", "utf-8")) as string;
  expect(content == "this is a test.").toBeTruthy();
});

test("Correctly reads from an AgentFS database", async () => {
  const agentFs = await getAgentFS({ filePath: "test.db" });
  const content = await readFile("/test.md", agentFs);
  expect(content == "this is a test.").toBeTruthy();
});

test("Correctly reads from an AgentFS database", async () => {
  const agentFs = await getAgentFS({ filePath: "test.db" });
  const content = await readFile("/test.md", agentFs);
  expect(content == "this is a test.").toBeTruthy();
});

test("Correctly lists all files within an AgentFS database", async () => {
  const agentFs = await getAgentFS({ filePath: "test.db" });
  const files = await listFiles(agentFs);
  expect(files == "AVAILABLE FILES:\ntest.md,").toBeTruthy();
});

test("Correctly checks whether or not a file exists within an AgentFS database", async () => {
  const agentFs = await getAgentFS({ filePath: "test.db" });
  const exists = await fileExists("/test.md", agentFs);
  expect(exists).toBeTruthy();
  const notExists = await fileExists("/tests.md", agentFs);
  expect(notExists).toBeFalsy();
});

test("Correctly edits a file within an AgentFS database", async () => {
  const agentFs = await getAgentFS({ filePath: "test.db" });
  await editFile(
    "/test.md",
    "this is a test.",
    "this is a test file.",
    agentFs,
  );
  const content = (await agentFs.fs.readFile("/test.md", "utf-8")) as string;
  expect(content == "this is a test file.").toBeTruthy();
});
