export const hero = {
  engineering: 'Charting',
  article: 'the',
  deep: 'Deep',
  frontier: 'Frontier',
  sub: 'built by triton - tested by the ocean.',
}

export const nav = {
  left: ['Home', 'Competition'],
  right: ['Docs', 'Contact'],
}

export const about = [
  {
    title: 'Who We Are',
    body: 'Founded in 2024 at the Arab Academy for Science, Technology & Maritime Transport (AASTMT), Team Triton is a student-led engineering team competing in the MATE ROV International Competition. We combine mechanical, electrical, software and non-technical talent to design ROVs that tackle real-world underwater challenges. Every member brings a different discipline to the table — from CAD and embedded systems to business documentation and media — united by a shared drive to build something that works under pressure, literally and figuratively.',
  },
  {
    title: 'The Competition',
    body: 'The MATE ROV Competition is one of the most rigorous student engineering challenges in the world. Teams design, build, and pilot remotely operated vehicles to complete real underwater mission tasks — tasks modelled on the work of professional ocean engineers. We compete at the international level, measured not just on technical performance but on documentation, presentation, and professional standards.',
  },
  {
    title: 'Our ROV',
    body: "Baymax is Team Triton's competition ROV — engineered from the ground up by our students. Built around a Draco-compressed SolidWorks design with 22 preserved material configurations, Baymax integrates custom thruster mounts, precision gripper assemblies, and a full onboard electronics stack. Every subsystem was designed, tested, and iterated by the team — no off-the-shelf frames, no shortcuts.",
  },
  {
    title: 'How We Work',
    body: "Team Triton runs as four interconnected divisions: Mechanical, Electrical, Software, and Non-Technical. Each division owns its domain end-to-end — from design and fabrication to testing and documentation. We operate on a real project cycle: scoped deliverables, integration reviews, and a shared deadline. It's less like a club, more like an engineering team with a competition on the calendar.",
  },
  {
    title: 'The Mission',
    body: "Underwater infrastructure powers the modern world — pipelines, cables, offshore platforms, marine ecosystems. Inspecting and maintaining it demands tools that can operate where humans can't. Our mission is to build the skills and the machines to contribute to that work. MATE gives us the proving ground. The ocean gives us the standard.",
  },
]

export const team: { photo: string; firstName: string; lastName: string; role: string }[] = [
  // C-Suite
  { photo: 'mohamed-ehab.jpeg',   firstName: 'Mohamed',      lastName: 'Ehab',        role: 'CEO' },
  { photo: 'yehia-moh.jpeg',      firstName: 'Yehia',        lastName: 'Mohamed',     role: 'COO' },
  { photo: 'aboya.jpeg',          firstName: 'Mohamed',      lastName: 'Osama',       role: 'CTO' },
  { photo: 'ali-elouny.jpeg',     firstName: 'Ali',          lastName: 'Elouny',      role: 'CFO' },
  
  // Mechanical — all members
  { photo: 'haggar.jpeg',         firstName: 'Youssef',      lastName: 'Haggar',      role: 'Mechanical Member' },
  { photo: 'abdullah.jpeg',       firstName: 'Abdallah',     lastName: 'Khaled',      role: 'Mechanical Member' },
  { photo: 'amro-tarek.jpeg',     firstName: 'Amro',         lastName: 'Tarek',       role: 'Mechanical Member' },
  { photo: 'sherif.jpeg',         firstName: 'Sherif',       lastName: 'Fahmy',       role: 'Mechanical Member' },
  { photo: 'salama.jpeg',         firstName: 'Abdelrahman',  lastName: 'Salama',      role: 'Mechanical Member' },
  { photo: 'aley.jpeg',           firstName: 'Aleyeldeen',   lastName: 'Bassam',      role: 'Mechanical Member' },
  { photo: 'bassam.jpeg',         firstName: 'Bassam',       lastName: 'Hisham',      role: 'Mechanical Member' },
  { photo: 'farida gouda.jpeg',   firstName: 'Farida',       lastName: 'Gouda',       role: 'Mechanical Member' },

  // Software — Lead then group
  { photo: 'hashem.jpeg',         firstName: 'Youssef',      lastName: 'Hashem',      role: 'Software Lead' },
  { photo: 'youssef-waleed.jpeg', firstName: 'Youssef',      lastName: 'Waleed',      role: 'Control Lead' },
  { photo: 'saged-khaled.jpeg',   firstName: 'Saged',        lastName: 'Khaled',      role: 'Vision Lead' },
  { photo: 'el-rayes.jpeg',       firstName: 'Adham',        lastName: 'Waheeb',      role: 'GUI Lead' },
  { photo: 'salma-sherif.jpeg',   firstName: 'Salma',        lastName: 'Sherif',      role: 'Float Lead' },
  { photo: 'marwan.jpeg',         firstName: 'Marwan',       lastName: 'Mahmoud',     role: 'Software Member' },
  { photo: 'marawan-gui.jpeg',    firstName: 'Marwan',       lastName: 'Hossam',      role: 'Software Member' },
  { photo: 'gamal.jpeg',          firstName: 'Gamal',        lastName: 'Marangoz',  role: 'Software Member' },
  { photo: 'sheifo-jr.jpeg',      firstName: 'Mohamed',      lastName: 'Tawfik',      role: 'Software Member' },
  { photo: 'jana ayman.jpeg',     firstName: 'Jana',         lastName: 'Ayman',       role: 'Software Member' },
  { photo: 'aya yasser.jpeg',     firstName: 'Aya',          lastName: 'Yasser',      role: 'Software Member' },
  { photo: 'hadeer amer.jpeg',    firstName: 'Hadeer',       lastName: 'Amer',        role: 'Software Member' },
  { photo: 'ahmed-mansour.jpeg',  firstName: 'Ahmed',        lastName: 'Mansour',     role: 'Software Member' },
  { photo: 'ziad-gado.jpeg',      firstName: 'Ziad',         lastName: 'Gado',        role: 'Software Member' },
  { photo: 'zeina magdy.jpeg',    firstName: 'Zeina',        lastName: 'Magdy',       role: 'Software Member' },
  { photo: 'nour walid.jpeg',     firstName: 'Nour',         lastName: 'Walid',       role: 'Software Member' },
  { photo: 'kenzy.jpeg',          firstName: 'Kenzy',        lastName: 'Baher',       role: 'Software Member' },
  
  // Electrical — Lead then group
  { photo: 'zeyad-magdy.jpeg',    firstName: 'Zeyad',        lastName: 'Magdy',       role: 'Electrical Lead' },
  { photo: 'seiffox.jpeg',        firstName: 'Seifeldeen',   lastName: 'Walid',       role: 'Electrical Member' },
  { photo: 'sheifo.jpeg',         firstName: 'Mohamed',      lastName: 'Sherif',      role: 'Electrical Member' },
  { photo: 'seif-walid.jpeg',     firstName: 'Seif',         lastName: 'Walid',       role: 'Electrical Member' },
  { photo: 'mariam.jpeg',         firstName: 'Mariam',       lastName: 'Mohamed',     role: 'Electrical Member' },
  { photo: 'sama abdelhady.jpeg', firstName: 'Sama',         lastName: 'Abdelhady',   role: 'Non-Technical Member' },
  { photo: 'salma abdelsattar.jpeg', firstName: 'Salma',     lastName: 'Abdelsattar', role: 'Non-Technical Member' },
  { photo: 'malak islam.jpeg',    firstName: 'Malak',        lastName: 'Islam',       role: 'Non-Technical Member' },

  
]
