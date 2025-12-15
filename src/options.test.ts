import { expect, test } from "vitest";
import { denyFileSystemToolsHook } from "./options";

test("Denies tool usage correctly", async () => {
  const controller = new AbortController();
  const signal = controller.signal;
  const result = await denyFileSystemToolsHook(
    {
      hook_event_name: "PreToolUse",
      tool_input: {},
      tool_name: "Read",
      tool_use_id: "1",
      session_id: "1",
      cwd: ".",
      transcript_path: "transcript.txt",
    },
    "1",
    { signal: signal },
  );
  if ("hookSpecificOutput" in result) {
    if (typeof result.hookSpecificOutput != "undefined") {
      if (
        "permissionDecision" in result.hookSpecificOutput &&
        "permissionDecisionReason" in result.hookSpecificOutput &&
        "hookEventName" in result.hookSpecificOutput
      ) {
        expect(result.hookSpecificOutput.hookEventName).toBe("PreToolUse");
        expect(result.hookSpecificOutput.permissionDecision).toBe("deny");
        expect(result.hookSpecificOutput.permissionDecisionReason).toBe(
          "You cannot use standard file system tools, you should use the ones from the filesystem MCP server.",
        );
      }
    }
  }
});
