// Line icons used across services, sectors and platforms.
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

const paths = {
  map: <><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15M15 6v15" /></>,
  survey: <><path d="M12 3v4M7 21l5-14 5 14M9 15h6" /><circle cx="12" cy="5" r="2" /></>,
  drone: <><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 9L5 5M15 9l4-4M9 15l-4 4M15 15l4 4" /><circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /></>,
  app: <><rect x="2" y="4" width="14" height="11" rx="1.5" /><rect x="15" y="9" width="7" height="12" rx="1.5" /><path d="M6 19h6" /></>,
  analytics: <><path d="M3 20h18" /><path d="M4 16l5-6 4 3 7-9" /><circle cx="20" cy="4" r="1.5" /></>,
  city: <><rect x="3" y="8" width="5" height="13" /><rect x="10" y="3" width="5" height="18" /><rect x="17" y="10" width="4" height="11" /></>,
  road: <path d="M8 21L11 3M16 21L13 3M10 12h4M9.5 17h5M10.5 7.5h3" />,
  leaf: <path d="M12 21V9M12 12c-4 0-6-3-6-6 4 0 6 2.5 6 6zM12 15c4 0 6-3 6-6-4 0-6 2.5-6 6z" />,
  bolt: <path d="M13 2L6 13h5l-1 9 7-11h-5z" />,
  mine: <><path d="M2 20l6-11 4 6 3-4 7 9z" /><circle cx="17" cy="5" r="2" /></>,
  home: <><path d="M3 11L12 4l9 7v10H3z" /><path d="M9 21v-6h6v6" /></>,
};

export default function Icon({ name, size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...P} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
