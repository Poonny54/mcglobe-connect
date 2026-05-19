export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#080c14", minHeight: "100vh" }}>
      {children}
    </div>
  )
}
