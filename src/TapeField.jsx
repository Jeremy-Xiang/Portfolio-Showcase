import { useEffect, useRef } from "react";

// TapeField — a faint field of drifting sparklines behind the hero.
// Pure canvas, no deps; respects prefers-reduced-motion by drawing one static frame.
export default function TapeField() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    let raf = 0;
    let W = 0, H = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const LINES = 14;
    const lines = Array.from({ length: LINES }, (_, i) => ({
      y: (i + 0.5) / LINES,                       // vertical band
      amp: 6 + Math.random() * 14,                // wiggle amplitude (px)
      speed: 0.12 + Math.random() * 0.25,         // drift speed
      phase: Math.random() * 1000,
      seg: 26 + Math.floor(Math.random() * 22),   // points per line
      amber: Math.random() < 0.18,                // a few lines get the accent
    }));

    function resize() {
      W = cv.clientWidth * DPR;
      H = cv.clientHeight * DPR;
      cv.width = W;
      cv.height = H;
    }

    // Deterministic-ish value noise so lines look like price paths, not sine waves.
    function val(line, k, t) {
      const x = k * 0.7 + line.phase + t * line.speed;
      return (
        Math.sin(x) * 0.5 +
        Math.sin(x * 2.3 + 1.7) * 0.3 +
        Math.sin(x * 5.1 + 4.2) * 0.2
      );
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (const line of lines) {
        const baseY = line.y * H;
        ctx.beginPath();
        for (let k = 0; k <= line.seg; k++) {
          const x = (k / line.seg) * W;
          const y = baseY + val(line, k, t) * line.amp * DPR;
          k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = line.amber
          ? "rgba(240, 180, 41, 0.10)"
          : "rgba(139, 143, 152, 0.07)";
        ctx.lineWidth = 1 * DPR;
        ctx.stroke();
        // closing tick dot at the line's end
        const yEnd = baseY + val(line, line.seg, t) * line.amp * DPR;
        ctx.fillStyle = line.amber
          ? "rgba(240, 180, 41, 0.28)"
          : "rgba(139, 143, 152, 0.16)";
        ctx.beginPath();
        ctx.arc(W - 2 * DPR, yEnd, 1.6 * DPR, 0, 7);
        ctx.fill();
      }
    }

    resize();
    window.addEventListener("resize", resize);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      draw(12);
    } else {
      const t0 = performance.now();
      const loop = () => {
        draw((performance.now() - t0) / 1000);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="tapefield" ref={ref} aria-hidden="true" />;
}
