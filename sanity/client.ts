// DEMO MODE — Sanity is commented out. Pages use local fallback data.
// To re-enable: restore the createClient call and set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local

// import { createClient } from "@sanity/client";
// import imageUrlBuilder  from "@sanity/image-url";
// import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// export const client = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
//   dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
//   apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
//   useCdn: process.env.NODE_ENV === "production",
//   token:  process.env.SANITY_API_READ_TOKEN,
// });

// const builder = imageUrlBuilder(client);
// export const urlFor = (source: SanityImageSource) => builder.image(source);

// ── Demo stubs ────────────────────────────────────────────────────────────────

export const client = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fetch: async (_query: string) => null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (_source: any) => ({
  width: () => ({ quality: () => ({ url: () => "" }) }),
});
