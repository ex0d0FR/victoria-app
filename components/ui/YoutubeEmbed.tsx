"use client";

function getYoutubeId(url: string): string | null {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}

export function YoutubeEmbed({ url, title }: { url: string; title?: string }) {
  const id = getYoutubeId(url);
  if (!id) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-ink-900">
      <iframe
        src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
        title={title ?? "Victoria Reindale"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
