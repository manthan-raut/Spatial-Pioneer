// ─────────────────────────────────────────────────────────────
// ALL SITE COPY LIVES HERE. Values marked // PLACEHOLDER are
// invented and MUST be replaced with real company data.
// ─────────────────────────────────────────────────────────────

export const company = {
  name: "Spatial Pioneer",
  tagline: "GIS · SURVEY · DRONE",
  email: "hello@spatialpioneer.com", // PLACEHOLDER
  phone: "+91 00000 00000", // PLACEHOLDER
  address: "Your office address, City, State", // PLACEHOLDER
  socials: [
    { label: "LinkedIn", href: "#" }, // PLACEHOLDER
    { label: "Instagram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "X", href: "#" },
  ],
};

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Estimator", href: "#planner" },
  { label: "How we work", href: "#process" },
  { label: "Industries", href: "#sectors" },
  { label: "Contact", href: "#contact" },
];

export const heroWords = ["cities", "highways", "mines", "farmland", "utilities", "rivers"];

export const marquee = ["GIS Mapping", "land survey", "Drone Photogrammetry", "web GIS", "Mobile Field Apps", "spatial analytics", "LiDAR", "digital twins"];

// PLACEHOLDER — replace with your real numbers
export const stats = [
  { k: "LOG/01 · AREA", value: 12000, suffix: "km²", label: "Mapped by drone & satellite" },
  { k: "LOG/02 · ASSETS", value: 850, suffix: "K+", label: "Properties & assets geotagged" },
  { k: "LOG/03 · CORRIDORS", value: 3400, suffix: "km", label: "Road, rail & utility routes surveyed" },
  { k: "LOG/04 · SORTIES", value: 4200, suffix: "+", label: "Drone missions flown safely" },
  { k: "LOG/05 · APPS", value: 60, suffix: "+", label: "Web & mobile GIS apps in production" },
];

export const services = [
  {
    code: "SP—01", name: "GIS", em: "Mapping", icon: "map",
    desc: "Digitisation, geodatabase design, topology-clean vector data and cartography for land records, utilities and urban planning.",
    chips: ["Geodatabase", "Digitisation", "Cadastral", "Cartography"],
    deliverables: ["Enterprise geodatabase (PostGIS / FGDB)", "Topology-validated vector layers", "Print-ready map sheets & atlases", "Metadata to ISO 19115"],
    accuracy: "Matches source scale (1:500 – 1:50,000)", timeline: "2 – 8 weeks",
  },
  {
    code: "SP—02", name: "Land", em: "Survey", icon: "survey",
    desc: "DGPS / RTK control networks, total station, topographic, contour, route and as-built surveys — tied to national datums.",
    chips: ["DGPS / RTK", "Total Station", "Topographic", "As-built"],
    deliverables: ["Control network report & GCP log", "Topographic & contour drawings (DWG)", "Longitudinal / cross sections", "Boundary & cadastral plans"],
    accuracy: "±1 – 2 cm horizontal (RTK)", timeline: "1 – 6 weeks",
  },
  {
    code: "SP—03", name: "Drone", em: "Mapping", icon: "drone",
    desc: "Photogrammetry and LiDAR missions delivering orthomosaics, DSM/DTM, 3D meshes and volumetrics at centimetre GSD.",
    chips: ["Orthomosaic", "DSM / DTM", "LiDAR", "Volumetrics"],
    deliverables: ["Orthomosaic (GeoTIFF / ECW)", "DSM, DTM & contours", "Classified LiDAR point cloud (LAS)", "3D mesh & volumetric reports"],
    accuracy: "GSD 1.5 – 5 cm/px, ±3 cm with GCPs", timeline: "1 – 4 weeks",
  },
  {
    code: "SP—04", name: "Web & Mobile", em: "GIS", icon: "app",
    desc: "Custom map portals, dashboards and offline-first field apps — built on open standards and synced to your enterprise systems.",
    chips: ["WebGIS Portals", "Field Apps", "Offline Sync", "APIs"],
    deliverables: ["Role-based WebGIS portal", "Android / iOS field-collection app", "OGC services (WMS / WFS / WMTS)", "Admin dashboards & REST APIs"],
    accuracy: "Uptime-monitored, audited data edits", timeline: "6 – 16 weeks",
  },
  {
    code: "SP—05", name: "Spatial", em: "Analytics", icon: "analytics",
    desc: "Site suitability, change detection, network and catchment analysis, and remote-sensing models that turn layers into decisions.",
    chips: ["Change Detection", "Suitability", "Remote Sensing", "Forecasting"],
    deliverables: ["Suitability & risk maps", "Change-detection reports", "Land-use / land-cover classification", "Interactive analytics dashboards"],
    accuracy: "Validated against field ground truth", timeline: "2 – 10 weeks",
  },
];

export const personas = [
  {
    id: "city", label: "Municipal officer",
    challenge: "Property records don't match the ground, tax collection leaks, and planning decisions rely on outdated maps.",
    help: ["Drone base map of the whole city", "Door-to-door property survey with field app", "Parcel-to-tax-register linking", "Citizen & officer WebGIS portal"],
    deliverables: ["Property GIS", "Ward maps", "Tax dashboard", "Utility layers"],
    kpi: { v: "+30–40%", l: "typical tax-base uplift after GIS survey" }, // PLACEHOLDER
  },
  {
    id: "infra", label: "Infrastructure engineer",
    challenge: "Alignment studies need accurate terrain fast, and progress on site is hard to verify remotely.",
    help: ["DGPS control & corridor LiDAR", "DTM, contours & cross sections", "Monthly progress orthomosaics", "Quantity & cut-fill reports"],
    deliverables: ["DTM", "L-sections", "Progress ortho", "Cut / fill"],
    kpi: { v: "70%", l: "faster topo survey vs. conventional methods" }, // PLACEHOLDER
  },
  {
    id: "mine", label: "Mine manager",
    challenge: "Stockpile volumes are estimated, compliance reports are manual, and pit safety needs constant monitoring.",
    help: ["Scheduled drone volumetric surveys", "Pit progress & bench mapping", "Slope / haul-road analysis", "Automated monthly reports"],
    deliverables: ["Volumes", "Pit maps", "Compliance pack", "3D mesh"],
    kpi: { v: "±1.5%", l: "volumetric accuracy with GCPs" }, // PLACEHOLDER
  },
  {
    id: "agri", label: "Agri & forestry lead",
    challenge: "Large holdings make crop health, plantation counts and boundary disputes hard to track.",
    help: ["Multispectral crop-health mapping", "Plant / tree counting", "Boundary & land-record survey", "Season-over-season change analysis"],
    deliverables: ["NDVI maps", "Tree count", "Boundaries", "Yield zones"],
    kpi: { v: "1000+ ha", l: "mapped per drone-day" }, // PLACEHOLDER
  },
  {
    id: "dev", label: "Tech / product team",
    challenge: "You need location features in your product but don't want to build a GIS stack from scratch.",
    help: ["Spatial database & tile server setup", "OGC & REST APIs", "Map UI components (web & mobile)", "Data pipelines & ETL"],
    deliverables: ["PostGIS", "Vector tiles", "APIs", "SDK"],
    kpi: { v: "Weeks", l: "not months, to a production map stack" },
  },
];

export const steps = [
  { n: "01", title: "Understand", text: "We discuss your goal, visit or study the site, and agree on accuracy, timeline and cost. Drone permissions are handled by us.", out: "Proposal · Survey plan" },
  { n: "02", title: "Survey", text: "Our team works on site — GPS survey points, drone flights and mobile data collection, checked every day.", out: "Field data · Drone photos" },
  { n: "03", title: "Process", text: "We turn the raw data into maps, 3D terrain and GIS layers, and check them against ground measurements.", out: "Maps · 3D terrain · GIS layers" },
  { n: "04", title: "Deliver", text: "You get the result the way your team works — a web map, a mobile app, CAD drawings or GIS files.", out: "Web map · App · Files" },
  { n: "05", title: "Support", text: "Training, updates and repeat surveys, so your map stays current after hand-over.", out: "Training · Updates" },
];

// PLACEHOLDER product names — rename or remove
export const platforms = [
  { tag: "PIONEER ATLAS · WEBGIS", title: "A map portal your whole organisation can use.", text: "Role-based layers, measurement tools, before/after swipe and dashboards wired straight to the spatial database.", viz: "atlas", big: true },
  { tag: "FIELDPIN · MOBILE", title: "Offline-first field collection.", text: "Forms, photos and GNSS-tagged features captured without signal, synced when you're back in range.", viz: "mobile" },
  { tag: "SKYDESK · DRONE OPS", title: "Mission planning to processed ortho.", text: "Flight plans, GCP management and automated QA reports for every sortie.", viz: "flight" },
  { tag: "TERRALENS · ANALYTICS", title: "Change detection on autopilot.", text: "Compare epochs of imagery to flag encroachments, construction progress and land-use change.", viz: "change" },
  { tag: "GEOSYNC · API", title: "Your data, everywhere.", text: "OGC-compliant WMS/WFS and REST APIs to feed ERP, CRM and asset systems.", viz: "api" },
];

export const sectors = [
  { id: "city", name: "Smart Cities & ULBs", glyph: "city", text: "Property tax GIS, utility mapping, master plans and municipal dashboards.", uses: ["Property & tax GIS", "Master-plan base maps", "Water / sewer network GIS", "Encroachment detection"] },
  { id: "infra", name: "Roads & Infrastructure", glyph: "road", text: "Corridor surveys, alignment studies, ROW mapping and construction monitoring.", uses: ["Route & alignment survey", "ROW & land acquisition maps", "Progress monitoring", "As-built documentation"] },
  { id: "agri", name: "Agriculture & Forestry", glyph: "leaf", text: "Crop health, land-use classification, plantation and forest cover monitoring.", uses: ["NDVI / crop health", "Plantation counting", "Forest cover change", "Watershed planning"] },
  { id: "power", name: "Power & Utilities", glyph: "bolt", text: "Transmission line surveys, network digitisation and asset inspection by drone.", uses: ["Transmission line survey", "Network digitisation", "Vegetation encroachment", "Asset inspection"] },
  { id: "mine", name: "Mining & Earthworks", glyph: "mine", text: "Stockpile volumetrics, pit progress, slope stability and compliance reporting.", uses: ["Stockpile volumetrics", "Pit & bench mapping", "Slope monitoring", "Reclamation tracking"] },
  { id: "estate", name: "Real Estate & Land", glyph: "home", text: "Boundary and cadastral surveys, site suitability and township planning.", uses: ["Boundary survey", "Site suitability", "Township layout", "Marketing 3D models"] },
];

export const why = [
  { title: "Field-to-cloud in one team", text: "No hand-offs between subcontractors. One crew owns the survey, the processing and the app — so nothing gets lost in translation." },
  { title: "Accuracy reports on every delivery", text: "RMSE, checkpoint residuals and metadata ship with every dataset. You always know how good the data is." },
  { title: "Open standards, no lock-in", text: "PostGIS, GeoServer, OGC services and standard formats. Your data stays yours and works with your existing tools." },
  { title: "Secure & scalable", text: "Role-based access, on-prem options for sensitive government data, and infrastructure that grows from one site to a whole state." },
];

export const credentials = ["ISO 9001", "ISO 27001", "DGCA Remote Pilots", "OGC Standards"]; // PLACEHOLDER — only list what you actually hold

// PLACEHOLDER blog posts
export const insights = [
  { tag: "DRONE MAPPING", title: "GCPs vs. RTK drones: when do you still need ground control?", read: "6 min", date: "Oct 2026" },
  { tag: "WEB GIS", title: "Building an offline-first field app that field crews actually trust", read: "8 min", date: "Sep 2026" },
  { tag: "ANALYTICS", title: "Change detection for urban local bodies: a practical playbook", read: "5 min", date: "Aug 2026" },
];

export const faqs = [
  { q: "How accurate is drone mapping compared to a conventional survey?", a: "With RTK/PPK drones and well-distributed ground control points we routinely achieve 2–5 cm accuracy, which is enough for most topographic, volumetric and planning work. For legal boundary work we combine drone data with DGPS / total-station observations." },
  { q: "Do you handle DGCA permissions for drone flights?", a: "Yes. Our remote pilots are certified, our aircraft are registered on Digital Sky, and we handle airspace (green / yellow / red zone) permissions as part of project planning." },
  { q: "What formats will I receive?", a: "Whatever your team uses: GeoTIFF, ECW, LAS/LAZ, SHP, GeoPackage, DWG/DXF, KML, PDF map sheets, or live OGC services and web portals." },
  { q: "Can you build on our existing GIS (ArcGIS / QGIS) setup?", a: "Absolutely. We work with ArcGIS Enterprise, QGIS, GeoServer and PostGIS, and can migrate or integrate rather than replace." },
  { q: "How long does a typical project take?", a: "A small-site drone survey can be delivered in under a week. City-scale GIS or custom web & mobile GIS platforms usually run 2–4 months. Use the mission planner above for a quick flight estimate." },
  { q: "Do you provide support after delivery?", a: "Yes — training, annual maintenance, repeat surveys and data updates so your map stays current." },
];

export const stack = ["QGIS", "ArcGIS", "PostGIS", "GeoServer", "Pix4D", "Agisoft Metashape", "DJI Enterprise", "Trimble & Leica GNSS", "AutoCAD Civil 3D", "OpenLayers", "Leaflet", "MapLibre", "Flutter", "React", "Python / GDAL", "Google Earth Engine"];

export const SERVICE_NAMES = ["GIS Mapping", "Land Survey", "Drone Mapping", "Web & Mobile GIS", "Spatial Analytics"];
