document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  const contents = gsap.utils.toArray(".content");
  const texts = gsap.utils.toArray(".text");
  const imageWrappers = gsap.utils.toArray(".img-wrapper");

  gsap.set(".content:first-child .text", { y: -50 });

  const tl = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: ".container",
      pin: true,
      start: "top top",
      end: `+=${contents.length * 50}%`,
      scrub: 3,
    },
  });

  tl.to(imageWrappers[0], { rotate: -3 }, 0);

  contents.forEach((_, i) => {
    if (i === contents.length - 1) return;

    tl.to(texts[i], { opacity: 0, duration: 2 }, "+=0.5")
      .to(
        imageWrappers[i + 1],
        {
          scale: 1,
          duration: 2,
          y: (i + 1) * 5,
          x: (i + 1) * -5,
          opacity: 1,
          rotate: (i + 1) * 3 * (i % 2 === 0 ? 1 : -1),
        },
        "<"
      )
      .to(texts[i + 1], { opacity: 1, y: -50, duration: 2 }, "<+=0.5");
  });
});
