/**
 * Sanity Studio embedded at /studio
 * Victoria edits all content here — no separate deployment needed.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
