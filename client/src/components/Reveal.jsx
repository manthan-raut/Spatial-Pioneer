import { motion } from "framer-motion";

/** Fades + lifts children into view once. `as` lets you pick the element. */
export default function Reveal({ children, delay = 0, y = 28, as = "div", className, ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
      {...rest}
    >
      {children}
    </M>
  );
}

export function SectionHead({ eyebrow, title, serif, after, lede, children, className = "" }) {
  return (
    <div className={`head-row ${className}`}>
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="title">
          {title} <span className="serif">{serif}</span>
          {after}
        </h2>
        {lede && <p className="lede">{lede}</p>}
      </Reveal>
      {children && <Reveal delay={0.1}>{children}</Reveal>}
    </div>
  );
}
