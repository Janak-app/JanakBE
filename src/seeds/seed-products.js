/**
 * Product seeder — built from local "Product Info" folder (PDFs + Description.txt)
 *
 * Run inside Docker after the app has started:
 *
 *   docker cp src/seeds/seed-products.js janak_app:/app/seed-products.js
 *   docker exec janak_app node /app/seed-products.js
 *
 * Or locally (set env vars first):
 *   node src/seeds/seed-products.js
 */

const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'janak_db',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

// ─── Categories ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'GNSS Receiver',  slug: 'gnss-receiver',  sortOrder: 1 },
  { name: 'GNSS Antenna',   slug: 'gnss-antenna',   sortOrder: 2 },
  { name: 'Data Collector', slug: 'data-collector', sortOrder: 3 },
];

// ─── Brands ────────────────────────────────────────────────────────────────────

const BRANDS = [
  { name: 'JANAK', slug: 'janak' },
];

// ─── Products ──────────────────────────────────────────────────────────────────

const PRODUCTS = [

  // ── GNSS Receivers ──────────────────────────────────────────────────────────

  {
    name: 'J-50 GNSS',
    slug: 'j-50-gnss',
    category: 'gnss-receiver',
    brand: 'janak',
    modelNumber: 'J-50',
    description: 'The J-50 GNSS Receiver is a lightweight yet powerful solution for surveyors. With 1408 channels and full constellation support (GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC), it delivers precise results with MEMS tilt compensation up to 60°. Featuring Wi-Fi WebUI, 4G LTE, Bluetooth 5.1, and rugged IP68 design, it ensures 12-hour performance in any field condition.',
    specs: [
      { key: 'Channels',              value: '1408' },
      { key: 'Constellations',        value: 'GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC, SBAS' },
      { key: 'Signals',               value: 'GPS L1C/A L1C L2P(Y) L2C L5; GLONASS G1 G2 G3; BDS B1I B2I B3I B1C B2a B2b; Galileo E1 E5a E5b E6; QZSS L1C/A L1C L2C L5; NavIC L5' },
      { key: 'Tilt Compensation',     value: 'MEMS tilt sensor up to 60°' },
      { key: 'RTK Accuracy (H)',      value: '8 mm + 1 ppm' },
      { key: 'RTK Accuracy (V)',      value: '15 mm + 1 ppm' },
      { key: 'Cold Start',            value: '<30 seconds' },
      { key: 'Signal Reacquisition',  value: '<1 second' },
      { key: 'Dimensions',            value: 'Ø134 mm × H74 mm' },
      { key: 'Weight',                value: '~0.9 kg' },
      { key: 'Operating Temperature', value: '-30°C to +65°C' },
      { key: 'Storage Temperature',   value: '-40°C to +80°C' },
      { key: 'Protection',            value: 'IP68, MIL-STD-810H' },
      { key: 'Drop Resistance',       value: '2 m pole drop; 1.2 m free drop (hardwood floor)' },
      { key: 'Connectivity',          value: '4G LTE, Wi-Fi (WebUI), Bluetooth 5.1, UHF radio' },
      { key: 'Indicators',            value: 'Satellites, data link, battery' },
    ],
  },

  {
    name: 'SIGMA Series',
    slug: 'sigma-series',
    category: 'gnss-receiver',
    brand: 'janak',
    modelNumber: 'SIGMA',
    description: 'SIGMA is a versatile GNSS receiver designed for multiple RTK applications with options for GNSS Heading and roll/pitch from a MEMS IMU. With an internal battery, dual power inputs, and all typical I/O, SIGMA readily serves multiple GNSS configurations. Featuring integrated cell and radio communications, SIGMA may be used as a Reference Station with NTRIP Caster and Server functions to transmit RTCM corrections via TCP or NTRIP.',
    specs: [
      { key: 'Total Channels',        value: '874' },
      { key: 'Constellations',        value: 'GPS, GLONASS, Galileo, BeiDou, QZSS, SBAS, NavIC, L-Band' },
      { key: 'GPS Signals',           value: 'L1 C/A, L1C, P1, P2, L2C, L5' },
      { key: 'GLONASS Signals',       value: 'L1 C/A, P1, P2, L2 C/A, L3' },
      { key: 'RTK Accuracy (H)',      value: '8 mm + 1 ppm' },
      { key: 'RTK Accuracy (V)',      value: '15 mm + 1 ppm' },
      { key: 'Autonomous Accuracy',   value: 'Horizontal: 1.0 m, Vertical: 1.5 m' },
      { key: 'IMU',                   value: 'GNSS Heading & MEMS IMU (roll/pitch)' },
      { key: 'Communication',         value: 'Cell & Radio, NTRIP Caster/Server, TCP/NTRIP RTCM output' },
      { key: 'Ports',                 value: 'Ethernet, USB, Serial (RS-232/RS-422)' },
      { key: 'Wireless',              value: 'Wi-Fi, Bluetooth' },
      { key: 'I/O',                   value: 'CAN, Event, 1PPS, External Frequency I/O' },
      { key: 'Power',                 value: 'Internal battery, dual power inputs' },
    ],
  },

  {
    name: 'Spacexx',
    slug: 'spacexx',
    category: 'gnss-receiver',
    brand: 'janak',
    modelNumber: 'Spacexx',
    description: 'The Spacexx GNSS is a next-generation, multi-constellation GNSS receiver engineered for high-accuracy RTK positioning in any environment. Designed with a rugged magnesium alloy housing, powerful internal radio, intelligent IMU, and ultra-long battery life, it delivers survey-grade performance with unmatched speed and reliability. Whether in construction, agriculture, mapping, or land surveying — Spacexx ensures <1 second RTK fix with 99.99% reliability, even in tough conditions.',
    specs: [
      { key: 'Channels',              value: '1408' },
      { key: 'Constellations',        value: 'GPS, GLONASS, BeiDou, Galileo, IRNSS, QZSS, SBAS' },
      { key: 'RTK Init Time',         value: '<5 seconds; Reacquisition <1 second' },
      { key: 'RTK Reliability',       value: '>99.99%' },
      { key: 'RTK Accuracy (H)',      value: '±8 mm + 1 ppm RMS' },
      { key: 'RTK Accuracy (V)',      value: '±15 mm + 1 ppm RMS' },
      { key: 'NRTK Accuracy (H)',     value: '±8 mm + 0.5 ppm RMS' },
      { key: 'Static Accuracy (H)',   value: '±3 mm + 0.1 ppm RMS' },
      { key: 'DGPS Accuracy',         value: 'Horizontal: 0.25 m, Vertical: 0.4 m' },
      { key: 'Output Rate',           value: '1 Hz – 20 Hz' },
      { key: 'Time Accuracy',         value: '20 ns' },
      { key: 'Cold Start',            value: '<50 seconds' },
      { key: 'Hot Start',             value: '<15 seconds' },
      { key: 'Housing',               value: 'Magnesium alloy' },
      { key: 'Dimensions',            value: '120 mm × 72 mm' },
      { key: 'Weight',                value: '0.76 kg' },
      { key: 'Operating Temperature', value: '-40°C to +75°C' },
      { key: 'Storage Temperature',   value: '-55°C to +85°C' },
      { key: 'Protection',            value: 'IP67 (30 min immersion to 1 m depth)' },
      { key: 'Battery',               value: '8000 mAh internal lithium-ion, >24 hours' },
      { key: 'Power Input',           value: '9–24 V DC external; USB Type-C fast charging' },
      { key: 'Storage',               value: '8 GB internal, cyclic storage support' },
    ],
  },

  {
    name: 'Spacexx Lite',
    slug: 'spacexx-lite',
    category: 'gnss-receiver',
    brand: 'janak',
    modelNumber: 'Spacexx Lite',
    description: 'The Spacexx Lite GNSS Receiver is designed for surveyors, engineers, and geospatial professionals who demand accuracy, speed, and durability. Powered by a cutting-edge 1408-channel engine and full constellation tracking (GPS, GLONASS, BeiDou, Galileo, IRNSS, QZSS, SBAS), Spacexx Lite delivers centimeter-level precision in even the toughest environments with IMU tilt compensation up to 120°.',
    specs: [
      { key: 'Channels',              value: '1408' },
      { key: 'Constellations',        value: 'GPS, GLONASS, BeiDou, Galileo, IRNSS, QZSS, SBAS' },
      { key: 'RTK Init Time',         value: '<5 seconds; Reacquisition <1 second' },
      { key: 'RTK Reliability',       value: '>99.99%' },
      { key: 'RTK Accuracy (H)',      value: '±8 mm + 1 ppm RMS' },
      { key: 'RTK Accuracy (V)',      value: '±15 mm + 1 ppm RMS' },
      { key: 'NRTK Accuracy (H)',     value: '±8 mm + 0.5 ppm RMS' },
      { key: 'Static Accuracy (H)',   value: '±3 mm + 0.1 ppm RMS' },
      { key: 'DGPS Accuracy',         value: 'Horizontal: 0.25 m, Vertical: 0.4 m' },
      { key: 'Output Rate',           value: '1 Hz – 20 Hz' },
      { key: 'Tilt Compensation',     value: 'IMU tilt up to 120°, 2.5 cm accuracy' },
      { key: 'Housing',               value: 'Magnesium alloy' },
      { key: 'Dimensions',            value: '120 mm × 72 mm' },
      { key: 'Weight',                value: '0.76 kg' },
      { key: 'Operating Temperature', value: '-40°C to +75°C' },
      { key: 'Protection',            value: 'IP67, MIL-STD-810G certified' },
      { key: 'Drop Resistance',       value: '2 m drop tested' },
      { key: 'Battery',               value: '8000 mAh, >24 hours' },
      { key: 'Storage',               value: '8 GB internal, 1+ year raw data' },
      { key: 'Wireless',              value: 'Bluetooth 5.0, USB-C, internal radio' },
    ],
  },

  {
    name: 'T-1M Plus',
    slug: 't-1m-plus',
    category: 'gnss-receiver',
    brand: 'janak',
    modelNumber: 'TRIUMPH-1M Plus',
    description: 'TRIUMPH-1M Plus is a precision GNSS Smart Antenna featuring integrated wireless communications and a MEMS IMU to deliver Tilt Compensated RTK. With a full-band UHF radio and a 4G cell modem, users have Base/Rover or network RTK on demand. The JAVAD patented in-pole UHF & cellular antenna ensures exceptional reliability.',
    specs: [
      { key: 'Total Channels',          value: '874' },
      { key: 'Constellations',          value: 'GPS, GLONASS, Galileo, BeiDou, QZSS, SBAS, NavIC, L-Band' },
      { key: 'GPS Signals',             value: 'L1 C/A, L1C, P1, P2, L2C, L5' },
      { key: 'RTK Accuracy (H)',        value: '8 mm + 1 ppm' },
      { key: 'RTK Accuracy (V)',        value: '15 mm + 1 ppm' },
      { key: 'Network RTK Accuracy (H)', value: '8 mm + 0.5 ppm' },
      { key: 'Tilt Compensated RTK',   value: 'RTK + 5 mm + 0.5 mm/° tilt, up to 30°' },
      { key: 'Static Accuracy (H)',     value: '3 mm + 0.1 ppm' },
      { key: 'Autonomous Accuracy',     value: 'Horizontal: 1.0 m, Vertical: 1.5 m' },
      { key: 'Cold Start',              value: '<35 seconds' },
      { key: 'IMU',                     value: 'GNSS & MEMS IMU (tilt compensation)' },
      { key: 'Cellular',                value: '4G LTE (LTE, HSPA+, WCDMA, GSM, GPRS, EDGE, EV-DO)' },
      { key: 'Radio',                   value: 'Full-band UHF, patented in-pole UHF/Cell antenna' },
      { key: 'Wireless',                value: 'Bluetooth & Wi-Fi' },
      { key: 'Battery Life',            value: '18 hours' },
    ],
  },

  {
    name: 'T3-NR',
    slug: 't3-nr',
    category: 'gnss-receiver',
    brand: 'janak',
    modelNumber: 'T3-NR',
    description: 'The T3-NR GNSS Network Rover is a lightweight, high-performance receiver designed for seamless field operations. Equipped with an integrated MEMS IMU, this advanced rover delivers precise and reliable positioning, making it ideal for surveying, mapping, and geospatial applications. Features 25-hour battery life with Bluetooth, WiFi, and USB connectivity.',
    specs: [
      { key: 'IMU',          value: 'GNSS & MEMS IMU' },
      { key: 'Constellations', value: 'All constellations activated' },
      { key: 'Form Factor',  value: 'Small size, lightweight' },
      { key: 'Battery Life', value: '25 hours' },
      { key: 'Wireless',     value: 'Bluetooth, Wi-Fi, USB' },
      { key: 'Indicators',   value: 'LED status display' },
    ],
  },

  {
    name: 'TRIUMPH-1M',
    slug: 'triumph-1m',
    category: 'gnss-receiver',
    brand: 'janak',
    modelNumber: 'TRIUMPH-1M',
    description: 'The TRIUMPH-1M GNSS Smart Antenna is equipped with an 864-channel ASIC for faster signal tracking and greater accuracy. With its onboard 4G LTE modem, easily accessible SD and SIM card slots, and groundbreaking Lift & Tilt automation, the TRIUMPH-1M provides effortless field operation for surveying, construction, and precision agriculture.',
    specs: [
      { key: 'Channels',              value: '864' },
      { key: 'Constellations',        value: 'GPS, GLONASS, Galileo, BeiDou, QZSS, SBAS, IRNSS' },
      { key: 'GPS Signals',           value: 'L1 C/A, L1C, P2, L2C, L5' },
      { key: 'RTK Accuracy (H)',      value: '8 mm + 1 ppm' },
      { key: 'RTK Accuracy (V)',      value: '15 mm + 1 ppm' },
      { key: 'Static Accuracy (H)',   value: '3 mm + 0.1 ppm' },
      { key: 'Autonomous Accuracy',   value: '<2 m' },
      { key: 'DGPS Accuracy',         value: '<0.25 m post-processing; <0.5 m real-time' },
      { key: 'Cold Start',            value: '<35 seconds' },
      { key: 'Hot Start',             value: '<5 seconds' },
      { key: 'Reacquisition',         value: '<1 second' },
      { key: 'Cellular',              value: '4G LTE (LTE, HSPA+, WCDMA, GSM, GPRS, EDGE, EV-DO, up to 100 Mbps)' },
      { key: 'Radio',                 value: 'Internal 406–470 MHz UHF, 1 W' },
      { key: 'Storage',               value: '16 GB on-board' },
      { key: 'Connectivity',          value: 'Ethernet, Serial, USB' },
      { key: 'Automation',            value: 'Lift & Tilt' },
      { key: 'Multipath',             value: 'Advanced multipath reduction' },
    ],
  },

  {
    name: 'TRIUMPH-2',
    slug: 'triumph-2',
    category: 'gnss-receiver',
    brand: 'janak',
    modelNumber: 'TRIUMPH-2',
    description: 'The TRIUMPH-2 GNSS Smart Antenna by JAVAD GNSS is a small and lightweight receiver that features all-day battery life. With all-constellation tracking, the TRIUMPH-2 excels as a network rover, preferred for its light weight (0.56 kg) and simple operation. Integrated Bluetooth and WiFi enable wireless access to local GNSS reference networks.',
    specs: [
      { key: 'Channels',              value: '216' },
      { key: 'Constellations',        value: 'GPS, GLONASS, Galileo, BeiDou, QZSS, SBAS' },
      { key: 'GPS Signals',           value: 'L1 C/A, P1, P2, L1C, L2C' },
      { key: 'RTK Accuracy (H)',      value: '10 mm + 1 ppm' },
      { key: 'RTK Accuracy (V)',      value: '15 mm + 1 ppm' },
      { key: 'Static Accuracy (H)',   value: '3 mm + 0.5 ppm' },
      { key: 'SBAS Accuracy',         value: '<1.0 m' },
      { key: 'DGPS Accuracy',         value: '<0.5 m' },
      { key: 'Cold Start',            value: '<35 seconds' },
      { key: 'Warm Start',            value: '<5 seconds' },
      { key: 'Reacquisition',         value: '<1 second' },
      { key: 'Weight',                value: '0.56 kg' },
      { key: 'Antenna',               value: 'Internal NGS calibrated, microstrip zero-centered' },
      { key: 'Storage',               value: 'Up to 2 GB, raw data up to 100 Hz' },
      { key: 'Wireless',              value: 'Bluetooth, Wi-Fi, USB' },
      { key: 'Battery Life',          value: '25 hours' },
      { key: 'Multipath',             value: 'Advanced multipath reduction, RAIM technology' },
    ],
  },

  {
    name: 'TRIUMPH-3',
    slug: 'triumph-3',
    category: 'gnss-receiver',
    brand: 'janak',
    modelNumber: 'TRIUMPH-3',
    description: 'The TRIUMPH-3 is a compact GNSS Smart Antenna by JAVAD GNSS with a variety of wireless interfaces for hands-free operation. Dual-band Wi-Fi and Bluetooth 5.1 allow easy cable-free connection in the field. The TRIUMPH-3 complements the JAVAD receiver line with quick setup for base/rover operation using the internal radio or cell modem, or as an NTRIP caster with advanced spoofing detection.',
    specs: [
      { key: 'Channels',              value: '874' },
      { key: 'Constellations',        value: 'GPS, GLONASS, Galileo, BeiDou, QZSS, SBAS, NavIC' },
      { key: 'GPS Signals',           value: 'L1 C/A, L1C, P1, P2, L2C, L5' },
      { key: 'RTK Accuracy (H)',      value: '8 mm + 1 ppm' },
      { key: 'RTK Accuracy (V)',      value: '15 mm + 1 ppm' },
      { key: 'Network RTK (H)',       value: '8 mm + 0.5 ppm' },
      { key: 'Tilt Compensated RTK',  value: 'RTK + 5 mm + 0.5 mm/° tilt, up to 30°' },
      { key: 'Static Accuracy (H)',   value: '3 mm + 0.1 ppm' },
      { key: 'DGPS Accuracy',         value: '<0.5 m' },
      { key: 'Security',              value: 'Spoofing detection, advanced multipath mitigation' },
      { key: 'Radio',                 value: 'UHF 1W transceiver' },
      { key: 'Cellular',              value: '4G/LTE module' },
      { key: 'Wi-Fi',                 value: 'Dual-band 5 GHz & 2.4 GHz (802.11 a/b/g/n/d/e/i)' },
      { key: 'Bluetooth',             value: 'Bluetooth 5.1, dual-mode BT & BLE' },
      { key: 'Ethernet',              value: '10BASE-T/100BASE-TX full-duplex' },
      { key: 'USB',                   value: '480 Mbps High-Speed USB 2.0 Host & Device' },
      { key: 'Storage',               value: 'microSD up to 128 GB' },
      { key: 'NTRIP',                 value: 'NTRIP Caster support' },
      { key: 'Battery Life',          value: '12 hours' },
      { key: 'Interface',             value: 'J-Mobile Interface' },
    ],
  },

  {
    name: 'TRIUMPH-LS Plus',
    slug: 'triumph-ls-plus',
    category: 'gnss-receiver',
    brand: 'janak',
    modelNumber: 'TRIUMPH-LS Plus',
    description: 'The TRIUMPH-LS Plus GNSS Smart Antenna features 4 parallel RTK engines for simultaneous computations together with in-field RTPK, giving users the assurance of accurate and repeatable positions especially under foliage and difficult reception conditions. The integrated field computer and Lift & Tilt automation streamline data collection workflows.',
    specs: [
      { key: 'Channels',              value: '874' },
      { key: 'Constellations',        value: 'GPS, GLONASS, Galileo, BeiDou, QZSS, SBAS, IRNSS' },
      { key: 'RTK Engine',            value: '4 parallel RTK engines' },
      { key: 'RTK Accuracy (H)',      value: '4 mm + 1 ppm' },
      { key: 'RTK Accuracy (V)',      value: '7 mm + 1 ppm' },
      { key: 'Static Accuracy (H)',   value: '3 mm + 0.1 ppm' },
      { key: 'RTK Reliability',       value: '99.99%' },
      { key: 'RTK Init Time',         value: '<1 second (hot start)' },
      { key: 'Cold Start',            value: '<35 seconds' },
      { key: 'DGPS Accuracy',         value: '<0.5 m' },
      { key: 'Computer',              value: 'Built-in field computer' },
      { key: 'Automation',            value: 'Lift & Tilt auto point recording' },
      { key: 'Repeatability',         value: 'In-field RTPK repeatability' },
      { key: 'Battery Life',          value: '25 hours' },
      { key: 'Cellular',              value: '4G LTE (LTE, HSPA+, WCDMA, GSM, GPRS, EDGE)' },
      { key: 'Radio UHF',             value: 'Internal 406–470 MHz, 1 W' },
      { key: 'Radio ISM',             value: '902–928 / 868–870 MHz, 1 W (optional)' },
      { key: 'Wi-Fi',                 value: 'IEEE 802.11 b/g/n/d/e' },
      { key: 'Warranty',              value: '3-year warranty, lifetime firmware & software updates' },
    ],
  },

  // ── GNSS Antennas ───────────────────────────────────────────────────────────

  {
    name: 'AgAnt-3S',
    slug: 'agant-3s',
    category: 'gnss-antenna',
    brand: 'janak',
    modelNumber: 'AgAnt-3S',
    description: 'The AgAnt-3S GNSS receiver is based on the JAVAD TRIUMPH-3 chip with 874 channels, allowing tracking of all current and future satellite signals. The high-performance GNSS antenna is integrated with the receiver in a compact and robust housing. It can be mounted on flat surfaces or standard poles (5/8-11 or 1-14 inch thread) with communication via CAN 2.0, USB 2.0, and RS-232/RS-422.',
    specs: [
      { key: 'Total Channels',        value: '874' },
      { key: 'Constellations',        value: 'GPS, GLONASS, Galileo, QZSS, BeiDou, IRNSS, SBAS' },
      { key: 'GPS Signals',           value: 'C/A, L1C, P1, P2, L2C, L5' },
      { key: 'GLONASS Signals',       value: 'C/A, P1, P2, L2C, L3' },
      { key: 'Galileo Signals',       value: 'E1, E5A, E5B, AltBoc, E6' },
      { key: 'BeiDou Signals',        value: 'B1, B1C, B2B, B2, B2A, B3' },
      { key: 'Autonomous Accuracy',   value: '<2 m' },
      { key: 'Static Accuracy (H)',   value: '0.3 cm + 0.1 ppm' },
      { key: 'Static Accuracy (V)',   value: '0.35 cm + 0.4 ppm' },
      { key: 'RTK Accuracy (H)',      value: '1 cm + 1 ppm' },
      { key: 'RTK Accuracy (V)',      value: '1.5 cm + 1 ppm' },
      { key: 'Cold Start',            value: '<35 seconds' },
      { key: 'Reacquisition',         value: '<1 second' },
      { key: 'Antenna Type',          value: 'Integrated microstrip (zero centered), flat ground plane' },
      { key: 'Communication',         value: 'CAN 2.0 (1 Mbps); RS-232/RS-422 up to 460.8 kbps; USB 2.0 480 Mbps' },
      { key: 'Internal Memory',       value: 'Up to 16 GB' },
      { key: 'Raw Data Recording',    value: 'Up to 100 Hz' },
      { key: 'Data Formats',          value: 'JPS, RTCM SC104 v2.x/3.x, CMR, NMEA 0183, BINEX' },
      { key: 'Input Voltage',         value: '+4.5 to +35 V' },
      { key: 'Mounting',              value: '5/8-11 or 1-14 inch thread, or 4× M5 screw holes' },
      { key: 'Dimensions',            value: '140 × 140 × 62 mm' },
      { key: 'Weight',                value: '0.461 kg' },
      { key: 'Operating Temperature', value: '-40°C to +80°C' },
      { key: 'Storage Temperature',   value: '-40°C to +85°C' },
      { key: 'Protection',            value: 'IP67, survives 2 m drop onto hard surface' },
    ],
  },

  {
    name: 'AirAnt',
    slug: 'airant',
    category: 'gnss-antenna',
    brand: 'janak',
    modelNumber: 'AirAnt',
    description: 'The AirAnt antenna is designed to be mounted on aircraft and applications where a low-profile and aerodynamic shape are desired. Its sophisticated interference signal rejection and capability to track GPS, GLONASS, Galileo, BeiDou, WAAS, EGNOS, MSAS, GAGAN, and QZSS signals make it useful for a wide range of applications. AirAnt\'s lightweight yet rugged design combined with low power consumption make it an ideal antenna for almost any environment.',
    specs: [
      { key: 'Constellations',        value: 'GPS L1/L2/L5, GLONASS L1/L2/L3, Galileo E1/E2/E5ab, BeiDou B1/B2, WAAS, EGNOS, MSAS, GAGAN, QZSS' },
      { key: 'Frequency (High)',      value: '1559–1610 MHz' },
      { key: 'Frequency (Low)',       value: '1164–1253 MHz' },
      { key: 'Antenna Gain (High)',   value: '4.0 dB typical @ 1559–1610 MHz' },
      { key: 'Antenna Gain (Low)',    value: '3.0 dB typical @ 1164–1253 MHz' },
      { key: 'Axial Ratio',          value: '3.0 dB max' },
      { key: 'Output Impedance',      value: '50 Ohm' },
      { key: 'VSWR',                  value: '2.0:1' },
      { key: 'LNA Gain',              value: '3.0 dB max' },
      { key: 'DC Voltage',            value: '4.7–12.0 VDC, 85 mA @ 5.0 V typical' },
      { key: 'Connector',             value: 'TNC' },
      { key: 'Mounting',              value: '4 holes' },
      { key: 'Dimensions',            value: '120 mm × 74 mm × 44 mm' },
      { key: 'Weight',                value: '320 g' },
      { key: 'Enclosure',             value: 'Radome: GE PEI+40%GF, Base: Aluminum' },
      { key: 'Operating Temperature', value: '-50°C to +85°C' },
      { key: 'Storage Temperature',   value: '-60°C to +85°C' },
      { key: 'Protection',            value: 'Waterproof' },
    ],
  },

  {
    name: 'GrAnt Series',
    slug: 'grant-series',
    category: 'gnss-antenna',
    brand: 'janak',
    modelNumber: 'GrAnt Series',
    description: 'The GrAnt Series are wide-band GNSS antennas with full GNSS spectrum compatibility to track GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC, SBAS, and L-Band signals. They feature a stable phase center with enhanced signal reception, ideal for high-precision positioning using L-Band corrections. The GrAnt-3L and GrAnt-3LS models offer durable IP68 weatherproof housing suitable for a wide variety of reference station and base station applications.',
    specs: [
      { key: 'Models',                value: 'GrAnt-3L, GrAnt-3LS, GrAnt-G2T-JS-HPO' },
      { key: 'Constellations',        value: 'GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC, SBAS, L-Band' },
      { key: 'GrAnt-3LS Signals',     value: 'GPS L1/L2/L5; GLONASS L1/L2/L3; Galileo E1/E5a/E5b/E6; BeiDou B1/B1C/B2/B2A/B2B/B3; QZSS L1/L2/L5/L6; NavIC L1/L5/S' },
      { key: 'Frequency (High)',      value: '1525–1614 MHz' },
      { key: 'Frequency (Low)',       value: '1164–1300 MHz' },
      { key: 'LNA Gain',              value: '32 ±2 dB; 40 ±2 dB (optional)' },
      { key: 'Noise Figure',          value: '1.7 dB typical' },
      { key: 'VSWR',                  value: '2.0:1 max' },
      { key: 'Output Impedance',      value: '50 Ohm' },
      { key: 'Connector',             value: 'TNC (N-type optional)' },
      { key: 'Mounting',              value: '5/8 × 11 inch or 4× M5 holes' },
      { key: 'Input Voltage',         value: '+3.0 to +15 VDC' },
      { key: 'Phase Center',          value: 'Stable phase center, tracking to horizon' },
      { key: 'Protection',            value: 'IP68 weatherproof, aluminum base' },
    ],
  },

  {
    name: 'RingAnt-S',
    slug: 'ringant-s',
    category: 'gnss-antenna',
    brand: 'janak',
    modelNumber: 'RingAnt-S',
    description: 'The RingAnt-S is a wide-band choke ring GNSS antenna with full GNSS spectrum compatibility to track GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC, SBAS, and L-Band signals. It features a stable phase center with enhanced signal reception, ideal for high-precision positioning using L-Band corrections. With a durable IP68 housing, the RingAnt-S is suitable for reference stations, geodetic surveying, and precision applications.',
    specs: [
      { key: 'Antenna Type',          value: 'Choke ring GNSS antenna' },
      { key: 'Constellations',        value: 'GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC, SBAS, L-Band' },
      { key: 'GPS Signals',           value: 'L1, L2, L5' },
      { key: 'GLONASS Signals',       value: 'L1, L2, L3' },
      { key: 'Galileo Signals',       value: 'E1, E5A, E5B, E6' },
      { key: 'BeiDou Signals',        value: 'B1, B1C, B2A, B2B, B3' },
      { key: 'QZSS Signals',          value: 'L1, L2, L5, L6' },
      { key: 'Phase Center',          value: 'Stable phase center, tracking to horizon' },
      { key: 'Protection',            value: 'IP68 weatherproof, aluminum base' },
    ],
  },

  {
    name: 'RingAnt Series',
    slug: 'ringant-series',
    category: 'gnss-antenna',
    brand: 'janak',
    modelNumber: 'RingAnt Series',
    description: 'The RingAnt Series offers high-performance choke ring GNSS antennas for geodetic, monitoring, and reference station applications. The RingAnt-3L mounts the GrAnt antenna on a choke ring for field upgradeability, while the RingAnt-DMT embeds Tallysman\'s Vera-Phase® technology with less than 1 mm Phase Center Variation for the most demanding precision applications including GNSS reference networks and infrastructure monitoring.',
    specs: [
      { key: 'Models',                value: 'RingAnt-3L, RingAnt-DMT' },
      { key: 'Constellations',        value: 'GPS, GLONASS, Galileo, BeiDou, QZSS, SBAS, NavIC, L-Band' },
      { key: 'RingAnt-3L Signals',    value: 'GPS L1/L2/L2C/L5; GLONASS L1/L2/L3; Galileo E1/E2/E5ab/E6; BeiDou B1/B2/B3; QZSS; IRNSS L5; L-Band' },
      { key: 'RingAnt-DMT Technology', value: 'Vera-Phase® from Tallysman, <1 mm Phase Center Variation' },
      { key: 'RingAnt-DMT Signals',   value: 'GPS L1/L2/L5; GLONASS L1/L2/L3; Galileo E1/E5a/E5b/E6; BeiDou B1/B2/B2a/B3; QZSS L1/L2/L5/L6; NavIC L1/L5; L-Band 1539–1559 MHz' },
      { key: 'Multipath',             value: 'Multipath rejection (RingAnt-DMT)' },
      { key: 'LNA',                   value: 'Pre-filtered LNA (RingAnt-DMT)' },
      { key: 'Frequency (High)',      value: '1525–1614 MHz' },
      { key: 'Frequency (Low)',       value: '1164–1300 MHz' },
      { key: 'LNA Gain',              value: '32 ±2 dB' },
      { key: 'Noise Figure',          value: '1.7 dB typical' },
      { key: 'Connector',             value: 'TNC (N-type optional)' },
      { key: 'Mounting (3L)',         value: '5/8 × 11 inch or 4× M5 holes; 1-14 UNS' },
      { key: 'Weight (3L)',           value: '2.7 kg' },
      { key: 'Operating Temperature (3L)', value: '-45°C to +85°C' },
      { key: 'Protection (3L)',       value: 'IP68, MIL-STD-810H (shock & vibration)' },
      { key: 'Protection (DMT)',      value: 'IP67' },
      { key: 'Enclosure',             value: 'Radome: ABS, Base: Aluminum' },
    ],
  },

  // ── Data Collectors ─────────────────────────────────────────────────────────

  {
    name: 'Janak FieldPad',
    slug: 'janak-fieldpad',
    category: 'data-collector',
    brand: 'janak',
    modelNumber: 'Janak-FieldPad',
    description: 'The Janak FieldPad is a rugged field data collector designed for seamless integration with GNSS receivers and total stations, built for demanding outdoor survey and mapping workflows.',
    specs: [],
  },

  {
    name: 'JS-10 Pro',
    slug: 'js-10-pro',
    category: 'data-collector',
    brand: 'janak',
    modelNumber: 'JS-10 Pro',
    description: 'The JS-10 Pro is a fully rugged tablet for industrial applications supporting both Android 11 and Windows 10. Powered by a Qualcomm Snapdragon Octa-core processor with 6 GB RAM and 64 GB storage, it features a 1280×800 WXGA multi-touch display, 5G connectivity, IP68 protection, and 10–12 hour battery life with front 2MP and rear 16MP cameras.',
    specs: [
      { key: 'Operating System',      value: 'Android 11 / Windows 10' },
      { key: 'Processor',             value: 'Qualcomm Snapdragon Octa-core Kryo 260 @ 2.0 GHz / Intel Pentium N4200' },
      { key: 'Memory',                value: '6 GB LPDDR4 RAM, 64 GB eMMC / 8 GB LPDDR4, 128 or 256 GB' },
      { key: 'Display',               value: '1280×800 WXGA IPS LCD, Dragontrail cover glass, multi-touch' },
      { key: 'GPU',                   value: 'Qualcomm Adreno 512 / Intel HD Graphics' },
      { key: 'Camera',                value: 'Rear: 16 MP, Front: 2 MP' },
      { key: 'Sensors',               value: 'Ambient light, compass, accelerometer, gyroscope' },
      { key: 'GPS',                   value: 'Qualcomm SDR660 GNSS receiver (optional)' },
      { key: 'Cellular',              value: '4G LTE (Snapdragon X12 LTE / AirPrime EM7455 or EM7430), 5G support' },
      { key: 'Wi-Fi',                 value: '802.11 a/b/g/n/ac, 2.4 GHz and 5 GHz' },
      { key: 'Bluetooth',             value: 'v5.0 + EDR, Class 1.5, BLE support' },
      { key: 'USB',                   value: 'USB-C, USB 3.1 OTG × 1' },
      { key: 'External Interfaces',   value: 'Optional RS-232 9-pin D-Sub, Dock connector (Power, USB 2.0, HDMI, Ethernet)' },
      { key: 'Audio',                 value: '3.5 mm audio jack' },
      { key: 'Battery',               value: 'Li-Ion 43.2 Whr, removable, field-changeable' },
      { key: 'Battery Life',          value: '10–12 hours; optional 21.6 Whr for hot swap (5–6 hours)' },
      { key: 'Power Input',           value: '12 V DC' },
      { key: 'Dimensions',            value: '228 × 145 × 16.5 mm' },
      { key: 'Weight',                value: '630 g (with battery)' },
      { key: 'Operating Temperature', value: '-20°C to +50°C' },
      { key: 'Storage Temperature',   value: '-30°C to +70°C' },
      { key: 'Humidity',              value: '95% non-condensing' },
      { key: 'Protection',            value: 'IP68' },
      { key: 'Drop Resistance',       value: '1.5 m multi-drop onto concrete' },
      { key: 'Certifications',        value: 'FCC, CE, RoHS 2, EN62368, Industry Canada' },
      { key: 'Warranty',              value: '2 years' },
    ],
  },

  {
    name: 'JS-10 Rugged Tablet',
    slug: 'js-10-rugged-tablet',
    category: 'data-collector',
    brand: 'janak',
    modelNumber: 'JS-10',
    description: 'The JS-10 is an 8-inch industrial 5G rugged tablet running Android 10. Powered by a Qualcomm SDM 690 Octa-core processor at up to 2.0 GHz, it features a 1200×1920 HD IPS display with 550 nits brightness, 8500 mAh battery, GPS L1/L5 and GLONASS support, IP67 protection, and 1.22 m drop resistance.',
    specs: [
      { key: 'Operating System',      value: 'Android 10' },
      { key: 'Processor',             value: 'Qualcomm SDM 690 Octa-core up to 2.0 GHz' },
      { key: 'Memory',                value: '4 GB RAM, 64 GB ROM' },
      { key: 'Display',               value: '8 inch HD IPS, 1200×1920 (16:10), 550 nits, capacitive 10-point multi-touch' },
      { key: 'GPU',                   value: 'Adreno 619L' },
      { key: 'Camera',                value: 'Rear: 13 MP AF with flash, Front: 5 MP' },
      { key: 'GPS',                   value: 'GPS L1 & L5 / GLONASS' },
      { key: 'Sensors',               value: 'Ambient light, virtual gyro, compass' },
      { key: 'Cellular',              value: '5G NR (N1/41/78/79), 4G LTE, 3G, 2G GSM' },
      { key: 'Wi-Fi',                 value: '802.11 a/b/g/n/ac dual-band 2.4 GHz & 5 GHz' },
      { key: 'Bluetooth',             value: 'v4.1, 10 m range' },
      { key: 'Expansion',             value: '1× SIM slot, 1× TF card up to 256 GB' },
      { key: 'Interfaces',            value: '1× USB 3.0 Type-A, 1× USB Type-C, 1× HDMI 1.4a, 12-pin Pogo, 3.5 mm audio jack' },
      { key: 'Battery',               value: '3.7 V Li-ion 8500 mAh' },
      { key: 'Power',                 value: 'AC 100–240 V, 50/60 Hz, Output DC 5 V/3 A' },
      { key: 'Dimensions',            value: '225.6 × 144.6 × 21.5 mm' },
      { key: 'Weight',                value: '~715 g' },
      { key: 'Operating Temperature', value: '-20°C to +65°C' },
      { key: 'Storage Temperature',   value: '-30°C to +70°C' },
      { key: 'Humidity',              value: '95% non-condensing' },
      { key: 'Protection',            value: 'IP67' },
      { key: 'Drop Resistance',       value: '1.22 m' },
      { key: 'Certifications',        value: 'KC, CE' },
      { key: 'Warranty',              value: '1 year manufacturer warranty' },
    ],
  },

  {
    name: 'JS-10A',
    slug: 'js-10a',
    category: 'data-collector',
    brand: 'janak',
    modelNumber: 'JS-10A',
    description: 'The JS-10A is a compact and durable data collector offering reliable performance for field survey, data capture, and real-time positioning workflows.',
    specs: [],
  },

  {
    name: 'JS-11',
    slug: 'js-11',
    category: 'data-collector',
    brand: 'janak',
    modelNumber: 'JS-11',
    description: 'The JS-11 is a next-generation rugged data collector built for professional surveying and mapping, with an ergonomic design optimised for one-handed field operation.',
    specs: [],
  },

  {
    name: 'JS-60',
    slug: 'js-60',
    category: 'data-collector',
    brand: 'janak',
    modelNumber: 'JS-60',
    description: 'The JS-60 is a high-performance ultra-rugged tablet designed for industrial and survey field applications, offering advanced connectivity and durable construction for large-scale data collection operations.',
    specs: [],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function upsertCategory(cat) {
  const { rows } = await client.query(`SELECT id FROM categories WHERE slug = $1`, [cat.slug]);
  if (rows.length > 0) return rows[0].id;

  const res = await client.query(
    `INSERT INTO categories (name, slug, icon, "isActive", "sortOrder", "createdAt", "updatedAt")
     VALUES ($1, $2, NULL, true, $3, NOW(), NOW()) RETURNING id`,
    [cat.name, cat.slug, cat.sortOrder],
  );
  console.log(`  [category] created: ${cat.name}`);
  return res.rows[0].id;
}

async function upsertBrand(brand) {
  const { rows } = await client.query(`SELECT id FROM brands WHERE slug = $1`, [brand.slug]);
  if (rows.length > 0) return rows[0].id;

  const res = await client.query(
    `INSERT INTO brands (name, slug, "isActive", "createdAt", "updatedAt")
     VALUES ($1, $2, true, NOW(), NOW()) RETURNING id`,
    [brand.name, brand.slug],
  );
  console.log(`  [brand] created: ${brand.name}`);
  return res.rows[0].id;
}

async function upsertProduct(p, categoryId, brandId) {
  const { rows } = await client.query(`SELECT id FROM products WHERE slug = $1`, [p.slug]);

  let productId;
  if (rows.length > 0) {
    productId = rows[0].id;
    await client.query(
      `UPDATE products
       SET name = $1, description = $2, "modelNumber" = $3, "categoryId" = $4, "brandId" = $5, "updatedAt" = NOW()
       WHERE id = $6`,
      [p.name, p.description, p.modelNumber, categoryId, brandId, productId],
    );
    console.log(`  [product] updated: ${p.name}`);
  } else {
    const res = await client.query(
      `INSERT INTO products
         (name, slug, description, price, "stockStatus", "modelNumber", "isFeatured", "isNewArrival", "isActive", "categoryId", "brandId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 0, 'in_stock', $4, false, false, true, $5, $6, NOW(), NOW())
       RETURNING id`,
      [p.name, p.slug, p.description, p.modelNumber, categoryId, brandId],
    );
    productId = res.rows[0].id;
    console.log(`  [product] inserted: ${p.name}`);
  }

  // Replace specs on every run to keep in sync
  await client.query(`DELETE FROM product_specs WHERE "productId" = $1`, [productId]);
  for (let i = 0; i < p.specs.length; i++) {
    await client.query(
      `INSERT INTO product_specs (key, value, "sortOrder", "productId") VALUES ($1, $2, $3, $4)`,
      [p.specs[i].key, p.specs[i].value, i, productId],
    );
  }

  return productId;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function seed() {
  await client.connect();
  console.log('Connected to database\n');

  console.log('── Categories ──');
  const categoryMap = {};
  for (const cat of CATEGORIES) {
    categoryMap[cat.slug] = await upsertCategory(cat);
  }

  console.log('\n── Brands ──');
  const brandMap = {};
  for (const brand of BRANDS) {
    brandMap[brand.slug] = await upsertBrand(brand);
  }

  console.log('\n── Products ──');
  for (const product of PRODUCTS) {
    const categoryId = categoryMap[product.category];
    const brandId = brandMap[product.brand];
    if (!categoryId) { console.warn(`  SKIP ${product.name} — unknown category: ${product.category}`); continue; }
    if (!brandId)    { console.warn(`  SKIP ${product.name} — unknown brand: ${product.brand}`);       continue; }
    await upsertProduct(product, categoryId, brandId);
  }

  console.log(`\nDone — ${PRODUCTS.length} products processed`);
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
