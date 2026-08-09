export const BRANCHES = {
  global: {
    id: 'global',
    name: 'National Body',
    locationName: 'Amesi Town (National Headquarters)',
    heroImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1200&auto=format&fit=crop',
    description: 'Amesi Improvement Union (AIU) is the apex socio-cultural organization guiding the development, unity, and progress of the Amesi town indigenes, both at home and abroad.',
    address: 'AIU National Secretariat, ASCON Hall, Amesi, Aguata LGA, Anambra State, Nigeria',
    phone: '+234 803 123 4567',
    email: 'national@aiu-portal.org',
    meetingSchedule: 'First Sunday of every quarter at 2:00 PM',
    president: 'Chief Dr. Aloysius Ofordile (Onwanetilora of Amesi)',
  },
  lagos: {
    id: 'lagos',
    name: 'AIU Lagos Branch',
    locationName: 'Lagos State',
    heroImage: 'https://images.unsplash.com/photo-1597058776822-4416035eb445?q=80&w=1200&auto=format&fit=crop',
    description: 'Serving the vibrant community of Amesi indigenes in Lagos. Fostering economic empowerment, cultural heritage, and mutual support in the commercial capital.',
    address: 'AIU Event Hall, 14 Igbo Elerin Road, Okokomaiko, Lagos, Nigeria',
    phone: '+234 802 987 6543',
    email: 'lagos@aiu-portal.org',
    meetingSchedule: 'Second Sunday of every month at 1:00 PM',
    president: 'Nze Bartholomew Chijioke',
  },
  abuja: {
    id: 'abuja',
    name: 'AIU Abuja Branch',
    locationName: 'Federal Capital Territory',
    heroImage: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1200&auto=format&fit=crop',
    description: 'Uniting all Amesi indigenes residing in the Federal Capital Territory. Empowering members through networking, civic engagement, and community welfare.',
    address: 'Amesi House, Plot 742, Kaura District, Abuja, FCT, Nigeria',
    phone: '+234 805 111 2222',
    email: 'abuja@aiu-portal.org',
    meetingSchedule: 'Third Sunday of every month at 3:00 PM',
    president: 'Engr. Fidelis Anayo Nwankwo',
  },
  portharcourt: {
    id: 'portharcourt',
    name: 'AIU Port Harcourt Branch',
    locationName: 'Rivers State',
    heroImage: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200&auto=format&fit=crop',
    description: 'Representing the Amesi community in the Niger Delta region. Actively promoting welfare, academic scholarships, and industrial integration for our people.',
    address: 'AIU Civic Centre, 45 Trans-Amadi Layout, Port Harcourt, Rivers State, Nigeria',
    phone: '+234 818 333 4444',
    email: 'ph@aiu-portal.org',
    meetingSchedule: 'Last Sunday of every month at 2:00 PM',
    president: 'Chief Ichie Jude Ezenwa',
  }
};

export const INITIAL_NEWS = [
  {
    id: 1,
    title: 'Amesi Indigenes Inducted Into Anambra Health Scheme (ASHIA)',
    content: 'In a landmark development sponsored by the Amesi Improvement Union (AIU) National Body, over 500 women and children in Amesi have been enrolled into the Anambra State Health Insurance Agency (ASHIA) scheme. This initiative aims to provide accessible and quality healthcare services to the vulnerable populations in the community. Chief Dr. Aloysius Ofordile during the flags-off ceremony stated that this health outreach represents a core pillar of the AIU 2026 development agenda.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop',
    date: 'July 10, 2026',
    branch: 'global',
    author: 'AIU Press Secretariat',
    tags: ['Healthcare', 'Empowerment', 'National']
  },
  {
    id: 2,
    title: 'Lagos Branch Announces Annual Cultural Day and Akalabo Warm-Up Festival',
    content: 'The executive committee of AIU Lagos Branch has officially announced October 15, 2026, as the Lagos Branch Annual Cultural Day. This year\'s celebration will double as a preparation and awareness campaign for the upcoming triennial Akalabo Festival in Amesi. The event will showcase traditional Igbo dances, culinary competitions, and fundraising for the Lagos Branch Youth Endowment Fund. Nze Bartholomew Chijioke invites all families to attend in full traditional regalia.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    date: 'July 05, 2026',
    branch: 'lagos',
    author: 'Lagos Publicity Secretary',
    tags: ['Culture', 'Lagos', 'Akalabo']
  },
  {
    id: 3,
    title: 'Abuja Branch Empowers 50 Youths via IT and Entrepreneurship Program',
    content: 'AIU Abuja Branch has concluded its 6-week intensive training program in Digital Marketing, Web Development, and Business Management. Fifty youths of Amesi origin residing in the FCT participated in the program. During the graduation ceremony at Amesi House, Abuja, laptops and start-up grants of N250,000 each were distributed to the top ten graduates. Engr. Fidelis Nwankwo emphasized the necessity of equipping youths with 21st-century digital competencies.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    date: 'June 28, 2026',
    branch: 'abuja',
    author: 'Abuja Welfare Committee',
    tags: ['Youth', 'Empowerment', 'Abuja']
  },
  {
    id: 4,
    title: 'Port Harcourt Branch to Launch University Scholarship Scheme',
    content: 'The Port Harcourt branch is proud to unveil the AIU-PH Academic Excellence Scholarship for the 2026/2027 academic session. The scheme will sponsor ten deserving Amesi indigenes studying engineering, computer science, and medical sciences in Nigerian federal universities. Applications open next week, and candidates will undergo a merit-based examination. Chief Ichie Jude Ezenwa noted that education remains the greatest driver of community elevation.',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop',
    date: 'June 20, 2026',
    branch: 'portharcourt',
    author: 'PH Education Board',
    tags: ['Scholarship', 'Education', 'PortHarcourt']
  },
  {
    id: 5,
    title: 'Obinabo Village Celebrates New Community Hall Handover',
    content: 'Residents of Obinabo, the fifth and newest village in Amesi town, celebrated the commissioning of their modern Town Hall yesterday. The project, funded jointly by the national AIU body and contributions from diaspora branches, will serve as a hub for village councils, educational lectures, and socio-cultural gatherings. The traditional ruler of Amesi, in his address, praised the unity and collaborative spirit of the town indigenes.',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=800&auto=format&fit=crop',
    date: 'June 15, 2026',
    branch: 'global',
    author: 'AIU National Secretariat',
    tags: ['Development', 'Obinabo', 'TownHall']
  }
];

export const MOCK_GALLERY = {
  lagos: [
    {
      id: 'l1',
      title: 'Lagos Executives Inauguration',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop',
      date: 'May 2026',
      uploader: 'Nze Bartholomew Chijioke',
      description: 'The newly elected executive committee members taking their oath of office.'
    },
    {
      id: 'l2',
      title: 'Monthly General Assembly Meeting',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
      date: 'June 2026',
      uploader: 'Nze Bartholomew Chijioke',
      description: 'Members debating community development projects at the Lagos Event Hall.'
    },
    {
      id: 'l3',
      title: 'End-of-Year Cultural Festival',
      imageUrl: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=600&auto=format&fit=crop',
      date: 'December 2025',
      uploader: 'Lagos Publicity Secretary',
      description: 'Beautiful display of traditional clothing and dances during our end of year gala.'
    },
    {
      id: 'l4',
      title: 'Lagos Charity Visitation',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop',
      date: 'April 2026',
      uploader: 'Chinedu Okeke',
      description: 'Lagos AIU representatives visiting and donating food items to local charity homes.'
    }
  ],
  abuja: [
    {
      id: 'a1',
      title: 'Abuja Amesi House Groundbreaking',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
      date: 'January 2026',
      uploader: 'Engr. Fidelis Nwankwo',
      description: 'Laying the foundation stone of the Abuja Amesi House in Kaura District.'
    },
    {
      id: 'a2',
      title: 'Youth IT Graduation Ceremony',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop',
      date: 'June 2026',
      uploader: 'Abuja Welfare Committee',
      description: 'Graduating students proudly showing their IT training certificates and laptops.'
    },
    {
      id: 'a3',
      title: 'Abuja New Yam Festival (Iri Ji)',
      imageUrl: 'https://images.unsplash.com/photo-1534080391025-a77af6eb215c?q=80&w=600&auto=format&fit=crop',
      date: 'September 2025',
      uploader: 'Ngozi Obi',
      description: 'Traditional presentation of roasted yams to elders at the annual FCT Iri Ji festival.'
    }
  ],
  portharcourt: [
    {
      id: 'p1',
      title: 'PH Civic Centre Commissioning',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
      date: 'March 2026',
      uploader: 'Chief Ichie Jude Ezenwa',
      description: 'Opening the doors to our newly renovated AIU Civic Centre in Trans-Amadi.'
    },
    {
      id: 'p2',
      title: 'Scholarship Award Handover',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop',
      date: 'June 2026',
      uploader: 'PH Education Board',
      description: 'Presenting bank cheques and admission award letters to student beneficiaries.'
    },
    {
      id: 'p3',
      title: 'PH Branch Family Picnic',
      imageUrl: 'https://images.unsplash.com/photo-1526218626217-dc65a29bb444?q=80&w=600&auto=format&fit=crop',
      date: 'May 2026',
      uploader: 'Emeka Nwosu',
      description: 'Gathering of Port Harcourt indigenes, children, and spouses for a fun day out.'
    }
  ]
};
