import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Servera — Digital meny & QR-beställning för restauranger"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #0c0a09 0%, #1c1917 55%, #292524 100%)",
          color: "#fafaf9",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: "100%",
            background:
              "radial-gradient(circle at center, rgba(245, 158, 11, 0.55) 0%, rgba(245, 158, 11, 0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -140,
            width: 500,
            height: 500,
            borderRadius: "100%",
            background:
              "radial-gradient(circle at center, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0) 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
              color: "#0c0a09",
              fontFamily: "serif",
            }}
          >
            S
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Servera
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 18px",
              borderRadius: 999,
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#fbbf24",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#f59e0b",
                display: "flex",
              }}
            />
            QR-beställning för moderna restauranger
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontFamily: "serif",
            }}
          >
            <div style={{ display: "flex" }}>Menyn i fickan.</div>
            <div style={{ display: "flex", gap: 22 }}>
              <span style={{ color: "#f59e0b", fontStyle: "italic" }}>
                Köket
              </span>
              <span>i realtid.</span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#a8a29e",
              maxWidth: 740,
              lineHeight: 1.4,
            }}
          >
            Digital meny, mobilbeställning och kontaktlös betalning — på
            minuter.
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#78716c",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            servera.triadsolutions.se
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
