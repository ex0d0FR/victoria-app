import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Victoria Reindale — Soprano · Artiste Vocale";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1C1C1E",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Subtle decorative gold border */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px solid rgba(196, 168, 130, 0.3)",
            display: "flex",
          }}
        />

        {/* Top subtitle */}
        <div
          style={{
            color: "#C4A882",
            fontSize: "20px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "24px",
            fontWeight: 500,
          }}
        >
          Soprano · Artiste Vocale
        </div>

        {/* Main Name */}
        <div
          style={{
            color: "#FDFCF9",
            fontSize: "76px",
            letterSpacing: "-0.01em",
            textAlign: "center",
            fontWeight: 400,
            fontFamily: "serif",
            marginBottom: "20px",
          }}
        >
          Victoria Reindale
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: "80px",
            height: "2px",
            backgroundColor: "#C4A882",
            marginBottom: "32px",
          }}
        />

        {/* Repertoire / services teaser */}
        <div
          style={{
            color: "#AEAEB2",
            fontSize: "22px",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Concerts · Cérémonies · Événements Privés · Musique Sacrée & Opéra
        </div>

        {/* Website URL footer */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            color: "#C4A882",
            fontSize: "16px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          victoriareindalesoprano.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
