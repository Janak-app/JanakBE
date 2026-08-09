/**
 * Specification seeder — inserts technical spec rows for each product.
 *
 * Run locally (set env vars first):
 *   node src/seeds/seed-specs.js
 *
 * Or inside Docker:
 *   docker exec janak_app node /app/seed-specs.js
 *
 * Sources: pdftotext extraction + visual PDF reading for image-only PDFs.
 * Products with no PDF/specs available are noted with [SKIP] comments.
 */

const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'janak_db',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// ---------------------------------------------------------------------------
// Spec data — extracted from datasheets (pdftotext + visual reading)
// ---------------------------------------------------------------------------

const PRODUCT_SPECS = [

  // -------------------------------------------------------------------------
  // GNSS RECEIVERS
  // -------------------------------------------------------------------------

  {
    slug: 'j-50-gnss',
    // Source: J-50-RTK-GNSS-Receiver-2.pdf
    specs: [
      { key: 'Channels', value: '1408' },
      { key: 'GPS Signals', value: 'L1C/A, L1C, L2P(Y), L2C, L5' },
      { key: 'GLONASS Signals', value: 'G1, G2, G3' },
      { key: 'BeiDou Signals', value: 'B1I, B2I, B3I, B1C, B2a, B2b' },
      { key: 'Galileo Signals', value: 'E1, E5a, E5b, E6' },
      { key: 'QZSS Signals', value: 'L1C/A, L1C, L2C, L5' },
      { key: 'NavIC Signals', value: 'L5' },
      { key: 'SBAS', value: 'Supported' },
      { key: 'RTK Accuracy (H)', value: '8 mm + 1 ppm (RMS)' },
      { key: 'RTK Accuracy (V)', value: '15 mm + 1 ppm (RMS)' },
      { key: 'Static Accuracy (H)', value: '3.0 mm + 0.1 ppm (RMS)' },
      { key: 'Static Accuracy (V)', value: '3.5 mm + 0.4 ppm (RMS)' },
      { key: 'Single Point Accuracy (H)', value: '1.5 m (RMS)' },
      { key: 'Single Point Accuracy (V)', value: '2.5 m (RMS)' },
      { key: 'Code Differential (H)', value: '0.25 m (RMS)' },
      { key: 'Code Differential (V)', value: '0.5 m (RMS)' },
      { key: 'L-Band Accuracy (H)', value: '<0.1 m (RMS)' },
      { key: 'L-Band Accuracy (V)', value: '<0.15 m (RMS)' },
      { key: 'RTK Signal Reacquisition', value: '<1 second' },
      { key: 'Cold Start', value: '<30 seconds' },
      { key: 'Warm Start', value: '<20 seconds' },
      { key: 'Hot Start', value: '<5 seconds' },
      { key: 'RTK Initialization', value: '<5 seconds' },
      { key: 'Initialization Reliability', value: '>99.9%' },
      { key: 'Update Rate', value: 'Up to 20 Hz' },
      { key: 'Correction Data', value: 'RTCM 2.X, 3.X, CMR, CMR+' },
      { key: 'Battery', value: 'Built-in 3.6V 13400mAh (48.2Wh), PD quick charge' },
      { key: 'Charging Port', value: 'Type-C, PD Charging' },
      { key: 'Working Time', value: '12 hours' },
      { key: 'Operating System', value: 'Linux' },
      { key: 'Internal Memory', value: '8 GB' },
      { key: 'Bluetooth', value: 'BT 5.1, EDR backward compatible, BLE' },
      { key: 'Wi-Fi', value: '802.11 b/g/n' },
      { key: 'Cellular', value: 'Nano SIM, LTE FDD/TDD, UMTS, GSM' },
      { key: 'Radio', value: 'TX and RX, 1W TX power, 410–470 MHz' },
      { key: 'Dimension', value: 'Φ134 mm × H74 mm' },
      { key: 'Weight', value: 'About 0.9 kg' },
      { key: 'Operating Temperature', value: '-30°C to +65°C' },
      { key: 'Storage Temperature', value: '-40°C to +80°C' },
      { key: 'Water/Dust Proof', value: 'IP68' },
      { key: 'Shock & Vibration', value: 'MIL-STD-810H' },
      { key: 'Drop Resistance', value: '2 m pole drop; 1.2 m free drop (hardwood floor)' },
    ],
  },

  {
    slug: 'sigma-series',
    // Source: SIGMA_Datasheet_250520.pdf-4.pdf
    specs: [
      { key: 'Total Channels', value: '874' },
      { key: 'GPS Signals', value: 'L1 C/A, L1C, P1, P2, L2C, L5' },
      { key: 'GLONASS Signals', value: 'L1 C/A, P1, P2, L2 C/A, L3' },
      { key: 'Galileo Signals', value: 'E1, E5, E5A, E5B, E6' },
      { key: 'BeiDou Signals', value: 'B1, B1C, B2B, B2, B2A, B3' },
      { key: 'QZSS Signals', value: 'L1C C/A, L1C, L2C, L5, L6, L1S, L1Sb, L5S' },
      { key: 'SBAS Signals', value: 'L1, L5' },
      { key: 'NavIC Signals', value: 'L1, L5, S-Band' },
      { key: 'L-Band', value: '1525–1560 MHz' },
      { key: 'Autonomous Accuracy (H)', value: '1.000 m' },
      { key: 'Autonomous Accuracy (V)', value: '1.500 m' },
      { key: 'SBAS Accuracy (H)', value: '0.500 m' },
      { key: 'SBAS Accuracy (V)', value: '0.850 m' },
      { key: 'DGPS Accuracy (H)', value: '0.250 m' },
      { key: 'DGPS Accuracy (V)', value: '0.500 m' },
      { key: 'JStar (PPP) Accuracy (H)', value: '0.025 m' },
      { key: 'JStar (PPP) Accuracy (V)', value: '0.050 m' },
      { key: 'RTK Accuracy (H)', value: '0.008 m + 1 ppm' },
      { key: 'RTK Accuracy (V)', value: '0.015 m + 1 ppm' },
      { key: 'Network RTK Accuracy (H)', value: '0.008 m + 0.5 ppm' },
      { key: 'Network RTK Accuracy (V)', value: '0.015 m + 0.5 ppm' },
      { key: 'Static Accuracy (H)', value: '0.003 m + 0.1 ppm' },
      { key: 'Static Accuracy (V)', value: '0.004 m + 0.4 ppm' },
      { key: 'GNSS Heading Accuracy', value: '<0.09° (2 m baseline)' },
      { key: 'Cold Start', value: '<35 s' },
      { key: 'Warm Start', value: '<5 s' },
      { key: 'RTK Initialization', value: '2 to 6 s' },
      { key: 'Output Rate (Position)', value: 'Up to 200 Hz' },
      { key: 'Output Rate (IMU)', value: 'Up to 100 Hz' },
      { key: 'Internal Memory', value: 'Up to 64 GB' },
      { key: 'Ethernet', value: 'Full-duplex 10BASE-T/100BASE-TX' },
      { key: 'Wi-Fi', value: '5 GHz and 2.4 GHz, 802.11 a/b/g/n/ac' },
      { key: 'Bluetooth', value: 'v5.1, Dual-Mode' },
      { key: 'Cellular', value: '4G LTE: LTE-FDD, LTE-TDD, DC-HSPA+' },
      { key: 'UHF Radio', value: '1W TPO / 2W EIRP, 406–470 MHz transceiver' },
      { key: 'USB', value: 'High-speed USB 2.0 (480 Mbps)' },
      { key: 'Serial Ports', value: '2 × RS232 up to 460.8 kbps; 1 × RS232/RS422/CAN 2.0' },
      { key: '1PPS', value: '2 × 1PPS (BNC)' },
      { key: 'Event Marker', value: '2 × Event Marker (BNC)' },
      { key: 'External Frequency I/O', value: '5/10/20 MHz (BNC)' },
      { key: 'Input Voltage', value: '+10 to +30 VDC (2 ports)' },
      { key: 'Internal Battery', value: 'Rechargeable Li-Ion, 42500 mWh' },
      { key: 'Operating Time', value: '18 hours' },
      { key: 'Dimensions', value: '212 × 132 × 62 mm' },
      { key: 'Weight', value: '1.5 kg' },
      { key: 'Operating Temperature', value: '-40°C to +65°C' },
      { key: 'Storage Temperature', value: '-40°C to +85°C' },
      { key: 'Humidity', value: '100%' },
      { key: 'Ingress Protection', value: 'IP68' },
      { key: 'Shock & Vibration', value: 'MIL-STD-810H (Method 516.8 / Method 514.8)' },
      { key: 'LEDs', value: '7 LEDs: Power, Status, Recording, Radio, Cellular, Wi-Fi, Bluetooth' },
    ],
  },

  // spacexx — image-only PNG, no PDF. No spec table available. [SKIP]
  // spacexx-lite — image-only PNG, no PDF. No spec table available. [SKIP]

  {
    slug: 't-1m-plus',
    // Source: TRIUMPH-1M_Plus_Datasheet_250729.pdf.pdf
    specs: [
      { key: 'Total Channels', value: '874' },
      { key: 'GPS Signals', value: 'L1 C/A, L1C, P1, P2, L2C, L5' },
      { key: 'GLONASS Signals', value: 'L1 C/A, P1, P2, L2 C/A, L3' },
      { key: 'Galileo Signals', value: 'E1, E5, E5A, E5B, E6' },
      { key: 'BeiDou Signals', value: 'B1, B1C, B2B, B2, B2A, B3' },
      { key: 'QZSS Signals', value: 'L1C C/A, L1C, L2C, L5, L6, L1S, L1Sb, L5S' },
      { key: 'SBAS Signals', value: 'L1, L5' },
      { key: 'NavIC Signals', value: 'L1, L5' },
      { key: 'L-Band', value: '1525–1560 MHz' },
      { key: 'Autonomous Accuracy (H)', value: '1.000 m' },
      { key: 'Autonomous Accuracy (V)', value: '1.500 m' },
      { key: 'SBAS Accuracy (H)', value: '0.500 m' },
      { key: 'SBAS Accuracy (V)', value: '0.850 m' },
      { key: 'DGPS Accuracy (H)', value: '0.250 m' },
      { key: 'DGPS Accuracy (V)', value: '0.500 m' },
      { key: 'JStar (PPP) Accuracy (H)', value: '0.025 m' },
      { key: 'JStar (PPP) Accuracy (V)', value: '0.050 m' },
      { key: 'RTK Accuracy (H)', value: '0.008 m + 1 ppm' },
      { key: 'RTK Accuracy (V)', value: '0.015 m + 1 ppm' },
      { key: 'Network RTK Accuracy (H)', value: '0.008 m + 0.5 ppm' },
      { key: 'Network RTK Accuracy (V)', value: '0.015 m + 0.5 ppm' },
      { key: 'Static Accuracy (H)', value: '0.003 m + 0.1 ppm' },
      { key: 'Static Accuracy (V)', value: '0.004 m + 0.4 ppm' },
      { key: 'Tilt-Compensated RTK', value: 'RTK + 5 mm + 0.5 mm/° tilt, up to 30°' },
      { key: 'Cold Start', value: '<35 s' },
      { key: 'Warm Start', value: '<5 s' },
      { key: 'Reacquisition', value: '<1 s' },
      { key: 'RTK Initialization', value: '2–6 s' },
      { key: 'Output Rate', value: 'Up to 100 Hz' },
      { key: 'Bluetooth', value: 'v5.1 Class 2' },
      { key: 'Wi-Fi', value: '802.11 ac/a/b/g/n, 2.4 & 5 GHz' },
      { key: 'UHF Radio', value: '406–470 MHz; up to 2W power' },
      { key: 'Cellular', value: 'LTE / DC-HSPA+; Class 10 microSIM' },
      { key: 'USB', value: 'USB 2.0 High Speed, Type-C' },
      { key: 'Internal Memory', value: '64 GB' },
      { key: 'Input Voltage', value: '+10 to +30 VDC' },
      { key: 'Battery', value: '2 × Li-Ion (7.2V, 5.9 Ah)' },
      { key: 'Operating Time', value: 'Up to 18 hours' },
      { key: 'Dimensions', value: '178 × 96 × 178 mm' },
      { key: 'Weight', value: '1.7 kg / 1.82 kg (with modem antenna)' },
      { key: 'Operating Temperature', value: '-40°C to +65°C' },
      { key: 'Storage Temperature', value: '-45°C to +85°C' },
      { key: 'Humidity', value: '100% Condensing' },
      { key: 'Shock & Vibration', value: 'MIL-STD-810H; survives 2 m drop' },
      { key: 'Ingress Protection', value: 'IP68' },
    ],
  },

  {
    slug: 't3-nr',
    // Source: T3-NR_MII.pdf — visual reading (image-based PDF)
    specs: [
      { key: 'Channels', value: '874 total' },
      { key: 'GPS Signals', value: 'L1 C/A, L1C, P1, P2, L2C, L5' },
      { key: 'GLONASS Signals', value: 'L1 C/A, P1, P2, L2 C/A, L3' },
      { key: 'Galileo Signals', value: 'E1, E5 (a/b), E6' },
      { key: 'BeiDou Signals', value: 'B1I, B1C, B2, B2a, B2b' },
      { key: 'QZSS Signals', value: 'L1C C/A, L1C, L2C, L5, L6, L1S, L1Sb, L5S' },
      { key: 'SBAS Signals', value: 'L1' },
      { key: 'NavIC Signals', value: 'L1, L5' },
      { key: 'L-Band', value: '1525–1560 MHz' },
      { key: 'Autonomous Accuracy (H/V)', value: '1.0 m / 1.5 m' },
      { key: 'SBAS Accuracy (H/V)', value: '0.5 m / 0.85 m' },
      { key: 'DGPS Accuracy (H/V)', value: '0.25 m / 0.5 m' },
      { key: 'PPP (J-Star) Accuracy (H/V)', value: '0.025 m / 0.05 m' },
      { key: 'RTK Accuracy (H/V)', value: '0.008 ± 1 ppm / 0.015 ± 1 ppm' },
      { key: 'Network RTK Accuracy (H/V)', value: '0.008 ± 0.5 ppm / 0.015 ± 0.5 ppm' },
      { key: 'Static / Fast Static (H/V)', value: '0.003 ± 0.1 ppm / 0.035 ± 0.4 ppm' },
      { key: 'Tilt RTK', value: 'RTK ± 5 mm + 0.5 mm/° tilt (up to 30°)' },
      { key: 'Cold Start', value: '<35 s' },
      { key: 'Warm Start', value: '<5 s' },
      { key: 'Reacquisition', value: '<1 s' },
      { key: 'RTK Fix', value: '2–6 s' },
      { key: 'Refresh Rate (Position/Heading)', value: 'Up to 10 Hz' },
      { key: 'Refresh Rate (Raw Data)', value: 'Up to 100 Hz' },
      { key: 'Wi-Fi', value: '2.4 & 5 GHz (802.11 a/b/g/n)' },
      { key: 'Bluetooth', value: 'v5.1, Class 2' },
      { key: 'USB', value: 'USB 2.0 micro-B (Host/Device)' },
      { key: 'GNSS Antenna', value: 'Internal microstrip, flat ground plane' },
      { key: 'Internal Memory', value: '64 GB internal flash' },
      { key: 'LED Indicators', value: 'Battery, Power, Bluetooth, Wi-Fi, Satellite Lock, Mode, Recording' },
      { key: 'Buttons', value: 'Power On/Off, Record On/Off' },
      { key: 'Connector', value: '3.5 mm jack' },
      { key: 'Input Voltage', value: '10–30 VDC' },
      { key: 'Battery', value: 'Rechargeable Li-Ion (637 Wh)' },
      { key: 'Operating Time', value: 'Up to 25 hours' },
      { key: 'Housing', value: 'Plastic top, metal base' },
      { key: 'Dimensions', value: '132 × 85 × 61 mm' },
      { key: 'Weight', value: '0.63 kg (1.39 lbs)' },
      { key: 'Operating Temperature', value: '-40°C to +60°C' },
      { key: 'Storage Temperature', value: '-45°C to +85°C' },
      { key: 'Humidity', value: '100% condensing' },
      { key: 'Shock & Vibration', value: 'MIL-STD-810H, survives 2 m drop' },
      { key: 'Ingress Protection', value: 'IP68' },
    ],
  },

  {
    slug: 'triumph-1m',
    // Source: TRIUMPH-1M_Datasheet_white_2page_v1_10.16.22.pdf
    specs: [
      { key: 'Number of Channels', value: '864' },
      { key: 'GPS Signals', value: 'L1 C/A, L1C (P+D), P2, L2C (L+M), L5 (I+Q)' },
      { key: 'GLONASS Signals', value: 'L1 C/A, P1, P2, L2C, L3 (I+Q)' },
      { key: 'Galileo Signals', value: 'E1 (B+C), E5A (I+Q), E5B (I+Q), AltBoc' },
      { key: 'BeiDou Signals', value: 'B1, B1C(P+D), B5A(I+Q), B2, B5B(I+Q)' },
      { key: 'QZSS Signals', value: 'L1 C/A, L1C(P+D), L1S, L2C(L+M), L5(I+Q)' },
      { key: 'SBAS Signals', value: 'L1, L5' },
      { key: 'IRNSS Signals', value: 'L5' },
      { key: 'Autonomous Accuracy', value: '<2 m' },
      { key: 'DGPS Accuracy', value: '<0.25 m (post-processing); <0.5 m (real-time)' },
      { key: 'RTK Accuracy (H)', value: '0.008 m + 1 ppm' },
      { key: 'RTK Accuracy (V)', value: '0.015 m + 1 ppm' },
      { key: 'Static Accuracy (H)', value: '0.003 m + 0.1 ppm' },
      { key: 'Static Accuracy (V)', value: '0.004 m + 0.4 ppm' },
      { key: 'Cold Start', value: '<35 s' },
      { key: 'Hot Start', value: '<5 s' },
      { key: 'Reacquisition', value: '<1 s' },
      { key: 'Cellular', value: 'MicroSIM; 4G LTE, HSPA+, HSDPA, HSUPA, WCDMA, GSM, GPRS, EDGE, EV-DO, 1xRTT CDMA' },
      { key: 'Radio', value: 'Internal 406–470 MHz (optional 902–928 / 868–870 MHz), 1 W' },
      { key: 'GNSS Antenna Type', value: 'Integrated Microstrip (Zero Centered)' },
      { key: 'Ground Plane', value: 'Flat' },
      { key: 'Internal Data Storage', value: '16 GB' },
      { key: 'Data Formats', value: 'JPS, RTCM SC104 v.2.x and 3.x, CMR' },
      { key: 'Output Formats', value: 'NMEA 0183 v.2.x and 3.x, BINEX' },
      { key: 'Interfaces', value: 'USB, Ethernet, RS-232 (Port A & B), External Power/Charging' },
      { key: 'Card Slots', value: 'microSD up to 128 GB; up to 2 microSIM' },
      { key: 'Input Voltage', value: '+10 to +30 VDC' },
      { key: 'Battery', value: 'Two internal Li-Ion (7.2V, 5.9 Ah each)' },
      { key: 'Operating Time', value: 'Up to 18 hours' },
      { key: 'Material', value: 'Molded magnesium alloy and plastic' },
      { key: 'Operating Temperature', value: '-40°C to +65°C' },
      { key: 'Storage Temperature', value: '-45°C to +85°C' },
      { key: 'Humidity', value: '100% Condensing' },
      { key: 'Dimensions', value: '178 × 96 × 178 mm' },
      { key: 'Weight', value: '1.7 kg / 1.82 kg (with modem antenna)' },
      { key: 'Ingress Protection', value: 'IP67' },
      { key: 'Drop Resistance', value: 'Survives a 2 m drop' },
      { key: 'Vibration', value: 'MIL-STD-810H (Method 516.8)' },
      { key: 'Shock', value: 'MIL-STD-810H (Method 514.8)' },
    ],
  },

  {
    slug: 'triumph-2',
    // Source: 20230222_TRIUMPH-2_Datasheet_white_2page-v1-2.22.23.pdf
    specs: [
      { key: 'Number of Channels', value: '216' },
      { key: 'GPS Signals', value: 'L1 C/A, P1, P2, L1C (P+D), L2C (L+M)' },
      { key: 'GLONASS Signals', value: 'L1 C/A, L2C, P1, P2' },
      { key: 'Galileo Signals', value: 'E1 (B+C)' },
      { key: 'BeiDou Signals', value: 'B1, B1C (P+D)' },
      { key: 'QZSS Signals', value: 'L1 C/A, L1C (P+D), L1S, L2C (L+M)' },
      { key: 'SBAS Signals', value: 'L1' },
      { key: 'Autonomous Accuracy', value: '<2.000 m' },
      { key: 'SBAS Accuracy', value: '<1.000 m' },
      { key: 'DGPS Accuracy', value: '<0.500 m' },
      { key: 'RTK Accuracy (H)', value: '0.010 m + 1 ppm' },
      { key: 'RTK Accuracy (V)', value: '0.015 m + 1 ppm' },
      { key: 'Static Accuracy (H)', value: '0.003 m + 0.5 ppm' },
      { key: 'Static Accuracy (V)', value: '0.005 m + 0.4 ppm' },
      { key: 'Cold Start', value: '<35 s' },
      { key: 'Warm Start', value: '<5 s' },
      { key: 'Reacquisition', value: '<1 s' },
      { key: 'GNSS Antenna Type', value: 'Internal, NGS calibrated, Microstrip (Zero Centered)' },
      { key: 'Internal Memory', value: 'Up to 2 GB, non-removable' },
      { key: 'Raw Data Recording', value: 'Up to 100 Hz' },
      { key: 'USB', value: 'USB 2.0 Full-Speed' },
      { key: 'Wi-Fi', value: 'IEEE 802.11 b/g' },
      { key: 'Bluetooth', value: 'V2.0+EDR Class 2, SPP Slave Profile' },
      { key: 'External Power Port', value: '1 port, 10–16 VDC' },
      { key: 'Battery', value: 'Internal Li-Ion (7.2V, 8.85 Ah)' },
      { key: 'Operating Time', value: '25 hours' },
      { key: 'Operating Temperature', value: '-40°C to +60°C' },
      { key: 'Storage Temperature', value: '-45°C to +85°C' },
      { key: 'Humidity', value: '100% condensing' },
      { key: 'Dimensions', value: '85 × 61 × 132 mm' },
      { key: 'Weight', value: '0.56 kg (1.23 lbs)' },
    ],
  },

  {
    slug: 'triumph-3',
    // Source: Triumph-3_Datasheet_240520.pdf
    specs: [
      { key: 'Number of Channels', value: '874' },
      { key: 'GPS Signals', value: 'L1 C/A, L1C (P+D), P1, P2, L2C (L+M), L5 (I+Q)' },
      { key: 'GLONASS Signals', value: 'L1 C/A, P1, P2, L2C, L3 (I+Q)' },
      { key: 'Galileo Signals', value: 'E1 (B+C), CBOC, E5A (I+Q), E5B (I+Q), AltBoc, E6 (B+C)' },
      { key: 'BeiDou Signals', value: 'B1, B1C (P+D), TMBOC, B2B(I+Q), B2, B2A(I+Q), AltBoc, B3' },
      { key: 'QZSS Signals', value: 'L1C C/A, L1C (P+D), L1S, L1Sb, L2C (L+M), L5 (I+Q), L5S, L6' },
      { key: 'SBAS Signals', value: 'L1, L5' },
      { key: 'NavIC Signals', value: 'L1, L5' },
      { key: 'Autonomous Accuracy', value: '<2 m' },
      { key: 'DGPS Accuracy', value: '<0.5 m' },
      { key: 'J-Star Accuracy (H)', value: '0.100 m' },
      { key: 'J-Star Accuracy (V)', value: '0.200 m' },
      { key: 'RTK Accuracy (H)', value: '0.008 m + 1 ppm' },
      { key: 'RTK Accuracy (V)', value: '0.015 m + 1 ppm' },
      { key: 'Network RTK Accuracy (H)', value: '0.008 m + 0.5 ppm' },
      { key: 'Network RTK Accuracy (V)', value: '0.015 m + 0.5 ppm' },
      { key: 'Tilt-Compensated RTK', value: 'RTK + 5 mm + 0.5 mm/° tilt, up to 30°' },
      { key: 'Static Accuracy (H)', value: '0.003 m + 0.1 ppm' },
      { key: 'Static Accuracy (V)', value: '0.004 m + 0.4 ppm' },
      { key: 'Cold Start', value: '<35 s' },
      { key: 'Hot Start', value: '<5 s' },
      { key: 'Reacquisition', value: '<1 s' },
      { key: 'RTK Initialization', value: '2 to 6 s' },
      { key: 'Cellular', value: '4G LTE Regional Modems (AMER/EMEA)' },
      { key: 'UHF Radio', value: '406–470 MHz, 1W max, up to 38,400 bps; optional 902–928/868–870 MHz' },
      { key: 'NTRIP Caster', value: '5 mount points, up to 256 clients' },
      { key: 'Ethernet', value: '10BASE-T/100BASE-TX' },
      { key: 'USB', value: 'USB 2.0 Host (A) / Device (micro-B)' },
      { key: 'Wi-Fi', value: '802.11 a, b, g, n, d, e, i' },
      { key: 'Bluetooth', value: '5.1 BR/EDR & LE Dual Mode' },
      { key: 'Card Slots', value: 'microSIM; microSD up to 128 GB, Class 10' },
      { key: 'Internal Memory', value: '21 GB' },
      { key: 'Raw Data Recording Rate', value: 'Up to 100 Hz' },
      { key: 'Input Voltage', value: '10–40 VDC' },
      { key: 'Battery', value: 'Rechargeable Li-Ion, 88.7 Wh' },
      { key: 'Operating Time', value: '12 hours' },
      { key: 'Material', value: 'Molded magnesium alloy and plastic' },
      { key: 'Operating Temperature', value: '-40°C to +60°C' },
      { key: 'Storage Temperature', value: '-20°C to +85°C' },
      { key: 'Humidity', value: 'MIL-STD-810D Method 507.2, 95% RH' },
      { key: 'Vibration', value: 'MIL-STD-810G 514.7' },
      { key: 'Shock', value: 'MIL-STD-810D 516.3' },
      { key: 'Dimensions', value: '182 × 96 × 78 mm' },
      { key: 'Weight', value: '1.25 kg' },
      { key: 'Ingress Protection', value: 'IP67' },
      { key: 'Drop Resistance', value: 'Survives a 2 m drop' },
    ],
  },

  {
    slug: 'triumph-ls-plus',
    // Source: TRIUMPH-LS_PLUS_Datasheet.pdf
    specs: [
      { key: 'Number of Channels', value: '874' },
      { key: 'GPS Signals', value: 'L1 C/A, L1C (P+D), P1, P2, L2C (L+M), L5 (I+Q)' },
      { key: 'GLONASS Signals', value: 'L1 C/A, P1, P2, L2C, L3 (I+Q)' },
      { key: 'Galileo Signals', value: 'E1 (B+C), E5A (I+Q), E5B (I+Q), AltBoc, E6 (B+C)' },
      { key: 'BeiDou Signals', value: 'B1, B1-2, B1C (P+D), B2, B3, B5A (I+Q), B5B (I+Q)' },
      { key: 'QZSS Signals', value: 'L1 C/A, L1C (P+D), L2C (L+M), L5 (I+Q), SAIF, LEX (P+D)' },
      { key: 'SBAS Signals', value: 'L1, L5' },
      { key: 'IRNSS Signals', value: 'L5' },
      { key: 'Autonomous Accuracy', value: '<2.000 m' },
      { key: 'SBAS Accuracy', value: '<1.000 m' },
      { key: 'DGPS Accuracy', value: '<0.500 m' },
      { key: 'RTK Accuracy (H)', value: '0.004 m + 1 ppm' },
      { key: 'RTK Accuracy (V)', value: '0.007 m + 1 ppm' },
      { key: 'Static Accuracy (H)', value: '0.003 m + 0.1 ppm' },
      { key: 'Static Accuracy (V)', value: '0.004 m + 0.4 ppm' },
      { key: 'Cold Start', value: '<35 s' },
      { key: 'Hot Start', value: '<1 s' },
      { key: 'RTK Initialization Reliability', value: '99.99%' },
      { key: 'Cellular', value: '4G LTE, HSPA+, HSDPA, HSUPA, WCDMA, GSM, GPRS, EDGE, EV-DO, 1xRTT CDMA' },
      { key: 'UHF Radio', value: 'Internal 406–470 MHz, 1W' },
      { key: 'ISM Radio', value: '902–928 / 868–870 MHz, 1W (optional)' },
      { key: 'Wi-Fi', value: 'IEEE 802.11 b/g/n/d/e' },
      { key: 'Bluetooth', value: 'V2.1+EDR, Class 2' },
      { key: 'Ethernet', value: '10BASE-T / 100BASE-TX' },
      { key: 'USB', value: 'Host & Device (2 ports), RS-232 up to 406800 bps' },
      { key: 'SIM Slots', value: '2 microSIM slots' },
      { key: 'Input Voltage', value: '10–30 VDC' },
      { key: 'Battery', value: 'Li-Ion 85 Wh, Rechargeable' },
      { key: 'Operating Time', value: '25 hours per charge' },
      { key: 'Material', value: 'Molded magnesium alloy and plastic' },
      { key: 'Operating Temperature', value: '-40°C to +55°C' },
      { key: 'Storage Temperature', value: '-20°C to +45°C' },
      { key: 'Humidity', value: '100% Condensing' },
      { key: 'Vibration', value: 'MIL STD 810G & 810F Certified' },
      { key: 'Dimensions', value: '183 × 124 × 106 mm' },
      { key: 'Weight', value: '2.1 kg (4.63 lbs)' },
      { key: 'Ingress Protection', value: 'IP67' },
    ],
  },

  // -------------------------------------------------------------------------
  // GNSS ANTENNAS
  // -------------------------------------------------------------------------

  {
    slug: 'agant-3s',
    // Source: AgAnt-3S_Datasheet-2.pdf
    specs: [
      { key: 'Total Channels', value: '874 All-In-View' },
      { key: 'GPS Signals', value: 'C/A, L1C(P+D), P1, P2, L2C (L+M), L5(I+Q)' },
      { key: 'GLONASS Signals', value: 'C/A, P1, P2, L2C, L3(I+Q)' },
      { key: 'Galileo Signals', value: 'E1(B+C), E5A(I+Q), E5B(I+Q), AltBoc, E6(B+C)' },
      { key: 'BeiDou Signals', value: 'B1, B1C(P+D), B2B(I+Q), B2, B2A(I+Q), AltBoc, B3' },
      { key: 'QZSS Signals', value: 'C/A, L1C(P+D), L2C(L+M), L5(I+Q), L6, L1S, L1Sb, L5S' },
      { key: 'IRNSS Signals', value: 'L5' },
      { key: 'SBAS Signals', value: 'L1, L5(P+D)' },
      { key: 'Autonomous Accuracy', value: '<2 m' },
      { key: 'Static Accuracy (H)', value: '0.3 cm + 0.1 ppm × baseline' },
      { key: 'Static Accuracy (V)', value: '0.35 cm + 0.4 ppm × baseline' },
      { key: 'Kinematic Accuracy (H)', value: '1 cm + 1 ppm × baseline' },
      { key: 'Kinematic Accuracy (V)', value: '1.5 cm + 1 ppm × baseline' },
      { key: 'DGPS Accuracy', value: '<0.25 m (post-processing); <0.5 m (real-time)' },
      { key: 'Cold / Warm Start', value: '<35 s / <5 s' },
      { key: 'Reacquisition', value: '<1 s' },
      { key: 'GNSS Antenna Type', value: 'Integrated Microstrip (Zero Centered)' },
      { key: 'Ground Plane', value: 'Flat' },
      { key: 'Communication Ports', value: 'CAN 2.0 (1 Mbps); RS232/RS422 up to 460.8 kbps; USB 2.0 High-Speed' },
      { key: 'Internal Memory', value: 'Up to 16 GB' },
      { key: 'Raw Data Recording', value: 'Up to 100 Hz' },
      { key: 'Input Voltage', value: '+4.5 to +35 VDC' },
      { key: 'Power Consumption (All-In-View)', value: '2.1–2.3 W' },
      { key: 'Enclosure', value: 'Aluminum and plastic, IP67' },
      { key: 'Mounting', value: '5/8-11 or 1-14 inch; 4 holes M5' },
      { key: 'Operating Temperature', value: '-40°C to +80°C' },
      { key: 'Storage Temperature', value: '-40°C to +85°C' },
      { key: 'Humidity', value: '100% condensing' },
      { key: 'Drop Resistance', value: 'Survives a 2 m drop' },
      { key: 'Dimensions', value: '140 × 140 × 62 mm' },
      { key: 'Weight', value: '0.461 kg (1.016 lbs)' },
    ],
  },

  {
    slug: 'airant',
    // Source: AirAnt_Datasheet.pdf-1.pdf
    specs: [
      { key: 'Frequency (L1)', value: '1559–1610 MHz' },
      { key: 'Frequency (L2/L5)', value: '1164–1253 MHz' },
      { key: 'Supported Signals', value: 'GPS L1/L2/L5, GLONASS L1/L2/L3, Galileo E1/E2/E5ab, BeiDou B1/B2, WAAS L1/L5, EGNOS, MSAS, GAGAN, QZSS L1/L2/L5' },
      { key: 'Antenna Gain (L1)', value: '4.0 dB typical (1559–1610 MHz)' },
      { key: 'Antenna Gain (L2)', value: '3.0 dB typical (1164–1253 MHz)' },
      { key: 'Axial Ratio', value: '3.0 dB max' },
      { key: 'Output Impedance', value: '50 Ohm' },
      { key: 'VSWR', value: '2.0:1' },
      { key: 'LNA Gain', value: '3.0 dB max' },
      { key: 'Noise Figure (L1)', value: '2.5 dB max' },
      { key: 'Noise Figure (L2)', value: '2.0 dB max' },
      { key: 'DC Voltage', value: '4.7–12.0 VDC, 85 mA @ 5.0V typical' },
      { key: 'Antenna Type', value: 'Microstrip' },
      { key: 'Connector', value: 'TNC' },
      { key: 'Weight', value: '320 g' },
      { key: 'Dimensions', value: '120 × 74 × 44 mm' },
      { key: 'Enclosure', value: 'Radome: GE PEI+40%GF; Base: Aluminum' },
      { key: 'Color', value: 'White' },
      { key: 'Mounting', value: '4 holes' },
      { key: 'Operating Temperature', value: '-50°C to +85°C' },
      { key: 'Storage Temperature', value: '-60°C to +85°C' },
      { key: 'Humidity', value: 'Waterproof' },
    ],
  },

  {
    slug: 'grant-series',
    // Source: GrAnt-3LS_Datasheet.pdf + GrAnt-3L_Datasheet_May24-1.pdf + GrAnt-G2T-JS-HPO_Datasheet26.pdf
    // Representative specs covering the full series (GrAnt-3LS, GrAnt-3L, GrAnt-G2T-JS-HPO)
    specs: [
      { key: 'GPS Signals', value: 'L1 / L2 / L5' },
      { key: 'GLONASS Signals', value: 'L1 / L2 / L3' },
      { key: 'Galileo Signals', value: 'E1 / E5a / E5b / E6' },
      { key: 'BeiDou Signals', value: 'B1 / B1C / B2 / B2A / B2B / B3' },
      { key: 'QZSS Signals', value: 'L1 / L2 / L5 / L6' },
      { key: 'SBAS Signals', value: 'L1 / L5' },
      { key: 'NavIC Signals', value: 'L1 / L5 / S' },
      { key: 'L-Band', value: '1520–1540 MHz' },
      { key: 'Antenna Gain (L1)', value: '5.0 dB typical (1551–1614 MHz)' },
      { key: 'Antenna Gain (L-Band)', value: '4.0 dB typical (1520–1540 MHz)' },
      { key: 'Antenna Gain (L2/L5)', value: '4.0 dB typical (1164–1300 MHz)' },
      { key: 'Axial Ratio', value: '3.0 dB max' },
      { key: 'Impedance', value: '50 Ohm' },
      { key: 'VSWR', value: '2.0:1' },
      { key: 'LNA Gain', value: '32±2 dB; 40±2 dB (optional)' },
      { key: 'Noise Figure', value: '1.7 dB typical' },
      { key: 'Connector', value: 'TNC; N-type (optional)' },
      { key: 'Mounting', value: '5/8 × 11 inch; or 4 holes M5' },
      { key: 'Input Voltage', value: '+3.0 to +15 VDC' },
      { key: 'Power Consumption', value: '1.3 W max (GrAnt-3LS); 0.68 W (GrAnt-3L)' },
      { key: 'Current', value: '90 mA @ 5.0V typical (GrAnt-3LS); 45 mA @ 5.0V (GrAnt-3L)' },
      { key: 'Operating Temperature', value: '-45°C to +85°C' },
      { key: 'Storage Temperature', value: '-50°C to +85°C' },
      { key: 'Humidity', value: '100% non-condensing' },
      { key: 'Ingress Protection', value: 'IP68' },
      { key: 'Shock', value: 'MIL-STD-810H Method 516.8 Procedure I' },
      { key: 'Vibration', value: 'MIL-STD-810H Method 514.8 Procedure I' },
      { key: 'Dimensions', value: '140 × 140 × 62 mm' },
      { key: 'Weight', value: '515–543 g (model dependent)' },
      { key: 'Material', value: 'Radome: ABS; Base: Aluminum' },
    ],
  },

  {
    slug: 'ringant-s',
    // Source: RingAnt-S_Datasheet-2.pdf
    specs: [
      { key: 'GPS Signals', value: 'L1, L2/L5' },
      { key: 'GLONASS Signals', value: 'L1, L2/L3' },
      { key: 'Galileo Signals', value: 'E1, E5A/E5B/E6' },
      { key: 'BeiDou Signals', value: 'B1/B1C, B2A/B2B/B3' },
      { key: 'QZSS Signals', value: 'L1, L2/L5/L6' },
      { key: 'SBAS Signals', value: 'L1, L5' },
      { key: 'NavIC Signals', value: 'L1/S, L5' },
      { key: 'L-Band', value: '1520–1559 MHz' },
      { key: 'Antenna Gain (L1, Zenith)', value: '5 dB typical' },
      { key: 'Antenna Gain (L2/L5, Zenith)', value: '4 dB typical' },
      { key: 'Axial Ratio', value: '3.0 dB max' },
      { key: 'Impedance', value: '50 Ohm' },
      { key: 'VSWR', value: '2.0:1' },
      { key: 'LNA Gain', value: '32±2 dB; 40±2 dB (optional)' },
      { key: 'Noise Figure', value: '1.7 dB typical; 2.3 dB typical for S-Band' },
      { key: 'Antenna Type', value: 'Microstrip' },
      { key: 'Connector', value: 'TNC; N-type (optional)' },
      { key: 'Mounting', value: '5/8-11; 1-14 (optional)' },
      { key: 'Input Voltage', value: '+3.0 to +15 VDC' },
      { key: 'Power Consumption', value: '1.3 W max' },
      { key: 'Current', value: '90 mA @ 5.0V typical' },
      { key: 'Operating Temperature', value: '-45°C to +85°C' },
      { key: 'Storage Temperature', value: '-50°C to +85°C' },
      { key: 'Humidity', value: 'Waterproof, 100% non-condensing, IP68' },
      { key: 'Dimensions', value: 'Ø326 mm, h = 88 mm' },
      { key: 'Weight', value: '2.8 kg' },
      { key: 'Material', value: 'Radome: ABS; Base: Aluminum' },
    ],
  },

  {
    slug: 'ringant-series',
    // Source: RingAnt-3L_Datasheet.pdf + RingAnt-DMT_Datasheet.pdf
    // Representative specs covering the series (RingAnt-3L, RingAnt-DMT)
    specs: [
      { key: 'GPS Signals', value: 'L1/L2/L2C/L5' },
      { key: 'GLONASS Signals', value: 'L1/L2/L3' },
      { key: 'Galileo Signals', value: 'E1/E2/E5ab/E6' },
      { key: 'BeiDou Signals', value: 'B1/B2/B3' },
      { key: 'QZSS Signals', value: 'L1/L2/L2C/L5/LEX' },
      { key: 'SBAS Signals', value: 'L1/L5' },
      { key: 'NavIC Signals', value: 'L1, L5' },
      { key: 'IRNSS Signals', value: 'L5' },
      { key: 'L-Band', value: '1525–1614 MHz (RingAnt-3L); 1539–1559 MHz (RingAnt-DMT)' },
      { key: 'Antenna Gain', value: '5.0 dB typical (L1); 4.0 dB typical (L2/L5)' },
      { key: 'Axial Ratio', value: '3.0 dB max; 0.3 dB max at Zenith (RingAnt-DMT)' },
      { key: 'LNA Gain', value: '32±2 dB (RingAnt-3L); 50 dB (RingAnt-DMT)' },
      { key: 'Noise Figure', value: '1.7 dB typical (RingAnt-3L); 2.0 dB typical (RingAnt-DMT)' },
      { key: 'VSWR', value: '2.0:1 (RingAnt-3L); 1.5:1 (RingAnt-DMT)' },
      { key: 'Phase Center Variation', value: '<1.0 mm (RingAnt-DMT)' },
      { key: 'Connector', value: 'TNC; N-type female (RingAnt-DMT)' },
      { key: 'Mounting', value: '5/8 × 11 inch (RingAnt-3L); 5/8" × 11 TPI female (RingAnt-DMT)' },
      { key: 'Input Voltage', value: '+3.0 to +15 VDC (RingAnt-3L); 2.7 to 24 VDC (RingAnt-DMT)' },
      { key: 'Power Consumption', value: '0.68 W (RingAnt-3L)' },
      { key: 'Current', value: '45 mA @ 5.0V typical (RingAnt-3L); 45 mA (RingAnt-DMT)' },
      { key: 'Operating Temperature', value: '-45°C to +85°C (RingAnt-3L); -55°C to +85°C (RingAnt-DMT)' },
      { key: 'Storage Temperature', value: '-50°C to +85°C (RingAnt-3L); -55°C to +95°C (RingAnt-DMT)' },
      { key: 'Humidity', value: '100% non-condensing' },
      { key: 'Ingress Protection', value: 'IP68 (RingAnt-3L); IP67 (RingAnt-DMT)' },
      { key: 'Vibration', value: 'MIL-STD-810H Method 514.8 (RingAnt-3L); MIL-STD-810E (RingAnt-DMT)' },
      { key: 'Shock', value: 'MIL-STD-810H Method 516.8 (RingAnt-3L)' },
      { key: 'Dimensions (RingAnt-3L)', value: 'Ø326 mm, h = 88 mm; 2.7 kg' },
      { key: 'Dimensions (RingAnt-DMT)', value: '378 × 150.8 mm (Dia. × H); 5.4 kg' },
      { key: 'Material', value: 'Radome: ABS; Base: Aluminum' },
      { key: 'Compliance (RingAnt-DMT)', value: 'IPC-A-610, FCC, RED/CE Mark, RoHS, REACH' },
    ],
  },

  // -------------------------------------------------------------------------
  // DATA COLLECTORS
  // -------------------------------------------------------------------------

  // janak-fieldpad — only image file (JPG) available, no PDF. [SKIP]

  {
    slug: 'js-10-pro',
    // Source: JS-10-Pro-3.pdf
    specs: [
      { key: 'Operating System', value: 'Android 11 / Windows 10' },
      { key: 'Processor', value: 'Qualcomm Snapdragon Octa-core Kryo 260 (Android) / Intel Pentium N4200 (Windows)' },
      { key: 'RAM', value: '6 GB LPDDR4 (Android) / 8 GB LPDDR4 (Windows)' },
      { key: 'Storage', value: '64 GB eMMC (Android) / 128 or 256 GB (Windows)' },
      { key: 'Display', value: 'Multi-Touch WXGA IPS LCD, 1280 × 800, Dragontrail Glass' },
      { key: 'GPU', value: 'Qualcomm Adreno 512 / Intel HD Graphics' },
      { key: 'Camera (Rear)', value: '16 MP' },
      { key: 'Camera (Front)', value: '2 MP' },
      { key: 'Sensors', value: 'Ambient Light Sensor, Compass, Accelerometer, Gyroscope' },
      { key: 'Cellular', value: '4G LTE (Snapdragon X12 / AirPrime EM7455 or EM7430)' },
      { key: 'Wi-Fi', value: '802.11 a/b/g/n/ac, 2.4 GHz and 5 GHz' },
      { key: 'Bluetooth', value: 'v5.0 + EDR, Class 1.5, BLE support' },
      { key: 'USB', value: 'USB-C USB 3.1 OTG × 1 / USB 3.0 × 1' },
      { key: 'GPS', value: 'Qualcomm SDR660 GNSS receiver' },
      { key: 'Battery', value: 'Li-Ion 43.2 Whr, removable, field changeable' },
      { key: 'Operating Time', value: '10–12 hours' },
      { key: 'Power Input', value: '12V DC' },
      { key: 'Operating Temperature', value: '-20°C to +50°C' },
      { key: 'Storage Temperature', value: '-30°C to +70°C' },
      { key: 'Humidity', value: '95% non-condensing' },
      { key: 'Dimensions', value: '228 × 145 × 16.5 mm' },
      { key: 'Weight', value: '630 g (with battery)' },
      { key: 'Ingress Protection', value: 'IP68' },
      { key: 'Drop Resistance', value: '1.5 m multi-drop to concrete' },
      { key: 'Regulatory', value: 'FCC, CE, RoHS 2, EN62368 Safety, Industry Canada' },
    ],
  },

  {
    slug: 'js-10-rugged-tablet',
    // Source: JS-10-DataSheet.pdf
    specs: [
      { key: 'Operating System', value: 'Android 10' },
      { key: 'Processor', value: 'Qualcomm SDM 690 up to 2.0 GHz Octa-core' },
      { key: 'RAM / ROM', value: '4 GB / 64 GB' },
      { key: 'GPU', value: 'Adreno 619L' },
      { key: 'Display', value: '8 inch HD IPS (16:10, 1200 × 1920), 550 nits' },
      { key: 'Touch Panel', value: 'Capacitive (10 Points Multi-touch)' },
      { key: 'Battery', value: '3.7V Li-ion 8,500 mAh' },
      { key: 'Expansion Slot', value: '1 × SIM Slot, 1 × TF Card Slot (up to 256 GB)' },
      { key: 'Interface', value: '1 × USB 3.0 Type-A, 1 × Type-C, 1 × HDMI 1.4a, 1 × ø3.5 mm DC Jack, 12 Pin Pogo' },
      { key: 'Camera (Front)', value: '5 MP' },
      { key: 'Camera (Rear)', value: '13 MP (AF with Flash)' },
      { key: 'Sensors', value: 'Ambient Light Sensor, Virtual Gyro, Compass' },
      { key: 'WWAN', value: '5G NR; 4G TDD-LTE; 4G FDD-LTE; 3G TD-SCDMA, WCDMA; 3G EVDO, CDMA; 2G GSM' },
      { key: 'Wi-Fi', value: '802.11 a/b/g/n/ac (Dual Band 2.4G/5G)' },
      { key: 'Bluetooth', value: '4.1' },
      { key: 'GPS', value: 'GPS L1 & L5 / GLONASS' },
      { key: 'Power', value: 'AC100V–240V, 50/60 Hz, Output DC 5V/3A' },
      { key: 'Dimensions', value: '225.6 × 144.6 × 21.5 mm' },
      { key: 'Weight', value: 'About 715 g' },
      { key: 'Operating Temperature', value: '-20°C to +65°C' },
      { key: 'Storage Temperature', value: '-30°C to +70°C' },
      { key: 'Humidity', value: '95% Non-condensing' },
      { key: 'Ingress Protection', value: 'IP67' },
      { key: 'Drop Resistance', value: '1.22 m' },
      { key: 'Regulatory', value: 'KC, CE' },
    ],
  },

  {
    slug: 'js-10a',
    // Source: JS-10A_MII-1.pdf — visual reading (image-based PDF)
    specs: [
      { key: 'Operating System', value: 'Android 15 (GMS)' },
      { key: 'Processor', value: '2.0 GHz ARM Octa-core' },
      { key: 'RAM / ROM', value: '8 GB / 128 GB' },
      { key: 'GPU', value: 'Adreno 619L' },
      { key: 'Display', value: '8 inch HD IPS (16:10, 1200 × 1920), 700 nits' },
      { key: 'Touch Panel', value: 'Capacitive Multi-touch, Corning Gorilla Glass' },
      { key: 'Battery', value: '3.7V Li-ion 8,500 mAh, up to 12 hours' },
      { key: 'Expansion Slot', value: '1 × SIM Slot, 1 × TF Card Slot (up to 128 GB)' },
      { key: 'Interface', value: '1 × USB 3.0 Type-A, 1 × Type-C, 1 × HDMI 1.4a, 1 × ø3.5 mm DC Jack, 12 Pin Pogo' },
      { key: 'Camera (Front)', value: '2 MP' },
      { key: 'Camera (Rear)', value: '13 MP (AF with Flash)' },
      { key: 'Sensors', value: 'Ambient Light Sensor, Virtual Gyro, Compass' },
      { key: 'WWAN', value: '5G NR N1/41/78/79; 4G TDD-LTE B34/38/39/40/41; 4G FDD-LTE B1/3/5/7/8/20; 3G TD-SCDMA, WCDMA; 3G EVDO, CDMA; 2G GSM' },
      { key: 'Wi-Fi', value: '802.11 a/b/g/n/ac (Dual Band 2.4G/5G)' },
      { key: 'Bluetooth', value: '5.2' },
      { key: 'GPS', value: 'A-GPS, GLONASS, BeiDou, Galileo' },
      { key: 'Power', value: 'AC100V–240V, 50/60 Hz, Output DC 5V/3A' },
      { key: 'Dimensions', value: '225.6 (L) × 144.6 (W) × 21.5 mm (H)' },
      { key: 'Weight', value: 'About 715 g' },
      { key: 'Operating Temperature', value: '-20°C to +65°C' },
      { key: 'Storage Temperature', value: '-30°C to +70°C' },
      { key: 'Humidity', value: '95% Non-condensing' },
      { key: 'Ingress Protection', value: 'IP67' },
      { key: 'Drop Resistance', value: '1.22 m' },
      { key: 'Regulatory', value: 'KC, CE' },
    ],
  },

  {
    slug: 'js-11',
    // Source: JS-11-DataSheet_Updated.pdf — visual reading (image-based PDF)
    specs: [
      { key: 'Operating System', value: 'Android 14 (GMS)' },
      { key: 'Processor', value: 'ARM Octa-Core, 2.0 GHz' },
      { key: 'RAM', value: '8 GB' },
      { key: 'Storage', value: '128 GB' },
      { key: 'Display', value: '10.1 inch IPS 16:10, 800 × 1280, 700 nits' },
      { key: 'Touch Panel', value: '10-point G+G capacitive touch screen' },
      { key: 'Battery', value: '3.7V Li-ion 8,000 mAh; backup up to 11 hours' },
      { key: 'Expansion Slot', value: '1 × SIM Slot, 1 × TF Card Slot' },
      { key: 'Interface', value: '1 × USB 2.0 Type-A, 1 × Type-C, 1 × ø3.5 mm DC Jack, 12 Pin Pogo' },
      { key: 'Camera (Front)', value: '5 MP' },
      { key: 'Camera (Rear)', value: '13 MP (AF with Flash)' },
      { key: 'Sensors', value: 'Ambient Light Sensor, Virtual Gyro, Compass' },
      { key: 'WWAN', value: '5G NR N1/41/78/79; 4G TDD-LTE B34/38/39/40/41; 4G FDD-LTE B1/3/5/7/8/20; 3G TD-SCDMA, WCDMA; 3G EVDO, CDMA; 2G GSM' },
      { key: 'Wi-Fi', value: '802.11 a/b/g/n/ac (Dual Band 2.4G/5G)' },
      { key: 'Bluetooth', value: '5.2, transmission distance 10 m' },
      { key: 'GPS', value: 'GPS L1 & L5 / GLONASS' },
      { key: 'Power', value: 'AC100V–240V, 50/60 Hz, Output DC 5V/3A' },
      { key: 'Dimensions', value: '275.7 × 187.5 × 24.5 mm' },
      { key: 'Weight', value: 'About 1000 g' },
      { key: 'Operating Temperature', value: '-20°C to +65°C' },
      { key: 'Storage Temperature', value: '-30°C to +70°C' },
      { key: 'Humidity', value: '95% Non-condensing' },
      { key: 'Ingress Protection', value: 'IP65' },
      { key: 'Drop Resistance', value: '1.22 m' },
      { key: 'Regulatory', value: 'KC, CE, MIL-STD-810G certified' },
    ],
  },

  {
    slug: 'js-60',
    // Source: JS-60_Datasheet_MII.pdf-1.pdf — visual reading (image-based PDF)
    specs: [
      { key: 'Operating System', value: 'Android 13 (GMS), upgradable to Android 14' },
      { key: 'Processor', value: 'Qualcomm SDM 660 2.2 GHz Octa-core (optional 2.45 GHz)' },
      { key: 'RAM / ROM', value: '4 GB / 64 GB; 6 GB / 128 GB UFS 2.1 (optional)' },
      { key: 'Display', value: '5.45" HD+ IPS (720 × 1440)' },
      { key: 'Touch Panel', value: 'Capacitive (Multi-touch), Corning Gorilla Glass 5' },
      { key: 'Battery', value: 'Li-ion polymer 3.7V 5,000 mAh (optional 7,000 mAh)' },
      { key: 'Expansion Slot', value: 'Micro SD Card up to 256 GB × 1; Nano SIM × 2 (1 SIM & 2 SIM)' },
      { key: 'Interface', value: 'USB 2.0 Type-C' },
      { key: 'Sound & Mic', value: 'Loud Speaker (2.5W), Receiver, Dual MIC (Noise Cancelling)' },
      { key: 'Physical Keys', value: 'Scan Key (L&R), Volume Up/Down, Function Key (Fn), Power Key' },
      { key: 'Camera (Front)', value: '8 MP f/2.0' },
      { key: 'Camera (Rear)', value: '16 MP AF with Flash' },
      { key: 'Sensors', value: 'Ambient Light Sensor, Proximity Sensor, Gyro & Acceleration Sensor, Digital Compass' },
      { key: 'LED & Vibration', value: 'Notification LED, Vibration' },
      { key: 'WWAN', value: '4G LTE FDD B1/3/5/7/8/20/28A&B; 4G LTE TDD B38/39/40/41; WCDMA B1/5/8; GSM 850/900/1900' },
      { key: 'Wi-Fi', value: 'IEEE 802.11 a/b/g/n/ac/d/h/i/r/k/v/w, 2x2 MIMO, Dual Band 2.4/5 GHz' },
      { key: 'Bluetooth', value: '5.0 (BLE), Connection Range 10 m' },
      { key: 'GPS', value: 'A-GPS, GLONASS, Galileo, BeiDou' },
      { key: 'NFC (RFID)', value: '13.56 MHz, ISO14443A&B, ISO15693, MIFARE, Felica, NFCIP-1, NFCIP-2' },
      { key: 'Barcode Scanner', value: 'SR: Zebra SE4710, SE4720, SE4770; LR: Zebra SE55 (optional)' },
      { key: 'Dimensions', value: '157 (L) × 75 (W) × 14.9 (T) mm' },
      { key: 'Weight', value: '270.2 g (with battery)' },
      { key: 'Operating Temperature', value: '-20°C to +60°C' },
      { key: 'Storage Temperature', value: '-30°C to +70°C' },
      { key: 'Humidity', value: '95% Non-condensing' },
      { key: 'Ingress Protection', value: 'IP68' },
      { key: 'Drop Resistance', value: '1.8 m to steel plate; 2.1 m to concrete (MIL-STD-810G)' },
      { key: 'Regulatory', value: 'KC, CE, RoHS' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Seeder
// ---------------------------------------------------------------------------

async function seed() {
  await client.connect();
  console.log('Connected to database\n');

  let ok = 0;
  let skipped = 0;
  let warned = 0;

  for (const { slug, specs } of PRODUCT_SPECS) {
    // Look up product
    const { rows } = await client.query(
      'SELECT id FROM products WHERE slug = $1',
      [slug],
    );

    if (rows.length === 0) {
      console.warn(`  [SKIP] Product not found in DB: ${slug}`);
      skipped++;
      continue;
    }

    const productId = rows[0].id;

    // Delete existing specs
    await client.query(
      'DELETE FROM product_specs WHERE "productId" = $1',
      [productId],
    );

    if (!specs || specs.length === 0) {
      console.warn(`  [WARN] No specs defined for: ${slug}`);
      warned++;
      continue;
    }

    // Insert fresh specs
    for (let i = 0; i < specs.length; i++) {
      const { key, value } = specs[i];
      await client.query(
        `INSERT INTO product_specs (key, value, "sortOrder", "productId")
         VALUES ($1, $2, $3, $4)`,
        [key, value, i, productId],
      );
    }

    console.log(`  [OK] ${slug} — ${specs.length} specs inserted`);
    ok++;
  }

  // Log skipped products (no PDF/specs available)
  const noSpecs = [
    'spacexx         — image-only PNG, no PDF',
    'spacexx-lite    — image-only PNG, no PDF',
    'janak-fieldpad  — image-only JPG, no PDF',
  ];
  for (const note of noSpecs) {
    console.log(`  [SKIP] ${note}`);
  }

  console.log(`\nDone. ${ok} products updated, ${skipped} skipped (not in DB), ${warned} warned.`);
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
