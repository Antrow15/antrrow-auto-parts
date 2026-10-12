const geo = { latitude: 13.094391585206138, longitude: 80.18162329952493 } as const;
const latLng = `${geo.latitude},${geo.longitude}`;

export const site = {
  name: 'Antrrow Auto Parts',
  legalName: 'Antrrow Auto Parts',
  tagline: 'CNC Turned Components, Grinding & Polygon Milling Works',
  shortDescription:
    'Chennai-based manufacturer of custom CNC turned components, pins, bushes, rods, shafts and levers made to customer drawings, with centreless grinding and polygon milling in Padi, Chennai.',
  url: 'https://www.antrrowautoparts.com',
  locale: 'en_IN',
  language: 'en-IN',
  generalManager: { name: 'M Justin Rajan', role: 'General Manager' },
  experienceYears: 35,
  workforce: 15,
  email: 'antrrowautoparts@gmail.com',
  phones: {
    mobile: { display: '+91 98844 49689', tel: '+919884449689' },
    landline: { display: '044 3598 4626', tel: '+914435984626' },
  },
  whatsapp: '919884449689',
  address: {
    street: 'No. 2, Kamaraj Street, Gopal Naicker Nagar',
    locality: 'Padi',
    city: 'Chennai',
    region: 'Tamil Nadu',
    regionCode: 'IN-TN',
    postalCode: '600050',
    country: 'IN',
    countryName: 'India',
  },
  geo,
  hours: {
    display: 'Monday to Saturday, 9:00 AM - 7:00 PM',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '19:00',
  },
  gstin: '33BBQPN3370J1ZC',
  msme: true,
  areaServed: ['Chennai', 'Tamil Nadu', 'India'],
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${latLng}`,
  mapsEmbed: `https://www.google.com/maps?q=${latLng}&z=17&output=embed`,
} as const;

export const fullAddress = `${site.address.street}, ${site.address.locality}, ${site.address.city} - ${site.address.postalCode}, ${site.address.region}, ${site.address.countryName}`;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Products', href: '/products/' },
  { label: 'Capabilities', href: '/capabilities/' },
  { label: 'Quality & Process', href: '/quality-process/' },
  { label: 'Industries & Customers', href: '/industries-customers/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const customers = [
  {
    name: 'Ammalgamision Repco',
    parts: ['Clutch pins', 'Bushes', 'Pads', 'Brackets', '3-finger and 4-finger levers'],
    sector: 'Automotive driveline / clutch components',
  },
  {
    name: 'XLERATE Driveline India',
    parts: ['Clutch pins', 'Bushes', 'Pads', 'Brackets', 'Levers'],
    sector: 'Automotive driveline / clutch components',
  },
  {
    name: 'Shree Maruthi Industries',
    parts: ['Weight-balancing rods'],
    sector: 'Industrial components',
  },
  {
    name: 'Padma Mines Pvt Ltd',
    parts: ['Piston rods'],
    sector: 'Mining and heavy equipment',
  },
  {
    name: 'Sree Megala Industries',
    parts: ['Bolts'],
    sector: 'Industrial fasteners',
  },
  {
    name: 'Srinivasa General Fabricators',
    parts: ['Two-wheeler child parts'],
    sector: 'General fabrication / two-wheeler supply chain',
  },
] as const;

export const componentCategories = [
  'Pins & dowels',
  'Bushes & sleeves',
  'Pads & brackets',
  'Levers',
  'Rods & shafts',
  'Bolts & threaded parts',
  'Rollers & cylindrical parts',
  'Piston rods',
  'Two-wheeler child parts',
  'Custom drawing-based part',
  'Other / not sure',
] as const;

export const processStages = [
  {
    title: 'Requirement review',
    text: 'We review your drawing revision, sample, quantity, material, tolerances, finish and delivery date before committing to a manufacturing route.',
  },
  {
    title: 'Raw material receipt',
    text: 'Incoming bar and rod stock is checked for size, grade marking and quantity against the job requirement.',
  },
  {
    title: 'Stock preparation',
    text: 'Bars and rods are cut into batch-identified blanks on our cutting machine, ready for machining.',
  },
  {
    title: 'Machining',
    text: 'CNC turning, polygon milling and drilling are carried out as defined by the approved process route.',
  },
  {
    title: 'Grinding',
    text: 'Where the drawing calls for it, external diameters are finished by centreless grinding for size consistency and surface finish.',
  },
  {
    title: 'Inspection',
    text: 'Dimensions specified on the drawing are checked with hand measuring instruments against the agreed acceptance criteria.',
  },
  {
    title: 'Packing',
    text: 'Components are protected against damage and corrosion, counted and labelled, including customer-specific packing where required.',
  },
  {
    title: 'Dispatch',
    text: 'Packing lists and delivery are coordinated with you so components arrive on schedule.',
  },
  {
    title: 'After-sales support',
    text: 'We stay available after delivery to resolve queries on supplied components and plan repeat batches.',
  },
] as const;
