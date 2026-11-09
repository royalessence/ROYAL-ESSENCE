/**
 * Authentic Bangladesh Administrative Divisions, Districts, and Upazilas/Thanas
 * Covering all 8 Divisions with real official administrative districts and thanas.
 */

export interface BangladeshLocationData {
  divisions: {
    [divisionName: string]: {
      districts: {
        [districtName: string]: {
          upazilas: string[];
          defaultPostalCode?: string;
        };
      };
    };
  };
}

export const BANGLADESH_LOCATIONS: BangladeshLocationData = {
  divisions: {
    Dhaka: {
      districts: {
        Dhaka: {
          upazilas: [
            'Dhanmondi',
            'Gulshan',
            'Banani',
            'Uttara',
            'Mirpur',
            'Mohammadpur',
            'Motijheel',
            'Badda',
            'Tejgaon',
            'Khilgaon',
            'Rampura',
            'Paltan',
            'Savar',
            'Keraniganj',
            'Dhamrai',
          ],
          defaultPostalCode: '1205',
        },
        Gazipur: {
          upazilas: ['Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj', 'Tongi'],
          defaultPostalCode: '1700',
        },
        Narayanganj: {
          upazilas: ['Narayanganj Sadar', 'Bandar', 'Rupganj', 'Araihazar', 'Sonargaon'],
          defaultPostalCode: '1400',
        },
        Tangail: {
          upazilas: ['Tangail Sadar', 'Mirzapur', 'Ghatail', 'Madhupur', 'Kalihati', 'Sakhipur', 'Basail'],
          defaultPostalCode: '1900',
        },
        Narsingdi: {
          upazilas: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Raipura', 'Monohardi', 'Belabo'],
          defaultPostalCode: '1600',
        },
        Faridpur: {
          upazilas: ['Faridpur Sadar', 'Boalmari', 'Bhanga', 'Madhukhali', 'Nagarkanda', 'Sadarpur'],
          defaultPostalCode: '7800',
        },
        Manikganj: {
          upazilas: ['Manikganj Sadar', 'Singair', 'Saturia', 'Shibalaya', 'Ghior', 'Harirampur'],
          defaultPostalCode: '1800',
        },
        Munshiganj: {
          upazilas: ['Munshiganj Sadar', 'Sreenagar', 'Sirajdikhan', 'Lohajang', 'Tongibari', 'Gazaria'],
          defaultPostalCode: '1500',
        },
        Gopalganj: {
          upazilas: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'],
          defaultPostalCode: '8100',
        },
        Madaripur: {
          upazilas: ['Madaripur Sadar', 'Shibchar', 'Kalkini', 'Rajoir'],
          defaultPostalCode: '7900',
        },
        Rajbari: {
          upazilas: ['Rajbari Sadar', 'Goalanda', 'Pangsha', 'Baliakandi', 'Kalukhali'],
          defaultPostalCode: '7700',
        },
        Shariatpur: {
          upazilas: ['Shariatpur Sadar', 'Naria', 'Damudya', 'Bhedarganj', 'Gosairhat', 'Zajira'],
          defaultPostalCode: '8000',
        },
        Kishoreganj: {
          upazilas: ['Kishoreganj Sadar', 'Bhairab', 'Bajitpur', 'Katiadi', 'Pakundia', 'Karimganj'],
          defaultPostalCode: '2300',
        },
      },
    },
    Chattogram: {
      districts: {
        Chattogram: {
          upazilas: [
            'Agrabad',
            'Panchlaish',
            'Kotwali',
            'Halishahar',
            'Khulshi',
            'Double Mooring',
            'Hathazari',
            'Sitakunda',
            'Mirsharai',
            'Patiya',
            'Raozan',
            'Anwara',
            'Boalkhali',
          ],
          defaultPostalCode: '4000',
        },
        "Cox's Bazar": {
          upazilas: ["Cox's Bazar Sadar", 'Ramu', 'Chakaria', 'Teknaf', 'Ukhia', 'Pekua', 'Kutubdia', 'Maheshkhali'],
          defaultPostalCode: '4700',
        },
        Cumilla: {
          upazilas: ['Cumilla Adarsha Sadar', 'Laksam', 'Debidwar', 'Chandina', 'Burichang', 'Muradnagar', 'Daudkandi', 'Barura'],
          defaultPostalCode: '3500',
        },
        Feni: {
          upazilas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Fulgazi', 'Sonagazi'],
          defaultPostalCode: '3900',
        },
        Noakhali: {
          upazilas: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companyganj', 'Senbagh', 'Hatiya'],
          defaultPostalCode: '3800',
        },
        Brahmanbaria: {
          upazilas: ['Brahmanbaria Sadar', 'Kasba', 'Nabinagar', 'Ashuganj', 'Sarail', 'Akhaura', 'Bancharampur'],
          defaultPostalCode: '3400',
        },
        Chandpur: {
          upazilas: ['Chandpur Sadar', 'Faridganj', 'Hajiganj', 'Matlab North', 'Matlab South', 'Shahrasti'],
          defaultPostalCode: '3600',
        },
        Lakshmipur: {
          upazilas: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'],
          defaultPostalCode: '3700',
        },
        Rangamati: {
          upazilas: ['Rangamati Sadar', 'Kaptai', 'Baghaichhari', 'Barkal', 'Langadu', 'Rajasthali'],
          defaultPostalCode: '4500',
        },
        Bandarban: {
          upazilas: ['Bandarban Sadar', 'Ruma', 'Thanchi', 'Lama', 'Alikadam', 'Rowangchhari'],
          defaultPostalCode: '4600',
        },
        Khagrachhari: {
          upazilas: ['Khagrachhari Sadar', 'Dighinala', 'Panchhari', 'Mahalchhari', 'Matiranga', 'Ramgarh'],
          defaultPostalCode: '4400',
        },
      },
    },
    Sylhet: {
      districts: {
        Sylhet: {
          upazilas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Zakiganj', 'Kanaighat', 'Fenchuganj', 'Osmani Nagar', 'Biswanath'],
          defaultPostalCode: '3100',
        },
        Moulvibazar: {
          upazilas: ['Moulvibazar Sadar', 'Sreemangal', 'Kulaura', 'Barlekha', 'Kamalganj', 'Rajnagar', 'Juri'],
          defaultPostalCode: '3200',
        },
        Habiganj: {
          upazilas: ['Habiganj Sadar', 'Madhabpur', 'Nabiganj', 'Bahubal', 'Chunarughat', 'Baniachong', 'Lakhai'],
          defaultPostalCode: '3300',
        },
        Sunamganj: {
          upazilas: ['Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Derai', 'Tahirpur', 'Dharmapasha', 'Doarabazar'],
          defaultPostalCode: '3000',
        },
      },
    },
    Rajshahi: {
      districts: {
        Rajshahi: {
          upazilas: ['Boalia', 'Motihar', 'Rajpara', 'Paba', 'Godagari', 'Tanore', 'Bagmara', 'Durgapur', 'Puthia', 'Charghat'],
          defaultPostalCode: '6000',
        },
        Bogura: {
          upazilas: ['Bogura Sadar', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Gabtali', 'Dhunat', 'Kahaloo', 'Sariakandi'],
          defaultPostalCode: '5800',
        },
        Pabna: {
          upazilas: ['Pabna Sadar', 'Ishwardi', 'Sujanagar', 'Santhia', 'Chatmohar', 'Bera', 'Atgharia', 'Faridpur'],
          defaultPostalCode: '6600',
        },
        Sirajganj: {
          upazilas: ['Sirajganj Sadar', 'Shahjadpur', 'Ullapara', 'Belkuchi', 'Kazipur', 'Tarash', 'Raiganj', 'Kamarkhanda'],
          defaultPostalCode: '6700',
        },
        Naogaon: {
          upazilas: ['Naogaon Sadar', 'Patnitala', 'Dhamoirhat', 'Manda', 'Badalgachhi', 'Raninagar', 'Niamatpur'],
          defaultPostalCode: '6500',
        },
        Natore: {
          upazilas: ['Natore Sadar', 'Singra', 'Baraigram', 'Bagatipara', 'Lalpur', 'Gurudaspur', 'Naldanga'],
          defaultPostalCode: '6400',
        },
        Chapai_Nawabganj: {
          upazilas: ['Chapai Nawabganj Sadar', 'Shibganj', 'Gomastapur', 'Nachole', 'Bholahat'],
          defaultPostalCode: '6300',
        },
        Joypurhat: {
          upazilas: ['Joypurhat Sadar', 'Panchbibi', 'Kalai', 'Khetlal', 'Akkelpur'],
          defaultPostalCode: '5900',
        },
      },
    },
    Khulna: {
      districts: {
        Khulna: {
          upazilas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Dighalia', 'Dumuria', 'Rupsha', 'Phultala', 'Paikgachha'],
          defaultPostalCode: '9000',
        },
        Jashore: {
          upazilas: ['Jashore Sadar', 'Jhikargachha', 'Chaugachha', 'Sharsha', 'Manirampur', 'Abhaynagar', 'Keshabpur', 'Bagherpara'],
          defaultPostalCode: '7400',
        },
        Kushtia: {
          upazilas: ['Kushtia Sadar', 'Kumarkhali', 'Bheramara', 'Mirpur', 'Daulatpur', 'Khoksa'],
          defaultPostalCode: '7000',
        },
        Satkhira: {
          upazilas: ['Satkhira Sadar', 'Kalaroa', 'Tala', 'Debhata', 'Kaliganj', 'Assasuni', 'Shyamnagar'],
          defaultPostalCode: '9400',
        },
        Bagerhat: {
          upazilas: ['Bagerhat Sadar', 'Mongla', 'Fakirhat', 'Rampal', 'Kachua', 'Morrelganj', 'Sarankhola', 'Chitalmari'],
          defaultPostalCode: '9300',
        },
        Jhenaidah: {
          upazilas: ['Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa', 'Harinakunda'],
          defaultPostalCode: '7300',
        },
        Chuadanga: {
          upazilas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'],
          defaultPostalCode: '7200',
        },
        Magura: {
          upazilas: ['Magura Sadar', 'Sreepur', 'Mohammadpur', 'Shalikha'],
          defaultPostalCode: '7600',
        },
        Meherpur: {
          upazilas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar'],
          defaultPostalCode: '7100',
        },
        Narail: {
          upazilas: ['Narail Sadar', 'Lohagara', 'Kalia'],
          defaultPostalCode: '7500',
        },
      },
    },
    Barishal: {
      districts: {
        Barishal: {
          upazilas: ['Barishal Sadar', 'Babuganj', 'Wazirpur', 'Banaripara', 'Gournadi', 'Agailjhara', 'Mehendiganj', 'Bakerganj', 'Muladi'],
          defaultPostalCode: '8200',
        },
        Patuakhali: {
          upazilas: ['Patuakhali Sadar', 'Galachipa', 'Bauphal', 'Kalapara', 'Mirzaganj', 'Dumki', 'Rangabali'],
          defaultPostalCode: '8600',
        },
        Bhola: {
          upazilas: ['Bhola Sadar', 'Borhanuddin', 'Lalmohan', 'Char Fasson', 'Daulatkhan', 'Tazumuddin', 'Monpura'],
          defaultPostalCode: '8300',
        },
        Pirojpur: {
          upazilas: ['Pirojpur Sadar', 'Nesarabad (Swarupkati)', 'Mathbaria', 'Bhandaria', 'Nazirpur', 'Kawkhali', 'Zianagar'],
          defaultPostalCode: '8500',
        },
        Barguna: {
          upazilas: ['Barguna Sadar', 'Amtali', 'Patharghata', 'Betagi', 'Bamna', 'Taltali'],
          defaultPostalCode: '8700',
        },
        Jhalokathi: {
          upazilas: ['Jhalokathi Sadar', 'Nalchity', 'Rajapur', 'Kathalia'],
          defaultPostalCode: '8400',
        },
      },
    },
    Rangpur: {
      districts: {
        Rangpur: {
          upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
          defaultPostalCode: '5400',
        },
        Dinajpur: {
          upazilas: ['Dinajpur Sadar', 'Birganj', 'Biral', 'Birampur', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur'],
          defaultPostalCode: '5200',
        },
        Gaibandha: {
          upazilas: ['Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj', 'Phulchhari'],
          defaultPostalCode: '5700',
        },
        Kurigram: {
          upazilas: ['Kurigram Sadar', 'Nageshwari', 'Bhurungamari', 'Phulbari', 'Rajarhat', 'Ulipur', 'Chilmari', 'Roumari', 'Rajibpur'],
          defaultPostalCode: '5600',
        },
        Nilphamari: {
          upazilas: ['Nilphamari Sadar', 'Saidpur', 'Domar', 'Dimla', 'Jaldhaka', 'Kishoreganj'],
          defaultPostalCode: '5300',
        },
        Lalmonirhat: {
          upazilas: ['Lalmonirhat Sadar', 'Aditmari', 'Kaliganj', 'Hatibandha', 'Patgram'],
          defaultPostalCode: '5500',
        },
        Panchagarh: {
          upazilas: ['Panchagarh Sadar', 'Boda', 'Debiganj', 'Atwari', 'Tetulia'],
          defaultPostalCode: '5000',
        },
        Thakurgaon: {
          upazilas: ['Thakurgaon Sadar', 'Pirganj', 'Ranisankail', 'Baliadangi', 'Haripur'],
          defaultPostalCode: '5100',
        },
      },
    },
    Mymensingh: {
      districts: {
        Mymensingh: {
          upazilas: ['Mymensingh Sadar', 'Muktagachha', 'Fulbaria', 'Trishal', 'Bhaluka', 'Gafargaon', 'Nandail', 'Ishwarganj', 'Gouripur', 'Haluaghat', 'Dhobaura', 'Phulpur', 'Tara Khanda'],
          defaultPostalCode: '2200',
        },
        Jamalpur: {
          upazilas: ['Jamalpur Sadar', 'Sarishabari', 'Melandaha', 'Islampur', 'Dewanganj', 'Madarganj', 'Baksiganj'],
          defaultPostalCode: '2000',
        },
        Netrokona: {
          upazilas: ['Netrokona Sadar', 'Kendua', 'Atpara', 'Barhatta', 'Durgapur', 'Kalmakanda', 'Madan', 'Mohanganj', 'Purbadhala', 'Khaliajuri'],
          defaultPostalCode: '2400',
        },
        Sherpur: {
          upazilas: ['Sherpur Sadar', 'Nalitabari', 'Nakla', 'Sreebardi', 'Jhenaigati'],
          defaultPostalCode: '2100',
        },
      },
    },
  },
};
