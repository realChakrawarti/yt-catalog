export default function GlobeBackground() {
  return (
    <video
      disablePictureInPicture
      muted
      autoPlay
      loop
      playsInline
      preload="metadata"
      controls={false}
      className="mx-auto my-16 absolute inset-0 size-auto dark:mix-blend-plus-lighter mix-blend-exclusion aspect-square dark:opacity-60"
    >
      <source src="background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
