export function getConfiguredAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isConfiguredAdmin(email) {
  return Boolean(email) && getConfiguredAdminEmails().includes(email.toLowerCase())
}
