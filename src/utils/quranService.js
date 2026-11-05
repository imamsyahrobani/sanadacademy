import { SURAH_LIST } from '../data/quranSurahs';

// Offline fallback dictionary for common verses
const POPULAR_VERSES_CACHE = {
  "1:1": {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
  },
  "1:2": {
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "Segala puji bagi Allah, Tuhan seluruh alam."
  },
  "2:45": {
    arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
    translation: "Dan mohonlah pertolongan (kepada Allah) dengan sabar dan shalat. Dan (shalat) itu sungguh berat, kecuali bagi orang-orang yang khusyuk."
  },
  "2:152": {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "Maka ingatlah kepada-Ku, Aku pun akan ingat kepadamu. Bersyukurlah kepada-Ku, dan janganlah kamu ingkar kepada-Ku."
  },
  "2:153": {
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan shalat. Sungguh, Allah beserta orang-orang yang sabar."
  },
  "2:255": {
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
    translation: "Allah, tidak ada tuhan selain Dia. Yang Mahahidup, yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi."
  },
  "2:286": {
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ",
    translation: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya. Dia mendapat (pahala) dari (kebajikan) yang dikerjakannya dan dia mendapat (siksa) dari (kejahatan) yang diperbuatnya."
  },
  "13:28": {
    arabic: "الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: "(Yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram."
  },
  "67:1": {
    arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    translation: "Mahasuci Allah Yang di tangan-Nya-lah segala kerajaan, dan Dia Mahakuasa atas segala sesuatu."
  },
  "67:2": {
    arabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
    translation: "Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya."
  },
  "94:5": {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Maka sesungguhnya beserta kesulitan ada kemudahan."
  },
  "94:6": {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Sesungguhnya beserta kesulitan ada kemudahan."
  },
  "112:1": {
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translation: "Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa.'"
  },
  "112:2": {
    arabic: "اللَّهُ الصَّمَدُ",
    translation: "Allah tempat meminta segala sesuatu."
  },
  "112:3": {
    arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    translation: "(Allah) tidak beranak dan tidak pula diperanakkan."
  },
  "112:4": {
    arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
    translation: "Dan tidak ada sesuatu yang setara dengan Dia."
  }
};

/**
 * Fetch Ayat Al-Quran (Teks Arab & Terjemahan Kemenag)
 * @param {number} surahNumber Nomor Surat (1-114)
 * @param {number} ayahNumber Nomor Ayat
 */
export async function fetchAyat(surahNumber, ayahNumber) {
  const surahInfo = SURAH_LIST.find(s => s.number === parseInt(surahNumber));
  const sNum = parseInt(surahNumber);
  const aNum = parseInt(ayahNumber);
  const key = `${sNum}:${aNum}`;

  // 1. Check local cache first
  if (POPULAR_VERSES_CACHE[key]) {
    return {
      surahName: surahInfo ? surahInfo.name : `Surat ${sNum}`,
      surahRef: `QS. ${surahInfo ? surahInfo.name : sNum}: ${aNum}`,
      arabic: POPULAR_VERSES_CACHE[key].arabic,
      translation: POPULAR_VERSES_CACHE[key].translation,
      source: 'cache'
    };
  }

  // 2. Try Al-Quran Cloud API (Uthmani + Indonesian Kemenag Translation)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${sNum}:${aNum}/editions/quran-uthmani,id.indonesian`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data?.data && Array.isArray(data.data) && data.data.length >= 2) {
        const arabicText = data.data[0].text;
        const translationText = data.data[1].text;

        return {
          surahName: surahInfo ? surahInfo.name : `Surat ${sNum}`,
          surahRef: `QS. ${surahInfo ? surahInfo.name : sNum}: ${aNum}`,
          arabic: arabicText,
          translation: translationText,
          source: 'api'
        };
      }
    }
  } catch (err) {
    console.warn("Primary Quran API fetch failed, trying secondary...", err);
  }

  // 3. Try Secondary Indonesian EQuran API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://equran.id/api/v2/surat/${sNum}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const ayatList = data?.data?.ayat;
      if (Array.isArray(ayatList)) {
        const targetAyat = ayatList.find(a => a.nomorAyat === aNum);
        if (targetAyat) {
          return {
            surahName: data.data.namaLatin || (surahInfo ? surahInfo.name : `Surat ${sNum}`),
            surahRef: `QS. ${surahInfo ? surahInfo.name : sNum}: ${aNum}`,
            arabic: targetAyat.teksArab,
            translation: targetAyat.teksIndonesia,
            source: 'equran'
          };
        }
      }
    }
  } catch (err) {
    console.warn("Secondary EQuran API failed:", err);
  }

  // 4. Fallback if offline
  return {
    surahName: surahInfo ? surahInfo.name : `Surat ${sNum}`,
    surahRef: `QS. ${surahInfo ? surahInfo.name : sNum}: ${aNum}`,
    arabic: `(Teks ayat QS. ${surahInfo ? surahInfo.name : sNum}: ${aNum})`,
    translation: `(Terjemahan ayat QS. ${surahInfo ? surahInfo.name : sNum}: ${aNum})`,
    source: 'fallback'
  };
}
