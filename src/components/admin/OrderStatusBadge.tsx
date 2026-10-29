const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  PENDING:        { label: "Pending",        bg: "#FEF3C7", color: "#92400E" },
  SLIP_SUBMITTED: { label: "Slip Submitted", bg: "#EDE9FE", color: "#5B21B6" },
  CONFIRMED:      { label: "Confirmed",      bg: "#EDF0EB", color: "#3F5E39" },
  IN_PRODUCTION:  { label: "In Production",  bg: "#DBEAFE", color: "#1E40AF" },
  READY:          { label: "Ready",          bg: "#D1FAE5", color: "#065F46" },
  DELIVERED:      { label: "Delivered",      bg: "#F0FDF4", color: "#14532D" },
  CANCELLED:      { label: "Cancelled",      bg: "#FEE2E2", color: "#991B1B" },
}

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, bg: "#F3F4F6", color: "#374151" }
  return (
    <span
      style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: "0.2rem 0.6rem",
        borderRadius: "9999px",
        fontSize: "0.7rem",
        fontWeight: 600,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        whiteSpace: "nowrap",
      }}
    >
      {config.label}
    </span>
  )
}