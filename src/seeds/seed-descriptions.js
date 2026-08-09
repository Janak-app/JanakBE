'use strict';

const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'janak_db',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

const products = [
  // ─── GNSS Receivers (descriptions from Description.txt files) ────────────────

  {
    slug: 'j-50-gnss',
    description: `The J-50 GNSS Receiver is a lightweight yet powerful solution for surveyors. With 1408 channels and full constellation support (GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC), it delivers precise results with MEMS tilt compensation up to 60°. Featuring Wi-Fi WebUI, 4G LTE, Bluetooth 5.1, and rugged IP68 design, it ensures 12-hour performance in any field condition.

Key Features:
- 1408 channels with GPS, GLONASS, Galileo, BeiDou, QZSS & NavIC
- MEMS tilt sensor up to 60° for quick, flexible surveys
- RTK accuracy: 8 mm + 1 ppm (H), 15 mm + 1 ppm (V)
- Rugged IP68 build, drop & temperature resistant
- Strong connectivity: LTE, Wi-Fi, Bluetooth 5.1, UHF radio
- 12-hour battery with fast PD charging`,
  },

  {
    slug: 'sigma-series',
    description: `SIGMA is a powerful and adaptable GNSS receiver built to handle a variety of RTK applications. It supports advanced features like heading determination and roll/pitch measurement, thanks to its integrated MEMS-based IMU. Equipped with an internal battery, dual power inputs, and a comprehensive set of input/output ports, SIGMA adapts seamlessly to various GNSS configurations and workflows. With integrated cellular and radio communication capabilities, SIGMA can also function as a full-featured reference station, supporting both NTRIP Caster and Server modes for delivering RTCM corrections over TCP or NTRIP protocols.

Key Features:
- All GNSS Constellations
- Cell & Radio connectivity
- NTRIP Caster / Server support
- GNSS Heading & IMU
- Ethernet, USB, Serial ports
- Wi-Fi, Bluetooth
- CAN, Event, 1PPS
- External Frequency I/O`,
  },

  {
    slug: 'spacexx',
    description: `The Spacexx GNSS is a next-generation, multi-constellation GNSS receiver engineered for high-accuracy RTK positioning in any environment. Designed with a rugged magnesium alloy housing, powerful internal radio, intelligent IMU, and ultra-long battery life, it delivers survey-grade performance with unmatched speed and reliability. Whether in construction, agriculture, mapping, or land surveying, Spacexx ensures sub-second RTK fix with 99.99% reliability, even in tough conditions.

Key Features:
- RTK Initialization Time: <1 s; Reliability: >99.99%
- Magnesium alloy housing, IP67, -40°C to +75°C operating temperature
- 8000mAh battery, >24 hours working time
- 8GB internal memory with cyclic storage support
- Satellite signals: GPS, GLONASS, BeiDou, Galileo, IRNSS, QZSS, SBAS
- Positioning output rate: 1 Hz to 20 Hz`,
  },

  {
    slug: 'spacexx-lite',
    description: `The Spacexx Lite GNSS Receiver is designed for surveyors, engineers, and geospatial professionals who demand accuracy, speed, and durability. Powered by a cutting-edge 1408-channel engine and full constellation tracking (GPS, GLONASS, BeiDou, Galileo, IRNSS, QZSS, SBAS), Spacexx Lite delivers centimeter-level precision in even the toughest environments. Its IMU tilt compensation up to 120° combined with a lightweight rugged body makes it an ideal field companion for demanding survey workflows.

Key Features:
- RTK fix in <1 s with 99.99% reliability
- High precision: ±8 mm horizontal, ±15 mm vertical
- 8000mAh battery with 24+ hours of use
- Rugged and light: 0.76 kg, IP67, -40°C to +75°C
- Survives 2 m drop, MIL-STD-810G certified
- IMU tilt up to 120° with 2.5 cm accuracy
- Bluetooth 5.0, USB-C, internal radio
- 8GB storage, Android-compatible survey software`,
  },

  {
    slug: 't-1m-plus',
    description: `The T-1M Plus is a cutting-edge GNSS Smart Antenna designed for superior positioning accuracy. Equipped with integrated wireless connectivity, a full-band UHF radio, and a high-speed 4G modem, it ensures seamless Base/Rover and network RTK solutions. Optional MEMS IMU technology enables Tilt-Compensated RTK, enhancing efficiency in challenging environments. Whether for surveying, construction, or precision agriculture, the T-1M Plus delivers reliable and accurate results in real time.

Key Features:
- 874 All-In-View Channels
- All GNSS Constellations activated
- Integrated GNSS & MEMS IMU
- 4G Cellular Modem
- Full-band UHF Radio
- Bluetooth & Wi-Fi connectivity
- Patented pole-secured UHF/Cell antenna
- 18-hour all-day battery life`,
  },

  {
    slug: 't3-nr',
    description: `The T3-NR GNSS Network Rover is a lightweight, high-performance receiver designed for seamless field operations. Equipped with an integrated MEMS IMU, this advanced rover delivers precise and reliable positioning, making it ideal for surveying, mapping, and geospatial applications. Engineered for efficiency, the T3-NR features an impressive 25-hour battery life, ensuring uninterrupted all-day productivity on a single charge.

Key Features:
- Integrated GNSS & MEMS IMU
- All GNSS Constellations activated
- Small size and lightweight design
- 25-hour battery life
- Bluetooth, Wi-Fi, USB connectivity
- LED status indicators for real-time system updates`,
  },

  {
    slug: 'triumph-1m',
    description: `The TRIUMPH-1M GNSS Smart Antenna improves upon its predecessor with the latest technology and expanded capabilities. With an 864-channel ASIC powering it, it provides faster signal tracking for greater accuracy. With its onboard 4G LTE modem, easily accessible SD and SIM card slots, and groundbreaking Lift & Tilt automation, the TRIUMPH-1M provides effortless field operation for professionals conducting surveys, construction, and precision agriculture.

Key Features:
- Total 864 All-In-View Channels
- Ethernet connectivity
- 16 GB on-board data recording
- Code Differential Base/Rover operation
- Advanced Multipath Reduction
- MinPad Interface
- Two RS-232 Serial Ports and USB port
- Internal GNSS antenna with Lift & Tilt technology`,
  },

  {
    slug: 'triumph-2',
    description: `The TRIUMPH-2 GNSS Smart Antenna by JAVAD GNSS is a lightweight, high-performance receiver designed for precision field mapping and navigation. With all-day battery life and the ability to track all GNSS constellations, this compact yet powerful device is an exceptional network rover for professional geospatial applications. Equipped with integrated Bluetooth and Wi-Fi, the TRIUMPH-2 enables wireless access to local GNSS reference networks, ensuring a hassle-free connection in the field.

Key Features:
- Multi-Constellation support (GPS, GLONASS, Galileo, BeiDou and more)
- High-precision positioning with advanced GNSS capabilities
- Internal data recording
- RAIM technology for integrity monitoring
- Wireless connectivity via Bluetooth and Wi-Fi
- Advanced Multipath Reduction
- Internal GNSS antenna
- USB interface with internal rechargeable battery`,
  },

  {
    slug: 'triumph-3',
    description: `The TRIUMPH-3 GNSS Smart Antenna by JAVAD GNSS is a cutting-edge solution designed for high-precision navigation and geospatial applications. Powered by an advanced 874-channel GNSS chipset, this robust receiver ensures superior accuracy and reliability with built-in 4G/LTE/3G connectivity, dual-band Wi-Fi, and innovative Lift & Tilt technology that streamlines field data collection. Whether deployed as a portable base station or a rover, the TRIUMPH-3 delivers outstanding results through its integrated radio or cellular modem.

Key Features:
- UHF 1W Transceiver
- 4G/LTE cellular module
- Dual-band Wi-Fi 5 GHz & 2.4 GHz (802.11 a/b/g/n/d/e/i)
- Dual-Mode Bluetooth & Bluetooth LE
- 10BASE-T/100BASE-TX Full-Duplex Ethernet Port
- 480 Mbps High-Speed USB 2.0 Host and Device
- microSD card support up to 128 GB
- Lift & Tilt technology with J-Mobile interface`,
  },

  {
    slug: 'triumph-ls-plus',
    description: `The TRIUMPH-LS Plus GNSS Smart Antenna delivers unmatched precision and reliability for surveying and geospatial applications. Powered by an 874-channel multi-RTK engine, this advanced smart antenna ensures high-accuracy positioning with seamless Real-Time Kinematic (RTK) processing. Equipped with an onboard field computer and innovative Lift & Tilt feature, it enables in-field RTPK repeatability for consistent, high-precision results even in challenging environments.

Key Features:
- Reliable 874-channel Multi-RTK engine
- Built-in field computer
- Lift & Tilt auto point recording
- In-field RTPK repeatability
- 25-hour long-lasting battery
- Versatile Base or Rover functionality
- 4G/LTE Cellular Modem
- UHF Transmit & Receive (406–470 MHz Rx / 902–928 MHz Spread Spectrum Rx)
- Lifetime firmware & software updates
- Robust 3-year warranty`,
  },

  // ─── GNSS Antennas (descriptions extracted from PDFs) ───────────────────────

  {
    slug: 'agant-3s',
    description: `The AgAnt-3S is a high-performance integrated GNSS receiver and antenna combining JAVAD's TRIUMPH3 chip technology with 874 all-in-view channels in a single compact and robust housing. It supports all current and future satellite signals across GPS, GLONASS, Galileo, BeiDou, QZSS, IRNSS, and SBAS constellations, and can be mounted on flat surfaces or standard survey poles. Communication is provided via CAN 2.0, USB 2.0, and RS-232/RS-422 interfaces, with up to 16 GB of internal memory for raw data recording at up to 100 Hz.

Key Features:
- 874 All-In-View channels tracking all GNSS constellations
- RTK accuracy: 1 cm + 1 ppm (H), 1.5 cm + 1 ppm (V)
- Integrated microstrip antenna with flat ground plane
- CAN 2.0, USB 2.0, RS-232/RS-422 communication ports
- Up to 16 GB internal memory, 100 Hz data recording
- JPS, RTCM SC104 v2.x/3.x, CMR, NMEA 0183 output formats
- IP67 waterproof aluminum and plastic housing
- 5/8-11 or 1-14 inch pole mount; -40°C to +80°C operating temperature`,
  },

  {
    slug: 'airant',
    description: `The AirAnt is a low-profile aerodynamic GNSS antenna designed for mounting on aircraft and other applications where a streamlined shape is essential. It features sophisticated interference signal rejection and supports GPS, GLONASS, Galileo, BeiDou, QZSS, WAAS, EGNOS, MSAS, and GAGAN signals, making it suitable for a wide range of precision positioning applications. Its lightweight yet rugged construction combined with low power consumption makes it an ideal antenna for almost any environment.

Key Features:
- Full multi-constellation support: GPS L1/L2/L5, GLONASS L1/L2/L3, Galileo E1/E5ab, BeiDou B1/B2, QZSS, SBAS
- Low-profile aerodynamic microstrip antenna design
- LNA gain: 3.0 dB max; Noise Figure: 2.5 dB max (L1), 2.0 dB max (L2)
- DC voltage: 4.7–12.0 VDC, 85 mA @ 5.0 V typical
- Waterproof with GE PEI+40%GF radome and aluminum base
- Operating temperature: -50°C to +85°C
- TNC connector; 320 g; Dimensions: 120 x 74 x 44 mm`,
  },

  {
    slug: 'grant-series',
    description: `The GrAnt-3LS is a wide-band GNSS antenna with full spectrum compatibility, designed to track GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC, SBAS, and L-Band signals for high-precision positioning applications. It features a stable phase center with enhanced signal reception and is ideal for L-Band correction-based workflows. Housed in a durable IP68-rated enclosure and built to MIL-STD-810H standards, the GrAnt-3LS is suitable for a wide variety of demanding field and infrastructure environments.

Key Features:
- Full GNSS constellation support including L-Band (1520–1540 MHz)
- Stable phase center with tracking to horizon
- LNA gain: 32±2 dB (40±2 dB optional); Noise Figure: 1.7 dB typical
- TNC connector; N-type optional
- 5/8 x 11 inch or 4-hole M5 mounting
- Input voltage: +3.0 to +15 VDC; Power: 1.3 W max
- IP68 weatherproof; MIL-STD-810H shock and vibration rated
- Operating temperature: -45°C to +85°C; Weight: 543 g`,
  },

  {
    slug: 'ringant-s',
    description: `The RingAnt-S is a wide-band choke ring GNSS antenna with full constellation compatibility, supporting GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC, SBAS, and L-Band signals. It features a stable phase center with enhanced signal reception and superior multipath rejection characteristics, making it ideal for high-precision positioning using L-Band corrections. The IP68-rated housing with aluminum base ensures durability across a wide variety of field and reference station applications.

Key Features:
- Full GNSS constellation support including L-Band (1520–1559 MHz)
- Stable phase center with tracking to horizon
- LNA gain: 32±2 dB (40±2 dB optional); Noise Figure: 1.7 dB typical
- Axial ratio: 3.0 dB max; VSWR: 2.0:1
- TNC connector; N-type optional
- 5/8-11 or 1-14 inch mounting
- Input voltage: +3.0 to +15 VDC; Power: 1.3 W max
- IP68 waterproof; Dimensions: Ø326 mm x 88 mm; Weight: 2.8 kg`,
  },

  {
    slug: 'ringant-series',
    description: `The RingAnt-DMT is a precision choke ring GNSS antenna embedding the unique Vera-Phase® technology from Tallysman, offering multi-constellation and multi-frequency tracking for GPS, GLONASS, Galileo, BeiDou, QZSS, NavIC, and SBAS signals. With less than 1 mm Phase Center Variation and low axial ratios, it is well-suited for high-precision applications such as GNSS reference networks, infrastructure monitoring, geodetic surveying, and machine control. Its pre-filtered LNA and superior multipath rejection ensure reliable performance in demanding environments.

Key Features:
- Full GNSS tracking: GPS/GLONASS/Galileo/BeiDou/QZSS/NavIC/SBAS
- <1 mm Phase Center Variation; 0.3 dB axial ratio at Zenith
- 50 dB LNA gain; Noise Figure: 2.0 dB typical
- Superior multipath rejection with Vera-Phase® technology
- IP67 rated; MIL-STD-810E vibration and MIL-STD-810G salt fog tested
- Operating temperature: -55°C to +85°C
- N-type female connector; SCIGN-compatible mount (5/8" x 11 TPI)
- Dimensions: 378 x 150.8 mm; Weight: 5.4 kg`,
  },

  // ─── Data Collectors (descriptions extracted from PDFs) ──────────────────────

  {
    slug: 'js-10-pro',
    description: `The JS-10 Pro is a fully rugged industrial tablet designed for demanding field and industrial applications, available with Android 11 or Windows 10 operating systems. Powered by a Qualcomm Snapdragon Octa-core processor with 6 GB RAM and 64 GB storage, it features a Multi-Touch WXGA IPS display with Dragontrail cover glass and supports 4G LTE, 5G, Bluetooth 5.0, and 802.11 a/b/g/n/ac Wi-Fi connectivity. Its IP68 sealing, 1.5 m multi-drop resistance, and 10–12 hour removable battery make it a reliable companion for professionals in surveying, GIS, and field data collection.

Key Features:
- Android 11 / Windows 10; Qualcomm Octa-core Kryo 260 processor
- 6 GB LPDDR4 RAM, 64 GB eMMC storage; WXGA 1280x800 IPS display
- 4G LTE with 5G support; 802.11 a/b/g/n/ac Wi-Fi; Bluetooth 5.0 + BLE
- USB-C (USB 3.1 OTG); optional RS-232 9-pin D-Sub connector
- Rear 16 MP and Front 2 MP cameras; ambient light, compass, accelerometer, gyroscope
- IP68 sealed; 1.5 m multi-drop resistance to concrete
- Removable Li-Ion 43.2 Whr battery with 10–12 hours operation
- FCC, CE, RoHS 2 certified`,
  },

  {
    slug: 'js-10-rugged-tablet',
    description: `The JS-10 Rugged Tablet is an 8-inch fully rugged industrial tablet designed for field professionals requiring reliable performance in harsh environments. Running Android 10 on a Qualcomm SDM 690 Octa-core 2.0 GHz processor with 4 GB RAM and 64 GB storage, it features an 8-inch HD IPS display rated at 1200 x 1920 resolution and packs a large 8,500 mAh battery for extended field use. With 5G connectivity, IP67 sealing, and a 1.22 m drop rating, it is built to withstand demanding survey and GIS workflows.

Key Features:
- Android 10; Qualcomm SDM 690 Octa-core up to 2.0 GHz
- 4 GB RAM / 64 GB ROM; 8" HD IPS display (1200 x 1920), 550 nits
- 5G NR support; 4G LTE; 802.11 a/b/g/n/ac dual-band Wi-Fi; Bluetooth 4.1
- GPS L1&L5 / GLONASS positioning
- Front 5 MP and Rear 13 MP (A/F with Flash) cameras
- 8,500 mAh Li-ion battery; USB 3.0 Type-A, Type-C, HDMI 1.4a interfaces
- IP67 sealed; 1.22 m drop rated; -20°C to +65°C operating temperature
- 1 x SIM Slot, 1 x TF Card Slot (up to 256 GB)`,
  },

  {
    slug: 'js-10a',
    description: `The JS-10A is an ultra-rugged 8-inch industrial tablet built for field professionals who need reliable performance in demanding environments. Running Android 15 on a 2.0 GHz Octa-core processor with 8 GB RAM and 128 GB ROM, it features an 8-inch HD IPS display with Corning Gorilla Glass and a large 8,500 mAh battery providing up to 12 hours of use. With 4G LTE connectivity, IP67 sealing, and a 1.2 m drop rating, the JS-10A is a capable and durable solution for surveying, GIS, and field data collection.

Key Features:
- Android 15 (GMS); 2.0 GHz ARM Octa-core processor
- 8 GB RAM / 128 GB ROM; 8" HD IPS display (1200 x 1920), 700 nits
- 4G LTE; 802.11 a/b/g/n/ac dual-band Wi-Fi; Bluetooth 5.2
- A-GPS, GLONASS, BeiDou, Galileo positioning
- Front 2 MP and Rear 13 MP (A/F with Flash) cameras
- 8,500 mAh Li-ion battery, up to 12 hours; USB 3.0 Type-A, Type-C, HDMI 1.4a
- IP67 sealed; 1.2 m drop rated; -20°C to +65°C operating temperature
- 1 x SIM Slot, 1 x TF Card Slot (up to 128 GB); KC, CE certified`,
  },

  {
    slug: 'js-11',
    description: `The JS-11 is a rugged 10.1-inch industrial tablet PC built for field and industrial professionals requiring a large-screen device that withstands tough conditions. Running Android 14 (GMS) on a 2.2 GHz ARM Octa-core processor with 8 GB RAM and 128 GB ROM, it features a 10.1-inch IPS display at 800 x 1280 resolution with 700 nits brightness and a 10-point G+G capacitive touch screen. With 4G LTE, Bluetooth 5.2, and IP65 sealing, the JS-11 delivers reliable connectivity and durability for surveying, GIS, and data collection workflows.

Key Features:
- Android 14 (GMS); ARM Octa-core 2.0 GHz processor
- 8 GB RAM / 128 GB ROM; 10.1" IPS display (800 x 1280), 700 nits, 10-point touch
- 4G LTE; 802.11 a/b/g/n/ac dual-band Wi-Fi (2.4 GHz/5G); Bluetooth 5.2
- GPS L1&L5 / GLONASS positioning
- Front 5 MP and Rear 13 MP (A/F with Flash) cameras
- 3.7V Li-ion 8,000 mAh battery; backup time up to 11 hours
- IP65 sealed; 1.22 m drop rated; -20°C to +65°C operating temperature
- USB 2.0 Type-A, Type-C, HDMI 1.4a, 12-pin Pogo interfaces; KC, CE, MIL-STD-810G certified`,
  },

  {
    slug: 'js-60',
    description: `The JS-60 is an ultra-rugged mobile computer engineered for maximum performance and ruggedness for everyday professional use. Running Android 13 (GMS) on a Qualcomm 2.2 GHz Octa-core processor, it features a 5.45-inch HD+ IPS display protected by Corning Gorilla Glass 5 and supports 4G LTE, Bluetooth 5.0 BLE, and 802.11 a/b/g/n/ac 2x2 MIMO Wi-Fi. With IP68 sealing, a 2.1 m MIL-STD-810G drop rating, an integrated 2D barcode imager, and NFC/RFID capability, the JS-60 is built for demanding field, logistics, and survey data capture workflows.

Key Features:
- Android 13 (GMS), upgradable to Android 14; Qualcomm SDM 660 Octa-core 2.2 GHz
- 4 GB RAM / 64 GB ROM (up to 6 GB / 128 GB optional); 5.45" HD+ IPS (720 x 1440), Gorilla Glass 5
- 4G LTE; 802.11 a/b/g/n/ac 2x2 MIMO dual-band Wi-Fi; Bluetooth 5.0 BLE
- A-GPS, GLONASS, Galileo, BeiDou positioning
- 2D Barcode Scanner (SR/LR): Zebra SE4710/SE4720/SE4770/SE55; NFC/RFID
- Front 8 MP f/2.0 and Rear 16 MP A/F cameras
- Li-ion polymer 5,000 mAh battery (7,000 mAh optional)
- IP68 sealed; 2.1 m drop to concrete (MIL-STD-810G); -20°C to +60°C operating temperature`,
  },

  {
    slug: 'janak-fieldpad',
    description: `The Janak FieldPad is a rugged field data collector designed for geospatial professionals. Built to withstand harsh field conditions, it offers a reliable platform for survey data collection and GIS applications.`,
  },
];

async function main() {
  await client.connect();
  console.log('Connected to PostgreSQL database.');

  for (const product of products) {
    try {
      const result = await client.query(
        'UPDATE products SET description = $1 WHERE slug = $2',
        [product.description, product.slug],
      );
      if (result.rowCount > 0) {
        console.log(`[OK]  Updated: ${product.slug}`);
      } else {
        console.warn(`[WARN] No product found with slug: ${product.slug}`);
      }
    } catch (err) {
      console.error(`[ERR] Failed to update slug "${product.slug}":`, err.message);
    }
  }

  await client.end();
  console.log('Done. Database connection closed.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
