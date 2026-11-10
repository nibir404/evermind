import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EverMind",
    short_name: "EverMind",
    description: "An executive digital twin that thinks like you and never acts without you.",
    start_url: "/home",
    display: "standalone",
    background_color: "#F5F5F7",
    theme_color: "#0E5A43",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
