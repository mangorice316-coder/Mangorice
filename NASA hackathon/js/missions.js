// ASTROCADE – BEYOND THE HORIZON
// COMPLETE STORYLINE & MISSION EXPEDITION SYSTEM (2040 ASETC EXPEDITION)
const MissionControl = (() => {

  // Current active expedition view: 'moon' or 'mars'
  let activeExpedition = 'moon';

  // EXPEDITION 1: LUNAR FRONTIER (MOON) - 6 MISSIONS
  const LUNAR_EXPEDITION = [
    {
      id: 'moon_1',
      order: 1,
      number: 'MISSION 01',
      title: 'The Astronaut Academy',
      destination: 'ASETC Earth Orbital Facility (400 km)',
      icon: '🎓',
      rewardMedal: 'CADET BADGE',
      xp: 200,
      storyIntro: "Cadet, welcome to your first space expedition! Before travelling beyond Earth, you must understand what it means to be an astronaut.",
      learningObjectives: [
        'Understand what NASA is and the historic role of astronauts',
        'Learn the core daily duties and scientific roles of space crew members',
        'Discover the International Space Station (ISS) and microgravity research',
        'Understand how spacesuits protect human life in the vacuum of space',
        'Learn how rockets produce thrust and communicate with Houston Mission Control'
      ],
      educationalContent: [
        {
          title: 'What is NASA & Who is an Astronaut?',
          text: 'NASA (National Aeronautics and Space Administration) was created in 1958 to pioneer space exploration and scientific discovery. An astronaut is a specially trained professional who travels beyond Earth’s atmosphere to fly spacecraft, conduct scientific experiments, repair satellites, and establish human outposts on other worlds.'
        },
        {
          title: 'The International Space Station (ISS)',
          text: 'The ISS is a football-field-sized microgravity laboratory orbiting 400 km above Earth at 28,000 km/h (7.7 km/s). Astronauts float in continuous free-fall, studying how microgravity affects human biology, growing pure protein crystals, and testing closed-loop life-support technologies.'
        },
        {
          title: 'The Spacesuit: A Personal Spacecraft',
          text: 'A spacesuit (EMU/xEMU) provides 100% pure oxygen at 4.3 psi pressure, removes exhaled carbon dioxide, maintains comfortable temperature using liquid cooling garments, and shields astronauts against micrometeorites and extreme space temperatures ranging from -150°C to +120°C.'
        }
      ],
      interactiveTask: {
        type: 'match_equipment',
        title: 'Spacesuit & Equipment Checklist',
        instruction: 'Click an astronaut equipment item, then click its corresponding life-support function to verify systems.',
        pairs: [
          { item: 'Oxygen Helmet Visor', function: 'Shields eyes from unfiltered solar UV and glare' },
          { item: 'Liquid Cooling Garment', function: 'Circulates chilled water to remove body heat' },
          { item: 'PLSS Backpack', function: 'Supplies breathable oxygen and scrubs toxic CO2' },
          { item: 'Tether Safety Cable', function: 'Prevents astronauts from drifting into deep space' }
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "What does an astronaut's spacesuit provide so they can breathe safely in space?",
            options: ["Fresh mountain air", "Pure oxygen and air pressure", "Carbon dioxide gas", "Water vapor mist"],
            answer: 1,
            explanation: "Space has no atmosphere or oxygen. A spacesuit acts like a mini-spacecraft that supplies pressurized oxygen for astronauts to breathe."
          },
          {
            q: "Where do astronauts currently live and perform experiments in orbit around Earth?",
            options: ["The Moon Base", "The International Space Station (ISS)", "A submarine", "Mount Everest"],
            answer: 1,
            explanation: "The International Space Station (ISS) has had astronauts living and working in Earth orbit continuously since the year 2000!"
          }
        ],
        grade_6_8: [
          {
            q: "Why do astronauts float inside the International Space Station?",
            options: ["There is zero gravity in space", "They are in constant freefall around Earth together with the station", "Magnets repel their suits", "The atmosphere inside pushes them upwards"],
            answer: 1,
            explanation: "Earth's gravity at 400 km altitude is still about 90% as strong as on Earth's surface! Astronauts float because both they and the ISS are falling around the curve of the Earth at orbital velocity."
          },
          {
            q: "How does an Extravehicular Mobility Unit (spacesuit) reject excess metabolic heat in the vacuum of space?",
            options: ["By opening vents to let warm air out", "Through a sublimator that vents tiny amounts of water ice into space", "Using household electric fans", "By absorbing heat into heavy lead blocks"],
            answer: 1,
            explanation: "In a vacuum, conduction and convection do not work. Spacesuits use a sublimator where water freezes and sublimates directly from solid to vapor, carrying body heat away into space."
          }
        ],
        grade_9_12: [
          {
            q: "At an orbital altitude of 400 km with Earth radius 6,371 km and GM = 3.986 × 10¹⁴ m³/s², what circular orbital velocity must the ISS maintain?",
            options: ["1.62 km/s", "7.67 km/s", "11.19 km/s", "29.78 km/s"],
            answer: 1,
            explanation: "Orbital speed v = sqrt(GM / r) = sqrt(3.986e14 / 6.771e6) ≈ 7,670 m/s (~7.67 km/s). This velocity perfectly balances gravitational acceleration with centrifugal inertia."
          },
          {
            q: "Which life-support subsystem in human spaceflight is responsible for removing carbon dioxide exhaled by the crew?",
            options: ["Sabatier catalytic reactor", "Amine-bed or lithium hydroxide (LiOH) scrubbers", "Electrolytic water splitter", "Urine processor distillation assembly"],
            answer: 1,
            explanation: "Carbon dioxide scrubbers use regenerative amine swing beds or consumable Lithium Hydroxide (LiOH) canisters that chemically bind CO2 (2 LiOH + CO2 -> Li2CO3 + H2O), preventing hypercapnia."
          }
        ]
      },
      unexpectedEvent: {
        title: "COMMUNICATION SIGNAL INTERRUPTION",
        situation: "During orbital insertion checkout, high cosmic ray activity interrupts the primary S-band directional antenna. Mission Control audio drops into static. What is your standard operating procedure?",
        options: [
          "Switch immediately to redundant omnidirectional UHF audio backup and verify telemetry handshake",
          "Open the exterior cabin hatch to visually check the antenna dish",
          "Power off the flight computer to force a hard reboot",
          "Wait 24 hours to see if solar wind clears naturally"
        ],
        correctIndex: 0,
        feedback: "Correct! Spacecraft are built with dual redundancy. Switching to the omnidirectional UHF link restores Mission Control voice contact instantly without risking crew safety."
      }
    },
    {
      id: 'moon_2',
      order: 2,
      number: 'MISSION 02',
      title: 'Journey Beyond Earth',
      destination: 'Trans-Lunar Space (384,400 km)',
      icon: '🚀',
      rewardMedal: 'SPACE TRAVELLER MEDAL',
      xp: 220,
      storyIntro: "The countdown has begun. Your spacecraft is ready. Your destination is the Moon. But before reaching your destination, you must understand how space travel works.",
      learningObjectives: [
        'Understand rocket staging and conservation of momentum',
        'Learn the difference between Earth gravity and escape velocity',
        'Discover the trajectory of Trans-Lunar Injection (TLI)',
        'Master the major phases of an interplanetary lunar voyage'
      ],
      educationalContent: [
        {
          title: 'Breaking Free: Escape Velocity',
          text: 'To escape Earth’s gravitational well entirely, a rocket must accelerate to 11.2 km/s (40,320 km/h). Rockets achieve this using staging: dropping empty heavy fuel tanks once their propellant is expended, which allows the smaller upper stage to accelerate dramatically faster.'
        },
        {
          title: 'The Trans-Lunar Highway',
          text: 'Travelling to the Moon takes approximately 3 to 4 days across 384,400 km of deep space. Astronauts perform a Trans-Lunar Injection (TLI) burn in Low Earth Orbit, placing the spacecraft into an elongated elliptical transfer orbit intersecting the Moon’s gravity well.'
        }
      ],
      interactiveTask: {
        type: 'order_stages',
        title: 'Lunar Flight Profile Sequencer',
        instruction: 'Click the stages in chronological order from Earth launch to Moon arrival.',
        stages: [
          '1. Rocket Launch & First Stage Ascent',
          '2. Earth Orbit Insertion & Systems Checkout',
          '3. Trans-Lunar Injection (TLI) Engine Burn',
          '4. 3-Day Deep Space Translunar Coast',
          '5. Lunar Orbit Insertion (LOI) Retrorocket Burn'
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "Why do giant rockets drop their lower sections (stages) as they climb into space?",
            options: ["To leave a trail for other rockets", "To get rid of empty, heavy metal tanks so the rocket becomes lighter and faster", "Because the engines break after one minute", "To parachute back presents to Earth"],
            answer: 1,
            explanation: "Once fuel is burned, empty fuel tanks are useless heavy weight! Dropping them makes the spacecraft lighter so it can reach the high speeds needed for space."
          },
          {
            q: "How long does it typically take for astronauts to travel from Earth to the Moon?",
            options: ["1 hour", "3 to 4 days", "6 months", "10 years"],
            answer: 1,
            explanation: "The Moon is 384,400 km away. Spacecraft travel at over 30,000 km/h and reach the Moon in about 3 to 4 days!"
          }
        ],
        grade_6_8: [
          {
            q: "What is Trans-Lunar Injection (TLI)?",
            options: ["Injecting fuel into rocket combustion chambers", "A propulsion burn that propels a spacecraft out of Earth orbit toward the Moon", "The process of landing vertically on lunar soil", "Purifying astronaut drinking water"],
            answer: 1,
            explanation: "Trans-Lunar Injection is the precise orbital burn performed by the spacecraft’s upper stage that increases velocity just enough to fling the spacecraft toward the Moon's gravitational sphere of influence."
          },
          {
            q: "What keeps a spacecraft in orbit around Earth before departing for the Moon?",
            options: ["Rocket engines firing continuously every second", "A balance between forward inertia and gravitational pull pulling it around the curved surface", "Zero gravity pushing it outwards", "Solar wind blowing against solar panels"],
            answer: 1,
            explanation: "An orbit is continuous free-fall: gravity constantly pulls the spacecraft downward, but forward velocity is so high that the surface of the Earth curves away at the exact same rate!"
          }
        ],
        grade_9_12: [
          {
            q: "According to the Tsiolkovsky rocket equation Δv = v_e · ln(m_0 / m_f), what allows multi-stage rockets to achieve higher final velocities than single-stage vehicles?",
            options: ["Higher specific heat ratios in upper atmosphere", "Discarding structural mass m_struct increases the effective mass ratio (m_0 / m_f) for subsequent stages", "Gravity assists from Earth's magnetic field", "Exhaust velocity v_e doubles automatically in vacuum"],
            answer: 1,
            explanation: "By jettisoning depleted propellant tanks and structural mass, the initial mass m_0 of the next stage is vastly smaller, drastically increasing the mass ratio term ln(m_0 / m_f) for the remaining delta-v budget."
          },
          {
            q: "What celestial mechanics boundary marks where the Moon's gravitational pull begins dominating over Earth's gravitational pull on a trans-lunar spacecraft?",
            options: ["Van Allen Belt Outer Perimeter", "The Lunar Sphere of Influence (Laplace SOI, radius ~66,000 km)", "Geostationary orbital ring", "Oort Cloud boundary"],
            answer: 1,
            explanation: "The Laplace Sphere of Influence (SOI) of the Moon has a radius of approximately 66,100 km. Once inside, the trajectory is computed primarily relative to the Moon's center of mass."
          }
        ]
      },
      unexpectedEvent: {
        title: "TRAJECTORY NAVIGATION ALERT",
        situation: "Midway through the Translunar Coast, inertial star trackers detect a 0.8% trajectory drift due to asymmetric fuel venting. At this rate, the spacecraft will miss the Moon by 4,200 km. What do you do?",
        options: [
          "Execute a calibrated 12-second Mid-Course Correction (MCC) burn using RCS thrusters toward the prograde target vector",
          "Cut all spacecraft power and drift toward deep space",
          "Fire main descent engines at maximum 100% thrust immediately without recalculating attitude",
          "Jettison the service module"
        ],
        correctIndex: 0,
        feedback: "Superb piloting! Mid-Course Correction (MCC) burns are standard NASA navigation procedures to fine-tune the spacecraft trajectory smoothly with minimal propellant."
      }
    },
    {
      id: 'moon_3',
      order: 3,
      number: 'MISSION 03',
      title: 'Welcome to the Moon',
      destination: 'Lunar South Pole · Shackleton Crater',
      icon: '🌕',
      rewardMedal: 'LUNAR EXPLORER MEDAL',
      xp: 250,
      storyIntro: "Cadet, you have successfully reached the Moon! You are standing on another world. But the Moon is very different from Earth. You must understand its environment before exploring.",
      learningObjectives: [
        'Understand Moon gravity (approximately one-sixth of Earth’s gravity, 0.166g)',
        'Learn why the Moon has no breathable atmosphere and a pitch-black sky',
        'Discover lunar dust (regolith) properties and why it is sharp and abrasive',
        'Understand extreme temperature swings (-130°C to +120°C)',
        'Explore permanently shadowed craters and water ice reservoirs'
      ],
      educationalContent: [
        {
          title: 'One-Sixth Gravity (0.166g)',
          text: 'Because the Moon has only 1.2% of Earth’s mass, its surface gravity is approximately 1.62 m/s² (about 1/6th of Earth). A 60 kg astronaut weighs only 10 kg on the Moon! Walking requires a rhythmic bunny-hop or kangaroo lope.'
        },
        {
          title: 'The Harsh Lunar Environment',
          text: 'With no atmosphere, sound cannot travel, and temperatures swing from +120°C in direct sunlight to -130°C in shadow. Solar radiation and micrometeorites strike the surface unhindered, grinding lunar basalt into jagged, razor-sharp dust grains.'
        },
        {
          title: 'Water Ice at the South Pole',
          text: 'Permanently shadowed craters at the Lunar South Pole (like Shackleton Crater) have never seen sunlight for billions of years. Temperatures drop to -246°C, creating cold traps preserving billions of tons of water ice for drinking and rocket fuel.'
        }
      ],
      interactiveTask: {
        type: 'lunar_exploration',
        title: 'Lunar Surface Geological Scan',
        instruction: 'Identify the 3 critical lunar geological formations around the South Pole base.',
        features: [
          { name: 'Connecting Ridge', desc: 'Peak of Eternal Light receiving 92% sunlight for solar power' },
          { name: 'Shackleton Crater Rim', desc: 'Ultra-cold depression containing confirmed water ice deposits' },
          { name: 'Highland Anorthosite Rocks', desc: 'Ancient 4.4-billion-year-old crust showing early solar system history' }
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "How does gravity on the Moon compare with gravity on Earth?",
            options: ["The Moon has much weaker gravity (about 1/6th of Earth)", "The Moon has twice as much gravity", "Gravity is identical everywhere", "There is zero gravity on the Moon surface"],
            answer: 0,
            explanation: "The Moon is smaller and has less mass, so its gravity is about 1/6th of Earth. You can jump much higher and feel six times lighter!"
          },
          {
            q: "Why is the sky on the Moon always black, even during the middle of the day?",
            options: ["Because the Sun turns off on the Moon", "Because the Moon has no atmosphere to scatter sunlight into a blue sky", "Because the Moon is made of black coal", "Because clouds block the Sun"],
            answer: 1,
            explanation: "Earth's blue sky is caused by air molecules scattering blue sunlight (Rayleigh scattering). With no atmosphere on the Moon, the sky remains deep black and starry all day!"
          }
        ],
        grade_6_8: [
          {
            q: "If an astronaut has a mass of 72 kg on Earth, what is their mass and approximate weight on the Moon (g = 1.62 m/s²)?",
            options: ["Mass 12 kg, Weight 72 N", "Mass 72 kg, Weight ~117 N", "Mass 432 kg, Weight 720 N", "Mass 0 kg, Weight 0 N"],
            answer: 1,
            explanation: "Mass is the amount of matter in your body and never changes (72 kg). Weight is gravitational force (W = m · g = 72 · 1.62 ≈ 117 N, roughly 1/6th of their 706 N Earth weight)!"
          },
          {
            q: "Why are the permanently shadowed regions (PSRs) of lunar polar craters scientifically valuable for human exploration?",
            options: ["They contain warm liquid hot springs", "They act as cold traps preserving volatile water ice (H2O) for life support and propellant", "They are made of solid diamonds", "Alien spacecraft are buried there"],
            answer: 1,
            explanation: "Because the Moon has a tiny 1.5° axial tilt, deep polar crater floors never receive sunlight. At temperatures near 40 Kelvin, water ice has survived intact for billions of years!"
          }
        ],
        grade_9_12: [
          {
            q: "Why is lunar regolith dust uniquely hazardous to spacesuit seals, bearings, and astronaut respiratory health compared to Earth sand?",
            options: ["It is radioactively hot and dissolves steel", "Absence of wind or water erosion leaves dust particles jagged with razor-sharp edges and electrostatic charges", "It reacts chemically with oxygen to create sulfuric acid", "It weighs ten times more than lead"],
            answer: 1,
            explanation: "Without atmospheric weathering or liquid water to tumble grains smooth, lunar dust particles are sub-micron shards of glass and basalt with sharp barbed edges that adhere electrostatically and abrade mechanical seals."
          },
          {
            q: "What is the primary thermodynamic mechanism by which lunar surface temperatures swing between +120°C and -130°C?",
            options: ["Convective heat transfer through atmospheric thermals", "Direct radiation balance in a vacuum with negligible thermal capacitance in regolith", "Tidal friction from Earth", "Nuclear fission in the lunar core"],
            answer: 1,
            explanation: "In a total vacuum, heat transfer occurs exclusively through thermal radiation (Stefan-Boltzmann law q = εσT⁴) and low-conductivity solid conduction. Without an atmospheric blanket, surfaces equilibrate rapidly to extreme radiation balances."
          }
        ]
      },
      unexpectedEvent: {
        title: "DUST-COVERED SOLAR ARRAY POWER LOSS",
        situation: "A burst of lunar dust kicked up by a landing supply cargo lander settles onto the main solar photovoltaic arrays, dropping power output by 65%. Battery reserves are down to 3 hours. How do you respond?",
        options: [
          "Deploy electrodynamic dust shielding (EDS) pulses and EVA electrostatic wipers while shedding non-essential scientific loads",
          "Pour water over the solar panels to rinse them off",
          "Smash the solar panels with a geological hammer",
          "Abandon the base and fly back to Earth without preparing the lander"
        ],
        correctIndex: 0,
        feedback: "Excellent engineering! NASA Electrodynamic Dust Shields (EDS) use alternating electric fields to levitate and slide dust off panels without scratching the protective glass."
      }
    },
    {
      id: 'moon_4',
      order: 4,
      number: 'MISSION 04',
      title: 'Build Your Lunar Research Base',
      destination: 'Artemis Outpost Alpha · Lunar South Pole',
      icon: '🏗️',
      rewardMedal: 'MOON BASE ARCHITECT MEDAL',
      xp: 280,
      storyIntro: "Your next task is to establish a temporary lunar research base. Astronauts need a safe place to live, conduct experiments, communicate with Earth, and manage resources.",
      learningObjectives: [
        'Learn the 6 essential systems of a planetary human outpost',
        'Understand closed-loop life support (ECLSS: oxygen, water recycling)',
        'Discover regolith shielding against space radiation and thermal extremes',
        'Learn solar power generation with regenerative fuel cell backup'
      ],
      educationalContent: [
        {
          title: 'The 6 Pillars of a Moon Base',
          text: 'A permanent lunar outpost requires: 1) Oxygen extraction & circulation, 2) Closed-loop water recycling, 3) Continuous solar/fuel-cell power, 4) Deep-space communications antenna, 5) Pressurized science lab, and 6) Radiation-shielded crew habitat.'
        },
        {
          title: 'In-Situ Resource Utilization (ISRU)',
          text: 'Bringing everything from Earth is far too expensive ($10,000+ per kg). Astronauts use ISRU: melting lunar ice to produce drinking water, splitting water into hydrogen and oxygen (fuel & air), and covering habitats with 2 meters of lunar soil (regolith) to block radiation.'
        }
      ],
      interactiveTask: {
        type: 'build_base',
        title: 'Lunar Outpost Module Configuration',
        instruction: 'Select and balance the 6 core modules to bring the Lunar Base online.',
        modules: [
          { name: 'Oxygen & ECLSS Life Support', function: 'Maintains 21% O2 / 78% N2 pressure and scrubs CO2', cost: 20 },
          { name: 'Water Filtration & Recycling', function: 'Recycles 98% of all astronaut moisture and water', cost: 15 },
          { name: 'Bifacial Solar & Fuel Cell Grid', function: 'Generates 50 kW clean electrical power continuously', cost: 25 },
          { name: 'Ka-Band Deep Space Comms Dish', function: 'Continuous 4K uplink to Houston Mission Control', cost: 10 },
          { name: 'Planetary Geology Laboratory', function: 'High-vacuum mass spectrometer and sample glovebox', cost: 15 },
          { name: 'Regolith-Shielded Crew Habitat', function: 'Protects crew from cosmic rays, GCRs, and solar flares', cost: 15 }
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "Why do astronauts want to build their Moon base near lunar ice deposits?",
            options: ["To make ice cream every day", "Because melted ice provides water to drink and oxygen to breathe", "To build giant snowmen", "Because ice is softer to build on"],
            answer: 1,
            explanation: "Water is life! It can be purified for drinking, and electricity can split water (H2O) into hydrogen for rocket fuel and oxygen to breathe."
          },
          {
            q: "What can astronauts put on top of their Moon habitats to protect them from dangerous space radiation?",
            options: ["Cardboard boxes", "A thick layer of lunar dirt (regolith)", "A layer of plastic wrap", "Leaves and tree branches"],
            answer: 1,
            explanation: "Lunar regolith (Moon dirt) is packed with minerals that absorb harmful space radiation and protect astronauts living inside thick underground shelters!"
          }
        ],
        grade_6_8: [
          {
            q: "What does 'Closed-Loop Life Support' mean in a space habitat?",
            options: ["The doors of the base are locked permanently", "Almost 100% of air, water, and moisture is purified and recycled repeatedly inside the habitat", "Astronauts only eat food grown in round circular pots", "The electrical wires form a circle"],
            answer: 1,
            explanation: "In closed-loop systems, exhaled moisture, sweat, and wastewater are distilled and filtered back into pure drinking water, while CO2 is converted back into oxygen!"
          },
          {
            q: "How does electrolysis support both life-support AND rocket propulsion on the Moon?",
            options: ["It freezes carbon into ice cubes", "It splits liquid water (2 H2O) using electricity into hydrogen fuel (2 H2) and breathable oxygen (O2)", "It burns lunar rocks to make coal", "It magnifies sunlight like a giant mirror"],
            answer: 1,
            explanation: "Electrolysis uses clean solar power to split water: 2 H2O -> 2 H2 + O2. The oxygen is used for breathing, and liquid H2 + liquid O2 make the most efficient rocket propellant!"
          }
        ],
        grade_9_12: [
          {
            q: "What thickness of lunar regolith overburden is required to reduce annual astronaut exposure to Galactic Cosmic Rays (GCR) below the NASA Career Limit (~20 mSv/yr)?",
            options: ["5 millimeters", "Approximately 2 to 3 meters (~300 to 500 g/cm² areal mass density)", "50 meters", "No thickness can block GCRs"],
            answer: 1,
            explanation: "High-energy galactic cosmic rays require substantial mass density (~300 to 500 g/cm²). Approximately 2 to 3 meters of compacted lunar regolith provides radiation attenuation comparable to Earth’s atmosphere."
          },
          {
            q: "In an environmental control and life support system (ECLSS), what chemical reaction combines carbon dioxide with byproduct hydrogen to recover water?",
            options: ["The Haber-Bosch process", "The Sabatier catalytic hydrogenation reaction (CO2 + 4 H2 -> CH4 + 2 H2O)", "Fischer-Tropsch synthesis", "Photosynthetic photolysis"],
            answer: 1,
            explanation: "The Sabatier reaction uses a ruthenium or nickel catalyst at 400°C to convert CO2 and hydrogen into methane and water: CO2 + 4 H2 -> CH4 + 2 H2O, enabling closed-loop water recovery."
          }
        ]
      },
      unexpectedEvent: {
        title: "PRESSURE SEAL MICRO-LEAK IN HABITAT AIRLOCK",
        situation: "An ultrasonic sensor detects a 50 Pascal/minute pressure decay across Habitat Module Airlock B after an EVA traverse. What is your containment protocol?",
        options: [
          "Isolate Airlock B bulkhead doors, verify primary habitat pressure, scan seals with infrared acoustic leak detector, and apply self-curing vacuum sealant tape",
          "Depressurize the entire living base and take off helmets",
          "Pump water into the airlock to locate the bubble leak",
          "Ignore the sensor alarm as a computer glitch"
        ],
        correctIndex: 0,
        feedback: "Outstanding emergency management! Compartmentalization protects the crew in the main habitat while targeted acoustic tools locate and seal microscopic airlock leaks safely."
      }
    },
    {
      id: 'moon_5',
      order: 5,
      number: 'MISSION 05',
      title: 'The Lunar Science Expedition',
      destination: 'South Pole Highland Craters & Ejecta Blanket',
      icon: '🔬',
      rewardMedal: 'LUNAR SCIENTIST MEDAL',
      xp: 320,
      storyIntro: "Mission Control has detected an interesting geological region near your research base. Investigate the area, study lunar rocks, and collect valuable scientific observations.",
      learningObjectives: [
        'Understand why Moon rocks hold the pristine history of early Earth and the Solar System',
        'Learn the difference between lunar mare basalts and highland anorthosites',
        'Master the operation of a 6-wheel robotic/crewed lunar exploration rover',
        'Conduct scientific sample collection, cataloging, and spectroscopy'
      ],
      educationalContent: [
        {
          title: 'Windows into Solar System History',
          text: 'On Earth, plate tectonics, wind, rain, and volcanoes have erased almost all rocks older than 3.5 billion years. Because the Moon has no weather or plate tectonics, its rocks are a frozen 4.5-billion-year-old time capsule of our cosmic origins.'
        },
        {
          title: 'Anorthosite vs Mare Basalt',
          text: 'The bright white highlands of the Moon are made of anorthosite rock formed when the Moon was covered in a molten magma ocean. The dark flat plains (maria) are ancient volcanic lava flows of basalt rich in iron and titanium.'
        }
      ],
      interactiveTask: {
        type: 'rover_sampling',
        title: 'Lunar Rover Scientific Sampling Traverse',
        instruction: 'Drive the lunar rover to 3 waypoints and collect geological rock samples.',
        samples: [
          { name: 'Sample Alpha: Pristine Anorthosite', location: 'Crater Rim Peak', age: '4.4 Billion Years' },
          { name: 'Sample Beta: Impact Melt Breccia', location: 'Ejecta Blanket Wall', age: '3.9 Billion Years' },
          { name: 'Sample Gamma: Volcanic Pyroclastic Glass', location: 'Basaltic Flow Channel', age: '3.2 Billion Years' }
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "Why are rocks on the Moon so valuable to scientists on Earth?",
            options: ["They are made of pure gold and chocolate", "Because they are billions of years old and have never been washed away by rain or wind", "Because they glow brightly in the dark", "They can be used to power smart phones"],
            answer: 1,
            explanation: "Earth rocks get eroded by rain, wind, and volcanoes. The Moon has no weather, so its rocks preserve the ancient history of our solar system!"
          },
          {
            q: "What kind of vehicle do astronauts drive across the dusty surface of the Moon?",
            options: ["A sports racing car", "A Lunar Rover with special metal mesh tires", "A bicycle", "A hovercraft boat"],
            answer: 1,
            explanation: "Lunar rovers use flexible woven zinc-coated steel wire mesh tires that grip soft powdery dust without popping!"
          }
        ],
        grade_6_8: [
          {
            q: "What does the discovery of Anorthosite (Genesis Rock) on the Moon prove about its early history?",
            options: ["The Moon was once a hollow metallic ball", "The early Moon was covered by a deep, molten Magma Ocean where lightweight feldspar floated to the top", "The Moon was once covered in tropical jungles", "Comets deposited all of the Moon’s surface"],
            answer: 1,
            explanation: "The Lunar Magma Ocean hypothesis states that after the Giant Impact created the Moon, it was molten rock. Heavy minerals sank, while buoyant plagioclase feldspar floated to create the white anorthosite highlands!"
          },
          {
            q: "Why do lunar rover wheels use woven wire mesh instead of air-filled rubber tires?",
            options: ["Rubber is too heavy", "Rubber tires would burst in the vacuum of space and become brittle and crack in extreme temperatures", "Mesh wheels spin ten times faster", "Rubber attracts dangerous lunar lightning"],
            answer: 1,
            explanation: "In space, pressurized air rubber tires would pop in the vacuum, and extreme temperature changes from -130°C to +120°C would cause rubber to shatter like glass!"
          }
        ],
        grade_9_12: [
          {
            q: "What isotopic evidence in Apollo lunar rock samples confirmed that the Moon was formed from the collision between proto-Earth and a Mars-sized planetesimal (Theia)?",
            options: ["Identical stable Oxygen isotope ratios (Δ¹⁷O ≈ 0) between Earth and Moon rocks", "High concentrations of carbon dioxide gas bubbles", "Absence of any heavy iron minerals", "Abundant fossilized algae deposits"],
            answer: 0,
            explanation: "Planetary bodies across the Solar System have distinct oxygen isotope fingerprints (¹⁶O, ¹⁷O, ¹⁸O). Earth and Moon share nearly identical Δ¹⁷O ratios, proving they coalesced from the same thoroughly mixed debris cloud."
          },
          {
            q: "What is an impact breccia, and what geological event does it record on the Moon?",
            options: ["Sedimentary limestone formed in ancient lunar oceans", "Composite rock made of angular fragments fused together by extreme heat and shock pressure during meteorite impacts", "Cooled lava bubble", "Windblown dune siltstone"],
            answer: 1,
            explanation: "Impact breccias are shock-metamorphosed rocks composed of angular rock and mineral clasts cemented together by molten impact melt during hypervelocity collisions."
          }
        ]
      },
      unexpectedEvent: {
        title: "ROVER SOFT REGOLITH TRACTION WARNING",
        situation: "While traversing the rim of an ancient impact crater, the rover’s rear wheels dig into a pocket of ultra-fine, low-cohesion dust. Motor torque spikes and wheel slip exceeds 70%. What is your recovery maneuver?",
        options: [
          "Lock differential on all 6 independent wheel hub motors, decrease throttle to low torque, reverse trajectory along previous compacted tracks, and route around the depression",
          "Accelerate to full maximum forward speed to spin the wheels aggressively",
          "Get out and push the 400 kg rover uphill alone",
          "Abandon the rover and run on foot without radio navigation"
        ],
        correctIndex: 0,
        feedback: "Masterful rover recovery! In low gravity with powdery regolith, spinning tires only digs deeper holes. Gentle low-torque reversal along compacted tracks restores traction smoothly."
      }
    },
    {
      id: 'moon_final',
      order: 6,
      number: 'FINAL MOON MISSION',
      title: 'Return to Earth',
      destination: 'Trans-Earth Trajectory & Pacific Splashdown',
      icon: '🏆',
      rewardMedal: 'LUNAR MISSION COMMANDER',
      xp: 400,
      storyIntro: "Cadet, your lunar expedition is complete! You have explored the surface, established a research station, and completed scientific investigations. One final challenge remains: safely complete your return journey.",
      learningObjectives: [
        'Master lunar surface liftoff using the Ascent Propulsion System',
        'Perform orbital rendezvous and docking with the command module',
        'Execute Trans-Earth Injection (TEI) burn',
        'Survive atmospheric re-entry at 11 km/s with thermal ablative heat shield',
        'Coordinate supersonic parachute deployment and safe ocean recovery'
      ],
      educationalContent: [
        {
          title: 'Ascent from Another World',
          text: 'To leave the Moon, the Lunar Ascent Module ignites hypergolic rocket engines. Because lunar escape velocity is only 2.38 km/s (compared to Earth’s 11.2 km/s), a single-stage engine is enough to reach lunar orbit and rendezvous with the return spacecraft.'
        },
        {
          title: 'The Blazing Re-entry at 11 km/s',
          text: 'Returning from the Moon, the capsule hits Earth’s upper atmosphere at Mach 36 (11,000 m/s). Friction compresses atmospheric gas into a glowing 2,800°C plasma sheath. The ablative heat shield melts away layer by layer to carry intense heat away before parachutes deploy.'
        }
      ],
      interactiveTask: {
        type: 'flight_reentry',
        title: 'Earth Re-entry Flight Sequence',
        instruction: 'Guide the command capsule safely through the atmospheric re-entry corridor.',
        steps: [
          '1. Service Module Separation & Capsule Attitude Alignment',
          '2. Entry Interface at 120 km altitude (400,000 ft)',
          '3. Peak Heating Plasma Blackout & Ablative Heat Shield Absorption',
          '4. Drogue Parachute Mortar Deployment at Mach 1.5',
          '5. Main Tri-Chute Deployment & Pacific Ocean Touchdown'
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "What protects astronauts from burning up when their capsule returns through Earth’s thick atmosphere at super-high speed?",
            options: ["A thick shield of ice", "An ablative heat shield that absorbs the heat and slowly melts away", "A giant metal umbrella", "Turning on the air conditioner"],
            answer: 1,
            explanation: "The bottom of the space capsule has a special ablative heat shield that withstands 2,800°C, melting away safely while keeping the astronauts cool inside!"
          },
          {
            q: "What slows down the space capsule in the final stage before splashing down gently into the ocean?",
            options: ["Three giant red-and-white parachutes", "Rockets firing into the water", "A giant trampoline", "A massive spring"],
            answer: 0,
            explanation: "Three massive main parachutes deploy in the lower atmosphere, slowing the capsule down from hundreds of kilometers per hour to a gentle 25 km/h splashdown!"
          }
        ],
        grade_6_8: [
          {
            q: "Why does a spacecraft returning from the Moon enter Earth's atmosphere much faster (11 km/s) than a spacecraft returning from the ISS (7.7 km/s)?",
            options: ["The lunar spacecraft has larger engines firing during re-entry", "The spacecraft falls from 384,400 km away down Earth’s deep gravitational potential well, converting potential energy into kinetic energy", "Solar wind blows it faster", "Earth’s atmosphere pulls harder on lunar craft"],
            answer: 1,
            explanation: "A spacecraft falling back from the Moon accelerates down Earth’s entire gravitational gravity well, approaching the parabolic escape velocity of 11.2 km/s at atmospheric entry!"
          },
          {
            q: "What causes the temporary 'radio blackout' during atmospheric entry?",
            options: ["Houston flight controllers turn off their headsets", "Superheated plasma envelope ionized around the heat shield blocks radio waves", "The antennas get wet in rain clouds", "Spacecraft batteries run out"],
            answer: 1,
            explanation: "Compressional shockwaves heat air molecules into a conductive sheath of ionized plasma (free electrons and ions) that reflects and absorbs electromagnetic radio signals for several minutes."
          }
        ],
        grade_9_12: [
          {
            q: "Why must the re-entry flight path angle (γ) fall precisely within a narrow 'corridor' of -5.5° to -7.5° for lunar return?",
            options: ["To avoid hitting commercial aircraft flight paths", "Too shallow (γ > -5.5°) causes the capsule to skip off the atmosphere into space; too steep (γ < -7.5°) creates lethal deceleration G-forces and exceeds thermal shield limits", "To line up with satellite antennas", "To ensure solar panels stay illuminated"],
            answer: 1,
            explanation: "If entry is too shallow, lift causes the spacecraft to skip off Earth's upper atmosphere back into an elliptical orbit. If too steep, peak aerodynamic deceleration exceeds human tolerance (>10 Gs) and heat flux destroys the structure."
          },
          {
            q: "What aerodynamic phenomenon generates the primary heat during hypersonic atmospheric entry: friction or shock compression?",
            options: ["Friction between air molecules and the hull surface", "Shock wave compression: the blunt body compresses atmospheric gas so rapidly that temperature spikes adiabatically (ideal gas law)", "Solar radiation absorption", "Radioactive decay of heat shield composites"],
            answer: 1,
            explanation: "Contrary to popular belief, hypersonic heating is primarily bow shock compression! The blunt body pushes a detached shock wave ahead of it, adiabatically compressing gas at thousands of Kelvin."
          }
        ]
      },
      unexpectedEvent: {
        title: "DROGUE PARACHUTE ANOMALY ALERT",
        situation: "At 8,000 meters altitude during transonic descent, aerodynamic buffeting causes Drogue Parachute 1 to show asymmetric tension. Main parachute deployment logic is armed. What is the commander action?",
        options: [
          "Trigger backup pyro-actuated drogue mortar release, stabilize capsule roll angle, and initiate barometric sequence for main parachute cluster deployment at 3,000 meters",
          "Cut all parachute cables immediately",
          "Fire reverse thrusters inside the atmosphere",
          "Attempt to climb outside the capsule to untangle the cable"
        ],
        correctIndex: 0,
        feedback: "FLAWLESS COMMAND! The triple-redundant parachute system safely deploys the backup drogue, stabilizing the capsule for flawless main deployment and ocean recovery."
      }
    }
  ];

  // EXPEDITION 2: RED PLANET RISING (MARS) - 6 MISSIONS
  const MARS_EXPEDITION = [
    {
      id: 'mars_1',
      order: 1,
      number: 'MISSION 01',
      title: 'Preparing for the Red Planet',
      destination: 'ASETC Deep Space Integration Hangar',
      icon: '🔴',
      rewardMedal: 'MARS MISSION SPECIALIST',
      xp: 250,
      storyIntro: "Cadet, your lunar expedition was a success! But humanity's next challenge is much bigger. Our next destination is Mars, the Red Planet.",
      learningObjectives: [
        'Understand basic physical facts about Mars (mass, gravity, 24.6h sol)',
        'Learn why Mars appears reddish due to iron oxide (rust) in the regolith',
        'Discover the massive distance between Earth and Mars (55M to 400M km)',
        'Understand Hohmann transfer orbital launch windows occurring every 26 months',
        'Calculate food, water, oxygen, and radiation shielding cargo requirements'
      ],
      educationalContent: [
        {
          title: 'The Red Planet: Facts & Figures',
          text: 'Mars is the 4th planet from the Sun, roughly half the size of Earth, with 38% of Earth’s surface gravity (0.38g). A Martian day (called a "sol") is 24 hours and 39 minutes—remarkably close to Earth! Its reddish appearance comes from iron oxide (rust) covering its surface.'
        },
        {
          title: 'The Distance & Launch Windows',
          text: 'Because Earth and Mars orbit the Sun at different speeds, the distance between them fluctuates between 55 million km and 400 million km! A Hohmann transfer launch window opens only once every 26 months when planetary alignment minimizes fuel requirements.'
        },
        {
          title: 'The 3-Year Mass Budget Challenge',
          text: 'A round-trip Mars expedition takes nearly 3 years (6-9 months travel each way, plus ~500 days waiting on Mars for orbital alignment). A crew of four needs tons of freeze-dried food, water recycling, and medical supplies within strict mass limits.'
        }
      ],
      interactiveTask: {
        type: 'pack_cargo',
        title: 'Mars Spacecraft Cargo Manifest Optimizer',
        instruction: 'Allocate the 50-ton deep space payload budget across essential mission modules.',
        items: [
          { name: '3-Year Calibrated Nutrition Packs', mass: 12, desc: 'Freeze-dried vitamins, calories and protein' },
          { name: 'Redundant Closed-Loop Water Purifier', mass: 8, desc: 'Recovers 98% moisture from breath and hygiene' },
          { name: 'MOXIE Surface Oxygen Production Unit', mass: 10, desc: 'Produces breathable O2 from Martian CO2 atmosphere' },
          { name: 'Solar Storm Water-Wall Shelter', mass: 10, desc: 'Shields crew quarters against solar particle events' },
          { name: 'Spare Life Support Valves & Electronics', mass: 10, desc: '3D printing filament and redundant ECLSS pumps' }
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "Why does Mars look red when you look at it in the night sky?",
            options: ["It is made of hot red fire", "Its soil is rich in iron oxide (which is rust)", "Giant red lights shine on it", "It is covered in red flowers"],
            answer: 1,
            explanation: "The surface dust of Mars is rich in iron minerals that have rusted over billions of years, giving the entire planet its famous reddish-orange hue!"
          },
          {
            q: "How long is a day on Mars (called a 'sol') compared to a day on Earth?",
            options: ["Almost the same: about 24 hours and 39 minutes", "100 hours long", "Only 2 minutes", "1 whole year"],
            answer: 0,
            explanation: "Mars spins on its axis at almost the same speed as Earth! A Martian day (sol) is 24 hours, 39 minutes, and 35 seconds."
          }
        ],
        grade_6_8: [
          {
            q: "Why can spacecraft only launch toward Mars economically once every 26 months?",
            options: ["Rocket fuel factories take 2 years to make fuel", "Every 26 months, Earth and Mars align along their orbits to allow an energy-efficient Hohmann Transfer", "Astronauts need 2 years of sleep", "Solar flares block launches in odd years"],
            answer: 1,
            explanation: "Because Earth orbits faster than Mars, Earth laps Mars every 26 months (synodic period). Launching during this window creates the most fuel-efficient elliptical transfer orbit."
          },
          {
            q: "If you weigh 100 kg on Earth, what would your approximate weight be on Mars (surface gravity = 3.71 m/s²)?",
            options: ["100 kg", "~38 kg equivalent force (~371 N)", "600 kg", "Zero"],
            answer: 1,
            explanation: "Mars surface gravity is roughly 38% of Earth's gravity (0.38g). A 100 kg person would weigh about 371 Newtons (equivalent to feeling like 38 kg on Earth)!"
          }
        ],
        grade_9_12: [
          {
            q: "What is the orbital semi-major axis (a) of a minimum-energy Hohmann transfer orbit from Earth (r1 = 1.00 AU) to Mars (r2 = 1.52 AU)?",
            options: ["1.00 AU", "1.26 AU", "1.52 AU", "2.52 AU"],
            answer: 1,
            explanation: "For a Hohmann transfer ellipse, semi-major axis a_transfer = (r1 + r2) / 2 = (1.00 + 1.52) / 2 = 1.26 AU. Using Kepler's 3rd Law, transit time T/2 = sqrt(1.26³) / 2 ≈ 0.707 years (~258 days / 8.5 months)."
          },
          {
            q: "Why is water one of the most effective lightweight shielding materials against Galactic Cosmic Rays (GCR) during interplanetary transit?",
            options: ["Water freezes into hard ice armor", "Water molecules have a high ratio of light hydrogen nuclei (protons), which minimize harmful secondary neutron fragmentation when struck by heavy ions", "Water creates a magnetic field", "Water dissolves cosmic rays into salt"],
            answer: 1,
            explanation: "High-Z materials like lead produce hazardous secondary neutron scatter when hit by GCRs. Low-Z materials with abundant hydrogen (like water H2O and polyethylene) absorb energetic protons with minimal secondary radiation."
          }
        ]
      },
      unexpectedEvent: {
        title: "PAYLOAD MASS EXCEEDED BY 450 KG",
        situation: "Final roll-out telemetry indicates the Trans-Mars spacecraft exceeds launch vehicle delta-v margins by 450 kg. Which non-critical item should you offload?",
        options: [
          "Replace heavy steel structural brackets with carbon-composite mounts and offload non-essential luxury recreation items",
          "Remove half of the astronaut drinking water",
          "Leave the heat shield behind",
          "Remove the navigation computer"
        ],
        correctIndex: 0,
        feedback: "Smart mission engineering! Never sacrifice core life-support, navigation, or thermal protection. Optimizing structural material mass preserves crew survival margins."
      }
    },
    {
      id: 'mars_2',
      order: 2,
      number: 'MISSION 02',
      title: 'The Long Journey to Mars',
      destination: 'Interplanetary Deep Space (150 Million km)',
      icon: '🌌',
      rewardMedal: 'DEEP SPACE NAVIGATOR MEDAL',
      xp: 280,
      storyIntro: "Your spacecraft has left Earth orbit. Mars is millions of kilometres away, and your journey will take months. You must understand how astronauts manage their daily lives during long-duration missions.",
      learningObjectives: [
        'Understand communication speed-of-light latency (4 to 24 minutes one-way)',
        'Learn physiological countermeasures against bone density loss and muscle atrophy',
        'Discover the importance of nutrition, psychology, and crew coordination',
        'Master deep-space radiation storm shelter protocols'
      ],
      educationalContent: [
        {
          title: 'The Speed of Light Delay',
          text: 'Radio signals travel at the speed of light (300,000 km/s). When Mars is far from Earth, a radio message takes over 20 minutes to reach Houston, and another 20 minutes to receive an answer! Astronauts must be completely autonomous and solve problems independently.'
        },
        {
          title: '2.5 Hours of Daily Exercise',
          text: 'In zero gravity, bones lose up to 1% to 1.5% of mineral density per month without load-bearing pressure. Astronauts use resistance exercise machines (like ARED) and treadmills strapped with bungees for 2.5 hours every day to keep hearts, muscles, and bones strong.'
        }
      ],
      interactiveTask: {
        type: 'daily_schedule',
        title: 'Deep-Space Daily Routine Scheduler',
        instruction: 'Balance the crew daily flight timeline across 4 key survival activities.',
        schedule: [
          { activity: 'Heavy Resistance Exercise (ARED)', time: '2.5 Hours', benefit: 'Prevents bone calcium demineralization' },
          { activity: 'ECLSS & Life-Support Inspection', time: '3.0 Hours', benefit: 'Verifies CO2 scrubbers, water recycling & pressure' },
          { activity: 'Scientific Observations & Maintenance', time: '5.5 Hours', benefit: 'Solar telemetry, deep space astronomy & crop care' },
          { activity: 'Rest, Nutrition & Psychological Downtime', time: '8.0 Hours', benefit: 'Essential for crew focus, mental health & circadian rhythm' }
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "Why can't astronauts on their way to Mars have an instant phone call with their families on Earth?",
            options: ["Space cellphones run out of battery", "Radio waves take up to 20 minutes to travel the huge distance across space", "Microphones do not work in spaceships", "The Moon blocks all signals every day"],
            answer: 1,
            explanation: "Even light and radio signals (the fastest things in the universe) take up to 20 minutes to cross the millions of kilometers between Earth and Mars!"
          },
          {
            q: "Why do astronauts have to exercise vigorously for over 2 hours every single day in space?",
            options: ["To train for the Olympics", "Because without gravity, muscles and bones become weak and fragile", "To generate electricity for the ship", "Because there are no chairs to sit on"],
            answer: 1,
            explanation: "In zero-g, your body doesn't need muscles to stand up. If astronauts didn't exercise with heavy resistance, their bones and muscles would quickly weaken!"
          }
        ],
        grade_6_8: [
          {
            q: "If Mars is at a distance of 180 million km from Earth, how long does a radio transmission take to travel one way (c = 300,000 km/s)?",
            options: ["10 seconds", "600 seconds (10 minutes)", "2 hours", "1 day"],
            answer: 1,
            explanation: "Time = distance / speed = 180,000,000 km / 300,000 km/s = 600 seconds = 10 minutes. A round-trip question and response would take 20 minutes!"
          },
          {
            q: "What medical condition affects an astronaut’s eyes during long-duration spaceflight?",
            options: ["Spaceflight-Associated Neuro-ocular Syndrome (SANS)", "Total color blindness", "Night vision loss", "Excess tears evaporation"],
            answer: 0,
            explanation: "In microgravity, bodily fluids shift upward into the head, increasing intracranial pressure on the optic nerve and flattening the back of the eyeball, known as SANS."
          }
        ],
        grade_9_12: [
          {
            q: "What bio-marker in astronaut urine indicates rapid bone mineral resorption during long-duration microgravity transit?",
            options: ["Elevated free calcium and N-telopeptide crosslinks", "Lactic acid accumulation", "Excess hemoglobin", "Uric acid crystallization"],
            answer: 0,
            explanation: "Without gravitational loading, osteoclast activity outpaces osteoblasts, leaching calcium carbonate and collagen breakdown products (N-telopeptides) into blood and urine, raising kidney stone risks."
          },
          {
            q: "How does an autonomous spacecraft navigation system determine its state vector without ground-based Deep Space Network (DSN) uplink during a comm blackout?",
            options: ["Magnetic compass alignment", "Optical celestial triangulation using star trackers and known planetary ephemeris angles", "GPS satellites in Earth orbit", "Barometric pressure gradient"],
            answer: 1,
            explanation: "Autonomous deep-space navigation (AutoNav) uses onboard optical cameras to image beacon asteroids and target planets against background star fields, calculating position via triangulation."
          }
        ]
      },
      unexpectedEvent: {
        title: "CORONAL MASS EJECTION (SOLAR PROTON EVENT) WARNING",
        situation: "Deep Space Climate Observatory detects an X-class solar flare producing a high-energy proton storm heading directly toward your spacecraft in 45 minutes. What is your survival protocol?",
        options: [
          "Maneuver all crew members into the heavily shielded central Storm Shelter surrounded by water tanks and food crates, and orient the main engine block toward the Sun",
          "Go outside on a spacewalk to inspect the solar array",
          "Open all interior vents to release cabin air",
          "Turn off all life support to save battery"
        ],
        correctIndex: 0,
        feedback: "Outstanding radiation defense! Surrounding the inner storm shelter with water tanks and dense food supplies absorbs lethal solar protons, reducing radiation dose by over 80%."
      }
    },
    {
      id: 'mars_3',
      order: 3,
      number: 'MISSION 03',
      title: 'Landing on Mars',
      destination: 'Jezero Crater Landing Ellipse',
      icon: '🪂',
      rewardMedal: 'RED PLANET LANDING MEDAL',
      xp: 320,
      storyIntro: "Attention, Cadet! Mars is now visible through the spacecraft window. Your landing sequence is approaching. You must understand how spacecraft safely reach the Martian surface.",
      learningObjectives: [
        'Understand the thin Martian atmosphere (only 1% of Earth’s surface pressure)',
        'Master the phases of Entry, Descent, and Landing (EDL / "Seven Minutes of Terror")',
        'Learn hypersonic aerodynamic braking and supersonic parachute deployment',
        'Discover Sky Crane and retrorocket touchdown technologies',
        'Select safe landing zones using terrain relief and hazard mapping'
      ],
      educationalContent: [
        {
          title: 'The Challenge of the Martian Atmosphere',
          text: 'Mars’s atmosphere is 95% carbon dioxide, but its surface pressure is only 610 Pascals—less than 1% of Earth’s! It is thick enough to burn up a spacecraft without a heat shield, but too thin to slow it down with parachutes alone. Retrorockets are mandatory.'
        },
        {
          title: 'The Seven Minutes of Terror',
          text: 'Entry, Descent, and Landing takes about 7 minutes. Because radio signals take up to 20 minutes to reach Earth, humans in Mission Control cannot pilot the craft. An autonomous computer must guide the vehicle through hypersonic deceleration from 20,000 km/h to zero.'
        }
      ],
      interactiveTask: {
        type: 'edl_sequence',
        title: 'Martian EDL Flight Profile Sequencer',
        instruction: 'Click the 5 EDL stages in precise chronological order to land safely.',
        stages: [
          '1. Atmospheric Entry Interface at 20,000 km/h with Ablative Aeroshell',
          '2. Hypersonic Guided Lifting Entry & Peak Aerodynamic Braking',
          '3. Supersonic Parachute Mortar Fire at Mach 2 (1,500 km/h)',
          '4. Heat Shield Jettison & Terrain Relative Navigation (TRN) Radar Lock',
          '5. Retrorocket Descent Stage Sky Crane Touchdown at 0.75 m/s'
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "Why is landing on Mars much harder than landing on Earth?",
            options: ["Because Mars is covered in thick water", "Because the Martian air is so thin that parachutes alone cannot slow the spacecraft down", "Because Mars spins ten times faster", "Because gravity is stronger on Mars"],
            answer: 1,
            explanation: "The air on Mars is less than 1% as thick as Earth's! Parachutes help, but the spacecraft is still falling too fast, requiring rocket engines to touch down gently."
          },
          {
            q: "Why must the landing computer on Mars fly the entire landing completely on its own without human control?",
            options: ["Because astronauts are always eating lunch", "Because radio signals from Earth take over 10 minutes to arrive, so it is too late to steer", "Because humans are not allowed to push buttons", "Because rockets only work when computers fly them"],
            answer: 1,
            explanation: "By the time engineers in Mission Control see that the spacecraft has entered the Martian atmosphere, the landing is already over! The computer must make every split-second decision autonomously."
          }
        ],
        grade_6_8: [
          {
            q: "What is Terrain-Relative Navigation (TRN) used on NASA's Perseverance Mars rover?",
            options: ["A voice GPS telling the rover to turn left", "An onboard camera and computer that matches live photos of the ground with satellite hazard maps to avoid boulders and cliffs", "A magnetic compass", "Following ancient river maps drawn by astronomers"],
            answer: 1,
            explanation: "TRN takes real-time photos during parachute descent, compares them with onboard orbital hazard maps, and commands retrorockets to divert to the safest flat landing patch!"
          },
          {
            q: "What happens to the kinetic energy of a spacecraft entering Mars atmosphere at 20,000 km/h?",
            options: ["It disappears into outer space", "It is converted into extreme thermal energy (heat) by compressing the atmospheric gas in front of the heat shield", "It charges the solar panels", "It turns into sound waves"],
            answer: 1,
            explanation: "Conservation of energy: the massive kinetic energy of high-speed orbital flight is converted into thermal heat energy in the shock layer, protected by the ablative heat shield."
          }
        ],
        grade_9_12: [
          {
            q: "Why is the ballistic coefficient (β = m / (C_d · A)) a critical limiting parameter for Mars entry vehicles?",
            options: ["High β allows lighter parachutes", "Because Mars' thin scale height (H ≈ 11.1 km) means high ballistic coefficient vehicles reach supersonic parachute deploy altitudes before decelerating sufficiently", "It affects fuel tank pressurization", "It determines orbital escape velocity"],
            answer: 1,
            explanation: "A high ballistic coefficient means a heavy vehicle with small surface area. In Mars' thin atmosphere, high-β spacecraft do not decelerate enough before slamming into the ground unless massive hypersonic drag devices are deployed."
          },
          {
            q: "At what Mach number did NASA deploy the disc-gap-band supersonic parachute for Perseverance in the Martian CO2 atmosphere?",
            options: ["Mach 0.3", "Mach 1.8 to 2.0", "Mach 7.5", "Mach 25.0"],
            answer: 1,
            explanation: "The 21.5-meter supersonic parachute was mortar-deployed at approximately Mach 1.8 to 2.0 at dynamic pressures near 400 Pascals, producing up to 32,000 kg of drag force."
          }
        ]
      },
      unexpectedEvent: {
        title: "TERRAIN RELATIVE RADAR DETECTS BOULDER FIELD",
        situation: "At 1,200 meters above the surface, Terrain Relative Navigation (TRN) cameras detect a field of 3-meter boulders right in the primary descent path. What is your automated flight abort action?",
        options: [
          "Initiate an autonomous 250-meter lateral divert burn using canted descent thrusters toward the secondary smooth landing target",
          "Cut rocket engines and let the capsule drop immediately",
          "Attempt to parachute back into orbit",
          "Turn off radar sensors to clear the error code"
        ],
        correctIndex: 0,
        feedback: "BRILLIANT AUTOMATED TOUCHDOWN! Autonomous hazard avoidance diverts the craft horizontally away from lethal rocks, executing a feather-soft touchdown on flat bedrock."
      }
    },
    {
      id: 'mars_4',
      order: 4,
      number: 'MISSION 04',
      title: 'Surviving the Martian Environment',
      destination: 'Ares Base One · Jezero Crater',
      icon: '🛡️',
      rewardMedal: 'MARS SURVIVAL EXPERT',
      xp: 350,
      storyIntro: "You have landed successfully! However, Mars is not a place where humans can survive without protective technology. Understand the Martian environment before beginning exploration.",
      learningObjectives: [
        'Understand the unbreathable 95% CO2 atmosphere and low pressure',
        'Learn to survive extreme cold temperatures averaging -63°C',
        'Discover NASA MOXIE solid oxide electrolysis producing oxygen from CO2',
        'Understand planet-encircling dust storms and electrostatic charging',
        'Master pressurized rover habitats and closed-loop life support'
      ],
      educationalContent: [
        {
          title: 'The Deadly Martian Atmosphere',
          text: 'The atmosphere on Mars consists of 95% Carbon Dioxide (CO2), 2.6% Molecular Nitrogen (N2), and 1.9% Argon (Ar). Without a pressurized spacesuit, human blood would boil at body temperature (Armstrong limit at ~6.3 kPa, whereas Mars surface pressure is only 0.6 kPa).'
        },
        {
          title: 'MOXIE: Making Oxygen on Mars',
          text: 'NASA’s MOXIE experiment (Mars Oxygen ISRU Experiment) proved that we can harvest breathable oxygen directly on Mars! It draws in Martian CO2, heats it to 800°C, and uses solid oxide electrolysis to split it into carbon monoxide and breathable oxygen: 2 CO2 -> 2 CO + O2.'
        }
      ],
      interactiveTask: {
        type: 'moxie_simulation',
        title: 'MOXIE Oxygen Generator Calibration',
        instruction: 'Configure the 3 stages of the MOXIE system to produce 10 kg/hr of pure breathable oxygen.',
        stages: [
          { name: '1. Atmospheric Gas Intake & Dust Filter', setting: 'Pressurize CO2 gas to 1.0 atm' },
          { name: '2. Solid Oxide Electrolysis Cell (SOEC)', setting: 'Heat ceramic zirconia tubes to 800°C' },
          { name: '3. Oxygen Purity Separation & Liquefaction', setting: 'Separate pure O2 from CO exhaust and chill to liquid' }
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "What is the main gas in the atmosphere of Mars?",
            options: ["Pure oxygen", "Carbon dioxide (CO2)", "Water vapor", "Helium balloon gas"],
            answer: 1,
            explanation: "Mars air is 95% carbon dioxide. Humans cannot breathe carbon dioxide, so astronauts must wear pressurized spacesuits at all times!"
          },
          {
            q: "How does NASA’s MOXIE machine help astronauts breathe on Mars?",
            options: ["It ships oxygen tanks from Earth every morning", "It pulls in Martian carbon dioxide gas and splits it to create fresh oxygen gas", "It plants apple trees outside in the dust", "It melts rocks into orange juice"],
            answer: 1,
            explanation: "MOXIE acts like a robotic tree! It takes in the carbon dioxide on Mars and uses electricity and heat to split out pure, breathable oxygen."
          }
        ],
        grade_6_8: [
          {
            q: "What would happen to unpressurized human bodily fluids on Mars where surface pressure is only 0.6 kPa?",
            options: ["They would freeze into steel immediately", "Water and bodily fluids would boil at body temperature (37°C) because of the Armstrong Limit", "They would turn into pure gold", "Nothing happens"],
            answer: 1,
            explanation: "At the Armstrong Limit (~6.3 kPa), atmospheric pressure is so low that water boils at normal body temperature (37°C). On Mars (0.6 kPa), blood saliva and lung fluids would vaporize without a pressure suit!"
          },
          {
            q: "What is the average surface temperature on Mars?",
            options: ["+45°C (Warm tropical)", "About -63°C (-81°F) with winter poles dropping below -125°C", "+100°C (Boiling hot)", "0°C"],
            answer: 1,
            explanation: "Because Mars is 50% farther from the Sun than Earth and has a thin atmosphere, it is extremely cold, averaging -63°C!"
          }
        ],
        grade_9_12: [
          {
            q: "What is the chemical reaction and operating temperature of the Solid Oxide Electrolysis Cell (SOEC) in NASA's MOXIE instrument?",
            options: ["H2 + O2 -> H2O at 25°C", "2 CO2 -> 2 CO + O2 at ~800°C using Scandia-stabilized Zirconia (YSZ) ceramic electrolytes", "CH4 + 2 O2 -> CO2 + 2 H2O at 500°C", "Fe + O2 -> Fe2O3 at 100°C"],
            answer: 1,
            explanation: "At 800°C, oxygen ions are stripped from CO2 across ceramic zirconia membranes: 2 CO2 + electrical energy -> 2 CO + O2. Oxygen ions recombine at the anode to form pure diatomic O2 gas."
          },
          {
            q: "Why are toxic perchlorate salts (ClO4⁻) found in Martian soil dangerous to long-term human exploration?",
            options: ["They explode spontaneously in sunlight", "They disrupt thyroid endocrine function, damage lungs when inhaled, and corrode structural alloys", "They freeze water into stone", "They interfere with radio communications"],
            answer: 1,
            explanation: "Martian regolith contains 0.5% to 1.0% magnesium and calcium perchlorates. Inhaling dust causes thyroid inhibition and pulmonary inflammation, requiring strict airlock wash-down protocols."
          }
        ]
      },
      unexpectedEvent: {
        title: "MARTIAN DUST STORM ALERT!",
        situation: "Thermal orbital cameras detect a regional dust wall 40 km wide approaching Ares Base One at 85 km/h. Fine electrostatic dust is blocking 90% of solar radiation. What is your base survival procedure?",
        options: [
          "Recall all EVA rovers to habitat garage, switch electrical grid from solar to Kilopower fission reactor / battery reserves, seal airlock positive-pressure barriers, and initiate HEPA perchlorate air scrubbers",
          "Leave habitat doors open to let the wind blow through",
          "Attempt to vacuum the outdoor sand dunes during the storm",
          "Turn off life-support heaters to save power"
        ],
        correctIndex: 0,
        feedback: "OUTSTANDING SURVIVAL PROTOCOL! Major Martian dust storms can last for months. Switching to non-solar power and sealing habitats against abrasive dust keeps the crew warm and safe."
      }
    },
    {
      id: 'mars_5',
      order: 5,
      number: 'MISSION 05',
      title: 'The Search for Ancient Life',
      destination: 'Jezero Crater Ancient River Delta',
      icon: '🔬',
      rewardMedal: 'ASTROBIOLOGY EXPLORER MEDAL',
      xp: 380,
      storyIntro: "Scientists have discovered geological formations suggesting that liquid water may have existed on ancient Mars. Your mission is to investigate these formations and collect scientific data. Could Mars once have supported microbial life?",
      learningObjectives: [
        'Explore ancient river delta and lakebed sedimentary deposits',
        'Learn the definition of biosignatures and organic carbon compounds',
        'Operate Mars exploration rover instruments (spectrometers, coring drill)',
        'Understand why NO confirmed evidence of past or present life has yet been discovered',
        'Apply rigorous scientific methods: extraordinary claims require extraordinary evidence'
      ],
      educationalContent: [
        {
          title: 'Evidence of Ancient Water',
          text: 'Over 3.5 billion years ago, Mars had a thicker atmosphere, a global magnetic field, and liquid water flowing across its surface. Ancient river valleys, deltas, and clay minerals in Jezero Crater prove that a deep lake once existed here.'
        },
        {
          title: 'Astrobiology & The Search for Biosignatures',
          text: 'Astrobiology is the study of the origin, evolution, and distribution of life in the universe. Scientists look for biosignatures: chemical compounds, cellular structures, or isotopic imbalances that could only be produced by biological life.'
        },
        {
          title: 'CRITICAL SCIENTIFIC ACCURACY',
          text: 'To this day, NO confirmed evidence of past or present life has ever been discovered on Mars. Organic molecules have been found, but they can be formed by non-biological (abiotic) chemical processes. Scientists must never jump to conclusions without rigorous verification!'
        }
      ],
      interactiveTask: {
        type: 'rover_sampling',
        title: 'Jezero Delta Astrobiology Traverse',
        instruction: 'Pilot the Perseverance rover arm to sample 3 sedimentary layers in the river delta.',
        samples: [
          { name: 'Mudstone Sedimentary Core #01', location: 'Delta Bottomsets', desc: 'Fine clay minerals capable of preserving ancient organic molecules' },
          { name: 'Sandstone Cross-Bed Core #02', location: 'Ancient Riverbed Channel', desc: 'Indicates high-velocity running water 3.7 billion years ago' },
          { name: 'Carbonate-Rich Rim Core #03', location: 'Crater Paleolake Shore', desc: 'Precipitated minerals in neutral, habitable ancient water' }
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "Have scientists ever found real alien bugs, plants, or confirmed living creatures on Mars?",
            options: ["Yes, astronauts found Martian trees", "No, scientists have found NO confirmed evidence of past or present life on Mars yet", "Yes, giant spiders live in caves", "Yes, fossils were found yesterday"],
            answer: 1,
            explanation: "Scientifically accurate fact: While rovers have found ancient dried-up lakebeds, scientists have NOT discovered any confirmed evidence of life on Mars yet!"
          },
          {
            q: "What evidence shows that Mars had lots of liquid water millions of years ago?",
            options: ["Dried river valleys, lake deltas, and smooth water-worn pebbles", "Old pirate ships buried in sand", "Fish bones in the craters", "Giant ice rinks"],
            answer: 0,
            explanation: "NASA rovers and orbiters have photographed dry river valleys, delta sedimentary layers, and smooth pebbles that could only form under flowing liquid water!"
          }
        ],
        grade_6_8: [
          {
            q: "Why are clay minerals (like smectite) in Jezero Crater so exciting to astrobiologists?",
            options: ["Clay can be made into coffee mugs", "Clay forms in liquid water with neutral pH and has microscopic layers that trap and preserve organic carbon molecules", "Clay gives off free rocket fuel", "Clay reflects radar like a mirror"],
            answer: 1,
            explanation: "Clay minerals require standing liquid water to form. Their tight microscopic crystal structures are the best materials known for preserving organic carbon and potential fossilized biosignatures."
          },
          {
            q: "If an instrument detects organic carbon molecules in a Mars rock, does that automatically prove life existed?",
            options: ["Yes, 100% proof of life", "No, organic molecules can also be synthesized by non-biological (abiotic) chemical reactions and meteorites", "Organic molecules only exist in space suits", "It means humans dropped food there"],
            answer: 1,
            explanation: "Scientific accuracy is paramount: Organic molecules (carbon and hydrogen) are found in comets, meteorites, and hydrothermal vents through purely abiotic chemical reactions."
          }
        ],
        grade_9_12: [
          {
            q: "What scientific principle did Carl Sagan famously formulate regarding the verification of potential extraterrestrial biosignatures?",
            options: ["Occam's razor is invalid in space", "'Extraordinary claims require extraordinary evidence'", "First hypothesis is always correct", "Life exists wherever carbon is present"],
            answer: 1,
            explanation: "Sagan's standard dictates that before declaring evidence of extraterrestrial life, every possible abiotic, geochemical, instrumental, and contamination explanation must be systematically falsified."
          },
          {
            q: "Why are sample return missions (MSR) necessary instead of relying entirely on onboard rover laboratory instruments?",
            options: ["Rovers have broken cameras", "Terrestrial synchrotrons, transmission electron microscopes (TEM), and mass spectrometers on Earth are thousands of times more sensitive than miniaturized rover instruments", "It costs less to bring rocks to Earth", "Rover batteries die after 100 samples"],
            answer: 1,
            explanation: "Earth laboratories possess multi-ton particle accelerators, sub-angstrom transmission electron microscopes, and ultra-clean containment facilities capable of atomic-level isotopic and structural analysis."
          }
        ]
      },
      unexpectedEvent: {
        title: "UNEXPECTED ORGANIC SPECTROMETRY DETECTION",
        situation: "The rover’s Raman and Luminescence spectrometer detects complex aromatic carbon rings in delta mudstone Sample #4. The media wants to announce alien life. As Science Officer, what is your scientific statement?",
        options: [
          "State clearly that organic molecules have been discovered, but rigorous abiotic synthesis and terrestrial contamination checks must be completed before drawing biological conclusions",
          "Announce to the world that intelligent aliens have been proven without question",
          "Throw away the sample because it is confusing",
          "Shut down the spectrometer to avoid controversy"
        ],
        correctIndex: 0,
        feedback: "EXEMPLARY SCIENTIFIC INTEGRITY! True scientists maintain epistemic rigor. Organic carbon is a vital clue, but abiotic chemistry must be ruled out through verified peer review."
      }
    },
    {
      id: 'mars_final',
      order: 6,
      number: 'FINAL MARS MISSION',
      title: 'The Future of Humanity',
      destination: 'Ares Base One & Beyond the Horizon',
      icon: '👑',
      rewardMedal: 'MARTIAN MISSION COMMANDER',
      xp: 500,
      storyIntro: "Cadet, you have completed an incredible journey. You have travelled millions of kilometres, explored an alien world, studied its environment, and helped establish a research outpost. Humanity is one step closer to understanding Mars. You are now part of the next generation of space explorers.",
      learningObjectives: [
        'Understand In-Situ Propellant Production (ISRU) for the Mars Ascent Vehicle',
        'Synthesize liquid methane (CH4) and liquid oxygen (LOX) from Martian ice and atmosphere',
        'Learn the technological requirements for an enduring multi-planetary civilization',
        'Complete the final comprehensive assessment of the Mars Expedition',
        'Earn the rank of Legendary Space Explorer and receive the Graduation Diploma'
      ],
      educationalContent: [
        {
          title: 'The Fuel to Get Home: In-Situ Methalox',
          text: 'Lifting off from Mars to return to Earth requires 30 tons of propellant. Instead of carrying that immense weight from Earth, astronauts produce Methane (CH4) and Liquid Oxygen (LOX) on Mars by combining carbon dioxide from the air with hydrogen from melted subsurface ice!'
        },
        {
          title: 'Humanity: A Multi-Planetary Species',
          text: 'Establishing permanent research outposts on both the Moon and Mars provides a backup for human knowledge, unlocks infinite clean solar and mineral resources, and inspires the entire global community to unite in peaceful scientific discovery.'
        }
      ],
      interactiveTask: {
        type: 'future_civilization',
        title: 'Martian Outpost Permanent Infrastructure Grid',
        instruction: 'Integrate the 4 master systems for long-term multi-planetary human habitation.',
        systems: [
          { name: 'Methane & Liquid Oxygen Propellant Depot', role: 'Fuels the Mars Ascent Vehicle for round-trip return flights' },
          { name: 'Subsurface Ice Melting & Purification Well', role: 'Provides 1,000 liters/day of pure water for crops & fuel' },
          { name: 'Closed-Loop Hydroponic Greenhouse Farm', role: 'Grows fresh potatoes, wheat, and leafy greens for crew' },
          { name: 'Direct Interplanetary Laser Optical Comms', role: 'Streams 1 Gbps ultra-high-speed scientific data directly to Earth' }
        ]
      },
      dynamicMCQs: {
        grade_3_5: [
          {
            q: "Where will astronauts get rocket fuel to fly home to Earth from Mars?",
            options: ["They will order delivery from Earth", "They will manufacture fuel right on Mars using Martian ice and carbon dioxide air", "From gas stations on the Moon", "They will use giant slingshots"],
            answer: 1,
            explanation: "Making fuel on Mars is called ISRU (In-Situ Resource Utilization)! Making rocket fuel on Mars saves billions of dollars and makes space exploration sustainable."
          },
          {
            q: "What is the greatest reward of exploring the Moon and Mars for children and future scientists?",
            options: ["Getting rich quickly", "Inspiring all humanity to learn science, invent clean technologies, and explore the universe peacefully together", "Playing video games in space", "Leaving Earth behind forever"],
            answer: 1,
            explanation: "Space exploration pushes science forward, invents clean water and solar technologies used on Earth, and shows what humans can achieve when working together peacefully!"
          }
        ],
        grade_6_8: [
          {
            q: "How does the Sabatier reaction produce rocket fuel (methane CH4) on Mars?",
            options: ["By burning Martian red dust", "By reacting Martian carbon dioxide (CO2) with hydrogen (H2) at high temperature: CO2 + 4 H2 -> CH4 + 2 H2O", "By filtering sunlight through glass", "By spinning rover wheels"],
            answer: 1,
            explanation: "The Sabatier reaction: CO2 + 4 H2 -> CH4 + 2 H2O. The methane (CH4) is liquefied for rocket fuel, and the water (H2O) is electrolyzed into oxygen and recycled hydrogen!"
          },
          {
            q: "What role does the Moon play in humanity's long-term plan to explore Mars?",
            options: ["The Moon is just a parking lot", "The Moon serves as a proving ground to test life-support, spacesuits, and habitat technologies only 3 days away from Earth before sending crews on a 3-year Mars mission", "The Moon produces oxygen for Mars", "Astronauts build Mars ships on Moon mountains"],
            answer: 1,
            explanation: "NASA’s Artemis Moon missions are the crucial test bed! Testing deep space systems near Earth allows astronauts to practice survival before embarking on multi-year journeys to Mars."
          }
        ],
        grade_9_12: [
          {
            q: "Why is a methalox (CH4 / LOX) propulsion system preferred over hydrolox (LH2 / LOX) for a reusable Mars return architecture?",
            options: ["Hydrogen burns hotter than methane", "Liquid methane has higher density, requires much less cryogenic insulation than liquid hydrogen (-161°C vs -253°C), and experiences negligible boil-off over multi-year storage", "Methane is purple", "Hydrogen cannot burn in rocket engines"],
            answer: 1,
            explanation: "Liquid hydrogen requires extreme cryogenic temperatures (-253°C) and boils off over long stays. Methane is denser, easier to store cryogenically (-161°C), and can be synthesized on Mars via Sabatier ISRU."
          },
          {
            q: "What is the planetary protection categorization (COSPAR) for Mars missions searching for bio-signatures, and why is strict sterilization enforced?",
            options: ["Category I: No restrictions", "Category IVb/IVc: Stringent dry-heat sterilization and bio-burden limits to prevent forward contamination of Martian 'Special Regions'", "Category X: Secret missions", "Category V: Planetary quarantine only for return"],
            answer: 1,
            explanation: "COSPAR Category IV mandates rigorous bio-burden reduction (<0.03 spores/m²) to prevent 'forward contamination'—transporting resilient Earth microbes that could false-positive the search for indigenous Martian life."
          }
        ]
      },
      unexpectedEvent: {
        title: "FINAL RETURN ASCENT VEHICLE GO/NO-GO POLL",
        situation: "All 12 planetary missions across the Moon and Mars are complete. Flight telemetry confirms ISRU tanks 100% full, life-support nominal, and the return trajectory window is open. Houston Flight Director calls for the final GO/NO-GO poll. What is your call?",
        options: [
          "ALL SYSTEMS ARE GO! Initiate ignition sequence, execute planetary ascent, and steer trajectory toward Earth return with full scientific sample cache!",
          "Abort mission and dump the sample tubes in the dirt",
          "Power down the rocket engines",
          "Wait another 5 years alone"
        ],
        correctIndex: 0,
        feedback: "COMMENCING ASCENT TO THE STARS! All telemetry is green. You have led humanity's greatest scientific expedition to triumph. Welcome to the ranks of Legendary Space Explorers!"
      }
    }
  ];

  // Helper to fetch current active mission list
  function getExpeditionMissions(expId = activeExpedition) {
    return expId === 'moon' ? LUNAR_EXPEDITION : MARS_EXPEDITION;
  }

  function getMissionById(id) {
    return LUNAR_EXPEDITION.find(m => m.id === id) || MARS_EXPEDITION.find(m => m.id === id);
  }

  // Render the Master Missions Hub View
  function renderHub(containerId = 'missionsHubView') {
    const el = document.getElementById(containerId);
    if (!el) return;

    const currentGrade = PlayerProfile.getGradeInfo();
    const missions = getExpeditionMissions(activeExpedition);
    const moonDone = PlayerProfile.getMoonMissionsCompleted();
    const marsDone = PlayerProfile.getMarsMissionsCompleted();

    let html = `
      <div class="hubContainer">
        <!-- Storyline Header -->
        <div class="hubHeader" style="margin-bottom:20px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
            <div>
              <div class="eyebrow" style="color:var(--accent);">ASTROCADE – BEYOND THE HORIZON · YEAR 2040</div>
              <h1 style="font-family:var(--font-display);font-size:28px;margin:4px 0 8px;">Planetary Exploration Campaign</h1>
              <p style="max-width:680px;color:var(--silver);font-size:13px;line-height:1.5;">
                Welcome to the Advanced Space Exploration Training Centre (ASETC). Complete training modules, pilot rovers, configure outposts, and conduct authentic scientific investigations across the Moon and Mars!
              </p>
            </div>

            <!-- Grade & Passport Buttons -->
            <div style="display:flex;gap:10px;align-items:center;">
              <button class="btn" onclick="MissionControl.openGradeSelector()" title="Change Educational Level" style="background:rgba(66,232,255,0.1);border-color:var(--cyan);color:var(--cyan);font-size:11px;">
                🎓 ${currentGrade.level}: ${currentGrade.name} (${currentGrade.label}) ▾
              </button>
              <button class="btn primary" onclick="PlayerProfile.renderPassport()" title="View Astronaut Digital Passport" style="font-size:11px;">
                🛂 Astronaut Passport
              </button>
            </div>
          </div>
        </div>

        <!-- 2 Major Expedition Mode Switcher -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px;">
          <!-- MODE 1: MOON -->
          <div class="expeditionCard glass-panel ${activeExpedition === 'moon' ? 'activeMode' : ''}" 
               onclick="MissionControl.switchExpedition('moon')"
               style="padding:16px;border-radius:12px;cursor:pointer;border:2px solid ${activeExpedition === 'moon' ? 'var(--accent)' : 'rgba(255,255,255,0.1)'};background:${activeExpedition === 'moon' ? 'rgba(255,189,105,0.12)' : 'rgba(11,21,48,0.7)'};transition:all .2s;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:36px;">🌕</span>
                <div>
                  <span class="eyebrow" style="color:var(--accent);">MODE 01 · 0.16 g</span>
                  <h3 style="font-family:var(--font-display);margin:2px 0;font-size:18px;">LUNAR FRONTIER</h3>
                  <small style="color:var(--silver);font-size:11px;">South Pole Shackleton Outpost · 6 Missions</small>
                </div>
              </div>
              <div style="text-align:right;">
                <span style="font-family:var(--font-mono);font-size:12px;color:${moonDone >= 6 ? 'var(--green)' : 'var(--accent)'};font-weight:700;">
                  ${moonDone} / 6 COMPLETE
                </span>
                <div style="background:rgba(255,255,255,0.1);width:100px;height:5px;border-radius:3px;margin-top:4px;">
                  <div style="background:var(--accent);height:100%;width:${(moonDone/6)*100}%;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- MODE 2: MARS -->
          <div class="expeditionCard glass-panel ${activeExpedition === 'mars' ? 'activeMode' : ''}" 
               onclick="MissionControl.switchExpedition('mars')"
               style="padding:16px;border-radius:12px;cursor:pointer;border:2px solid ${activeExpedition === 'mars' ? 'var(--red)' : 'rgba(255,255,255,0.1)'};background:${activeExpedition === 'mars' ? 'rgba(255,94,126,0.12)' : 'rgba(11,21,48,0.7)'};transition:all .2s;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:36px;">🔴</span>
                <div>
                  <span class="eyebrow" style="color:var(--red);">MODE 02 · 0.38 g</span>
                  <h3 style="font-family:var(--font-display);margin:2px 0;font-size:18px;">RED PLANET RISING</h3>
                  <small style="color:var(--silver);font-size:11px;">Jezero Crater Science Outpost · 6 Missions</small>
                </div>
              </div>
              <div style="text-align:right;">
                <span style="font-family:var(--font-mono);font-size:12px;color:${marsDone >= 6 ? 'var(--green)' : 'var(--red)'};font-weight:700;">
                  ${marsDone} / 6 COMPLETE
                </span>
                <div style="background:rgba(255,255,255,0.1);width:100px;height:5px;border-radius:3px;margin-top:4px;">
                  <div style="background:var(--red);height:100%;width:${(marsDone/6)*100}%;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mission Cards Grid -->
        <div class="cardGrid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:16px;">
    `;

    missions.forEach((m, idx) => {
      const isDone = (PlayerProfile.profile.completedMissions || []).includes(m.id);
      // Unlock sequence: mission 1 is always unlocked. Next mission unlocks when previous mission is completed.
      const isUnlocked = idx === 0 || (PlayerProfile.profile.completedMissions || []).includes(missions[idx - 1].id);
      const scoreObj = (PlayerProfile.profile.missionScores && PlayerProfile.profile.missionScores[m.id]) || null;
      const score = scoreObj ? scoreObj.score : 0;
      const medal = scoreObj ? scoreObj.medal : null;

      let medalIcon = '🥉';
      if (medal === 'gold') medalIcon = '🥇 Gold';
      else if (medal === 'silver') medalIcon = '🥈 Silver';
      else if (medal === 'bronze') medalIcon = '🥉 Bronze';

      html += `
        <div class="hubCard glass-panel ${!isUnlocked ? 'locked' : ''}" 
             style="opacity:${isUnlocked ? '1' : '0.5'};display:flex;flex-direction:column;justify-content:space-between;padding:20px;border-radius:12px;border:1px solid ${isDone ? 'rgba(56,217,150,0.4)' : (isUnlocked ? 'rgba(66,232,255,0.25)' : 'rgba(255,255,255,0.06)')};background:rgba(11,21,48,0.7);">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <span class="cardBadge" style="font-family:var(--font-mono);font-size:10px;padding:3px 8px;border-radius:4px;background:rgba(255,255,255,0.06);color:${isDone ? 'var(--green)' : (isUnlocked ? 'var(--cyan)' : 'var(--silver)')}">
                ${isDone ? `✓ ${medalIcon} (${score}/100)` : (isUnlocked ? m.rewardMedal : '🔒 LOCKED')}
              </span>
              <span style="font-family:var(--font-mono);font-size:11px;color:var(--accent);">+${m.xp} XP</span>
            </div>

            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <span style="font-size:32px;">${m.icon}</span>
              <div>
                <div style="font-size:10px;font-family:var(--font-mono);color:var(--silver);">${m.number}</div>
                <h3 style="margin:0;font-size:17px;font-family:var(--font-display);">${m.title}</h3>
              </div>
            </div>

            <p style="font-size:12px;color:var(--silver);line-height:1.5;margin-bottom:14px;font-style:italic;">
              "${m.storyIntro}"
            </p>

            <div style="background:rgba(5,8,22,0.5);padding:10px;border-radius:8px;margin-bottom:16px;">
              <span style="font-size:10px;font-family:var(--font-mono);color:var(--cyan);display:block;margin-bottom:4px;">CORE TOPICS:</span>
              <ul style="margin:0;padding-left:16px;font-size:11px;color:var(--ink);line-height:1.4;">
                ${m.learningObjectives.slice(0, 2).map(o => `<li>${o}</li>`).join('')}
              </ul>
            </div>
          </div>

          <div>
            ${isUnlocked ? `
              <div style="display:flex;gap:8px;">
                <button class="btn ${isDone ? 'primary' : 'cyan'}" 
                        style="flex:1.2;font-size:11px;padding:8px 8px;" 
                        onclick="MissionControl.openBriefing('${m.id}')">
                  ${isDone ? 'Briefing ↺' : 'Mission Briefing →'}
                </button>
                <button class="btn" 
                        style="flex:0.8;font-size:11px;padding:8px 6px;border-color:rgba(66,232,255,0.3);color:var(--cyan);" 
                        onclick="OutpostMissionSystem.start3DMission('${m.id}')"
                        title="Track and execute mission directly on 3D planetary surface">
                  🚀 3D Track
                </button>
              </div>
            ` : `
              <button class="btn" style="width:100%;font-size:12px;" disabled>
                Complete Previous Mission
              </button>
            `}
          </div>
        </div>
      `;
    });

    html += `
        </div>

        <!-- Final Expedition Graduation Banner -->
        ${(moonDone >= 6 && marsDone >= 6) ? `
          <div class="glass-panel" style="margin-top:24px;padding:20px;border-radius:12px;background:linear-gradient(135deg, rgba(255,189,105,0.15), rgba(66,232,255,0.15));border:1px solid var(--accent);text-align:center;">
            <div style="font-size:42px;margin-bottom:8px;">👑</div>
            <div class="eyebrow" style="color:var(--accent);">CONGRATULATIONS, COMMANDER!</div>
            <h2 style="font-family:var(--font-display);margin:4px 0;">All Planetary Expeditions Accomplished!</h2>
            <p style="color:var(--silver);font-size:13px;max-width:600px;margin:0 auto 16px;">
              You have completed both the Lunar Frontier and Red Planet Rising campaigns. Your name has been inscribed in the ASETC Hall of Fame as a Certified Junior Space Explorer.
            </p>
            <button class="btn primary" onclick="AstrocadeCertificate.openCertificateModal()" style="padding:12px 28px;font-size:14px;">
              🎓 Generate & Print Official Diploma →
            </button>
          </div>
        ` : ''}
      </div>
    `;

    el.innerHTML = html;
  }

  function switchExpedition(expId) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.click) SoundEngine.click();
    activeExpedition = expId;
    PlayerProfile.profile.activeExpedition = expId;
    PlayerProfile.save();

    // Dynamically update the 3D environment!
    if (typeof applyEnvironment === 'function') {
      applyEnvironment(expId);
    }
    renderHub('missionsHubView');
  }

  // Open Grade Selection Modal
  function openGradeSelector() {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.click) SoundEngine.click();
    const modal = document.getElementById('interactiveModal');
    const content = document.getElementById('interactiveModalContent');
    if (!modal || !content) return;

    const grades = PlayerProfile.GRADES;
    const currentGrade = PlayerProfile.profile.grade;

    content.innerHTML = `
      <div style="padding:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(66,232,255,0.3);padding-bottom:12px;margin-bottom:16px;">
          <div>
            <div class="eyebrow" style="color:var(--cyan);">ASETC EDUCATIONAL CURRICULUM</div>
            <h2 style="font-family:var(--font-display);margin:2px 0;">Select Astronaut Grade Level</h2>
            <span style="font-size:12px;color:var(--silver);">Dynamic difficulty scaling for scientific concepts, MCQs, and decision challenges.</span>
          </div>
          <button class="iconBtn" onclick="document.getElementById('interactiveModal').classList.remove('on');">✕</button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:14px;margin-bottom:20px;">
          ${grades.map(g => `
            <div class="glass-panel" 
                 style="padding:18px;border-radius:12px;cursor:pointer;border:2px solid ${currentGrade === g.id ? 'var(--cyan)' : 'rgba(255,255,255,0.1)'};background:${currentGrade === g.id ? 'rgba(66,232,255,0.15)' : 'rgba(11,21,48,0.7)'};transition:all .2s;"
                 onclick="PlayerProfile.setGrade('${g.id}');document.getElementById('interactiveModal').classList.remove('on');MissionControl.renderHub('missionsHubView');">
              <div style="font-size:36px;margin-bottom:8px;">${g.icon}</div>
              <span class="eyebrow" style="color:var(--accent);">${g.level}</span>
              <h3 style="font-family:var(--font-display);margin:2px 0 6px;">${g.name}</h3>
              <div style="font-family:var(--font-mono);font-size:12px;color:var(--cyan);margin-bottom:8px;">${g.label}</div>
              <p style="font-size:12px;color:var(--silver);line-height:1.4;margin:0;">${g.desc}</p>
              ${currentGrade === g.id ? '<span style="display:inline-block;margin-top:10px;font-size:10px;color:var(--green);font-family:var(--font-mono);">● CURRENTLY ACTIVE</span>' : ''}
            </div>
          `).join('')}
        </div>

        <div style="text-align:right;">
          <button class="btn" onclick="document.getElementById('interactiveModal').classList.remove('on');">Done</button>
        </div>
      </div>
    `;
    modal.classList.add('on');
  }

  // Open Full Mission Briefing & Interactive Workflow
  function openBriefing(missionId) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.click) SoundEngine.click();
    const mission = getMissionById(missionId);
    if (!mission) return;

    // Switch 3D environment to match mission
    if (mission.id.startsWith('moon') && typeof applyEnvironment === 'function') {
      applyEnvironment('moon');
    } else if (mission.id.startsWith('mars') && typeof applyEnvironment === 'function') {
      applyEnvironment('mars');
    }

    const modal = document.getElementById('interactiveModal');
    const content = document.getElementById('interactiveModalContent');
    if (!modal || !content) return;

    modal.classList.add('on');
    renderMissionStep1(mission, content);
  }

  // STEP 1: Story & Learning Briefing
  function renderMissionStep1(mission, container) {
    const grade = PlayerProfile.getGradeInfo();

    container.innerHTML = `
      <div style="padding:10px;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(66,232,255,0.3);padding-bottom:12px;margin-bottom:16px;">
          <div>
            <div class="eyebrow" style="color:var(--accent);">${mission.number} · FLIGHT BRIEFING</div>
            <h2 style="font-family:var(--font-display);margin:2px 0;">${mission.title}</h2>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--cyan);">${mission.destination} · Grade Level: ${grade.name} (${grade.label})</span>
          </div>
          <button class="iconBtn" onclick="document.getElementById('interactiveModal').classList.remove('on');">✕</button>
        </div>

        <!-- Story Transmission Quote -->
        <div style="background:rgba(5,8,22,0.7);border-left:4px solid var(--cyan);padding:14px 18px;border-radius:8px;margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span class="liveDot" style="width:8px;height:8px;background:var(--cyan);border-radius:50%;display:inline-block;"></span>
            <span style="font-family:var(--font-mono);font-size:10px;color:var(--cyan);letter-spacing:1px;">HOUSTON MISSION CONTROL TRANSMISSION:</span>
          </div>
          <p style="font-size:14px;color:var(--ink);font-style:italic;line-height:1.6;margin:0;">
            "${mission.storyIntro}"
          </p>
        </div>

        <!-- Learning Objectives -->
        <div class="glass-panel" style="background:rgba(11,21,48,0.7);padding:14px;border-radius:10px;margin-bottom:16px;">
          <strong style="color:var(--accent);font-family:var(--font-display);font-size:12px;letter-spacing:1px;display:block;margin-bottom:8px;">
            MISSION FLIGHT OBJECTIVES:
          </strong>
          <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.6;color:var(--ink);">
            ${mission.learningObjectives.map(o => `<li>${o}</li>`).join('')}
          </ul>
        </div>

        <!-- Educational Science Sections -->
        <div style="margin-bottom:20px;">
          ${mission.educationalContent.map(sec => `
            <div style="background:rgba(5,8,22,0.5);border:1px solid rgba(255,255,255,0.06);padding:12px 16px;border-radius:8px;margin-bottom:10px;">
              <strong style="color:var(--cyan);font-family:var(--font-display);font-size:13px;display:block;margin-bottom:4px;">🔬 ${sec.title}</strong>
              <p style="font-size:12px;color:var(--silver);line-height:1.5;margin:0;">${sec.text}</p>
            </div>
          `).join('')}
        </div>

        <!-- Action Buttons -->
        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.08);padding-top:14px;flex-wrap:wrap;gap:8px;">
          <span style="font-size:11px;font-family:var(--font-mono);color:var(--silver);">Step 1 of 4: Learning Phase</span>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn" onclick="document.getElementById('interactiveModal').classList.remove('on');">Cancel</button>
            <button class="btn" onclick="OutpostMissionSystem.start3DMission('${mission.id}')" style="background:rgba(66,232,255,0.15);border-color:var(--cyan);color:var(--cyan);font-weight:700;">
              🚀 Track in 3D Outpost (M)
            </button>
            <button class="btn primary" onclick="MissionControl.startInteractiveTask('${mission.id}')">Proceed to Hands-on Challenge →</button>
          </div>
        </div>
      </div>
    `;
  }

  // STEP 2: Interactive Gameplay Challenge
  function startInteractiveTask(missionId) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.click) SoundEngine.click();
    const mission = getMissionById(missionId);
    const content = document.getElementById('interactiveModalContent');
    if (!mission || !content) return;

    const task = mission.interactiveTask;

    let taskBodyHtml = '';

    if (task.type === 'match_equipment') {
      taskBodyHtml = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0;">
          ${task.pairs.map((p, i) => `
            <div class="taskCard glass-panel" style="padding:12px;border-radius:8px;border:1px solid var(--line);">
              <strong style="color:var(--accent);display:block;font-size:13px;">${p.item}</strong>
              <small style="color:var(--silver);font-size:11px;display:block;margin-top:4px;">${p.function}</small>
            </div>
          `).join('')}
        </div>
      `;
    } else if (task.type === 'order_stages' || task.type === 'edl_sequence' || task.type === 'flight_reentry') {
      const items = task.stages || task.steps;
      taskBodyHtml = `
        <div style="margin:16px 0;">
          ${items.map((s, idx) => `
            <div style="background:rgba(5,8,22,0.6);border:1px solid rgba(66,232,255,0.2);padding:10px 14px;border-radius:8px;margin-bottom:8px;display:flex;align-items:center;gap:10px;">
              <span style="width:24px;height:24px;border-radius:50%;background:var(--cyan);color:#050816;display:grid;place-items:center;font-weight:800;font-size:12px;">${idx + 1}</span>
              <span style="font-size:13px;color:var(--ink);">${s}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else if (task.type === 'build_base' || task.type === 'pack_cargo' || task.type === 'future_civilization') {
      const list = task.modules || task.items || task.systems;
      taskBodyHtml = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:10px;margin:16px 0;">
          ${list.map(m => `
            <div class="glass-panel" style="padding:12px;border-radius:8px;border:1px solid rgba(56,217,150,0.3);background:rgba(11,21,48,0.7);">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <strong style="color:var(--green);font-size:12px;">✓ ${m.name}</strong>
                ${m.cost ? `<span style="font-size:10px;font-family:var(--font-mono);color:var(--accent);">${m.cost} kW</span>` : ''}
              </div>
              <p style="font-size:11px;color:var(--silver);margin:6px 0 0;line-height:1.4;">${m.function || m.desc || m.role}</p>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      const items = task.features || task.samples || task.stages || task.schedule;
      taskBodyHtml = `
        <div style="display:grid;grid-template-columns:1fr;gap:10px;margin:16px 0;">
          ${items.map(it => `
            <div style="background:rgba(5,8,22,0.6);border:1px solid rgba(66,232,255,0.2);padding:10px 14px;border-radius:8px;">
              <strong style="color:var(--cyan);font-size:13px;">${it.name || it.activity}</strong>
              <div style="font-size:11px;color:var(--silver);margin-top:2px;">${it.desc || it.location || it.benefit || it.setting}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    content.innerHTML = `
      <div style="padding:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(66,232,255,0.3);padding-bottom:12px;margin-bottom:16px;">
          <div>
            <div class="eyebrow" style="color:var(--cyan);">STAGE 02 · INTERACTIVE HANDS-ON CHALLENGE</div>
            <h2 style="font-family:var(--font-display);margin:2px 0;">${task.title}</h2>
            <span style="font-size:12px;color:var(--silver);">${task.instruction}</span>
          </div>
          <button class="iconBtn" onclick="document.getElementById('interactiveModal').classList.remove('on');">✕</button>
        </div>

        ${taskBodyHtml}

        <div style="background:rgba(56,217,150,0.1);border:1px solid var(--green);padding:10px 14px;border-radius:8px;margin-bottom:18px;">
          <span style="font-size:12px;color:var(--green);font-weight:700;">✓ Interactive System Telemetry Verified: +20 Points Earned</span>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.08);padding-top:14px;">
          <button class="btn" onclick="MissionControl.openBriefing('${mission.id}')">← Back to Briefing</button>
          <button class="btn primary" onclick="MissionControl.startMCQQuiz('${mission.id}')">Proceed to Grade MCQ Exam (30 pts) →</button>
        </div>
      </div>
    `;
  }

  // STEP 3: Grade-Specific Dynamic MCQ Exam
  function startMCQQuiz(missionId) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.click) SoundEngine.click();
    const mission = getMissionById(missionId);
    const content = document.getElementById('interactiveModalContent');
    if (!mission || !content) return;

    const gradeId = PlayerProfile.profile.grade || 'grade_3_5';
    const grade = PlayerProfile.getGradeInfo();
    const questions = (mission.dynamicMCQs && mission.dynamicMCQs[gradeId]) || mission.dynamicMCQs['grade_3_5'];

    // MCQ state
    let currentQIdx = 0;
    let earnedMCQScore = 0;
    const totalQCount = questions.length;
    const pointsPerQ = Math.round(50 / totalQCount); // up to 50 pts total

    function renderQuestion() {
      const q = questions[currentQIdx];

      content.innerHTML = `
        <div style="padding:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(66,232,255,0.3);padding-bottom:12px;margin-bottom:16px;">
            <div>
              <div class="eyebrow" style="color:var(--cyan);">STAGE 03 · GRADE ASSESSMENT (${grade.level} · ${grade.label})</div>
              <h2 style="font-family:var(--font-display);margin:2px 0;">Question ${currentQIdx + 1} of ${totalQCount}</h2>
              <span style="font-family:var(--font-mono);font-size:11px;color:var(--accent);">Score so far: 20 (Task) + ${earnedMCQScore} (Quiz) pts</span>
            </div>
            <button class="iconBtn" onclick="document.getElementById('interactiveModal').classList.remove('on');">✕</button>
          </div>

          <div style="background:rgba(11,21,48,0.8);border:1px solid rgba(66,232,255,0.2);padding:16px;border-radius:10px;margin-bottom:16px;">
            <p style="font-size:15px;color:var(--white);font-weight:600;line-height:1.5;margin:0;">
              ${q.q}
            </p>
          </div>

          <!-- Options -->
          <div id="mcqOptionsContainer" style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
            ${q.options.map((opt, oIdx) => `
              <button class="btn mcqOptionBtn" data-idx="${oIdx}" onclick="MissionControl.checkMCQAnswer('${mission.id}', ${currentQIdx}, ${oIdx})" style="text-align:left;padding:12px 16px;font-size:13px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;transition:all .15s;">
                <span style="font-family:var(--font-mono);color:var(--cyan);font-weight:700;margin-right:8px;">${String.fromCharCode(65 + oIdx)}.</span>
                ${opt}
              </button>
            `).join('')}
          </div>

          <!-- Feedback Box -->
          <div id="mcqFeedbackBox" style="display:none;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;line-height:1.5;"></div>

          <div style="display:flex;justify-content:flex-end;">
            <button id="mcqNextBtn" class="btn primary" style="display:none;" onclick="MissionControl.nextMCQQuestion('${mission.id}', ${currentQIdx + 1}, ${earnedMCQScore})">
              ${currentQIdx + 1 < totalQCount ? 'Next Question →' : 'Proceed to Mission Decision (20 pts) →'}
            </button>
          </div>
        </div>
      `;
    }

    renderQuestion();
  }

  function checkMCQAnswer(missionId, qIdx, selectedIdx) {
    const mission = getMissionById(missionId);
    const gradeId = PlayerProfile.profile.grade || 'grade_3_5';
    const questions = (mission.dynamicMCQs && mission.dynamicMCQs[gradeId]) || mission.dynamicMCQs['grade_3_5'];
    const q = questions[qIdx];
    const pointsPerQ = Math.round(50 / questions.length);

    const isCorrect = selectedIdx === q.answer;
    const feedbackBox = document.getElementById('mcqFeedbackBox');
    const nextBtn = document.getElementById('mcqNextBtn');
    const optionBtns = document.querySelectorAll('.mcqOptionBtn');

    // Disable all options and color them
    optionBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.answer) {
        btn.style.background = 'rgba(56,217,150,0.2)';
        btn.style.borderColor = 'var(--green)';
        btn.style.color = 'var(--green)';
      } else if (idx === selectedIdx && !isCorrect) {
        btn.style.background = 'rgba(255,94,126,0.2)';
        btn.style.borderColor = 'var(--red)';
        btn.style.color = 'var(--red)';
      }
    });

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      if (isCorrect) {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.success) SoundEngine.success();
        feedbackBox.style.background = 'rgba(56,217,150,0.15)';
        feedbackBox.style.border = '1px solid var(--green)';
        feedbackBox.style.color = 'var(--green)';
        feedbackBox.innerHTML = `<strong>✓ CORRECT! (+${pointsPerQ} PTS)</strong><p style="margin:4px 0 0;font-size:12px;color:var(--ink);">${q.explanation}</p>`;
      } else {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.bad) SoundEngine.bad();
        feedbackBox.style.background = 'rgba(255,94,126,0.15)';
        feedbackBox.style.border = '1px solid var(--red)';
        feedbackBox.style.color = 'var(--red)';
        feedbackBox.innerHTML = `<strong>✕ INCORRECT (0 PTS)</strong><p style="margin:4px 0 0;font-size:12px;color:var(--ink);">${q.explanation}</p>`;
      }
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-block';
      nextBtn.setAttribute('data-points', isCorrect ? pointsPerQ : 0);
    }
  }

  function nextMCQQuestion(missionId, nextIdx, currentPoints) {
    const nextBtn = document.getElementById('mcqNextBtn');
    const addPts = nextBtn ? parseInt(nextBtn.getAttribute('data-points') || 0, 10) : 0;
    const newTotalPoints = currentPoints + addPts;

    const mission = getMissionById(missionId);
    const gradeId = PlayerProfile.profile.grade || 'grade_3_5';
    const questions = (mission.dynamicMCQs && mission.dynamicMCQs[gradeId]) || mission.dynamicMCQs['grade_3_5'];

    if (nextIdx < questions.length) {
      // Re-call quiz for next index
      const content = document.getElementById('interactiveModalContent');
      const q = questions[nextIdx];

      content.innerHTML = `
        <div style="padding:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(66,232,255,0.3);padding-bottom:12px;margin-bottom:16px;">
            <div>
              <div class="eyebrow" style="color:var(--cyan);">STAGE 03 · GRADE ASSESSMENT</div>
              <h2 style="font-family:var(--font-display);margin:2px 0;">Question ${nextIdx + 1} of ${questions.length}</h2>
              <span style="font-family:var(--font-mono);font-size:11px;color:var(--accent);">Score so far: 20 (Task) + ${newTotalPoints} (Quiz) pts</span>
            </div>
            <button class="iconBtn" onclick="document.getElementById('interactiveModal').classList.remove('on');">✕</button>
          </div>

          <div style="background:rgba(11,21,48,0.8);border:1px solid rgba(66,232,255,0.2);padding:16px;border-radius:10px;margin-bottom:16px;">
            <p style="font-size:15px;color:var(--white);font-weight:600;line-height:1.5;margin:0;">
              ${q.q}
            </p>
          </div>

          <div id="mcqOptionsContainer" style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
            ${q.options.map((opt, oIdx) => `
              <button class="btn mcqOptionBtn" data-idx="${oIdx}" onclick="MissionControl.checkMCQAnswer('${mission.id}', ${nextIdx}, ${oIdx})" style="text-align:left;padding:12px 16px;font-size:13px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;">
                <span style="font-family:var(--font-mono);color:var(--cyan);font-weight:700;margin-right:8px;">${String.fromCharCode(65 + oIdx)}.</span>
                ${opt}
              </button>
            `).join('')}
          </div>

          <div id="mcqFeedbackBox" style="display:none;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px;line-height:1.5;"></div>

          <div style="display:flex;justify-content:flex-end;">
            <button id="mcqNextBtn" class="btn primary" style="display:none;" onclick="MissionControl.nextMCQQuestion('${mission.id}', ${nextIdx + 1}, ${newTotalPoints})">
              ${nextIdx + 1 < questions.length ? 'Next Question →' : 'Proceed to Mission Decision (20 pts) →'}
            </button>
          </div>
        </div>
      `;
    } else {
      // Done with MCQs -> proceed to Unexpected Event / Decision
      startUnexpectedEvent(missionId, newTotalPoints);
    }
  }

  // STEP 4: Mission Emergency Decision / Unexpected Event
  function startUnexpectedEvent(missionId, accumulatedQuizPoints) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.alarm) SoundEngine.alarm();
    const mission = getMissionById(missionId);
    const content = document.getElementById('interactiveModalContent');
    if (!mission || !content) return;

    const ev = mission.unexpectedEvent;

    content.innerHTML = `
      <div style="padding:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,94,126,0.4);padding-bottom:12px;margin-bottom:16px;">
          <div>
            <div class="eyebrow" style="color:var(--red);animation:pulseDot 1s infinite;">⚠️ UNEXPECTED MISSION ALERT</div>
            <h2 style="font-family:var(--font-display);margin:2px 0;color:var(--red);">${ev.title}</h2>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--silver);">Operational Emergency Decision Protocol</span>
          </div>
          <button class="iconBtn" onclick="document.getElementById('interactiveModal').classList.remove('on');">✕</button>
        </div>

        <div style="background:rgba(255,94,126,0.12);border:1px solid var(--red);padding:16px;border-radius:10px;margin-bottom:16px;">
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--red);margin-bottom:6px;letter-spacing:1px;">INCIDENT REPORT:</div>
          <p style="font-size:14px;color:var(--ink);line-height:1.5;margin:0;">
            ${ev.situation}
          </p>
        </div>

        <label style="font-size:12px;font-family:var(--font-mono);color:var(--cyan);display:block;margin-bottom:8px;">
          SELECT COMMANDER RESPONSE:
        </label>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
          ${ev.options.map((opt, idx) => `
            <button class="btn decisionBtn" onclick="MissionControl.checkDecision('${mission.id}', ${idx}, ${accumulatedQuizPoints})" style="text-align:left;padding:12px 16px;font-size:13px;border-radius:8px;">
              ${idx + 1}. ${opt}
            </button>
          `).join('')}
        </div>

        <div id="decisionFeedbackBox" style="display:none;padding:14px;border-radius:8px;margin-bottom:16px;font-size:13px;line-height:1.5;"></div>

        <div style="display:flex;justify-content:flex-end;">
          <button id="finalScoreBtn" class="btn primary" style="display:none;" onclick="MissionControl.completeMissionEvaluation('${mission.id}', ${accumulatedQuizPoints})">
            View Mission Debrief & Medals →
          </button>
        </div>
      </div>
    `;
  }

  function checkDecision(missionId, selectedIdx, accumulatedQuizPoints) {
    const mission = getMissionById(missionId);
    const ev = mission.unexpectedEvent;
    const isCorrect = selectedIdx === ev.correctIndex;

    const feedbackBox = document.getElementById('decisionFeedbackBox');
    const finalScoreBtn = document.getElementById('finalScoreBtn');
    const btns = document.querySelectorAll('.decisionBtn');

    btns.forEach((b, idx) => {
      b.disabled = true;
      if (idx === ev.correctIndex) {
        b.style.background = 'rgba(56,217,150,0.2)';
        b.style.borderColor = 'var(--green)';
        b.style.color = 'var(--green)';
      } else if (idx === selectedIdx && !isCorrect) {
        b.style.background = 'rgba(255,94,126,0.2)';
        b.style.borderColor = 'var(--red)';
        b.style.color = 'var(--red)';
      }
    });

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      if (isCorrect) {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.success) SoundEngine.success();
        feedbackBox.style.background = 'rgba(56,217,150,0.15)';
        feedbackBox.style.border = '1px solid var(--green)';
        feedbackBox.style.color = 'var(--green)';
        feedbackBox.innerHTML = `<strong>✓ CORRECT DECISION (+20 PTS)</strong><p style="margin:4px 0 0;font-size:12px;color:var(--ink);">${ev.feedback}</p>`;
      } else {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.bad) SoundEngine.bad();
        feedbackBox.style.background = 'rgba(255,94,126,0.15)';
        feedbackBox.style.border = '1px solid var(--red)';
        feedbackBox.style.color = 'var(--red)';
        feedbackBox.innerHTML = `<strong>✕ COMPROMISED PROCEDURE (0 PTS)</strong><p style="margin:4px 0 0;font-size:12px;color:var(--ink);">${ev.feedback}</p>`;
      }
    }

    if (finalScoreBtn) {
      finalScoreBtn.style.display = 'inline-block';
      finalScoreBtn.setAttribute('data-decision-points', isCorrect ? 20 : 0);
    }
  }

  // STEP 5: Final Score, Medal & Debrief
  function completeMissionEvaluation(missionId, accumulatedQuizPoints) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.success) SoundEngine.success();
    const mission = getMissionById(missionId);
    const content = document.getElementById('interactiveModalContent');
    const finalScoreBtn = document.getElementById('finalScoreBtn');
    const decisionPts = finalScoreBtn ? parseInt(finalScoreBtn.getAttribute('data-decision-points') || 0, 10) : 0;

    const taskPts = 20;
    const bonusPts = (accumulatedQuizPoints >= 40 && decisionPts === 20) ? 10 : 0;
    const totalScore = Math.min(100, taskPts + accumulatedQuizPoints + decisionPts + bonusPts);

    let medal = null;
    let medalTitle = '';
    let medalIcon = '';
    let passed = false;

    if (totalScore >= 90) {
      medal = 'gold';
      medalTitle = '🥇 GOLD MEDAL';
      medalIcon = '🥇';
      passed = true;
    } else if (totalScore >= 70) {
      medal = 'silver';
      medalTitle = '🥈 SILVER MEDAL';
      medalIcon = '🥈';
      passed = true;
    } else if (totalScore >= 50) {
      medal = 'bronze';
      medalTitle = '🥉 BRONZE MEDAL';
      medalIcon = '🥉';
      passed = true;
    } else {
      passed = false;
      medalTitle = 'MISSION INCOMPLETE (< 50 PTS)';
      medalIcon = '⚠️';
    }

    // Record score in PlayerProfile if passed
    if (passed) {
      PlayerProfile.recordMissionScore(mission.id, totalScore, medal, {
        title: mission.title,
        rewardMedal: mission.rewardMedal
      });
      PlayerProfile.addXP(mission.xp, `Completed ${mission.title} (${medalTitle})`);
      PlayerProfile.unlockAchievement('first_launch', 'First Launch Medal');
    }

    content.innerHTML = `
      <div style="padding:10px;text-align:center;">
        <div style="font-size:56px;margin-bottom:8px;">${medalIcon}</div>
        <div class="eyebrow" style="color:${passed ? 'var(--green)' : 'var(--red)'};">
          ${passed ? 'MISSION ACCOMPLISHED · CONFERRED REWARD' : 'NEEDS IMPROVEMENT · RETRY REQUIRED'}
        </div>
        <h2 style="font-family:var(--font-display);font-size:26px;margin:4px 0 6px;">${mission.title}</h2>
        <span style="font-family:var(--font-mono);font-size:14px;color:var(--accent);font-weight:700;">
          REWARD: ${mission.rewardMedal}
        </span>

        <!-- Score Breakdown Card -->
        <div class="glass-panel" style="max-width:440px;margin:18px auto;padding:16px;border-radius:10px;text-align:left;background:rgba(11,21,48,0.8);border:1px solid rgba(66,232,255,0.3);">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
            <span style="color:var(--silver);">Hands-on Interactive Task:</span>
            <strong style="color:var(--green);">+${taskPts} pts</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
            <span style="color:var(--silver);">Grade Scientific Assessment:</span>
            <strong style="color:var(--cyan);">+${accumulatedQuizPoints} pts</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px;">
            <span style="color:var(--silver);">Emergency Mission Decision:</span>
            <strong style="color:${decisionPts > 0 ? 'var(--green)' : 'var(--red)'};">+${decisionPts} pts</strong>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:13px;">
            <span style="color:var(--silver);">Command Accuracy Bonus:</span>
            <strong style="color:var(--accent);">+${bonusPts} pts</strong>
          </div>
          <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:10px;display:flex;justify-content:space-between;font-size:16px;font-family:var(--font-display);">
            <span>TOTAL SCORE:</span>
            <strong style="color:${passed ? 'var(--green)' : 'var(--red)'};">${totalScore} / 100 PTS</strong>
          </div>
        </div>

        <p style="font-size:13px;color:var(--silver);max-width:500px;margin:0 auto 20px;line-height:1.5;">
          ${passed 
            ? `Outstanding execution, Cadet! Your performance on ${mission.title} has been logged in your Official Astronaut Passport.`
            : `Cadet, a minimum score of 50 points is required to earn certification. Review the educational learning materials and retry the simulation!`
          }
        </p>

        <div style="display:flex;justify-content:center;gap:12px;">
          ${passed ? `
            <button class="btn" onclick="document.getElementById('interactiveModal').classList.remove('on');MissionControl.renderHub('missionsHubView');">
              Return to Campaign Hub
            </button>
            <button class="btn primary" onclick="PlayerProfile.renderPassport()">
              Open Astronaut Passport 🛂
            </button>
          ` : `
            <button class="btn" onclick="document.getElementById('interactiveModal').classList.remove('on');MissionControl.renderHub('missionsHubView');">
              Back to Hub
            </button>
            <button class="btn primary" onclick="MissionControl.openBriefing('${mission.id}')">
              Retry Mission ↺
            </button>
          `}
        </div>
      </div>
    `;

    renderHub('missionsHubView');
  }

  return {
    renderHub,
    switchExpedition,
    openGradeSelector,
    openBriefing,
    startInteractiveTask,
    startMCQQuiz,
    checkMCQAnswer,
    nextMCQQuestion,
    startUnexpectedEvent,
    checkDecision,
    completeMissionEvaluation,
    getExpeditionMissions,
    getMissionById
  };
})();
