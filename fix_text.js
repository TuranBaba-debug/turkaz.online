const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Fix YouTube embed: remove color=white which can cause Error 153
c = c.replace('?rel=0&modestbranding=1&color=white', '?rel=0&modestbranding=1');

// Fix — ouTube at line 1573
c = c.replace('— ouTube Kanalımız', '▶ YouTube Kanalımız');

// Fix brand1_desc: "Türkiy—— 976 — 00+ ölkə" -> "Türkiyə, 1976 — 100+ ölkə"
c = c.replace('Türkiy—— 976 — 00+ ölkə', 'Türkiyə, 1976 — 100+ ölkə');

// Fix brand2_desc: "100+ ölk—— FB texnologiyası — koloji təmiz" -> "100+ ölkə, EFB texnologiyası, Ekoloji təmiz"
c = c.replace('100+ ölk—— FB texnologiyası — koloji təmiz', '100+ ölkə, EFB texnologiyası, Ekoloji təmiz');

// Fix brand3_desc: "SMF seriyası — eavy Duty — IS modelləri" -> "SMF seriyası, Heavy Duty, JIS modelləri"
c = c.replace('SMF seriyası — eavy Duty — IS modelləri', 'SMF seriyası, Heavy Duty, JIS modelləri');

// Fix brand4_desc: "Etibarlı — üdc— ostu — ündəlik istifadə" -> "Etibarlı, büdcə dostu, gündəlik istifadə"
c = c.replace('Etibarlı — üdc— ostu — ündəlik istifadə', 'Etibarlı, büdcə dostu, gündəlik istifadə');

// Fix brand5_desc: "6 ay zəmanət — ündəlik istifad—üçün" -> "6 ay zəmanət, gündəlik istifadə üçün"
c = c.replace('6 ay zəmanət — ündəlik istifad—üçün', '6 ay zəmanət, gündəlik istifadə üçün');

// Fix Turkuaz partner: "Orta — q v— frika bazarı" -> "Orta Şərq və Afrika bazarı"
c = c.replace('Orta — q v— frika bazarı', 'Orta Şərq və Afrika bazarı');

// Fix Probat partner: "Sənaye v— ommersiya" -> "Sənaye və Kommersiya"
c = c.replace('Sənaye v— ommersiya', 'Sənaye və Kommersiya');

// Fix Vesline partner: "saxlama v— olar tətbiqlər" -> "saxlama və Solar tətbiqlər"
c = c.replace('saxlama v— olar tətbiqlər', 'saxlama və Solar tətbiqlər');

// Fix Rigel partner: "Müdafi— ənayesi v— üsusi tətbiqlər" -> "Müdafiə Sənayesi və Xüsusi tətbiqlər"
c = c.replace('Müdafi— ənayesi v— üsusi tətbiqlər', 'Müdafiə Sənayesi və Xüsusi tətbiqlər');

// Fix Gentry partner: "Kommersiya nəqliyyatı. Heavy duty seriya"
// (already correct, skip)

// Fix hero_sub separator dashes (these are fine as em dashes between brands)

// Fix about_text
c = c.replace(
  'Birbaəa istehsalçılardan tədarük edirik — SO 9001, ISO 14001 v— HSAS 18001 sertifikatlı. Korporativ müətərilər— üsusi B2B — tlər təklif edirik.',
  'Birbaşa istehsalçılardan tədarük edirik. ISO 9001, ISO 14001 və OHSAS 18001 sertifikatlı. Korporativ müştərilərə xüsusi B2B şərtlər təklif edirik.'
);

// Fix footer_slogan
c = c.replace(
  'Premium Akkumulyator Həlləri — zərbaycanın —  böyük akkumulyator maəazası',
  'Premium Akkumulyator Həlləri — Azərbaycanın ən böyük akkumulyator mağazası'
);

// Fix yigit_s2: "2x — rj dövrü — unch Grid texnologiyası" -> "2x enerji dövrü, Punch Grid texnologiyası"
c = c.replace('2x — rj dövrü — unch Grid texnologiyası', '2x enerji dövrü, Punch Grid texnologiyası');

// Fix yigit_s3: "3x uzun ömür — aintenance Free" -> "3x uzun ömür, Maintenance Free"
c = c.replace('3x uzun ömür — aintenance Free', '3x uzun ömür, Maintenance Free');

// Fix yigit_s6: "12V 33ə260Ah — olar/UPS" -> "12V 33-260Ah, Solar/UPS"
c = c.replace('12V 33ə260Ah — olar/UPS', '12V 33-260Ah, Solar/UPS');

// Fix yigit_s8: "2V 100ə3000Ah — 000+ tsikl" -> "2V 100-3000Ah, 2000+ tsikl"
c = c.replace('2V 100ə3000Ah — 000+ tsikl', '2V 100-3000Ah, 2000+ tsikl');

// Fix Niy— -> Niyə  (in HTML title)
c = c.replace('Niy—', 'Niyə');

// Fix stat2: "əlkə" should be "ölkə" (in stat labels)
// Check the HTML for "əlkə"
c = c.replace(/">əlkə<\/div>/g, '">ölkə</div>');
c = c.replace(/stat2: 'əlkə'/, "stat2: 'ölkə'");

// Fix contact_whatsapp text
c = c.replace('⚡ WhatsApp il— azın', '⚡ WhatsApp ilə yazın');
c = c.replace('⚡ WhatsApp il— azın', '⚡ WhatsApp ilə yazın');

// Fix form_title: "Biz— azın" -> "Bizimlə əlaqə"
c = c.replace('Biz— azın', 'Bizimlə əlaqə');

// Fix contact_hours_label: "İ— aatları" -> "İş saatları"
c = c.replace('İ— aatları', 'İş saatları');

// Fix contact_hours: "Həftəiçi 09:00ə18:00" -> "Həftəiçi 09:00-18:00"
c = c.replace('09:00ə18:00', '09:00-18:00');

// Fix b2b_title: "Korporativ B2B — tlər" -> "Korporativ B2B şərtlər"
c = c.replace('Korporativ B2B — tlər', 'Korporativ B2B şərtlər');

// Fix b2b_text
c = c.replace(
  'Biznes müətərilərimiz üçün xüsusi endirimlər, fərdi çatdırılma v— zunmüddətli — əkdaəlıq — tləri təklif edirik.',
  'Biznes müştərilərimiz üçün xüsusi endirimlər, fərdi çatdırılma və uzunmüddətli əməkdaşlıq şərtləri təklif edirik.'
);

// Fix b2bf1_desc: "Həcm sifariələrind— üsusi qiymətlər" -> "Həcm sifarişlərindən xüsusi qiymətlər"
c = c.replace('Həcm sifariələrind— üsusi qiymətlər', 'Həcm sifarişlərindən xüsusi qiymətlər');

// Fix b2bf3_title: "əatdırılma" -> "Çatdırılma"
c = c.replace("b2bf3_title: 'əatdırılma'", "b2bf3_title: 'Çatdırılma'");
c = c.replace('">əatdırılma</h', '">Çatdırılma</h');

// Fix b2bf3_desc: "Bakı v— egionlara çatdırılma" -> "Bakı və regionlara çatdırılma"
c = c.replace('Bakı v— egionlara çatdırılma', 'Bakı və regionlara çatdırılma');

// Fix b2bf4_desc: "Aylıq satı— — nventar hesabatları" -> "Aylıq satış və inventar hesabatları"
c = c.replace('Aylıq satı— — nventar hesabatları', 'Aylıq satış və inventar hesabatları');

// Fix newsletter_sub: "Yeni məhsullar v— ampaniyalar" -> "Yeni məhsullar və kampaniyalar"
c = c.replace('Yeni məhsullar v— ampaniyalar', 'Yeni məhsullar və kampaniyalar');

// Fix newsletter_btn: "Abun— l" -> "Abunə ol"
c = c.replace('Abun— l', 'Abunə ol');

// Fix newsletter_success: "— bun— ldunuz!" -> "Abunə oldunuz!"
c = c.replace('— bun— ldunuz!', 'Abunə oldunuz!');

// Fix quiz_title
c = c.replace('— Hansı Akkumulyator Siz— yəundur?', 'Hansı Akkumulyator Sizə Uyğundur?');

// Fix quiz_sub: "3 sual — əqiq tövsiy— lın" -> "3 sual, dəqiq tövsiyə alın"
c = c.replace('3 sual — əqiq tövsiy— lın', '3 sual, dəqiq tövsiyə alın');

// Fix order_btn: "Sifari— t" -> "Sifariş et"
c = c.replace("order_btn: 'Sifari— t'", "order_btn: 'Sifariş et'");

// Fix b2b_btn: "B2B Sorəu Göndər" -> "B2B Sorgu Göndər"
c = c.replace('B2B Sorəu Göndər', 'B2B Sorgu Göndər');

// Fix settings_desc in HTML
c = c.replace(
  'real akkumulyator şəkilləri yaradın',
  'real akkumulyator şəkilləri yaradın'
);

// Fix brand5_desc with the other style: "6 ay zəmanət, gündəlik istifadə üçün"
// Already fixed above

// Fix line 2870: "Gündəlik istifad—üçün ideal seçim."
c = c.replace('Gündəlik istifad—üçün ideal seçim.', 'Gündəlik istifadə üçün ideal seçim.');

fs.writeFileSync('index.html', c, 'utf8');
console.log('Text fixes applied');
