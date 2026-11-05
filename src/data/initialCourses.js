export const initialCourses = [
  {
    id: "kursus-sabar",
    title: "Tadabbur Tematik: Manajemen Hati & Sabar",
    category: "Tadabbur",
    level: "Pemula",
    badge: "Populer",
    duration: "6 Pelajaran • 2 Kuis",
    instructor: "Ustadz Hanif Al-Fatih, Lc.",
    description: "Panduan komprehensif menata ketahanan mental dan ketenangan batin berlandaskan ayat-ayat kesabaran dalam Al-Qur'an.",
    thumbnailBg: "from-emerald-900/60 to-teal-950/80",
    modules: [
      {
        id: "modul-1",
        title: "Bab 1: Fondasi Sabar & Shalat",
        lessons: [
          {
            id: "les-1-1",
            title: "Hakikat Sabar sebagai Penolong Nyata",
            surah: "QS. Al-Baqarah: Ayat 45",
            arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
            translation: "Dan mohonlah pertolongan (kepada Allah) dengan sabar dan shalat. Dan (shalat) itu sungguh berat, kecuali bagi orang-orang yang khusyuk.",
            content: "Sabar bukan sekadar pasrah tanpa usaha, melainkan kemampuan menahan diri dari kepanikan dan menempatkan respon sesuai tuntunan wahyu. Ketika digabungkan dengan shalat, jiwa kita mendapatkan energi ilahiyah untuk menyelesaikan ujian terberat sekalipun.",
            actionToday: "Lakukan jeda hening selama 3 menit setelah salam shalat fardhu berikutnya, tumpahkan beban dalam sujud terakhir.",
            mediaType: "video",
            mediaUrl: "https://www.youtube.com/watch?v=zu6mOmxih8Y",
            audioUrl: null,
            attachments: [
              {
                name: "Rangkuman_Tadabbur_Sabar_Bab1.pdf",
                size: "1.4 MB",
                type: "PDF Document",
                url: "/docs/Rangkuman_Tadabbur_Sabar_Bab1.pdf"
              },
              {
                name: "Lembar_Mutabaah_Dzikir_Harian.docx",
                size: "450 KB",
                type: "Word Document",
                url: "https://docs.google.com/document/d/1X5X-sample-drive/edit"
              }
            ]
          },
          {
            id: "les-1-2",
            title: "Pahala Tanpa Batas Bagi Yang Bersabar",
            surah: "QS. Az-Zumar: Ayat 10",
            arabic: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ",
            translation: "Sesungguhnya hanya orang-orang yang bersabarlah yang disempurnakan pahalanya tanpa batas.",
            content: "Setiap amal ibadah umumnya memiliki takaran pahala kelipatan 10 hingga 700 kali lipat, namun pahala kesabaran diganjar tanpa hisab (tanpa batas timbangan). Ini menunjukkan betapa mulia dan tingginya derajat orang yang mampu menahan amarah dan konsisten dalam ketaatan.",
            actionToday: "Saat ada hal yang memicu kekesalan hari ini, tahan lisan minimal 10 detik sebelum merespons.",
            audioUrl: null
          }
        ],
        quiz: {
          id: "quiz-1",
          title: "Evaluasi Pemahaman Bab 1: Fondasi Sabar",
          minScore: 70,
          questions: [
            {
              id: "q1",
              question: "Menurut QS. Al-Baqarah: 45, perkara shalat itu terasa berat kecuali bagi siapa?",
              options: [
                "Orang yang kaya raya",
                "Orang-orang yang khusyuk",
                "Orang yang berpuasa",
                "Orang yang berilmu tinggi"
              ],
              correctAnswer: 1,
              explanation: "Ayat menyebutkan 'wa innaha lakabiratun illa 'alal-khasyi'in' (sungguh berat kecuali bagi orang-orang yang khusyuk)."
            },
            {
              id: "q2",
              question: "Bagaimanakah takaran pahala bagi orang yang bersabar menurut QS. Az-Zumar: 10?",
              options: [
                "10 kali lipat pahala",
                "700 kali lipat kebaikan",
                "Tanpa batas (bi ghairi hisab)",
                "Diberikan di akhirat saja"
              ],
              correctAnswer: 2,
              explanation: "Pahala orang bersabar disempurnakan tanpa hitungan/timbangan pembatas."
            }
          ]
        }
      },
      {
        id: "modul-2",
        title: "Bab 2: Ketenangan Jiwa & Menghadapi Tekanan",
        lessons: [
          {
            id: "les-2-1",
            title: "Ketenangan Hakiki Hanya dengan Mengingat Allah",
            surah: "QS. Ar-Ra'd: Ayat 28",
            arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
            translation: "(Yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
            content: "Kegalauan modern seringkali berakar dari overthinking pada hal-hal di luar kendali kita. Dzikir adalah proses rekalibrasi batin, mengembalikan kesadaran bahwa segala urusan berada di genggaman Sang Maha Kuasa.",
            actionToday: "Rutinkan dzikir 'La hawla wa la quwwata illa billah' 33x saat merasa overwhelmed.",
            audioUrl: null
          },
          {
            id: "les-2-2",
            title: "Pasti Ada Kemudahan Bersama Setiap Kesulitan",
            surah: "QS. Al-Insyirah: Ayat 5-6",
            arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
            translation: "Maka sesungguhnya beserta kesulitan ada kemudahan, sesungguhnya beserta kesulitan ada kemudahan.",
            content: "Kata 'Al-'Usr' menggunakan alif-lam (makrifah - kesulitan yang tunggal/terbatas), sedangkan 'Yusra' berbentuk nakirah (kemudahan yang tak terhitung dan berulang). Satu kesulitan tak akan pernah mengalahkan dua kemudahan yang Allah bentangkan bersamaan.",
            actionToday: "Tuliskan 3 kemudahan atau nikmat kecil yang kamu rasakan hari ini di tengah kesibukan.",
            audioUrl: null
          }
        ],
        quiz: {
          id: "quiz-2",
          title: "Evaluasi Pemahaman Bab 2: Ketenangan Jiwa",
          minScore: 70,
          questions: [
            {
              id: "q2_1",
              question: "Berdasarkan QS. Ar-Ra'd: 28, apa sarana utama agar hati manusia menjadi tenteram?",
              options: [
                "Menimbun banyak harta benda",
                "Mengingat Allah (Dzikrullah)",
                "Menghindari semua masalah hidup",
                "Berekreasi ke tempat sunyi"
              ],
              correctAnswer: 1,
              explanation: "Hati menjadi tenteram hanya dengan mengingat Allah (bi dzikrillah tatma'innul qulub)."
            },
            {
              id: "q2_2",
              question: "Pesan utama dari pengulangan ayat 'Inna ma'al-'usri yusra' adalah...",
              options: [
                "Kesulitan akan berlangsung selamanya",
                "Kemudahan selalu menyertai dan melampaui kesulitan",
                "Manusia harus berserah diri tanpa ikhtiar",
                "Ujian hidup hanya untuk orang tertentu"
              ],
              correctAnswer: 1,
              explanation: "Allah menegaskan bahwa bersama kesulitan pasti selalu ada kemudahan yang lebih luas."
            }
          ]
        }
      }
    ]
  },
  {
    id: "kursus-almulk",
    title: "Bedah Surah: Rahasia Keberkahan Surah Al-Mulk",
    category: "Tafsir",
    level: "Menengah",
    badge: "Spesial",
    duration: "4 Pelajaran • 1 Kuis",
    instructor: "Dr. Ahmad Zaki, M.Ag.",
    description: "Menyelami 30 ayat penyelamat siksa kubur, memahami tujuan penciptaan hidup dan mati, serta tadabbur kebesaran ciptaan semesta.",
    thumbnailBg: "from-amber-950/60 to-slate-900",
    modules: [
      {
        id: "modul-almulk-1",
        title: "Bab 1: Kekuasaan Allah & Ujian Kematian",
        lessons: [
          {
            id: "les-m-1",
            title: "Hakikat Kerajaan & Maha Berkah",
            surah: "QS. Al-Mulk: Ayat 1",
            arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
            translation: "Mahasuci Allah Yang di tangan-Nya-lah segala kerajaan, dan Dia Mahakuasa atas segala sesuatu.",
            content: "Ayat pembuka ini meletakkan pondasi tauhid rububiyah: pengakuan mutlak bahwa alam semesta dan takdir hidup manusia sepenuhnya berada dalam kendali tangan Allah yang Maha Pengasih.",
            actionToday: "Bacalah Surah Al-Mulk sebelum tidur malam ini secara konsisten.",
            audioUrl: null
          },
          {
            id: "les-m-2",
            title: "Penciptaan Hidup & Mati: Mencari Amal Terbaik",
            surah: "QS. Al-Mulk: Ayat 2",
            arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
            translation: "Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya.",
            content: "Allah mendahulukan kata 'mati' daripada 'hidup' sebagai pengingat bahwa masa hidup di dunia sangat singkat dan tujuan sejatinya adalah 'Ahsanu 'Amala' (amal yang paling ikhlas dan paling benar, bukan sekadar paling banyak kuantitasnya).",
            actionToday: "Periksa kembali niat setiap pekerjaan kita hari ini agar bernilai ibadah.",
            audioUrl: null
          }
        ],
        quiz: {
          id: "quiz-m-1",
          title: "Evaluasi Surah Al-Mulk",
          minScore: 70,
          questions: [
            {
              id: "qm1",
              question: "Mengapa Allah menciptakan hidup dan mati menurut QS. Al-Mulk ayat 2?",
              options: [
                "Untuk melihat siapa yang paling kaya",
                "Untuk menguji siapa yang paling baik amalnya",
                "Agar manusia saling bersaing jabatan",
                "Untuk memenuhi alam semesta"
              ],
              correctAnswer: 1,
              explanation: "Tujuannya adalah 'liyabluwakum ayyukum ahsanu 'amala' (menguji siapa yang paling baik amalnya)."
            }
          ]
        }
      }
    ]
  },
  {
    id: "kursus-tahsin",
    title: "Tahsin & Makharijul Huruf Dasar",
    category: "Tahsin",
    level: "Pemula",
    badge: "Fundamental",
    duration: "4 Pelajaran • 1 Kuis",
    instructor: "Ustadzah Fatimah Azzahra",
    description: "Pelajari cara melafalkan huruf hijaiyah dengan benar sesuai makhraj dan sifat huruf untuk memperindah bacaan shalat dan tilawah.",
    thumbnailBg: "from-blue-950/60 to-slate-900",
    modules: [
      {
        id: "modul-tahsin-1",
        title: "Bab 1: Pengenalan 5 Tempat Makhraj Utama",
        lessons: [
          {
            id: "les-t-1",
            title: "Al-Jauf (Rongga Mulut) & Huruf Mad",
            surah: "Pengantar Kaidah Tajwid",
            arabic: "الْجَوْفُ: أَلِفٌ، وَاوٌ، يَاءٌ (حُرُوفُ الْمَدِّ)",
            translation: "Makhraj Al-Jauf: keluarnya suara dari rongga mulut dan tenggorokan untuk huruf-huruf mad.",
            content: "Al-Jauf adalah rongga udara di tenggorokan dan mulut. Tempat ini merupakan makhraj huruf mad (Alif setelah fathah, Wawu sukun setelah dhammah, dan Ya sukun setelah kasrah). Suara dikeluarkan bebas mengalir tanpa tertahan pada bagian bibir atau lidah.",
            actionToday: "Latih panjang bacaan 2 harakat huruf mad saat membaca Al-Fatihah.",
            audioUrl: null
          }
        ],
        quiz: {
          id: "quiz-t-1",
          title: "Kuis Dasar Makhraj Huruf",
          minScore: 70,
          questions: [
            {
              id: "qt1",
              question: "Makhraj Al-Jauf adalah tempat keluarnya huruf apa?",
              options: [
                "Huruf halqiyah (tenggorokan)",
                "Huruf mad (panjang)",
                "Huruf bibir (syafatain)",
                "Huruf lidah (lisan)"
              ],
              correctAnswer: 1,
              explanation: "Al-Jauf adalah rongga udara tempat mengalirnya huruf mad (Alif, Wawu, Ya mad)."
            }
          ]
        }
      }
    ]
  },
  {
    id: "kursus-ruqyah-syariyyah",
    title: "Ruqyah Mandiri Syar'iyyah: Benteng Diri & Rumah Tangga",
    category: "Ruqyah Syar'iyyah",
    level: "Pemula",
    badge: "Bersanad",
    duration: "4 Pelajaran • 1 Kuis",
    instructor: "Ustadz Muhammad Arifin, S.Pd.I",
    description: "Panduan otentik bersanad ruqyah syar'iyyah: metode meruqyah mandiri berlandaskan Al-Qur'an dan Sunnah, dzikir pagi-petang, serta proteksi dari 'ain dan gangguan sihir.",
    thumbnailBg: "from-teal-950/80 to-slate-950",
    modules: [
      {
        id: "modul-ruqyah-1",
        title: "Bab 1: Hakikat & Kaidah Ruqyah Syar'iyyah",
        lessons: [
          {
            id: "les-rq-1",
            title: "Al-Qur'an sebagai Syifa' (Obat Penyembuh)",
            surah: "QS. Al-Isra: Ayat 82",
            arabic: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ ۙ وَلَا يَزِيدُ الظَّالِمِينَ إِلَّا خَسَارًا",
            translation: "Dan Kami turunkan dari Al-Qur'an (sesuatu) yang menjadi penawar dan rahmat bagi orang-orang yang beriman, sedangkan bagi orang-orang yang zalim (Al-Qur'an itu) hanya akan menambah kerugian.",
            content: "Ruqyah Syar'iyyah adalah pengobatan ilahiyah menggunakan kalamullah dan doa-doa ma'tsur dari Nabi ﷺ. Syarat mutlak ruqyah syar'iyyah: (1) Menggunakan kalamullah, asma' wa shifat-Nya, (2) Bahasa Arab atau bahasa yang dipahami maknanya, (3) Meyakini kesembuhan murni dari Allah, bukan dari peruqyah.",
            actionToday: "Bacakan Surah Al-Fatihah 7x pada segelas air putih dengan penuh keyakinan tauhid lalu minumkan kepada diri sendiri atau keluarga.",
            mediaType: "video",
            mediaUrl: "https://www.youtube.com/watch?v=voL_L9ZLLyA",
            audioUrl: null
          },
          {
            id: "les-rq-2",
            title: "Ayat Kursi: Benteng Utama Penjaga Jiwa",
            surah: "QS. Al-Baqarah: Ayat 255",
            arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
            translation: "Allah, tidak ada tuhan selain Dia. Yang Mahahidup, yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur...",
            content: "Dalam hadits sahih riwayat Al-Bukhari, siapa yang membaca Ayat Kursi sebelum tidur maka Allah akan mengutus malaikat penjaga dan setan tidak akan mampu mendekatinya hingga pagi hari.",
            actionToday: "Rutinkan membaca Ayat Kursi setiap selesai shalat fardhu dan sebelum tidur malam.",
            audioUrl: null
          }
        ],
        quiz: {
          id: "quiz-rq-1",
          title: "Evaluasi Kaidah Ruqyah Syar'iyyah",
          minScore: 70,
          questions: [
            {
              id: "qrq1",
              question: "Manakah yang BUKAN syarat ruqyah syar'iyyah menurut ijma' ulama?",
              options: [
                "Menggunakan jimat atau rajah bertuliskan huruf terputus",
                "Menggunakan ayat-ayat Al-Qur'an dan doa-doa ma'tsur",
                "Menggunakan bahasa Arab yang jelas maknanya",
                "Meyakini ruqyah hanyalah sebab dan kesembuhan mutlak dari Allah"
              ],
              correctAnswer: 0,
              explanation: "Penggunaan jimat atau rajah berhuruf aneh adalah indikasi kesyirikan dan dilarang dalam Islam."
            }
          ]
        }
      }
    ]
  },
  {
    id: "kursus-fiqih-muamalah",
    title: "Fiqih Muamalah: Kaidah Akad & Finansial Syariah",
    category: "Fiqih & Muamalah",
    level: "Menengah",
    badge: "Praktis",
    duration: "4 Pelajaran • 1 Kuis",
    instructor: "Dr. Muhammad Irfan, M.E.Sy.",
    description: "Memahami prinsip dasar perniagaan Islam, menghindari riba, gharar, dan maysir, serta implementasi akad syariah di era transaksi digital.",
    thumbnailBg: "from-amber-950/80 to-slate-950",
    modules: [
      {
        id: "modul-fiqih-1",
        title: "Bab 1: Kaidah Dasar Jual Beli & Larangan Riba",
        lessons: [
          {
            id: "les-fq-1",
            title: "Halalnya Jual Beli & Haramnya Riba",
            surah: "QS. Al-Baqarah: Ayat 275",
            arabic: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
            translation: "Padahal Allah telah menghalalkan jual beli dan mengharamkan riba.",
            content: "Kaidah ushul fiqh menyatakan: Hukum asal muamalah (perdagangan) adalah boleh dan mubah sampai ada dalil yang mengharamkannya. Tiga pilar utama yang membatalkan keabsahan akad transaksi adalah: Riba, Gharar (ketidakjelasan/penipuan), dan Maysir (spekulasi/judi).",
            actionToday: "Audit kembali transaksi belanja atau investasi harian Anda agar terbebas dari unsur bunga riba.",
            audioUrl: null
          }
        ],
        quiz: {
          id: "quiz-fq-1",
          title: "Evaluasi Dasar Fiqih Muamalah",
          minScore: 70,
          questions: [
            {
              id: "qfq1",
              question: "Apa kaidah fiqih asal dalam urusan muamalah (perniagaan)?",
              options: [
                "Semuanya haram sampai ada dalil yang membolehkan",
                "Semuanya boleh (mubah) sampai ada dalil yang mengharamkan",
                "Hanya boleh berdagang secara barter",
                "Wajib izin pemerintah dalam setiap transaksi"
              ],
              correctAnswer: 1,
              explanation: "Al-Ashlu fil mu'amalati al-ibahah (Hukum asal transaksi muamalah adalah boleh sampai datang dalil pengharaman)."
            }
          ]
        }
      }
    ]
  }
];
