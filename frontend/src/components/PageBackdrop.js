import Image from "next/image";

/**
 * Viewport-anchored decorative page backdrop.
 *
 * Replaces `background-image` + `background-attachment: fixed`, which bypassed
 * next/image entirely (shipping the full-size original) and forced expensive
 * repaints on every scroll frame. Rendering it as a fixed-position next/image
 * layer keeps the same visual result while serving AVIF/WebP at device size.
 *
 * Pair with a `relative z-10` wrapper around the page content so it stacks
 * above this layer.
 */
export default function PageBackdrop({ src = "/curtains-background.png" }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
    </div>
  );
}
