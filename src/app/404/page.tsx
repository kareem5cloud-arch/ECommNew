export default function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#eeededff",
        color: "black",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.3rem", marginBottom: "2rem", opacity: 0.8 }}>
        Oops… This page doesn’t exist.
      </p>
      <a
        href="/"
        style={{
          padding: "0.7rem 1.4rem",
          background: "black",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Go Home
      </a>
    </div>
  );
}
