import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt =
  "Keen & Ken — AI Automation Services & AI-Integrated Development";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public", "web-app-manifest-192x192.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #050505 0%, #1a1025 50%, #050505 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Logo */}
        <img
          src={logoSrc}
          width={80}
          height={80}
          style={{ marginBottom: 24, borderRadius: 16 }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#f0eef6",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          Keen & Ken
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#A78BFA",
            textAlign: "center",
            lineHeight: 1.4,
            marginBottom: 32,
          }}
        >
          We Build AI Systems That Run Your Business
        </div>
        <div
          style={{
            fontSize: 20,
            color: "rgba(240, 238, 246, 0.5)",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.6,
          }}
        >
          Custom AI Agents • Workflow Automation • Full-Stack Products
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "rgba(240, 238, 246, 0.3)",
          }}
        >
          keenken.com
        </div>
      </div>
    ),
    { ...size }
  );
}
