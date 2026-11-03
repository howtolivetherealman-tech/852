import {
  TELANGANA_33_DISTRICTS_DIRECTORY,
  ANDHRA_PRADESH_26_DISTRICTS_DIRECTORY,
  toTeluguMandalName,
} from './tg-ap-directory';

export interface StateEntry {
  id: string;
  code: string;
  name: string;
  nameTelugu: string;
  type: 'STATE' | 'UT';
  divisionLabel: 'Mandal' | 'Tehsil' | 'Taluk' | 'Block' | 'Sub-Division';
  active: boolean;
}

export interface DistrictEntry {
  id: string;
  stateCode: string;
  stateName: string;
  name: string;
  nameTelugu: string;
  active: boolean;
}

export interface MandalEntry {
  id: string;
  stateCode: string;
  districtName: string;
  name: string;
  nameTelugu: string;
  divisionType: string;
  active: boolean;
}

export const INITIAL_INDIA_STATES: StateEntry[] = [
  { id: 'state-tg', code: 'TG', name: 'Telangana', nameTelugu: 'తెలంగాణ', type: 'STATE', divisionLabel: 'Mandal', active: true },
  { id: 'state-ap', code: 'AP', name: 'Andhra Pradesh', nameTelugu: 'ఆంధ్రప్రదేశ్', type: 'STATE', divisionLabel: 'Mandal', active: true },
  { id: 'state-ka', code: 'KA', name: 'Karnataka', nameTelugu: 'కర్ణాటక', type: 'STATE', divisionLabel: 'Taluk', active: true },
  { id: 'state-tn', code: 'TN', name: 'Tamil Nadu', nameTelugu: 'తమిళనాడు', type: 'STATE', divisionLabel: 'Taluk', active: true },
  { id: 'state-mh', code: 'MH', name: 'Maharashtra', nameTelugu: 'మహారాష్ట్ర', type: 'STATE', divisionLabel: 'Taluk', active: true },
  { id: 'state-dl', code: 'DL', name: 'Delhi (NCT)', nameTelugu: 'ఢిల్లీ', type: 'UT', divisionLabel: 'Tehsil', active: true },
  { id: 'state-kl', code: 'KL', name: 'Kerala', nameTelugu: 'కేరళ', type: 'STATE', divisionLabel: 'Taluk', active: true },
  { id: 'state-od', code: 'OD', name: 'Odisha', nameTelugu: 'ఒడిశా', type: 'STATE', divisionLabel: 'Block', active: true },
  { id: 'state-gj', code: 'GJ', name: 'Gujarat', nameTelugu: 'గుజరాత్', type: 'STATE', divisionLabel: 'Taluk', active: true },
  { id: 'state-up', code: 'UP', name: 'Uttar Pradesh', nameTelugu: 'ఉత్తర ప్రదేశ్', type: 'STATE', divisionLabel: 'Tehsil', active: true },
  { id: 'state-mp', code: 'MP', name: 'Madhya Pradesh', nameTelugu: 'మధ్య ప్రదేశ్', type: 'STATE', divisionLabel: 'Tehsil', active: true },
  { id: 'state-rj', code: 'RJ', name: 'Rajasthan', nameTelugu: 'రాజస్థాన్', type: 'STATE', divisionLabel: 'Tehsil', active: true },
  { id: 'state-wb', code: 'WB', name: 'West Bengal', nameTelugu: 'పశ్చిమ బెంగాల్', type: 'STATE', divisionLabel: 'Block', active: true },
  { id: 'state-br', code: 'BR', name: 'Bihar', nameTelugu: 'బీహార్', type: 'STATE', divisionLabel: 'Block', active: true },
  { id: 'state-pb', code: 'PB', name: 'Punjab', nameTelugu: 'పంజాబ్', type: 'STATE', divisionLabel: 'Tehsil', active: true },
  { id: 'state-hr', code: 'HR', name: 'Haryana', nameTelugu: 'హర్యానా', type: 'STATE', divisionLabel: 'Tehsil', active: true },
  { id: 'state-ct', code: 'CT', name: 'Chhattisgarh', nameTelugu: 'ఛత్తీస్‌గఢ్', type: 'STATE', divisionLabel: 'Tehsil', active: true },
  { id: 'state-jh', code: 'JH', name: 'Jharkhand', nameTelugu: 'జార్ఖండ్', type: 'STATE', divisionLabel: 'Block', active: true },
  { id: 'state-as', code: 'AS', name: 'Assam', nameTelugu: 'అస్సాం', type: 'STATE', divisionLabel: 'Block', active: true },
  { id: 'state-uk', code: 'UK', name: 'Uttarakhand', nameTelugu: 'ఉత్తరాఖండ్', type: 'STATE', divisionLabel: 'Tehsil', active: true },
  { id: 'state-hp', code: 'HP', name: 'Himachal Pradesh', nameTelugu: 'హిమాచల్ ప్రదేశ్', type: 'STATE', divisionLabel: 'Tehsil', active: true },
  { id: 'state-ga', code: 'GA', name: 'Goa', nameTelugu: 'గోవా', type: 'STATE', divisionLabel: 'Taluk', active: true },
  { id: 'state-tr', code: 'TR', name: 'Tripura', nameTelugu: 'త్రిపుర', type: 'STATE', divisionLabel: 'Block', active: true },
  { id: 'state-ml', code: 'ML', name: 'Meghalaya', nameTelugu: 'మేఘాలయ', type: 'STATE', divisionLabel: 'Block', active: true },
  { id: 'state-mn', code: 'MN', name: 'Manipur', nameTelugu: 'మణిపూర్', type: 'STATE', divisionLabel: 'Sub-Division', active: true },
  { id: 'state-nl', code: 'NL', name: 'Nagaland', nameTelugu: 'నాగాలాండ్', type: 'STATE', divisionLabel: 'Block', active: true },
  { id: 'state-ar', code: 'AR', name: 'Arunachal Pradesh', nameTelugu: 'అరుణాచల్ ప్రదేశ్', type: 'STATE', divisionLabel: 'Block', active: true },
  { id: 'state-mz', code: 'MZ', name: 'Mizoram', nameTelugu: 'మిజోరం', type: 'STATE', divisionLabel: 'Block', active: true },
  { id: 'state-sk', code: 'SK', name: 'Sikkim', nameTelugu: 'సిక్కిం', type: 'STATE', divisionLabel: 'Sub-Division', active: true },
  { id: 'state-py', code: 'PY', name: 'Puducherry', nameTelugu: 'పుదుచ్చేరి', type: 'UT', divisionLabel: 'Taluk', active: true },
  { id: 'state-jk', code: 'JK', name: 'Jammu and Kashmir', nameTelugu: 'జమ్మూ కాశ్మీర్', type: 'UT', divisionLabel: 'Tehsil', active: true },
  { id: 'state-la', code: 'LA', name: 'Ladakh', nameTelugu: 'లడఖ్', type: 'UT', divisionLabel: 'Tehsil', active: true },
  { id: 'state-ch', code: 'CH', name: 'Chandigarh', nameTelugu: 'చండీగఢ్', type: 'UT', divisionLabel: 'Tehsil', active: true },
  { id: 'state-an', code: 'AN', name: 'Andaman and Nicobar Islands', nameTelugu: 'అండమాన్ నికోబార్ దీవులు', type: 'UT', divisionLabel: 'Tehsil', active: true },
  { id: 'state-dn', code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu', nameTelugu: 'దాద్రా నగర్ హవేలీ మరియు డామన్ డయ్యూ', type: 'UT', divisionLabel: 'Taluk', active: true },
  { id: 'state-ld', code: 'LD', name: 'Lakshadweep', nameTelugu: 'లక్షద్వీప్', type: 'UT', divisionLabel: 'Sub-Division', active: true },
];

interface RawStateDistricts {
  stateCode: string;
  stateName: string;
  divisionType: string;
  districts: {
    name: string;
    nameTelugu: string;
    mandals: { name: string; nameTelugu: string }[];
  }[];
}

const RAW_HIERARCHY: RawStateDistricts[] = [
  {
    stateCode: 'TG',
    stateName: 'Telangana',
    divisionType: 'Mandal',
    districts: TELANGANA_33_DISTRICTS_DIRECTORY.map((d) => ({
      name: d.name,
      nameTelugu: d.nameTelugu,
      mandals: d.mandalNames.map((mName) => ({
        name: mName,
        nameTelugu: toTeluguMandalName(mName),
      })),
    })),
  },
  {
    stateCode: 'AP',
    stateName: 'Andhra Pradesh',
    divisionType: 'Mandal',
    districts: ANDHRA_PRADESH_26_DISTRICTS_DIRECTORY.map((d) => ({
      name: d.name,
      nameTelugu: d.nameTelugu,
      mandals: d.mandalNames.map((mName) => ({
        name: mName,
        nameTelugu: toTeluguMandalName(mName),
      })),
    })),
  },
  {
    stateCode: 'KA',
    stateName: 'Karnataka',
    divisionType: 'Taluk',
    districts: [
      {
        name: 'Bengaluru Urban',
        nameTelugu: 'బెంగళూరు అర్బన్',
        mandals: [
          { name: 'Bengaluru North', nameTelugu: 'బెంగళూరు నార్త్' },
          { name: 'Bengaluru South', nameTelugu: 'బెంగళూరు సౌత్' },
          { name: 'Bengaluru East (KR Puram)', nameTelugu: 'బెంగళూరు ఈస్ట్' },
          { name: 'Yelahanka', nameTelugu: 'యలహంక' },
          { name: 'Anekal', nameTelugu: 'ఆనేకల్' },
        ],
      },
      {
        name: 'Mysuru',
        nameTelugu: 'మైసూరు',
        mandals: [
          { name: 'Mysuru Taluk', nameTelugu: 'మైసూరు తాలూకా' },
          { name: 'Nanjangud', nameTelugu: 'నంజనగూడు' },
          { name: 'Hunsur', nameTelugu: 'హున్సూరు' },
        ],
      },
      {
        name: 'Ballari',
        nameTelugu: 'బళ్లారి',
        mandals: [
          { name: 'Ballari Taluk', nameTelugu: 'బళ్లారి తాలూకా' },
          { name: 'Sandur', nameTelugu: 'సండూరు' },
          { name: 'Siruguppa', nameTelugu: 'సిరుగుప్ప' },
        ],
      },
    ],
  },
  {
    stateCode: 'TN',
    stateName: 'Tamil Nadu',
    divisionType: 'Taluk',
    districts: [
      {
        name: 'Chennai',
        nameTelugu: 'చెన్నై',
        mandals: [
          { name: 'Egmore', nameTelugu: 'ఎగ్మోర్' },
          { name: 'Mylapore', nameTelugu: 'మైలాపూర్' },
          { name: 'Guindy', nameTelugu: 'గిండి' },
          { name: 'Velachery', nameTelugu: 'వేలచ్చేరి' },
        ],
      },
      {
        name: 'Coimbatore',
        nameTelugu: 'కోయంబత్తూరు',
        mandals: [
          { name: 'Coimbatore North', nameTelugu: 'కోయంబత్తూరు నార్త్' },
          { name: 'Coimbatore South', nameTelugu: 'కోయంబత్తూరు సౌత్' },
          { name: 'Pollachi', nameTelugu: 'పొల్లాచ్చి' },
        ],
      },
    ],
  },
  {
    stateCode: 'MH',
    stateName: 'Maharashtra',
    divisionType: 'Taluk',
    districts: [
      {
        name: 'Mumbai Suburban',
        nameTelugu: 'ముంబై సబర్బన్',
        mandals: [
          { name: 'Andheri', nameTelugu: 'అంధేరి' },
          { name: 'Bandra', nameTelugu: 'బాంద్రా' },
          { name: 'Borivali', nameTelugu: 'బోరివలి' },
          { name: 'Kurla', nameTelugu: 'కుర్లా' },
        ],
      },
      {
        name: 'Pune',
        nameTelugu: 'పుణె',
        mandals: [
          { name: 'Pune City', nameTelugu: 'పుణె సిటీ' },
          { name: 'Haveli', nameTelugu: 'హవేలీ' },
          { name: 'Baramati', nameTelugu: 'బారామతి' },
        ],
      },
      {
        name: 'Nanded',
        nameTelugu: 'నాందేడ్',
        mandals: [
          { name: 'Nanded', nameTelugu: 'నాందేడ్' },
          { name: 'Dharmabad', nameTelugu: 'ధర్మాబాద్' },
          { name: 'Deglur', nameTelugu: 'డెగ్లూర్' },
        ],
      },
    ],
  },
  {
    stateCode: 'DL',
    stateName: 'Delhi (NCT)',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'New Delhi',
        nameTelugu: 'న్యూఢిల్లీ',
        mandals: [
          { name: 'Parliament Street (Connaught Place)', nameTelugu: 'పార్లమెంట్ స్ట్రీట్' },
          { name: 'Chanakyapuri', nameTelugu: 'చాణక్యపురి' },
          { name: 'Vasant Vihar', nameTelugu: 'వసంత్ విహార్' },
        ],
      },
      {
        name: 'Central Delhi',
        nameTelugu: 'సెంట్రల్ ఢిల్లీ',
        mandals: [
          { name: 'Civil Lines', nameTelugu: 'సివిల్ లైన్స్' },
          { name: 'Karol Bagh', nameTelugu: 'కరోల్ బాగ్' },
          { name: 'Kotwali', nameTelugu: 'కొత్వాలి' },
        ],
      },
    ],
  },
  {
    stateCode: 'KL',
    stateName: 'Kerala',
    divisionType: 'Taluk',
    districts: [
      {
        name: 'Thiruvananthapuram',
        nameTelugu: 'తిరువనంతపురం',
        mandals: [
          { name: 'Thiruvananthapuram Taluk', nameTelugu: 'తిరువనంతపురం తాలూకా' },
          { name: 'Neyyattinkara', nameTelugu: 'నెయ్యట్టింకర' },
        ],
      },
      {
        name: 'Ernakulam (Kochi)',
        nameTelugu: 'ఎర్నాకుళం (కొచ్చి)',
        mandals: [
          { name: 'Kanayannur', nameTelugu: 'కనయన్నూర్' },
          { name: 'Kochi', nameTelugu: 'కొచ్చి' },
          { name: 'Aluva', nameTelugu: 'అలువా' },
        ],
      },
    ],
  },
  {
    stateCode: 'OD',
    stateName: 'Odisha',
    divisionType: 'Block',
    districts: [
      {
        name: 'Khordha (Bhubaneswar)',
        nameTelugu: 'ఖోర్ధా (భువనేశ్వర్)',
        mandals: [
          { name: 'Bhubaneswar Block', nameTelugu: 'భువనేశ్వర్ బ్లాక్' },
          { name: 'Jatni', nameTelugu: 'జట్ని' },
        ],
      },
      {
        name: 'Ganjam (Berhampur)',
        nameTelugu: 'గంజాం (బరంపురం)',
        mandals: [
          { name: 'Berhampur (Brahmapur)', nameTelugu: 'బరంపురం' },
          { name: 'Chhatrapur', nameTelugu: 'ఛత్రపూర్' },
        ],
      },
    ],
  },
  {
    stateCode: 'GJ',
    stateName: 'Gujarat',
    divisionType: 'Taluk',
    districts: [
      {
        name: 'Ahmedabad',
        nameTelugu: 'అహ్మదాబాద్',
        mandals: [
          { name: 'Ahmedabad City', nameTelugu: 'అహ్మదాబాద్ సిటీ' },
          { name: 'Sanand', nameTelugu: 'సనంద్' },
        ],
      },
      {
        name: 'Surat',
        nameTelugu: 'సూరత్',
        mandals: [
          { name: 'Surat City', nameTelugu: 'సూరత్ సిటీ' },
          { name: 'Chorasi', nameTelugu: 'చోరాసి' },
        ],
      },
    ],
  },
  {
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Lucknow',
        nameTelugu: 'లక్నో',
        mandals: [
          { name: 'Lucknow Sadar', nameTelugu: 'లక్నో సదర్' },
          { name: 'Sarojini Nagar', nameTelugu: 'సరోజినీ నగర్' },
        ],
      },
      {
        name: 'Varanasi',
        nameTelugu: 'వారణాసి (కాశీ)',
        mandals: [
          { name: 'Varanasi Sadar', nameTelugu: 'వారణాసి సదర్' },
          { name: 'Pindra', nameTelugu: 'పిండ్రా' },
        ],
      },
    ],
  },
  {
    stateCode: 'MP',
    stateName: 'Madhya Pradesh',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Bhopal',
        nameTelugu: 'భోపాల్',
        mandals: [
          { name: 'Huzur (Bhopal)', nameTelugu: 'హుజూర్ (భోపాల్)' },
          { name: 'Kolar', nameTelugu: 'కోలార్' },
        ],
      },
      {
        name: 'Indore',
        nameTelugu: 'ఇండోర్',
        mandals: [
          { name: 'Indore Urban', nameTelugu: 'ఇండోర్ అర్బన్' },
          { name: 'Mhow', nameTelugu: 'మౌ' },
        ],
      },
    ],
  },
  {
    stateCode: 'RJ',
    stateName: 'Rajasthan',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Jaipur',
        nameTelugu: 'జైపూర్',
        mandals: [
          { name: 'Jaipur Tehsil', nameTelugu: 'జైపూర్ తహసీల్' },
          { name: 'Sanganer', nameTelugu: 'సంగానేర్' },
        ],
      },
    ],
  },
  {
    stateCode: 'WB',
    stateName: 'West Bengal',
    divisionType: 'Block',
    districts: [
      {
        name: 'Kolkata',
        nameTelugu: 'కోల్‌కతా',
        mandals: [
          { name: 'Ballygunge', nameTelugu: 'బల్లీగంజ్' },
          { name: 'Alipore', nameTelugu: 'అలీపూర్' },
          { name: 'Kharagpur (Paschim Medinipur)', nameTelugu: 'ఖరగ్‌పూర్' },
        ],
      },
    ],
  },
  {
    stateCode: 'BR',
    stateName: 'Bihar',
    divisionType: 'Block',
    districts: [
      {
        name: 'Patna',
        nameTelugu: 'పాట్నా',
        mandals: [
          { name: 'Patna Sadar', nameTelugu: 'పాట్నా సదర్' },
          { name: 'Danapur', nameTelugu: 'దానాపూర్' },
        ],
      },
    ],
  },
  {
    stateCode: 'PB',
    stateName: 'Punjab',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Amritsar',
        nameTelugu: 'అమృత్‌సర్',
        mandals: [
          { name: 'Amritsar-I', nameTelugu: 'అమృత్‌సర్-I' },
          { name: 'Ajnala', nameTelugu: 'అజ్నాలా' },
        ],
      },
    ],
  },
  {
    stateCode: 'HR',
    stateName: 'Haryana',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Gurugram',
        nameTelugu: 'గురుగ్రామ్',
        mandals: [
          { name: 'Gurugram Tehsil', nameTelugu: 'గురుగ్రామ్ తహసీల్' },
          { name: 'Manesar', nameTelugu: 'మనేసర్' },
        ],
      },
    ],
  },
  {
    stateCode: 'CT',
    stateName: 'Chhattisgarh',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Raipur',
        nameTelugu: 'రాయ్‌పూర్',
        mandals: [
          { name: 'Raipur Tehsil', nameTelugu: 'రాయ్‌పూర్ తహసీల్' },
          { name: 'Nava Raipur', nameTelugu: 'నవ రాయ్‌పూర్' },
        ],
      },
    ],
  },
  {
    stateCode: 'JH',
    stateName: 'Jharkhand',
    divisionType: 'Block',
    districts: [
      {
        name: 'Ranchi',
        nameTelugu: 'రాంచీ',
        mandals: [
          { name: 'Ranchi Sadar', nameTelugu: 'రాంచీ సదర్' },
          { name: 'Kanke', nameTelugu: 'కాంకే' },
        ],
      },
    ],
  },
  {
    stateCode: 'AS',
    stateName: 'Assam',
    divisionType: 'Block',
    districts: [
      {
        name: 'Kamrup Metropolitan (Guwahati)',
        nameTelugu: 'కామరూప్ మెట్రోపాలిటన్ (గువాహటి)',
        mandals: [
          { name: 'Guwahati', nameTelugu: 'గువాహటి' },
          { name: 'Dispur', nameTelugu: 'దిస్పూర్' },
        ],
      },
    ],
  },
  {
    stateCode: 'UK',
    stateName: 'Uttarakhand',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Dehradun',
        nameTelugu: 'డెహ్రాడూన్',
        mandals: [
          { name: 'Dehradun Sadar', nameTelugu: 'డెహ్రాడూన్ సదర్' },
          { name: 'Rishikesh', nameTelugu: 'రిషికేశ్' },
        ],
      },
    ],
  },
  {
    stateCode: 'HP',
    stateName: 'Himachal Pradesh',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Shimla',
        nameTelugu: 'సిమ్లా',
        mandals: [
          { name: 'Shimla Urban', nameTelugu: 'సిమ్లా అర్బన్' },
          { name: 'Shimla Rural', nameTelugu: 'సిమ్లా రూరల్' },
        ],
      },
    ],
  },
  {
    stateCode: 'GA',
    stateName: 'Goa',
    divisionType: 'Taluk',
    districts: [
      {
        name: 'North Goa',
        nameTelugu: 'ఉత్తర గోవా',
        mandals: [
          { name: 'Tiswadi (Panaji)', nameTelugu: 'తిస్వాడి (పనాజీ)' },
          { name: 'Bardez (Mapusa)', nameTelugu: 'బార్డెజ్' },
        ],
      },
    ],
  },
  {
    stateCode: 'TR',
    stateName: 'Tripura',
    divisionType: 'Block',
    districts: [
      {
        name: 'West Tripura (Agartala)',
        nameTelugu: 'పశ్చిమ త్రిపుర (అగర్తలా)',
        mandals: [{ name: 'Agartala', nameTelugu: 'అగర్తలా' }],
      },
    ],
  },
  {
    stateCode: 'ML',
    stateName: 'Meghalaya',
    divisionType: 'Block',
    districts: [
      {
        name: 'East Khasi Hills (Shillong)',
        nameTelugu: 'తూర్పు ఖాసీ హిల్స్ (షిల్లాంగ్)',
        mandals: [{ name: 'Mylliem (Shillong)', nameTelugu: 'షిల్లాంగ్' }],
      },
    ],
  },
  {
    stateCode: 'MN',
    stateName: 'Manipur',
    divisionType: 'Sub-Division',
    districts: [
      {
        name: 'Imphal West',
        nameTelugu: 'ఇంఫాల్ వెస్ట్',
        mandals: [{ name: 'Lamphelpat (Imphal)', nameTelugu: 'ఇంఫాల్' }],
      },
    ],
  },
  {
    stateCode: 'NL',
    stateName: 'Nagaland',
    divisionType: 'Block',
    districts: [
      {
        name: 'Kohima',
        nameTelugu: 'కోహిమా',
        mandals: [{ name: 'Kohima Sadar', nameTelugu: 'కోహిమా సదర్' }],
      },
    ],
  },
  {
    stateCode: 'AR',
    stateName: 'Arunachal Pradesh',
    divisionType: 'Block',
    districts: [
      {
        name: 'Papum Pare (Itanagar)',
        nameTelugu: 'పాపుమ్ పరే (ఇటానగర్)',
        mandals: [{ name: 'Itanagar', nameTelugu: 'ఇటానగర్' }],
      },
    ],
  },
  {
    stateCode: 'MZ',
    stateName: 'Mizoram',
    divisionType: 'Block',
    districts: [
      {
        name: 'Aizawl',
        nameTelugu: 'ఐజ్వాల్',
        mandals: [{ name: 'Tlangnuam (Aizawl)', nameTelugu: 'ఐజ్వాల్' }],
      },
    ],
  },
  {
    stateCode: 'SK',
    stateName: 'Sikkim',
    divisionType: 'Sub-Division',
    districts: [
      {
        name: 'Gangtok',
        nameTelugu: 'గ్యాంగ్‌టక్',
        mandals: [{ name: 'Gangtok Sub-Division', nameTelugu: 'గ్యాంగ్‌టక్' }],
      },
    ],
  },
  {
    stateCode: 'PY',
    stateName: 'Puducherry',
    divisionType: 'Taluk',
    districts: [
      {
        name: 'Yanam',
        nameTelugu: 'యానాం',
        mandals: [{ name: 'Yanam Taluk', nameTelugu: 'యానాం తాలూకా' }],
      },
      {
        name: 'Puducherry',
        nameTelugu: 'పుదుచ్చేరి',
        mandals: [{ name: 'Puducherry Taluk', nameTelugu: 'పుదుచ్చేరి తాలూకా' }],
      },
    ],
  },
  {
    stateCode: 'JK',
    stateName: 'Jammu and Kashmir',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Srinagar',
        nameTelugu: 'శ్రీనగర్',
        mandals: [{ name: 'Srinagar Central', nameTelugu: 'శ్రీనగర్ సెంట్రల్' }],
      },
      {
        name: 'Jammu',
        nameTelugu: 'జమ్మూ',
        mandals: [{ name: 'Jammu Khas', nameTelugu: 'జమ్మూ ఖాస్' }],
      },
    ],
  },
  {
    stateCode: 'LA',
    stateName: 'Ladakh',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Leh',
        nameTelugu: 'లేహ్',
        mandals: [{ name: 'Leh Tehsil', nameTelugu: 'లేహ్ తహసీల్' }],
      },
    ],
  },
  {
    stateCode: 'CH',
    stateName: 'Chandigarh',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'Chandigarh',
        nameTelugu: 'చండీగఢ్',
        mandals: [{ name: 'Chandigarh Tehsil', nameTelugu: 'చండీగఢ్ తహసీల్' }],
      },
    ],
  },
  {
    stateCode: 'AN',
    stateName: 'Andaman and Nicobar Islands',
    divisionType: 'Tehsil',
    districts: [
      {
        name: 'South Andaman (Port Blair)',
        nameTelugu: 'సౌత్ అండమాన్ (పోర్ట్ బ్లెయిర్)',
        mandals: [{ name: 'Port Blair (Sri Vijaya Puram)', nameTelugu: 'శ్రీ విజయపురం' }],
      },
    ],
  },
  {
    stateCode: 'DN',
    stateName: 'Dadra and Nagar Haveli and Daman and Diu',
    divisionType: 'Taluk',
    districts: [
      {
        name: 'Daman',
        nameTelugu: 'డామన్',
        mandals: [{ name: 'Daman Taluk', nameTelugu: 'డామన్ తాలూకా' }],
      },
    ],
  },
  {
    stateCode: 'LD',
    stateName: 'Lakshadweep',
    divisionType: 'Sub-Division',
    districts: [
      {
        name: 'Lakshadweep (Kavaratti)',
        nameTelugu: 'లక్షద్వీప్ (కవరత్తి)',
        mandals: [{ name: 'Kavaratti', nameTelugu: 'కవరత్తి' }],
      },
    ],
  },
];

function slugifyId(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const INITIAL_INDIA_DISTRICTS: DistrictEntry[] = RAW_HIERARCHY.flatMap((st) =>
  st.districts.map((dist) => ({
    id: `dist-${st.stateCode.toLowerCase()}-${slugifyId(dist.name)}`,
    stateCode: st.stateCode,
    stateName: st.stateName,
    name: dist.name,
    nameTelugu: dist.nameTelugu,
    active: true,
  }))
);

export const INITIAL_INDIA_MANDALS: MandalEntry[] = RAW_HIERARCHY.flatMap((st) =>
  st.districts.flatMap((dist) =>
    dist.mandals.map((mandal) => ({
      id: `mandal-${st.stateCode.toLowerCase()}-${slugifyId(dist.name)}-${slugifyId(mandal.name)}`,
      stateCode: st.stateCode,
      districtName: dist.name,
      name: mandal.name,
      nameTelugu: mandal.nameTelugu,
      divisionType: st.divisionType,
      active: true,
    }))
  )
);

export function getDistrictsForState(
  districts: DistrictEntry[],
  stateNameOrCode: string,
  includeInactive = false
): DistrictEntry[] {
  if (!stateNameOrCode) return [];
  return districts.filter(
    (d) =>
      (includeInactive || d.active) &&
      (d.stateName === stateNameOrCode || d.stateCode === stateNameOrCode)
  );
}

const DISTRICT_ALIASES: Record<string, string> = {
  'NTR (Vijayawada)': 'NTR District',
  'SPSR Nellore': 'Sri Potti Sriramulu Nellore',
  'Anantapur': 'Anantapuramu',
  'East Godavari (Rajahmundry)': 'East Godavari',
};

export function normalizeDistrictName(districtName: string): string {
  return DISTRICT_ALIASES[districtName] || districtName;
}

export function getMandalsForDistrict(
  mandals: MandalEntry[],
  districtName: string,
  includeInactive = false
): MandalEntry[] {
  if (!districtName) return [];
  const canonical = normalizeDistrictName(districtName);
  return mandals.filter(
    (m) =>
      (includeInactive || m.active) &&
      (m.districtName === districtName || m.districtName === canonical)
  );
}

