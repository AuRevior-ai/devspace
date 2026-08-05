import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runShellTool } from "./pi-tools.js";

const root = mkdtempSync(join(tmpdir(), "devspace-pi-tools-shell-test-"));
const previousShellPath = process.env.DEVSPACE_SHELL_PATH;
try {
  const missingShellPath = join(root, "missing-bash.exe");
  process.env.DEVSPACE_SHELL_PATH = missingShellPath;

  const response = await runShellTool(
    { command: "printf unreachable" },
    { cwd: root, root },
  );

  assert.equal(response.isError, true);
  assert.match(response.content[0]?.type === "text" ? response.content[0].text : "", /Custom shell path not found/);
} finally {
  if (previousShellPath === undefined) {
    delete process.env.DEVSPACE_SHELL_PATH;
  } else {
    process.env.DEVSPACE_SHELL_PATH = previousShellPath;
  }
  rmSync(root, { recursive: true, force: true });
}
