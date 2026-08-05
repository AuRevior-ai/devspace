export function configuredShellPath(env: NodeJS.ProcessEnv = process.env): string | undefined {
  const value = env.DEVSPACE_SHELL_PATH?.trim();
  return value || undefined;
}
