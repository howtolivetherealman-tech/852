// Complete Administrative Directory for Telangana (33 Districts, 618+ Mandals)
// and Andhra Pradesh (26 Districts, 679 Mandals) sourced from the official Revenue Directories.

export interface RawDistrictDirectory {
  name: string;
  nameTelugu: string;
  headquarters: string;
  mandalNames: string[];
}

const TELUGU_MANDAL_OVERRIDES: Record<string, string> = {
  // Major Urban & Regional Centers
  'Amberpet': 'అంబర్‌పేట',
  'Ameerpet': 'అమీర్‌పేట',
  'Asifnagar': 'ఆసిఫ్‌నగర్',
  'Bahadurpura': 'బహదూర్‌పురా',
  'Bandlaguda': 'బండ్లగూడ',
  'Charminar': 'చార్మినార్',
  'Golkonda': 'గోల్కొండ',
  'Himayathnagar': 'హిమాయత్‌నగర్',
  'Khairatabad': 'ఖైరతాబాద్',
  'Marredpally': 'మారేడ్‌పల్లి',
  'Musheerabad': 'ముషీరాబాద్',
  'Nampally': 'నాంపల్లి',
  'Saidabad': 'సైదాబాద్',
  'Secunderabad': 'సికింద్రాబాద్',
  'Shaikpet': 'షేక్‌పేట',
  'Tirumalagiri': 'తిరుమలగిరి',
  'Serilingampally': 'శేరిలింగంపల్లి',
  'Rajendranagar': 'రాజేంద్రనగర్',
  'Shamshabad': 'శంషాబాద్',
  'Hayathnagar': 'హయత్‌నగర్',
  'Ibrahimpatnam': 'ఇబ్రహీంపట్నం',
  'Saroornagar': 'సరూర్‌నగర్',
  'Uppal': 'ఉప్పల్',
  'Kukatpally': 'కూకట్‌పల్లి',
  'Malkajgiri': 'మల్కాజిగిరి',
  'Quthbullapur': 'కుత్బుల్లాపూర్',
  'Medchal': 'మేడ్చల్',
  'Ghatkesar': 'ఘట్‌కేసర్',
  'Shamirpet': 'శామీర్‌పేట',
  'Hanumakonda': 'హనుమకొండ',
  'Kazipet': 'కాజీపేట',
  'Hasanparthy': 'హసన్‌పర్తి',
  'Parkal': 'పరకాల',
  'Warangal': 'వరంగల్',
  'Khila Warangal': 'ఖిలా వరంగల్',
  'Narsampet': 'నర్సంపేట',
  'Wardhannapet': 'వర్ధన్నపేట',
  'Khammam Urban': 'ఖమ్మం అర్బన్',
  'Khammam Rural': 'ఖమ్మం రూరల్',
  'Madhira': 'మధిర',
  'Sathupalli': 'సత్తుపల్లి',
  'Wyra': 'వైరా',
  'Karimnagar': 'కరీంనగర్',
  'Huzurabad': 'హుజూరాబాద్',
  'Jammikunta': 'జమ్మికుంట',
  'Choppadandi': 'చొప్పదండి',
  'Manakondur': 'మానకొండూరు',
  'Nizamabad North': 'నిజామాబాద్ నార్త్',
  'Nizamabad South': 'నిజామాబాద్ సౌత్',
  'Nizamabad Rural': 'నిజామాబాద్ రూరల్',
  'Armoor': 'ఆర్మూర్',
  'Bodhan': 'బోధన్',
  'Balkonda': 'బాల్కొండ',
  'Nalgonda': 'నల్గొండ',
  'Miryalaguda': 'మిర్యాలగూడ',
  'Devarakonda': 'దేవరకొండ',
  'Suryapet': 'సూర్యాపేట',
  'Kodad': 'కోదాడ',
  'Huzurnagar': 'హుజూర్‌నగర్',
  'Bhongir': 'భువనగిరి',
  'Yadagirigutta': 'యాదగిరిగుట్ట',
  'Choutuppal': 'చౌటుప్పల్',
  'Alair': 'ఆలేరు',
  'Siddipet Urban': 'సిద్దిపేట అర్బన్',
  'Siddipet Rural': 'సిద్దిపేట రూరల్',
  'Gajwel': 'గజ్వేల్',
  'Husnabad': 'హుస్నాబాద్',
  'Dubbak': 'దుబ్బాక',
  'Sangareddy': 'సంగారెడ్డి',
  'Patancheru': 'పటాన్‌చెరు',
  'Zaheerabad': 'జహీరాబాద్',
  'Medak': 'మెదక్',
  'Narsapur': 'నర్సాపూర్',
  'Toopran': 'తూప్రాన్',
  'Mahabubnagar Urban': 'మహబూబ్‌నగర్ అర్బన్',
  'Mahabubnagar Rural': 'మహబూబ్‌నగర్ రూరల్',
  'Jadcherla': 'జడ్చర్ల',
  'Nagarkurnool': 'నాగర్‌కర్నూల్',
  'Achampet': 'అచ్చంపేట',
  'Kalwakurthy': 'కల్వకుర్తి',
  'Kollapur': 'కొల్లాపూర్',
  'Wanaparthy': 'వనపర్తి',
  'Gadwal': 'గద్వాల',
  'Alampur': 'అలంపూర్',
  'Narayanpet': 'నారాయణపేట',
  'Makthal': 'మక్తల్',
  'Vikarabad': 'వికారాబాద్',
  'Tandur': 'తాండూరు',
  'Kodangal': 'కొడంగల్',
  'Pargi': 'పరిగి',
  'Adilabad Urban': 'ఆదిలాబాద్ అర్బన్',
  'Adilabad Rural': 'ఆదిలాబాద్ రూరల్',
  'Utnoor': 'ఉట్నూర్',
  'Boath': 'బోథ్',
  'Nirmal Urban': 'నిర్మల్ అర్బన్',
  'Nirmal Rural': 'నిర్మల్ రూరల్',
  'Bhainsa': 'భైంసా',
  'Basar': 'బాసర',
  'Mancherial': 'మంచిర్యాల',
  'Bellampally': 'బెల్లంపల్లి',
  'Chennur': 'చెన్నూరు',
  'Asifabad': 'ఆసిఫాబాద్',
  'Kagaznagar': 'కాగజ్‌నగర్',
  'Jagtial': 'జగిత్యాల',
  'Korutla': 'కోరుట్ల',
  'Metpalli': 'మెట్‌పల్లి',
  'Dharmapuri': 'ధర్మపురి',
  'Peddapalli': 'పెద్దపల్లి',
  'Ramagundam': 'రామగుండం',
  'Manthani': 'మంథని',
  'Sircilla': 'సిరిసిల్ల',
  'Vemulawada': 'వేములవాడ',
  'Kamareddy': 'కామారెడ్డి',
  'Banswada': 'బాన్సువాడ',
  'Yellareddy': 'ఎల్లారెడ్డి',
  'Kothagudem': 'కొత్తగూడెం',
  'Bhadrachalam': 'భద్రాచలం',
  'Palvancha': 'పాల్వంచ',
  'Yellandu': 'ఇల్లందు',
  'Manuguru': 'మణుగూరు',
  'Mahabubabad': 'మహబూబాబాద్',
  'Thorrur': 'తొర్రూరు',
  'Dornakal': 'డోర్నకల్',
  'Jangaon': 'జనగామ',
  'Station Ghanpur': 'స్టేషన్ ఘన్‌పూర్',
  'Palakurthi': 'పాలకుర్తి',
  'Bhupalpally': 'భూపాలపల్లి',
  'Kataram': 'కాటారం',
  'Mulugu': 'ములుగు',
  'Eturnagaram': 'ఏటూరునాగారం',
  // Andhra Pradesh Major Centers
  'Vijayawada Central': 'విజయవాడ సెంట్రల్',
  'Vijayawada East': 'విజయవాడ ఈస్ట్',
  'Vijayawada North': 'విజయవాడ నార్త్',
  'Vijayawada West': 'విజయవాడ వెస్ట్',
  'Vijayawada Rural': 'విజయవాడ రూరల్',
  'Nandigama': 'నందిగామ',
  'Jaggaiahpeta': 'జగ్గయ్యపేట',
  'Tiruvuru': 'తిరువూరు',
  'Mylavaram': 'మైలవరం',
  'Guntur East': 'గుంటూరు ఈస్ట్',
  'Guntur West': 'గుంటూరు వెస్ట్',
  'Tenali': 'తెనాలి',
  'Mangalagiri': 'మంగళగిరి',
  'Tadepalle': 'తాడేపల్లి',
  'Thullur': 'తుళ్లూరు',
  'Ponnur': 'పొన్నూరు',
  'Amaravathi': 'అమరావతి',
  'Narasaraopet': 'నరసరావుపేట',
  'Chilakaluripet': 'చిలకలూరిపేట',
  'Sattenapalle': 'సత్తెనపల్లి',
  'Vinukonda': 'వినుకొండ',
  'Macherla': 'మాచర్ల',
  'Gurazala': 'గురజాల',
  'Piduguralla': 'పిడుగురాళ్ల',
  'Bapatla': 'బాపట్ల',
  'Chirala': 'చీరాల',
  'Repalle': 'రేపల్లె',
  'Addanki': 'అద్దంకి',
  'Ongole': 'ఒంగోలు',
  'Markapur': 'మార్కాపురం',
  'Kanigiri': 'కనిగిరి',
  'Giddalur': 'గిద్దలూరు',
  'Darsi': 'దర్శి',
  'Chirala Div': 'చీరాల',
  'Nellore Urban': 'నెల్లూరు అర్బన్',
  'Nellore Rural': 'నెల్లూరు రూరల్',
  'Kavali': 'కావలి',
  'Gudur': 'గూడూరు',
  'Kovur': 'కోవూరు',
  'Atmakur': 'ఆత్మకూరు',
  'Kandukur': 'కందుకూరు',
  'Tirupati Urban': 'తిరుపతి అర్బన్',
  'Tirupati Rural': 'తిరుపతి రూరల్',
  'Chandragiri': 'చంద్రగిరి',
  'Renigunta': 'రేణిగుంట',
  'Srikalahasti': 'శ్రీకాళహస్తి',
  'Sullurpeta': 'సూళ్లూరుపేట',
  'Venkatagiri': 'వెంకటగిరి',
  'Chittoor Urban': 'చిత్తూరు అర్బన్',
  'Chittoor Rural': 'చిత్తూరు రూరల్',
  'Palamaner': 'పలమనేరు',
  'Kuppam': 'కుప్పం',
  'Nagari': 'నగరి',
  'Punganur': 'పుంగనూరు',
  'Rayachoti': 'రాయచోటి',
  'Madanapalle': 'మదనపల్లె',
  'Rajampet': 'రాజంపేట',
  'Pileru': 'పీలేరు',
  'Kadapa': 'కడప',
  'Proddatur': 'ప్రొద్దుటూరు',
  'Pulivendula': 'పులివెందుల',
  'Jammalamadugu': 'జమ్మలమడుగు',
  'Badvel': 'బద్వేలు',
  'Vontimitta': 'ఒంటిమిట్ట',
  'Kurnool Urban': 'కర్నూలు అర్బన్',
  'Kurnool Rural': 'కర్నూలు రూరల్',
  'Adoni': 'ఆదోని',
  'Yemmiganur': 'ఎమ్మిగనూరు',
  'Mantralayam': 'మంత్రాలయం',
  'Pattikonda': 'పత్తికొండ',
  'Nandyal': 'నంద్యాల',
  'Allagadda': 'ఆళ్లగడ్డ',
  'Srisailam': 'శ్రీశైలం',
  'Dhone': 'డోన్',
  'Banaganapalle': 'బనగానపల్లె',
  'Nandikotkur': 'నందికొట్కూరు',
  'Anantapur Urban': 'అనంతపురం అర్బన్',
  'Anantapur Rural': 'అనంతపురం రూరల్',
  'Tadipatri': 'తాడిపత్రి',
  'Guntakal': 'గుంతకల్లు',
  'Gooty': 'గుత్తి',
  'Kalyandurg': 'కళ్యాణదుర్గం',
  'Rayadurg': 'రాయదుర్గం',
  'Uravakonda': 'ఉరవకొండ',
  'Puttaparthi': 'పుట్టపర్తి',
  'Dharmavaram': 'ధర్మవరం',
  'Hindupur': 'హిందూపురం',
  'Kadiri': 'కదిరి',
  'Penukonda': 'పెనుకొండ',
  'Lepakshi': 'లేపాక్షి',
  'Visakhapatnam Rural': 'విశాఖపట్నం రూరల్',
  'Gajuwaka': 'గాజువాక',
  'Gopalapatnam': 'గోపాలపట్నం',
  'Maharanipeta': 'మహారాణిపేట',
  'Seethammadhara': 'సీతమ్మధార',
  'Bheemunipatnam': 'భీమునిపట్నం',
  'Pendurthi': 'పెందుర్తి',
  'Anandapuram': 'ఆనందపురం',
  'Anakapalli': 'అనకాపల్లి',
  'Narsipatnam': 'నర్సీపట్నం',
  'Chodavaram': 'చోడవరం',
  'Elamanchili': 'యలమంచిలి',
  'Payakaraopeta': 'పాయకరావుపేట',
  'Paderu': 'పాడేరు',
  'Araku Valley': 'అరకు లోయ',
  'Chintapalle': 'చింతపల్లి',
  'Rampachodavaram': 'రంపచోడవరం',
  'Maredumilli': 'మారేడుమిల్లి',
  'Chinturu': 'చింతూరు',
  'Vizianagaram': 'విజయనగరం',
  'Bobbili': 'బొబ్బిలి',
  'Cheepurupalli': 'చీపురుపల్లి',
  'Bhogapuram': 'భోగాపురం',
  'Srungavarapukota': 'శృంగవరపుకోట',
  'Parvathipuram': 'పార్వతీపురం',
  'Palakonda': 'పాలకొండ',
  'Salur': 'సాలూరు',
  'Kurupam': 'కురుపాం',
  'Srikakulam': 'శ్రీకాకుళం',
  'Amadalavalasa': 'ఆమదాలవలస',
  'Tekkali': 'టెక్కలి',
  'Palasa': 'పలాస',
  'Ichchapuram': 'ఇచ్ఛాపురం',
  'Narasannapeta': 'నరసన్నపేట',
  'Kakinada Urban': 'కాకినాడ అర్బన్',
  'Kakinada Rural': 'కాకినాడ రూరల్',
  'Pithapuram': 'పిఠాపురం',
  'Peddapuram': 'పెద్దాపురం',
  'Tuni': 'తుని',
  'Samalkota': 'సామర్లకోట',
  'Prathipadu': 'ప్రత్తిపాడు',
  'Rajamahendravaram Urban': 'రాజమహేంద్రవరం అర్బన్',
  'Rajamahendravaram Rural': 'రాజమహేంద్రవరం రూరల్',
  'Kovvur': 'కొవ్వూరు',
  'Nidadavole': 'నిడదవోలు',
  'Rajanagaram': 'రాజానగరం',
  'Anaparthi': 'అనపర్తి',
  'Amalapuram': 'అమలాపురం',
  'Razole': 'రాజోలు',
  'Kothapeta': 'కొత్తపేట',
  'Ravulapalem': 'రావులపాలెం',
  'Mandapeta': 'మండపేట',
  'Ramachandrapuram': 'రామచంద్రపురం',
  'Bhimavaram': 'భీమవరం',
  'Narasapuram': 'నరసాపురం',
  'Tadepalligudem': 'తాడేపల్లిగూడెం',
  'Tanuku': 'తణుకు',
  'Palakollu': 'పాలకొల్లు',
  'Akividu': 'ఆకివీడు',
  'Eluru': 'ఏలూరు',
  'Jangareddygudem': 'జంగారెడ్డిగూడెం',
  'Kaikalur': 'కైకలూరు',
  'Chintalapudi': 'చింతలపూడి',
  'Nuzvid': 'నూజివీడు',
  'Polavaram': 'పోలవరం',
  'Machilipatnam': 'మచిలీపట్నం',
  'Gudivada': 'గుడివాడ',
  'Gannavaram': 'గన్నవరం',
  'Vuyyuru': 'ఉయ్యూరు',
  'Avanigadda': 'అవనిగడ్డ',
  'Pedana': 'పెడన',
  'Penamaluru': 'పెనమలూరు',
};

export function toTeluguMandalName(name: string): string {
  const clean = name.replace(/\*$/g, '').trim();
  if (TELUGU_MANDAL_OVERRIDES[clean]) {
    return TELUGU_MANDAL_OVERRIDES[clean];
  }
  // Translate common administrative suffixes into Telugu script while keeping clarity
  return clean
    .replace(/\bUrban\b/g, 'అర్బన్')
    .replace(/\bRural\b/g, 'రూరల్')
    .replace(/\bNorth\b/g, 'నార్త్')
    .replace(/\bSouth\b/g, 'సౌత్')
    .replace(/\bEast\b/g, 'ఈస్ట్')
    .replace(/\bWest\b/g, 'వెస్ట్')
    .replace(/\bCentral\b/g, 'సెంట్రల్')
    .replace(/palle$/i, 'పల్లె')
    .replace(/pally$/i, 'పల్లి')
    .replace(/pet$/i, 'పేట')
    .replace(/peta$/i, 'పేట')
    .replace(/puram$/i, 'పురం')
    .replace(/gudem$/i, 'గూడెం')
    .replace(/nagar$/i, 'నగర్')
    .replace(/konda$/i, 'కొండ')
    .replace(/padu$/i, 'పాడు')
    .replace(/uru$/i, 'ూరు')
    .replace(/বাদ$/i, 'బాద్');
}

// ============================================================================
// TELANGANA STATE — ALL 33 DISTRICTS & MANDALS (FROM OFFICIAL PDF DIRECTORY)
// ============================================================================
export const TELANGANA_33_DISTRICTS_DIRECTORY: RawDistrictDirectory[] = [
  {
    name: 'Adilabad',
    nameTelugu: 'ఆదిలాబాద్',
    headquarters: 'Adilabad',
    mandalNames: [
      'Adilabad Urban', 'Adilabad Rural', 'Mavala', 'Gudihathnoor', 'Sathnala', 'Bela',
      'Bheempoor', 'Jainad', 'Tamsi', 'Talamadagu', 'Neradigonda', 'Ichoda', 'Bazarhatnoor',
      'Boath', 'Sirikonda', 'Inderavelly', 'Narnoor', 'Gadiguda', 'Utnoor'
    ],
  },
  {
    name: 'Bhadradri Kothagudem',
    nameTelugu: 'భద్రాద్రి కొత్తగూడెం',
    headquarters: 'Kothagudem',
    mandalNames: [
      'Kothagudem', 'Palvancha', 'Tekulapalle', 'Yellandu', 'Chandrugonda', 'Aswaraopeta',
      'Mulakalapalle', 'Dammapeta', 'Gundala', 'Julurpad', 'Sujathanagar', 'Chunchupally',
      'Laxmidevipalli', 'Allapalli', 'Annapureddypally', 'Bhadrachalam', 'Dummugudem',
      'Cherla', 'Burgampahad', 'Aswapuram', 'Manuguru', 'Pinapaka', 'Karakagudem'
    ],
  },
  {
    name: 'Hanumakonda',
    nameTelugu: 'హనుమకొండ',
    headquarters: 'Hanumakonda',
    mandalNames: [
      'Hanumakonda', 'Kazipet', 'Hasanparthy', 'Inavole', 'Kamalapur', 'Velair',
      'Bheemadevarapalle', 'Elkathurthy', 'Dharmasagar', 'Parkal', 'Atmakur', 'Damera',
      'Shayampet', 'Nadikuda'
    ],
  },
  {
    name: 'Hyderabad',
    nameTelugu: 'హైదరాబాద్',
    headquarters: 'Hyderabad',
    mandalNames: [
      'Amberpet', 'Asifnagar', 'Bahadurpura', 'Bandlaguda', 'Charminar', 'Golkonda',
      'Himayathnagar', 'Nampally', 'Saidabad', 'Ameerpet', 'Khairatabad', 'Marredpally',
      'Musheerabad', 'Secunderabad', 'Shaikpet', 'Tirumalagiri'
    ],
  },
  {
    name: 'Jagtial',
    nameTelugu: 'జగిత్యాల',
    headquarters: 'Jagtial',
    mandalNames: [
      'Jagtial', 'Jagtial Rural', 'Raikal', 'Sarangapur', 'Beerpur', 'Dharmapuri',
      'Buggaram', 'Pegadapalle', 'Gollapalle', 'Mallial', 'Kodimial', 'Velgatoor',
      'Korutla', 'Metpalli', 'Mallapur', 'Ibrahimpatnam', 'Medipalle', 'Kathlapur',
      'Bheemaram', 'Endapalli'
    ],
  },
  {
    name: 'Jangaon',
    nameTelugu: 'జనగామ',
    headquarters: 'Jangaon',
    mandalNames: [
      'Jangaon', 'Lingalaghanpur', 'Bachannapeta', 'Devaruppula', 'Narmetta',
      'Tharigoppula', 'Raghunathapalle', 'Station Ghanpur', 'Chilpur', 'Zaffergadh',
      'Palakurthi', 'Kodakandla'
    ],
  },
  {
    name: 'Jayashankar Bhupalpally',
    nameTelugu: 'జయశంకర్ భూపాలపల్లి',
    headquarters: 'Bhupalpally',
    mandalNames: [
      'Bhupalpally', 'Ghanpur (Mulug)', 'Regonda', 'Mogullapalle', 'Chityal', 'Tekumatla',
      'Malharrao', 'Kataram', 'Mahadevpur', 'Palimela', 'Maha Mutharam', 'Kothapally Gori'
    ],
  },
  {
    name: 'Jogulamba Gadwal',
    nameTelugu: 'జోగులాంబ గద్వాల',
    headquarters: 'Gadwal',
    mandalNames: [
      'Gadwal', 'Dharur', 'Maldakal', 'Ghattu', 'Kaloor Timmanadoddi', 'Itikyal',
      'Manopad', 'Waddepalle', 'Rajoli', 'Undavelli', 'Alampur', 'Aiza', 'Yerravalli'
    ],
  },
  {
    name: 'Kamareddy',
    nameTelugu: 'కామారెడ్డి',
    headquarters: 'Kamareddy',
    mandalNames: [
      'Kamareddy', 'Bhiknoor', 'Tadwai', 'Rajampet', 'Domakonda', 'Machareddy',
      'Ramareddy', 'Sadasivanagar', 'Bibipet', 'Palvancha (Marampally)', 'Banswada',
      'Bichkunda', 'Jukkal', 'Madnoor', 'Pitlam', 'Pedda Kodapgal', 'Birkoor',
      'Nasurullabad', 'Nizamsagar', 'Dongli', 'Mohammadnagar', 'Yellareddy',
      'Nagireddypet', 'Lingampet', 'Gandhari'
    ],
  },
  {
    name: 'Karimnagar',
    nameTelugu: 'కరీంనగర్',
    headquarters: 'Karimnagar',
    mandalNames: [
      'Karimnagar', 'Karimnagar Rural-I (Kothapally)', 'Karimnagar Rural-II (Chintakunta)',
      'Manakondur', 'Thimmapur', 'Ganneruvaram', 'Gangadhara', 'Ramadugu', 'Choppadandi',
      'Chigurumamidi', 'Huzurabad', 'Veenavanka', 'V. Saidapur', 'Jammikunta',
      'Ellandakunta', 'Shankarapatnam'
    ],
  },
  {
    name: 'Khammam',
    nameTelugu: 'ఖమ్మం',
    headquarters: 'Khammam',
    mandalNames: [
      'Khammam Urban', 'Khammam Rural', 'Raghunadhapalem', 'Thirumalayapalem',
      'Kusumanchi', 'Nelakondapalle', 'Mudigonda', 'Chinthakani', 'Konijerla',
      'Singareni', 'Kamepalle', 'Wyra', 'Bonakal', 'Madhira', 'Yerrupalem',
      'Sathupalli', 'Vemsoor', 'Penuballi', 'Kalluru', 'Thallada', 'Enkuru'
    ],
  },
  {
    name: 'Kumuram Bheem Asifabad',
    nameTelugu: 'కుమురం భీమ్ ఆసిఫాబాద్',
    headquarters: 'Asifabad',
    mandalNames: [
      'Asifabad', 'Kerameri', 'Wankidi', 'Jainoor', 'Sirpur (U)', 'Lingapur', 'Tiryani',
      'Rebbena', 'Kagaznagar', 'Sirpur (T)', 'Kouthala', 'Chintalamanepally', 'Bejjur',
      'Penchikalpet', 'Dahegaon'
    ],
  },
  {
    name: 'Mahabubabad',
    nameTelugu: 'మహబూబాబాద్',
    headquarters: 'Mahabubabad',
    mandalNames: [
      'Mahabubabad', 'Kuravi', 'Kesamudram', 'Dornakal', 'Gudur', 'Kothaguda',
      'Gangaram', 'Bayyaram', 'Garla', 'Seerole', 'Inugurthy', 'Thorrur',
      'Peddavangara', 'Nellikudur', 'Maripeda', 'Danthalapalle', 'Narsimhulapet',
      'Chinnagudur'
    ],
  },
  {
    name: 'Mahabubnagar',
    nameTelugu: 'మహబూబ్‌నగర్',
    headquarters: 'Mahabubnagar',
    mandalNames: [
      'Mahabubnagar Urban', 'Mahabubnagar Rural', 'Bhoothpur', 'Hanwada', 'Koilkonda',
      'Nawabpet', 'Jadcherla', 'Balanagar', 'Rajapur', 'Midjil', 'Devarkadra',
      'Chinna Chintakunta', 'Addakal', 'Musapet', 'Mohammadabad', 'Gandeed',
      'Koulaspur (Kaukuntla)'
    ],
  },
  {
    name: 'Mancherial',
    nameTelugu: 'మంచిర్యాల',
    headquarters: 'Mancherial',
    mandalNames: [
      'Mancherial', 'Naspur', 'Hajipur', 'Luxettipet', 'Dandepally', 'Jannaram',
      'Mandamarri', 'Jaipur', 'Bheemaram', 'Chennur', 'Kotapally', 'Bellampally',
      'Kasipet', 'Tandur', 'Vemanpalle', 'Nennel', 'Bheemini', 'Kannepally'
    ],
  },
  {
    name: 'Medak',
    nameTelugu: 'మెదక్',
    headquarters: 'Medak',
    mandalNames: [
      'Medak', 'Havelighanpur', 'Papannapet', 'Shankarampet (R)', 'Ramayampet',
      'Nizampet', 'Shankarampet (A)', 'Tekmal', 'Alladurg', 'Regode', 'Narsapur',
      'Kulcharam', 'Kowdipalle', 'Shivampet', 'Chilipched', 'Toopran', 'Chegunta',
      'Yeldurthy', 'Manoharabad', 'Narsingi', 'Masaipet'
    ],
  },
  {
    name: 'Medchal-Malkajgiri',
    nameTelugu: 'మేడ్చల్-మల్కాజిగిరి',
    headquarters: 'Shamirpet',
    mandalNames: [
      'Malkajgiri', 'Alwal', 'Quthbullapur', 'Dundigal Gandimaisamma', 'Bachupally',
      'Kukatpally', 'Balanagar', 'Medchal', 'Shamirpet', 'Keesara', 'Kapra',
      'Ghatkesar', 'Medipally', 'Uppal', 'Muduchintalpalli'
    ],
  },
  {
    name: 'Mulugu',
    nameTelugu: 'ములుగు',
    headquarters: 'Mulugu',
    mandalNames: [
      'Mulugu', 'Venkatapur', 'Govindaraopet', 'Sammakka Saralamma Tadvai',
      'Eturnagaram', 'Mangapet', 'Kannaigudem', 'Venkatapuram (Nuguru)', 'Wazeed',
      'Mallampalli'
    ],
  },
  {
    name: 'Nagarkurnool',
    nameTelugu: 'నాగర్‌కర్నూల్',
    headquarters: 'Nagarkurnool',
    mandalNames: [
      'Nagarkurnool', 'Bijinapalle', 'Tadoor', 'Telkapalle', 'Thimmajipeta', 'Achampet',
      'Amrabad', 'Padra', 'Balmoor', 'Lingal', 'Uppunuthala', 'Kalwakurthy', 'Urkonda',
      'Veldanda', 'Vangoor', 'Charakonda', 'Kollapur', 'Pentlavelli',
      'Peddakothapalle', 'Kodair'
    ],
  },
  {
    name: 'Nalgonda',
    nameTelugu: 'నల్గొండ',
    headquarters: 'Nalgonda',
    mandalNames: [
      'Nalgonda', 'Thipparthi', 'Kanagal', 'Chandur', 'Munugode', 'Nakrekal',
      'Kethepalle', 'Shaligouraram', 'Kattangoor', 'Chityala', 'Narketpalle',
      'Gattuppal', 'Miryalaguda', 'Vemulapalle', 'Madugulapally', 'Adavidevulapalli',
      'Damaracherla', 'Anumula (Haliya)', 'Nidamanur', 'Peddavoora', 'Thripuraram',
      'Tirumalagiri Sagar', 'Gudipally', 'Devarakonda', 'Kondamallepally',
      'Pedda Adiserlapally', 'Gundlapally (Dindi)', 'Chandampet', 'Neredugommu',
      'Chinthapally', 'Marriguda', 'Nampally', 'Gurrampode'
    ],
  },
  {
    name: 'Narayanpet',
    nameTelugu: 'నారాయణపేట',
    headquarters: 'Narayanpet',
    mandalNames: [
      'Narayanpet', 'Damaragidda', 'Dhanwada', 'Marikal', 'Maddur', 'Kosgi',
      'Gundumal', 'Kothapally', 'Makthal', 'Narva', 'Utkoor', 'Maganoor', 'Krishna'
    ],
  },
  {
    name: 'Nirmal',
    nameTelugu: 'నిర్మల్',
    headquarters: 'Nirmal',
    mandalNames: [
      'Nirmal Urban', 'Nirmal Rural', 'Soan', 'Dilawarpur', 'Narsapur (G)',
      'Kaddam (Peddur)', 'Dasturabad', 'Khanapur', 'Pembi', 'Mamda', 'Laxmanchanda',
      'Sarangapur', 'Bhainsa', 'Mudhole', 'Basar', 'Lokeshwaram', 'Tanoor', 'Kubeer',
      'Kuntala'
    ],
  },
  {
    name: 'Nizamabad',
    nameTelugu: 'నిజామాబాద్',
    headquarters: 'Nizamabad',
    mandalNames: [
      'Nizamabad North', 'Nizamabad South', 'Nizamabad Rural', 'Mugpal', 'Dichpalle',
      'Indalwai', 'Dharpalle', 'Sirikonda', 'Makloor', 'Navipet', 'Armoor', 'Balkonda',
      'Mendora', 'Mupkal', 'Yerugatla', 'Kammarpalle', 'Mortad', 'Bheemgal', 'Velpur',
      'Jakranpalle', 'Nandipet', 'Aloor', 'Donkeshwar', 'Bodhan', 'Ranjal', 'Yedapalle',
      'Rudrur', 'Kotgiri', 'Varni', 'Mosra', 'Chandur', 'Pothangal', 'Saloora'
    ],
  },
  {
    name: 'Peddapalli',
    nameTelugu: 'పెద్దపల్లి',
    headquarters: 'Peddapalli',
    mandalNames: [
      'Peddapalli', 'Odela', 'Sultanabad', 'Julapalle', 'Elgaid', 'Dharmaram',
      'Ramagundam', 'Antargaon', 'Palakurthy', 'Srirampur', 'Manthani', 'Kamanpur',
      'Ramagiri', 'Mutharam (Manthani)'
    ],
  },
  {
    name: 'Rajanna Sircilla',
    nameTelugu: 'రాజన్న సిరిసిల్ల',
    headquarters: 'Sircilla',
    mandalNames: [
      'Sircilla', 'Thangallapalle', 'Gambhiraopet', 'Yellareddypet', 'Veernapalle',
      'Mustabad', 'Ellanthakunta', 'Vemulawada', 'Vemulawada Rural', 'Chandurthi',
      'Rudrangi', 'Boinpalle', 'Konaraopet'
    ],
  },
  {
    name: 'Rangareddy',
    nameTelugu: 'రంగారెడ్డి',
    headquarters: 'Kongara Kalan',
    mandalNames: [
      'Rajendranagar', 'Gandipet', 'Serilingampally', 'Shamshabad', 'Chevella',
      'Shahbad', 'Moinabad', 'Shankarpally', 'Ibrahimpatnam', 'Manchal', 'Yacharam',
      'Abdullapurmet', 'Hayathnagar', 'Madgul', 'Kandukur', 'Maheshwaram', 'Balapur',
      'Saroornagar', 'Amangal', 'Kadthal', 'Talakondapalle', 'Farooqnagar (Shadnagar)',
      'Kothur', 'Keshampet', 'Kondurg', 'Chowdergudem', 'Nandigama'
    ],
  },
  {
    name: 'Sangareddy',
    nameTelugu: 'సంగారెడ్డి',
    headquarters: 'Sangareddy',
    mandalNames: [
      'Sangareddy', 'Kandi', 'Kondapur', 'Sadasivpet', 'Patancheru', 'Ameenpur',
      'Ramachandrapuram', 'Jinnaram', 'Gummadidala', 'Hathnoora', 'Munipally',
      'Andole (Jogipet)', 'Pulkal', 'Chowtakur', 'Vatpally', 'Nizampet', 'Zaheerabad',
      'Mogudampally', 'Nyalkal', 'Jharasangam', 'Kohir', 'Raikode', 'Narayankhed',
      'Kangti', 'Kalher', 'Sirgapoor', 'Manoor', 'Nagilgidda'
    ],
  },
  {
    name: 'Siddipet',
    nameTelugu: 'సిద్దిపేట',
    headquarters: 'Siddipet',
    mandalNames: [
      'Siddipet Urban', 'Siddipet Rural', 'Nangnoor', 'Chinnakodur', 'Thoguta',
      'Dubbak', 'Mirdoddi', 'Doulthabad', 'Komuravelli', 'Cherial', 'Narayanaraopet',
      'Akbarpet-Bhoompally', 'Gajwel', 'Jagdevpur', 'Kondapak', 'Mulugu', 'Markook',
      'Wargal', 'Raipole', 'Kukunoorpally', 'Husnabad', 'Akkannapet', 'Koheda',
      'Bejjanki', 'Maddur', 'Dhoolmitta'
    ],
  },
  {
    name: 'Suryapet',
    nameTelugu: 'సూర్యాపేట',
    headquarters: 'Suryapet',
    mandalNames: [
      'Suryapet', 'Atmakur (S)', 'Chivvemla', 'Penpahad', 'Mothey', 'Thungathurthy',
      'Nutankal', 'Maddirala', 'Thirumalagiri', 'Jajireddygudem', 'Nagaram', 'Kodad',
      'Chilkur', 'Munagala', 'Nadigudem', 'Ananthagiri', 'Huzurnagar', 'Neredcherla',
      'Garidepally', 'Palakeedu', 'Mellachervu',
      'Chinthalapalem (Mallareddygudem)', 'Mattampally'
    ],
  },
  {
    name: 'Vikarabad',
    nameTelugu: 'వికారాబాద్',
    headquarters: 'Vikarabad',
    mandalNames: [
      'Vikarabad', 'Mominpet', 'Marpalle', 'Chittagidda', 'Dharur', 'Bantwaram',
      'Kotepally', 'Nawabpet', 'Pudur', 'Pargi', 'Kulkacherla', 'Doma', 'Tandur',
      'Basheerabad', 'Yelal', 'Peddemul', 'Kodangal', 'Bomraspet', 'Doulthabad',
      'Dudyal'
    ],
  },
  {
    name: 'Wanaparthy',
    nameTelugu: 'వనపర్తి',
    headquarters: 'Wanaparthy',
    mandalNames: [
      'Wanaparthy', 'Gopalpeta', 'Peddamandadi', 'Ghanpur (Khilla)', 'Pangal',
      'Pebbair', 'Srirangapur', 'Veepanagandla', 'Chinnambavi', 'Kothakota',
      'Madanapur', 'Atmakur', 'Amarchinta', 'Revally', 'Edula'
    ],
  },
  {
    name: 'Warangal',
    nameTelugu: 'వరంగల్',
    headquarters: 'Warangal',
    mandalNames: [
      'Warangal', 'Khila Warangal', 'Geesugonda', 'Sangem', 'Parvathagiri',
      'Wardhannapet', 'Rayaparthy', 'Narsampet', 'Chennaraopet', 'Nallabelly',
      'Duggondi', 'Khanapur', 'Nekkonda'
    ],
  },
  {
    name: 'Yadadri Bhuvanagiri',
    nameTelugu: 'యాదాద్రి భువనగిరి',
    headquarters: 'Bhongir',
    mandalNames: [
      'Bhongir', 'Alair', 'Yadagirigutta', 'Turkapally', 'Rajapet', 'Bommalaramaram',
      'Bibinagar', 'Motakondur', 'Mothkur', 'Atmakur (M)', 'Addaguduru', 'Gundala',
      'Choutuppal', 'Bhoodan Pochampally', 'Ramannapet', 'Valigonda', 'Narayanpur'
    ],
  },
];

// ============================================================================
// ANDHRA PRADESH STATE — ALL 26 DISTRICTS & MANDALS (FROM OFFICIAL PDF DIRECTORY)
// ============================================================================
export const ANDHRA_PRADESH_26_DISTRICTS_DIRECTORY: RawDistrictDirectory[] = [
  {
    name: 'Alluri Sitharama Raju',
    nameTelugu: 'అల్లూరి సీతారామరాజు',
    headquarters: 'Paderu',
    mandalNames: [
      'Paderu', 'Araku Valley', 'Ananthagiri', 'Chintapalle', 'Dumbriguda',
      'G. Madugula', 'Gudem Kotha Veedhi', 'Hukumpeta', 'Koyyuru', 'Munchingi Puttu',
      'Pedabayalu', 'Rampachodavaram', 'Addateegala', 'Devipatnam', 'Gangavaram',
      'Maredumilli', 'Rajavommangi', 'Y. Ramavaram', 'Chinturu', 'Etapaka',
      'Kunavaram', 'Vararamachandrapuram'
    ],
  },
  {
    name: 'Anakapalli',
    nameTelugu: 'అనకాపల్లి',
    headquarters: 'Anakapalli',
    mandalNames: [
      'Anakapalli', 'Atchutapuram', 'Butchayyapeta', 'Chodavaram', 'Devarapalli',
      'Elamanchili', 'K. Kotapadu', 'Kasimkota', 'Munagapaka', 'Paravada', 'Rambilli',
      'Sabbavaram', 'Narsipatnam', 'Cheedikada', 'Golugonda', 'Kotauratla', 'Madugula',
      'Makavarapalem', 'Nakkapalle', 'Nathavaram', 'Payakaraopeta', 'Ravikamatham',
      'Rolugunta', 'Sarvasiddhi Rayavaram'
    ],
  },
  {
    name: 'Anantapuramu',
    nameTelugu: 'అనంతపురం',
    headquarters: 'Anantapur',
    mandalNames: [
      'Anantapur Urban', 'Anantapur Rural', 'Atmakur', 'Bukkarayasamudram',
      'Garladinne', 'Kudair', 'Narpala', 'Peddapappur', 'Putlur', 'Raptadu',
      'Singanamala', 'Tadipatri', 'Yellanur', 'Guntakal', 'Gooty', 'Pamidi',
      'Peddavadugur', 'Uravakonda', 'Vajrakarur', 'Vidapanakal', 'Yadiki',
      'Kalyandurg', 'Beluguppa', 'Bommanahal', 'Brahmasamudram', 'D. Hirehal',
      'Gummagatta', 'Kambadur', 'Kanekal', 'Kundurpi', 'Rayadurg', 'Setturu'
    ],
  },
  {
    name: 'Annamayya',
    nameTelugu: 'అన్నమయ్య',
    headquarters: 'Rayachoti',
    mandalNames: [
      'Rayachoti', 'Chinnamandyam', 'Galiveedu', 'Gurramkonda', 'Kalakada',
      'Kambhamvaripalle', 'Lakkireddipalle', 'Pileru', 'Ramapuram', 'Sambepalli',
      'Madanapalle', 'Beerangi Kothakota', 'Kalikiri', 'Kurabalakota',
      'Mulakalacheruvu', 'Nimmanapalle', 'Peddamandyam', 'Peddathippasamudram',
      'Ramasamudram', 'Thamballapalle', 'Valmiki Puram', 'Rajampet', 'Chitvel',
      'Kodur', 'Nandalur', 'Obulavaripalle', 'Penagalur', 'Pullampeta',
      'T. Sundupalle', 'Veeraballi'
    ],
  },
  {
    name: 'Bapatla',
    nameTelugu: 'బాపట్ల',
    headquarters: 'Bapatla',
    mandalNames: [
      'Bapatla', 'Karlapalem', 'Martur', 'Parchur', 'Pittalavanipalem', 'Yeddanapudi',
      'Chirala', 'Addanki', 'Ballikurava', 'Chinaganjam', 'Inkollu',
      'Janakavarampanguluru', 'Karamchedu', 'Korisapadu', 'Santhamaguluru',
      'Vetapalem', 'Repalle', 'Amruthalur', 'Bhattiprolu', 'Cherukupalle', 'Kolluru',
      'Nagaram', 'Nizampatnam', 'Tsundur', 'Vemuru'
    ],
  },
  {
    name: 'Chittoor',
    nameTelugu: 'చిత్తూరు',
    headquarters: 'Chittoor',
    mandalNames: [
      'Chittoor Urban', 'Chittoor Rural', 'Gangadhara Nellore', 'Gudipala', 'Irala',
      'Penumuru', 'Pulicherla', 'Puthalapattu', 'Rompicherla', 'Srirangarajapuram',
      'Thavanampalle', 'Vedurukuppam', 'Yadamari', 'Punganur', 'Palamaner',
      'Baireddipalle', 'Bangarupalem', 'Chowdepalle', 'Gangavaram', 'Peddapanjani',
      'Sodam', 'Somala', 'Venkatagirikota', 'Kuppam', 'Gudupalle', 'Ramakuppam',
      'Santhipuram', 'Nagari', 'Karvetinagar', 'Nindra', 'Palasamudram', 'Vijayapuram'
    ],
  },
  {
    name: 'Dr. B.R. Ambedkar Konaseema',
    nameTelugu: 'డా. బి.ఆర్. అంబేద్కర్ కోనసీమ',
    headquarters: 'Amalapuram',
    mandalNames: [
      'Amalapuram', 'Ainavilli', 'Allavaram', 'I. Polavaram', 'Katrenikona',
      'Malikipuram', 'Mamidikuduru', 'Mummidivaram', 'Razole', 'Sakhinetipalle',
      'Uppalaguptam', 'Kothapeta', 'Alamuru', 'Ambajipeta', 'Atreyapuram',
      'P. Gannavaram', 'Ravulapalem', 'Ramachandrapuram', 'Gangavaram (K. Gangavaram)',
      'Kapileswarapuram', 'Mandapeta', 'Rayavaram'
    ],
  },
  {
    name: 'East Godavari',
    nameTelugu: 'తూర్పు గోదావరి',
    headquarters: 'Rajamahendravaram',
    mandalNames: [
      'Rajamahendravaram Urban', 'Rajamahendravaram Rural', 'Anaparthi', 'Biccavolu',
      'Gokavaram', 'Kadiam', 'Korukonda', 'Rajanagaram', 'Rangampeta',
      'Seethanagaram', 'Kovvur', 'Chagallu', 'Devarapalle', 'Gopalapuram',
      'Nallajerla', 'Nidadavole', 'Peravali', 'Tallapudi', 'Undrajavaram'
    ],
  },
  {
    name: 'Eluru',
    nameTelugu: 'ఏలూరు',
    headquarters: 'Eluru',
    mandalNames: [
      'Eluru', 'Bhimadole', 'Denduluru', 'Ganapavaram', 'Kaikalur', 'Kalidindi',
      'Mandavalli', 'Mudinepalli', 'Nidamarru', 'Pedapadu', 'Pedavegi', 'Unguturu',
      'Agiripalli', 'Jangareddygudem', 'Buttayagudem', 'Chintalapudi',
      'Jeelugu Milli', 'Kamavarapukota', 'Koyyalagudem', 'Kukkunoor', 'Lingapalem',
      'Polavaram', 'T. Narasapuram', 'Velerupadu', 'Nuzvid', 'Chatrai', 'Musunuru',
      'Dwaraka Tirumala'
    ],
  },
  {
    name: 'Guntur',
    nameTelugu: 'గుంటూరు',
    headquarters: 'Guntur',
    mandalNames: [
      'Guntur East', 'Guntur West', 'Medikonduru', 'Pedakakani', 'Pedanandipadu',
      'Phirangipuram', 'Prathipadu', 'Tadikonda', 'Thullur', 'Vatticherukuru',
      'Tenali', 'Chebrolu', 'Duggirala', 'Kakumanu', 'Kollipara', 'Mangalagiri',
      'Ponnur', 'Tadepalle'
    ],
  },
  {
    name: 'Kakinada',
    nameTelugu: 'కాకినాడ',
    headquarters: 'Kakinada',
    mandalNames: [
      'Kakinada Urban', 'Kakinada Rural', 'Gollaprolu', 'Kajuluru', 'Karapa',
      'Kothapalle', 'Pedapudi', 'Pithapuram', 'Samalkota', 'Thallarevu',
      'Peddapuram', 'Gandepalle', 'Jaggampeta', 'Kirlampudi', 'Kotananduru',
      'Prathipadu', 'Rowthulapudi', 'Sankhavaram', 'Thondangi', 'Tuni', 'Yeleswaram'
    ],
  },
  {
    name: 'Krishna',
    nameTelugu: 'కృష్ణా',
    headquarters: 'Machilipatnam',
    mandalNames: [
      'Machilipatnam', 'Avanigadda', 'Bantumilli', 'Challapalli', 'Ghantasala',
      'Guduru', 'Koduru', 'Kruthivennu', 'Mopidevi', 'Nagayalanka', 'Pedana',
      'Gudlavalleru', 'Gudivada', 'Bapulapadu', 'Gannavaram', 'Nandivada',
      'Pedaparupudi', 'Unguturu', 'Vuyyuru', 'Kankipadu', 'Movva', 'Pamarru',
      'Pamidimukkala', 'Penamaluru', 'Thotlavalluru'
    ],
  },
  {
    name: 'Kurnool',
    nameTelugu: 'కర్నూలు',
    headquarters: 'Kurnool',
    mandalNames: [
      'Kurnool Urban', 'Kurnool Rural', 'C. Belagal', 'Gudur', 'Kallur', 'Kodumur',
      'Orvakal', 'Veldurthi', 'Adoni', 'Gonegandla', 'Holagunda', 'Kosigi',
      'Kowthalam', 'Mantralayam', 'Nandavaram', 'Pedda Kadubur', 'Yemmiganur',
      'Pattikonda', 'Alur', 'Aspari', 'Chippagiri', 'Devanakonda', 'Halaharvi',
      'Krishnagiri', 'Maddikera East', 'Tuggali'
    ],
  },
  {
    name: 'Nandyal',
    nameTelugu: 'నంద్యాల',
    headquarters: 'Nandyal',
    mandalNames: [
      'Nandyal', 'Allagadda', 'Bandi Atmakur', 'Chagalamarri', 'Dornipadu',
      'Gadivemula', 'Gospadu', 'Koilkuntla', 'Mahanandi', 'Panyam', 'Rudravaram',
      'Sanjamala', 'Sirvel', 'Uyyalawada', 'Atmakur', 'Jupadu Bungalow', 'Kothapalle',
      'Midthur', 'Nandikotkur', 'Pagidyala', 'Pamulapadu', 'Srisailam', 'Velgodu',
      'Dhone', 'Banaganapalle', 'Bethamcherla', 'Kolimigundla', 'Owk', 'Peapully'
    ],
  },
  {
    name: 'NTR District',
    nameTelugu: 'ఎన్టీఆర్ జిల్లా (విజయవాడ)',
    headquarters: 'Vijayawada',
    mandalNames: [
      'Vijayawada Central', 'Vijayawada East', 'Vijayawada North', 'Vijayawada West',
      'Vijayawada Rural', 'G. Konduru', 'Ibrahimpatnam', 'Nandigama',
      'Chandarlapadu', 'Jaggaiahpeta', 'Kanchikacherla', 'Penuganchiprolu',
      'Vatsavai', 'Veerullapadu', 'Tiruvuru', 'A. Konduru', 'Gampalagudem',
      'Mylavaram', 'Reddigudem', 'Vissannapeta'
    ],
  },
  {
    name: 'Palnadu',
    nameTelugu: 'పల్నాడు',
    headquarters: 'Narasaraopet',
    mandalNames: [
      'Narasaraopet', 'Chilakaluripet', 'Edlapadu', 'Ipur', 'Nadendla', 'Nuzendla',
      'Rompicherla', 'Savalyapuram', 'Vinukonda', 'Sattenapalle', 'Amaravathi',
      'Atchampet', 'Bellamkonda', 'Krosuru', 'Muppalla', 'Nekarikallu',
      'Pedakurapadu', 'Rajupalem', 'Gurazala', 'Bollapalle', 'Dachepalle', 'Durgi',
      'Karempudi', 'Machavaram', 'Macherla', 'Piduguralla', 'Rentachintala', 'Veldurthi'
    ],
  },
  {
    name: 'Parvathipuram Manyam',
    nameTelugu: 'పార్వతీపురం మన్యం',
    headquarters: 'Parvathipuram',
    mandalNames: [
      'Parvathipuram', 'Balijipeta', 'Garugubilli', 'Gummalakshmipuram',
      'Jiyyammavalasa', 'Komarada', 'Kurupam', 'Makkuva', 'Palakonda', 'Bhamini',
      'Pachipenta', 'Salur', 'Seethampeta', 'Seethanagaram', 'Veeraghattam'
    ],
  },
  {
    name: 'Prakasam',
    nameTelugu: 'ప్రకాశం',
    headquarters: 'Ongole',
    mandalNames: [
      'Ongole', 'Chimakurthy', 'Kondapi', 'Kothapatnam', 'Maddipadu', 'Marripudi',
      'Mundlamuru', 'Naguluppalapadu', 'Ponnaluru', 'Santhanuthalapadu',
      'Singarayakonda', 'Tangutur', 'Thallur', 'Zarugumalli', 'Markapur',
      'Ardhaveedu', 'Bestawaripeta', 'Cumbum', 'Dornala', 'Giddalur', 'Komarole',
      'Konakanamitla', 'Pedda Araveedu', 'Podili', 'Pullalacheruvu', 'Racherla',
      'Tarlupadu', 'Tripuranthakam', 'Yerragondapalem', 'Kanigiri',
      'Chandra Sekhara Puram', 'Darsi', 'Donakonda', 'Hanumanthuni Padu',
      'Kurichedu', 'Pamur', 'Pedacherlo Palle', 'Veligandla'
    ],
  },
  {
    name: 'Sri Potti Sriramulu Nellore',
    nameTelugu: 'శ్రీ పొట్టి శ్రీరాములు నెల్లూరు',
    headquarters: 'Nellore',
    mandalNames: [
      'Nellore Urban', 'Nellore Rural', 'Allur', 'Buchireddypalem', 'Dagadarthi',
      'Indukurpet', 'Kodavalur', 'Kovur', 'Manubolu', 'Muthukur', 'Podalakur',
      'Rapur', 'Saidapuram', 'Thotapalligudur', 'Venkatachalam', 'Vidavalur',
      'Atmakur', 'Ananthasagaram', 'Anumasamudrampeta', 'Chejerla', 'Kaluvoya',
      'Marripadu', 'Sangam', 'Sitarampuramu', 'Udayagiri', 'Kavali', 'Bogole',
      'Duttalur', 'Jaladanki', 'Kaligiri', 'Kondapuram', 'Vinjamur', 'Kandukur',
      'Gudluru', 'Lingasamudram', 'Ulavapadu', 'Varikuntapadu', 'Voletivaripalem'
    ],
  },
  {
    name: 'Sri Sathya Sai',
    nameTelugu: 'శ్రీ సత్యసాయి',
    headquarters: 'Puttaparthi',
    mandalNames: [
      'Puttaparthi', 'Amadagur', 'Bukkapatnam', 'Kothacheruvu', 'Nallamada',
      'Obuladevaracheruvu', 'Dharmavaram', 'Bathalapalle', 'Chennekothapalle',
      'Kanaganapalle', 'Mudigubba', 'Ramagiri', 'Tadimarri', 'Penukonda', 'Agali',
      'Amarapuram', 'Chilamathur', 'Gorantla', 'Gudibanda', 'Hindupur', 'Lepakshi',
      'Madakasira', 'Parigi', 'Roddam', 'Rolla', 'Somandepalle', 'Kadiri',
      'Gandlapenta', 'Nallacheruvu', 'Nambulipulikunta', 'Talupula', 'Tanakal'
    ],
  },
  {
    name: 'Srikakulam',
    nameTelugu: 'శ్రీకాకుళం',
    headquarters: 'Srikakulam',
    mandalNames: [
      'Srikakulam', 'Amadalavalasa', 'Burja', 'Etcherla', 'Ganguvarisigadam', 'Gara',
      'Hiramandalam', 'Jalumuru', 'L.N. Peta', 'Laveru', 'Narasannapeta', 'Polaki',
      'Ponduru', 'Ranastalam', 'Sarubujjili', 'Tekkali', 'Kotabommali', 'Kothuru',
      'Meliaputti', 'Nandigam', 'Pathapatnam', 'Santhabommali', 'Saravakota',
      'Palasa', 'Ichchapuram', 'Kanchili', 'Kaviti', 'Mandasa', 'Sompeta',
      'Vajrapukothuru'
    ],
  },
  {
    name: 'Tirupati',
    nameTelugu: 'తిరుపతి',
    headquarters: 'Tirupati',
    mandalNames: [
      'Tirupati Urban', 'Tirupati Rural', 'Chandragiri', 'Chinnagottigallu', 'Pakala',
      'Puttur', 'Ramachandrapuram', 'Renigunta', 'Vadamalapeta', 'Yerravaripalem',
      'Narayanavanam', 'Pichatur', 'Gudur', 'Balayapalle', 'Chillakur', 'Chittamur',
      'Dakili', 'Kota', 'Vakadu', 'Venkatagiri', 'Sullurpeta', 'Buchinaidu Kandriga',
      'Doravarisatram', 'K.V.B. Puram', 'Nagalapuram', 'Naidupeta', 'Ozili',
      'Pellakur', 'Satyavedu', 'Srikalahasti', 'Tada', 'Thottambedu',
      'Varadaiahpalem', 'Yerpedu'
    ],
  },
  {
    name: 'Visakhapatnam',
    nameTelugu: 'విశాఖపట్నం',
    headquarters: 'Visakhapatnam',
    mandalNames: [
      'Visakhapatnam Rural', 'Gajuwaka', 'Gopalapatnam', 'Maharanipeta', 'Mulagada',
      'Seethammadhara', 'Bheemunipatnam', 'Anandapuram', 'Padmanabham',
      'Pedagantyada', 'Pendurthi'
    ],
  },
  {
    name: 'Vizianagaram',
    nameTelugu: 'విజయనగరం',
    headquarters: 'Vizianagaram',
    mandalNames: [
      'Vizianagaram', 'Bhogapuram', 'Bondapalli', 'Denkada', 'Gantyada', 'Jami',
      'Kothavalasa', 'Lakkavarapukota', 'Nellimarla', 'Pusapatirega',
      'Srungavarapukota', 'Vepada', 'Bobbili', 'Badangi', 'Dattirajeru',
      'Gajapathinagaram', 'Mentada', 'Ramabhadrapuram', 'Therlam', 'Cheepurupalli',
      'Garividi', 'Gurla', 'Merakamudidam', 'Rajam', 'Regidi Amadalavalasa',
      'Santhakaviti', 'Vangara'
    ],
  },
  {
    name: 'West Godavari',
    nameTelugu: 'పశ్చిమ గోదావరి',
    headquarters: 'Bhimavaram',
    mandalNames: [
      'Bhimavaram', 'Akividu', 'Kalla', 'Palacoderu', 'Undi', 'Veeravasaram',
      'Narasapuram', 'Achanta', 'Mogalthur', 'Palakollu', 'Poduru', 'Yelamanchili',
      'Tadepalligudem', 'Attili', 'Ganapavaram', 'Iragavaram', 'Pentapadu',
      'Penugonda', 'Penumantra', 'Tanuku'
    ],
  },
  {
    name: 'YSR Kadapa',
    nameTelugu: 'వైఎస్ఆర్ కడప',
    headquarters: 'Kadapa',
    mandalNames: [
      'Kadapa', 'Chakrayapet', 'Chennur', 'Chinthakommadinne', 'Kamalapuram',
      'Pendlimarri', 'Sidhout', 'Vallur', 'Veerapunayunipalle', 'Vontimitta',
      'Yerraguntla', 'Badvel', 'Atlur', 'B. Kodur', 'Brahmamgarimattam', 'Chapad',
      'Duvvur', 'Gopavaram', 'Kalasapadu', 'Khajipet', 'S. Mydukur', 'Porumamilla',
      'Sri Avadhutha Kasinayana', 'Jammalamadugu', 'Kondapuram', 'Muddanur',
      'Mylavaram', 'Peddamudium', 'Proddatur', 'Rajupalem', 'Pulivendula', 'Lingala',
      'Simhadripuram', 'Thondur', 'Vempalli', 'Vemula'
    ],
  },
];
