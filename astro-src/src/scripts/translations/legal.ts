import type { Language } from './types';
import { site } from '../../config/site';

export interface LegalKeys {
  // Cookie Consent
  cookie_title: string;
  cookie_subtitle: string;
  cookie_description: string;
  cookie_necessary_title: string;
  cookie_necessary_desc: string;
  cookie_functional_title: string;
  cookie_functional_desc: string;
  cookie_analytics_title: string;
  cookie_analytics_desc: string;
  cookie_marketing_title: string;
  cookie_marketing_desc: string;
  cookie_always_active: string;
  cookie_optional: string;
  cookie_accept_all: string;
  cookie_accept_selected: string;
  cookie_reject_all: string;
  cookie_customize: string;
  cookie_hide_details: string;
  cookie_privacy_policy: string;
  cookie_policy: string;
  cookie_settings: string;

  // Privacy Policy Page
  privacy_title: string;
  privacy_meta_description: string;
  privacy_company_intro: string;
  privacy_intro_text: string;
  privacy_intro_contact: string;
  privacy_section_1_title: string;
  privacy_section_1_intro: string;
  privacy_def_ai_assistant: string;
  privacy_def_ai_assistant_desc: string;
  privacy_def_gdpr: string;
  privacy_def_gdpr_desc: string;
  privacy_def_eea: string;
  privacy_def_eea_desc: string;
  privacy_def_commercial: string;
  privacy_def_commercial_desc: string;
  privacy_def_personal_data: string;
  privacy_def_personal_data_desc: string;
  privacy_def_service: string;
  privacy_def_service_desc: string;
  privacy_def_contract: string;
  privacy_def_contract_desc: string;
  privacy_def_user: string;
  privacy_def_user_desc: string;
  privacy_def_controller: string;
  privacy_def_controller_desc: string;
  privacy_def_processor: string;
  privacy_def_processor_desc: string;
  privacy_def_processing: string;
  privacy_def_processing_desc: string;
  privacy_def_special_category: string;
  privacy_def_special_category_desc: string;
  privacy_section_2_title: string;
  privacy_section_2_text_1: string;
  privacy_section_2_text_2: string;
  privacy_section_3_title: string;
  privacy_section_3_intro: string;
  privacy_section_3_when: string;
  privacy_section_3_controller_title: string;
  privacy_section_3_controller_when: string;
  privacy_section_3_controller_processors: string;
  privacy_section_3_processor_title: string;
  privacy_section_3_processor_when: string;
  privacy_section_3_processor_info: string;
  privacy_section_3_subprocessors: string;
  privacy_section_4_title: string;
  privacy_section_4_how: string;
  privacy_section_4_data_list: string;
  privacy_section_4_special: string;
  privacy_section_5_title: string;
  privacy_section_5_intro: string;
  privacy_section_5_website_title: string;
  privacy_section_5_website_intro: string;
  privacy_table_why: string;
  privacy_table_what: string;
  privacy_table_how: string;
  privacy_table_how_long: string;
  privacy_website_visit_why: string;
  privacy_website_visit_what: string;
  privacy_website_visit_how: string;
  privacy_website_visit_duration: string;
  privacy_inquiry_why: string;
  privacy_inquiry_what: string;
  privacy_inquiry_how: string;
  privacy_inquiry_duration: string;
  privacy_newsletter_why: string;
  privacy_newsletter_what: string;
  privacy_newsletter_how: string;
  privacy_newsletter_duration: string;
  privacy_webinar_why: string;
  privacy_webinar_what: string;
  privacy_webinar_how: string;
  privacy_webinar_duration: string;
  privacy_social_why: string;
  privacy_social_what: string;
  privacy_social_how: string;
  privacy_social_duration: string;
  privacy_section_5_customers_title: string;
  privacy_section_5_customers_intro: string;
  privacy_contract_why: string;
  privacy_contract_what: string;
  privacy_contract_how: string;
  privacy_contract_duration: string;
  privacy_service_why: string;
  privacy_service_what: string;
  privacy_service_how: string;
  privacy_service_duration: string;
  privacy_accounting_why: string;
  privacy_accounting_what: string;
  privacy_accounting_how: string;
  privacy_accounting_duration: string;
  privacy_customer_marketing_why: string;
  privacy_customer_marketing_what: string;
  privacy_customer_marketing_how: string;
  privacy_customer_marketing_duration: string;
  privacy_section_5_applicants_title: string;
  privacy_section_5_applicants_intro: string;
  privacy_job_why: string;
  privacy_job_what: string;
  privacy_job_how: string;
  privacy_job_duration: string;
  privacy_section_6_title: string;
  privacy_section_6_intro: string;
  privacy_section_6_list: string;
  privacy_section_6_note: string;
  privacy_section_7_title: string;
  privacy_section_7_intro: string;
  privacy_processors_website: string;
  privacy_processors_analytics: string;
  privacy_processors_service: string;
  privacy_processors_payment: string;
  privacy_processors_support: string;
  privacy_processors_marketing: string;
  privacy_processors_social: string;
  privacy_section_7_legal: string;
  privacy_section_8_title: string;
  privacy_section_8_intro: string;
  privacy_section_8_technical: string;
  privacy_section_8_technical_list: string;
  privacy_section_8_organizational: string;
  privacy_section_8_organizational_list: string;
  privacy_section_9_title: string;
  privacy_section_9_contact: string;
  privacy_section_9_timing: string;
  privacy_right_access: string;
  privacy_right_access_desc: string;
  privacy_right_rectification: string;
  privacy_right_rectification_desc: string;
  privacy_right_erasure: string;
  privacy_right_erasure_desc: string;
  privacy_right_restriction: string;
  privacy_right_restriction_desc: string;
  privacy_right_notification: string;
  privacy_right_notification_desc: string;
  privacy_right_portability: string;
  privacy_right_portability_desc: string;
  privacy_right_objection: string;
  privacy_right_objection_desc: string;
  privacy_right_withdraw: string;
  privacy_right_withdraw_desc: string;
  privacy_right_automated: string;
  privacy_right_automated_desc: string;
  privacy_section_10_title: string;
  privacy_section_10_text: string;
  privacy_section_10_contact: string;
  privacy_section_10_complaint: string;
  privacy_effective_date: string;
}

export const legalTranslations: Record<Language, LegalKeys> = {
  cs: {
    // Cookie Consent
    cookie_title: "Nastavení cookies",
    cookie_subtitle: "Respektujeme vaše soukromí",
    cookie_description: "Používáme cookies k zajištění správného fungování webu a ke zlepšení vašeho zážitku.",
    cookie_necessary_title: "Nezbytné",
    cookie_necessary_desc: "Tyto cookies jsou nezbytné pro správné fungování webu. Bez nich by web nefungoval správně. Zahrnují cookies pro správu relace, jazykové preference a základní bezpečnostní funkce.",
    cookie_functional_title: "Funkční",
    cookie_functional_desc: "Funkční cookies umožňují rozšířené funkce webu, jako je personalizace obsahu, ukládání vašich preferencí a zapamatování vašich voleb na webu.",
    cookie_analytics_title: "Analytické",
    cookie_analytics_desc: "Analytické cookies nám pomáhají pochopit, jak návštěvníci používají web. Shromažďují anonymizované informace o počtu návštěvníků, zdrojích návštěvnosti a chování na webu.",
    cookie_marketing_title: "Marketingové",
    cookie_marketing_desc: "Marketingové cookies sledují vaši aktivitu na webu a pomáhají zobrazovat relevantní reklamy. Mohou být využity třetími stranami k vytvoření profilu vašich zájmů.",
    cookie_always_active: "Vždy aktivní",
    cookie_optional: "Volitelné",
    cookie_accept_all: "Přijmout vše",
    cookie_accept_selected: "Uložit výběr",
    cookie_reject_all: "Odmítnout vše",
    cookie_customize: "Přizpůsobit",
    cookie_hide_details: "Skrýt detaily",
    cookie_privacy_policy: "Zásady ochrany osobních údajů",
    cookie_policy: "Cookie policy",
    cookie_settings: "Nastavení cookies",

    // Privacy Policy Page
    privacy_title: `Zásady zpracování osobních údajů | ${site.name}`,
    privacy_meta_description: `Zásady zpracování osobních údajů společnosti ${site.legalName}. Informace o zpracování osobních údajů podle GDPR.`,
    privacy_company_intro: `společnosti ${site.legalName}${site.ico ? `, IČO: ${site.ico}` : ''}, se sídlem ${site.address.street}, ${site.address.city}, ${site.address.postalCode} (dále jen 'my' nebo 'Správce' nebo '${site.name}').`,
    privacy_intro_text: "Ochranu osobních údajů nebereme na lehkou váhu. V těchto zásadách se dozvíte, za jakým účelem, z jakého důvodu a jakým způsobem Vaše Osobní údaje zpracováváme. Najdete také informace o tom, jaká jsou Vaše práva v souvislosti s ochranou osobních údajů.",
    privacy_intro_contact: `Pokud budete mít jakékoliv další dotazy ohledně zpracování Vašich Osobních údajů, prosím kontaktujte nás na e-mail ${site.email} nebo poštou na adrese našeho sídla.`,
    privacy_section_1_title: "1. DEFINICE",
    privacy_section_1_intro: "Aby byl text přehlednější, zjednodušíme vám čtení několika pojmy, které v těchto zásadách zpracování osobních údajů používáme:",
    privacy_def_ai_assistant: "AI asistent",
    privacy_def_ai_assistant_desc: `je softwarová služba zaměřující se na asistenci se zákaznickou podporou, chatbot, voicebot a dalšími úkoly, které je možno automatizovat, jeho jednotlivé verze jsou uvedeny na webových stránkách ${site.url};`,
    privacy_def_gdpr: "GDPR",
    privacy_def_gdpr_desc: "Nařízení Evropského parlamentu a rady (EU) 2016/679;",
    privacy_def_eea: "EEA",
    privacy_def_eea_desc: "Evropský hospodářský prostor;",
    privacy_def_commercial: "Obchodní sdělení",
    privacy_def_commercial_desc: "zpravidla e-mailová zpráva nebo SMS odesílaná za účelem propagace služeb a zasílání novinek;",
    privacy_def_personal_data: "Osobní údaje",
    privacy_def_personal_data_desc: "jakékoliv informace o fyzické osobě, na základě kterých jej lze přímo či nepřímo identifikovat;",
    privacy_def_service: "Služba",
    privacy_def_service_desc: "softwarová služba, sestávající z AI asistenta a dalších s tímto souvisejících služeb, které poskytujeme našim zákazníkům v souvislosti s umělou inteligencí;",
    privacy_def_contract: "Smlouva",
    privacy_def_contract_desc: "smlouva o poskytování Služeb, která je uzavřena mezi námi a naším zákazníkem, případně se bude jednat o smlouvu za individuálně sjednaných podmínek;",
    privacy_def_user: "Uživatel / vy",
    privacy_def_user_desc: "fyzická osoba, k níž se vztahují Osobní údaje, nejčastěji půjde o zákazníka, tedy osobu, která s námi uzavřela Smlouvu, případně s ní spolupracující osoby nebo o potenciálního zákazníka, případně uživatele našich webových stránek, kteří si je jen prohlížejí, či účastníka našich online nebo offline akcí;",
    privacy_def_controller: "Správce",
    privacy_def_controller_desc: "subjekt (ve vztahu k Vašim údajům jsme to my), který sám nebo společně s jinými určuje účely a prostředky zpracování Osobních údajů;",
    privacy_def_processor: "Zpracovatel",
    privacy_def_processor_desc: "využíváme jiné subjekty, aby nám např. zajistili bezpečné ukládání dat nebo abychom vám zaslali newsletter. Během této spolupráce mohou zpracovávat Osobní údaje, které jste nám poskytli;",
    privacy_def_processing: "Zpracování Osobních údajů",
    privacy_def_processing_desc: "zjednodušeně se jedná jakékoli nakládání s Osobními údaji - ať už je to jejich uložení, sdílení, smazání, nebo měnění;",
    privacy_def_special_category: "Zvláštní kategorie Osobních údajů",
    privacy_def_special_category_desc: "údaje, které chápeme jako ty, které jsou citlivější. Týkají se například toho, jaký je Váš etnický původ, jaká je Vaše sexuální orientace, jestli jste v odborech nebo jak jste na tom zdravotně a jaká je Vaše víra. Za zvláštní kategorii údajů jsou považovány i genetické a biometrické údaje, pokud jsou zpracovávány za účelem jedinečné identifikace fyzické osoby. My tuto kategorii Osobních údajů nezpracováváme.",
    privacy_section_2_title: "2. JAK PŘISTUPUJEME KE ZPRACOVÁNÍ OSOBNÍCH ÚDAJŮ?",
    privacy_section_2_text_1: "Vaše soukromí je pro nás prioritou, proto od Vás vyžadujeme jen ty Osobní údaje, které jsou k poskytování Služeb nezbytné. Naše Služby odpovídají standardům požadovaným GDPR. Pokud nám svá data svěříte, zavazujeme se s nimi nakládat v souladu s příslušnou právní úpravou, která se na Vás vztahuje (GDPR apod.). Naše Zpracování Osobních údajů se může přizpůsobovat i konkrétním právním předpisům v zemích zpracování, minimálním standardem však pro nás je v každém případě GDPR. O tom, jaká máte v souvislosti s Osobními údaji práva, informujeme níže.",
    privacy_section_2_text_2: "V rámci zpracování Osobních údajů v odůvodněných případech používáme i umělou inteligenci (AI). Nepoužíváme ji však k automatizovanému rozhodování nebo profilování ve smyslu GDPR (zejména článku 22). Veškeré zpracování Osobních údajů podléhá lidskému rozhodnutí, samotná AI o vás nijak nerozhoduje. Umělou inteligenci používáme především pro poskytování Služeb AI chatbot, který vás má informovat a poradit vám s vašimi dotazy a problémy.",
    privacy_section_3_title: "3. V JAKÉ ROLI SE VE VZTAHU K OSOBNÍM ÚDAJŮM OCITÁME",
    privacy_section_3_intro: "S ohledem na to jaké Služby poskytujeme, se můžeme ocitnout ve vztahu k Osobním údajům v pozici Správce i Zpracovatele.",
    privacy_section_3_when: "Kdy se tyto zásady uplatní? Tyto zásady Zpracování osobních údajů se vztahují pouze na situace, kdy jsme v pozici Správce, pokud není v textu zásad uvedeno jinak. Prosím vezměte na vědomí, že tyto zásady Zpracování osobních údajů se vztahují na Zpracování Osobních údajů našich Uživatelů, nikoliv jejich zákazníků a dalších subjektů údajů.",
    privacy_section_3_controller_title: `1. ${site.name.toUpperCase()} JAKO SPRÁVCE`,
    privacy_section_3_controller_when: `Kdy je ${site.name} Správcem? Ve vztahu k Uživatelům jsme Správcem Osobních údajů. Svěřili jste nám některé údaje o sobě (např. Vaše jméno a e-mail). Přehled zpracovávaných Osobních údajů včetně důvodů pro jejich zpracování najdete níže. Pokud by bylo cokoliv nejasného, neváhejte se nám ozvat na e-mail ${site.email}.`,
    privacy_section_3_controller_processors: "Další Zpracovatelé. Abychom Vám mohli naši Službu poskytovat co nejkvalitněji, využíváme k tomu dalších subjektů. Se všemi máme uzavřeny potřebné smlouvy a vyžadujeme co nejvyšší možnou úroveň ochrany a zabezpečení Osobních údajů. Všechny naše zpracovatele najdete v části 8. těchto zásad.",
    privacy_section_3_processor_title: `2. ${site.name.toUpperCase()} JAKO ZPRACOVATEL`,
    privacy_section_3_processor_when: `Kdy je ${site.name} v pozici zpracovatele? Poskytujeme Službu, jejímž účelem je komunikace a pomoc Vašim zákazníkům prostřednictvím AI asistenta. Ve vztahu k Vašim zákazníkům můžeme být v pozici zpracovatele Osobních údajů. Pokud zpracováváme jejich Osobní údaje, pak tak činíme Vaším jménem pouze jako zpracovatel, a to v souladu s Vašimi pokyny (tj. pokyny Uživatele). Ochrana osobních údajů a práva a povinnosti z toho vyplývající, jsou v tomto případě upravena Smlouvou o zpracování osobních údajů (DPA).`,
    privacy_section_3_processor_info: `Jste-li zákazníkem nebo jiným subjektem údajů, jehož Osobní údaje zpracovává některý z našich Uživatelů, doporučujeme Vám si pečlivě přečíst jejich dokumentaci týkající se Zpracování Osobních údajů. V ní byste měli zjistit, jak tento zákazník shromažďuje a používá informace o vás. Pokud nám náš Uživatel poskytl vaše Osobní údaje a chcete uplatnit veškerá práva, prosím informujte se přímo u příslušného Uživatele. Naši zaměstnanci mají omezenou možnost přístupu k vašim Osobním údajům. Pokud si přesto, přejete podat svůj požadavek týkající se uplatnění práv týkající se vašich Osobních údajů přímo ${site.name}, uveďte prosím také název našeho Uživatele. Vaši žádost předáme tomuto zákazníkovi v co nejkratší době.`,
    privacy_section_3_subprocessors: "Subzpracovatelé. V rámci zajišťování Služeb využíváme další subjekty. Pokud se ocitneme v pozici zpracovatele Osobních údajů, můžeme využívat další subzpracovatele, a to v souladu se Smlouvou o zpracování osobních údajů (DPA). K Vašim datům, které do systému uložíte, tj. k datům Vašich klientů, máme my i naši subzpracovatelé velmi omezený přístup, i přes to dbáme na to, aby naši subzpracovatelé byli vázáni k zajištění ochrany Osobních údajů na stejné úrovni, jakou poskytujeme my.",
    privacy_section_4_title: "4. JAKÉ OSOBNÍ ÚDAJE O VÁS ZPRACOVÁVÁME?",
    privacy_section_4_how: "Jak zpracováváme Osobní údaje? Vaše Osobní údaje zpracováváme pouze v rozsahu nezbytném pro dosažení účelu, pro který byly údaje pořízeny a při jejich zpracovávání dodržujeme bezpečnostní technická a organizační pravidla. Proces Zpracování Osobních údajů je automatizován, ale neprovádíme profilování. Konkrétní účely zpracování údajů a kategorie osobních údajů, které pro jednotlivé účely zpracováváme jsou rozepsány v následující části.",
    privacy_section_4_data_list: "→ Jméno a příjmení, případně datum narození (IČO) a adresa\n→ Kontaktní údaje (zejména e-mail, telefonní číslo) a další údaje, které dobrovolně uvedete ve svém uživatelském rozhraní\n→ Údaje v dotazu zaslaným zákazníkem nebo jinou osobou\n→ Užívání AI asistent (zejména údaje vyplněné Uživatelem v rámci zkušebního užívání AI asistent, čas registrace, datum poslední aktualizace profilu)\n→ Fakturační údaje a bankovní spojení (údaje nezbytné k vedení účetnictví a realizaci plateb)\n→ Informace, které nám sdělíte v rámci komunikace s námi (zejména se bude jednat o Vaše otázky a odpovědi na Vaše dotazy, komunikace s Vámi)\n→ Vámi přidané komentáře k našim příspěvkům na sociálních sítích (zejména Facebook, LinkedIn), jako i jméno (přezdívka) Vašeho profilu na těchto sociálních sítích a Vámi veřejně přístupné informace na Vašich profilech\n→ Cookies a IP adresa, údaje o aktivitách (včetně informací o Vašem zařízení nebo operačním systému)\n→ Provozní údaje značící hlavně vznik chybového stavu AI Asistent (čas a adresa vzniku chybového incidentu)",
    privacy_section_4_special: "Zvláštní kategorie Osobních údajů. Žádné Osobní údaje, které jsou dle GDPR Zvláštní kategorie osobních údajů, tedy Osobní údaje citlivé povahy o Vás nezpracováváme.",
    privacy_section_5_title: "5. V JAKÝCH PŘÍPADECH ZPRACOVÁVÁME OSOBNÍ ÚDAJE A JAK?",
    privacy_section_5_intro: "Vaše Osobní údaje zpracováváme v případě, že jste uživatelem našich webových stránek nebo naším zákazníkem. Vaše Osobní údaje zpracováváme pouze po nezbytnou dobu, její délka se ale může lišit s ohledem na příslušnou právní úpravu v místě, kde Vám naše Služby poskytujeme. Údaje o délce zpracování jsou tudíž pouze orientační.",
    privacy_section_5_website_title: "1. UŽIVATELÉ NAŠICH WEBOVÝCH STRÁNEK",
    privacy_section_5_website_intro: "Pokud navštívíte naše webové stránky, zpracováváme Vaše Osobní údaje pro účely uvedené v této tabulce.",
    privacy_table_why: "Proč?",
    privacy_table_what: "Jaké údaje?",
    privacy_table_how: "Jak?",
    privacy_table_how_long: "Jak dlouho?",
    privacy_website_visit_why: "Návštěva webových stránek. Zajištění základních funkcí našich webových stránek, analytiky, zlepšování našich služeb a naši propagaci. Preference můžete nastavit v cookie liště. Právním titulem pro zpracování Osobních údajů souhlas (analytika, marketingové cookies) nebo náš oprávněný zájem (nezbytné cookies).",
    privacy_website_visit_what: "Informace o tom, kdy a jak navštívíte a prohlížíte si naše webové stránky. Pokud navštívíte naše webové stránky přes mobilní telefon, můžeme také zpracovávat data o Vašem telefonu.",
    privacy_website_visit_how: "Cookies nebo jiné technologie pro sledování chování Uživatele.",
    privacy_website_visit_duration: "Délka zpracování se liší dle jednotlivých druhů cookie. Některé zpracovávají údaje pouze po dobu session (návštěvy), některé po dobu delší.",
    privacy_inquiry_why: "Zaslání dotazu. Můžete nás kdykoliv kontaktovat s Vašimi dotazy a my Vám na ně odpovíme. Kontaktovat nás můžete prostřednictvím kontaktního formuláře na našem webu, nebo na e-mail. Odeslání dotazu zároveň vyjadřujete souhlas se Zpracováním Osobních údajů.",
    privacy_inquiry_what: "Jméno, příjmení, e-mail, telefon, další Osobní údaje, které nám sdělíte.",
    privacy_inquiry_how: "Za účelem vyřízení dotazu zpracováváme Osobní údaje, které jsou k jeho vyřízení nezbytné. Komunikace probíhá po telefonu, e-mailu, nebo přímo na našem webu.",
    privacy_inquiry_duration: "Uzavřené dotazy jsou pravidelně mazány, nejpozději však za 3,5 roku od položení dotazu.",
    privacy_newsletter_why: "Zasílání Obchodních sdělení (přímý marketing). Přihlásili jste se k odběru newsletteru a tím vyslovili souhlas se zpracováním. Pokud ho nechcete už nadále dostávat, můžete se odhlásit v patičce e-mailu.",
    privacy_newsletter_what: "Jméno, příjmení, telefonní číslo a e-mail.",
    privacy_newsletter_how: "Zasíláme newsletter, ve kterém informujeme o našich Službách a novinkách.",
    privacy_newsletter_duration: "Údaje jsou zpracovávány po dobu 2 let od posledního aktivního prohlédnutí newsletteru, pokud se neodhlásíte dříve.",
    privacy_webinar_why: "Webinář nebo vzdělávací akce. Pořádáme webináře nebo vzdělávací akce. Zpracováváme Vaše Osobní údaje, které vyplníte v objednávkovém formuláři nebo nám jinak poskytnete při přihlášení.",
    privacy_webinar_what: "E-mail, jméno a příjmení. Některé Osobní údaje nám můžete sdělit v průběhu webináře nebo akce. Prosím vezměte na vědomí, že z některých z těchto akcí můžeme pořizovat videozáznamy nebo fotografie.",
    privacy_webinar_how: "Na webinář či akci se přihlásíte vyplněním formuláře nebo e-mailem. My se Vám poté ozveme s dalšími potřebnými informacemi.",
    privacy_webinar_duration: "Údaje jsou zpracovávány po dobu 6 měsíců od webináře či akce, pokud jste nám neudělili souhlas se zasíláním Obchodních sdělení.",
    privacy_social_why: "Blog, sociální sítě, soutěže a další propagační akce. Prosím vezměte na vědomí, že jakékoliv informace, které vložíte do komentáře na našem blogu, může zobrazit kdokoliv. Na našich webových stránkách nebo prostřednictvím sociálních sítí můžeme provádět průzkumy, pořádat soutěže nebo jiné propagační akce, včetně soutěží pořádaných formou slosování. Zapojením do soutěže souhlasíte i se zasíláním obchodních sdělení.",
    privacy_social_what: "Jméno a příjmení, adresa, datum narození, telefonní číslo, e-mailová adresa, uživatelské jméno a podobné údaje",
    privacy_social_how: "Veškeré informace, sdělení nebo materiály, které jsou prostřednictvím platformy sociálních médií poskytovány, jsou poskytovány také podle zásad zpracování osobních údajů těchto platforem.",
    privacy_social_duration: "Vaše komentáře u příspěvku necháváme po celou dobu, co je zveřejněn na našem profilu, pokud nás nepožádáte dříve o smazání Vašeho komentáře na našem blogu. V případě soutěží jsou údaje zpracovávány po dobu 2 let od skončení soutěže, pakliže svůj souhlas neodvoláte dříve.",
    privacy_section_5_customers_title: "2. ZÁKAZNÍCI",
    privacy_section_5_customers_intro: "Pokud se rozhodnete pro naše Služby, budete na základě Smlouvy využívat některou z verzí našich AI asistentů. Aby mohla proběhnout spolupráce, zpracováváme o Vás některé Osobní údaje.",
    privacy_contract_why: "Uzavření Smlouvy. Abyste mohli začít využívat Službu naplno, je potřeba nejprve s námi uzavřít Smlouvu. Takové údaje zpracováváme na základě vámi poskytnutých údajů pro plnění Smlouvy.",
    privacy_contract_what: "Pro uzavření Smlouvy budeme potřebovat Vaše jméno, příjmení a e-mailovou adresu, případně další údaje.",
    privacy_contract_how: "Tyto údaje nám poskytnete v rámci naší komunikace za účelem podpisu Smlouvy.",
    privacy_contract_duration: "Údaje jsou zpracovávány po dobu trvání Smlouvy a následně po dobu 3,5 roku od skončení Smlouvy.",
    privacy_service_why: "Služba AI asistent. Můžeme obdržet informace o tom, jak a kdy používáte AI asistent, zpracováváme i údaje spojené s jeho zabezpečením. Osobní údaje zpracováváme za účelem plnění Smlouvy a oprávněného zájmu pro zkvalitňování Služeb.",
    privacy_service_what: "Jméno, příjmení, adresa, datum narození (IČO), telefonní číslo, e-mail, pracovní pozice, případně IP adresa a další potřebné údaje k poskytování.",
    privacy_service_how: "Získané informace můžeme ukládat v rámci Smlouvy a poskytování Služeb.",
    privacy_service_duration: "Po dobu trvání smluvního vztahu s námi a následně 3,5 roku po jeho skončení.",
    privacy_accounting_why: "Účetnictví. Za poskytování Služeb přijímáme odměnu a vystavujeme Vám účetní a daňové doklady, které následně archivujeme a dále s nimi pracujeme pro potřeby řádného vedení našeho účetnictví a plnění zákonných povinností.",
    privacy_accounting_what: "Údaje na faktuře - jméno, příjmení, e-mailová adresa, fakturační adresa, či jinou identifikaci Uživatele a podrobnosti o plnění dle Smlouvy.",
    privacy_accounting_how: "Po vyplnění platebních informací v profilu si tyto údaje uložíme, abychom vytvořili fakturu.",
    privacy_accounting_duration: "Máme ze zákona povinnost archivovat nebo uchovat příslušný dokument, doba záleží na tom, co vyžaduje zákon (3 - 10 let).",
    privacy_customer_marketing_why: "Přímý marketing, zasílání Obchodních sdělení. U našich Uživatelů můžeme newsletter zasílat na základě oprávněného zájmu na zlepšování a propagování našich Služeb nebo těm, kteří se zasíláním vyslovili souhlas.",
    privacy_customer_marketing_what: "Jméno, příjmení, telefonní číslo a e-mail.",
    privacy_customer_marketing_how: "Zasíláme newsletter, ve kterém informujeme o našich Službách a novinkách.",
    privacy_customer_marketing_duration: "Údaje jsou zpracovávány po dobu 2 let od posledního aktivního prohlédnutí newsletteru, pokud se neodhlásíte dříve.",
    privacy_section_5_applicants_title: "3. UCHAZEČI O ZAMĚSTNÁNÍ",
    privacy_section_5_applicants_intro: `Tato sekce je pro vás relevantní v případě, že chcete pracovat přímo v rámci ${site.name}.`,
    privacy_job_why: "Nabídka pracovních pozic. Na našich webových stránkách v sekci o kariéře, kde můžete najít aktuálně volná pracovní místa.",
    privacy_job_what: "Jedná se o údaje, které nám poskytnete v zaslaném životopisu. Jméno a příjmení, adresa, datum narození, telefonní číslo, e-mailová adresa, případně odkaz na sociální síť, údaje o bývalém zaměstnání, vzdělání, zájmy, schopnosti, certifikace.",
    privacy_job_how: "Podíváme se na Vámi zaslané podklady, které obsahují Osobní údaje a na základě nich se Vám ozveme.",
    privacy_job_duration: "Na základě uděleného souhlasu můžeme uchovat Osobní údaje uchazečů o zaměstnání po dobu 2 let. Důvodem je možnost, že pro Vás později budeme mít zajímavou nabídku pracovní pozice u nás.",
    privacy_section_6_title: "6. NA JAKÉM ZÁKLADĚ VAŠE OSOBNÍ ÚDAJE ZPRACOVÁVÁME?",
    privacy_section_6_intro: "Zákonnost zpracování. Veškeré Osobní údaje získáváme a zpracováváme zákonným způsobem. Osobní údaje zpracováváme:",
    privacy_section_6_list: "na základě Vašeho souhlasu (např. když se dobrovolně přihlásíte k odběru našeho newsletteru),\nza účelem plnění Smlouvy (abychom Vám mohli začít poskytovat naše Služby),\nza účelem plnění zákonné povinnosti (např. v případě dozoru ze strany kontrolního úřadu) a\nna základě našeho oprávněného zájmu (např. v případě že jste naším zákazníkem, abychom Vás mohli informovat o tom, co je u nás nového).",
    privacy_section_6_note: "V případě, že Vám Službu poskytujeme mimo Evropský hospodářský prostor (EEA), mohou se právní tituly pro Zpracování Osobních údajů lišit.",
    privacy_section_7_title: "7. KDO JSOU NAŠI ZPRACOVATELÉ?",
    privacy_section_7_intro: "Zpracovatelé. Používáme pouze prověřené Zpracovatele, se kterými máme uzavřenou písemnou smlouvu, a kteří nám poskytují minimálně stejné záruky jako my Vám. Údaje, které mohou Zpracovatelé zpracovávat, včetně jejich účelu a právního titulu zpracování jsme uvedli výše. Tyto Zpracovatele využíváme z pozice Správce, to znamená, že nezpracovávají údaje, které vložíte do systému v rámci užívání Služby.",
    privacy_processors_website: "Provoz webových stránek",
    privacy_processors_analytics: "Běžná analýza návštěvnosti webových stránek",
    privacy_processors_service: "Poskytování Služby",
    privacy_processors_payment: "Platba a účetnictví",
    privacy_processors_support: "Komunikace se zákaznickou podporou, vyřízení dotazu",
    privacy_processors_marketing: "Marketing",
    privacy_processors_social: "Sociální sítě",
    privacy_section_7_legal: "Zákonné povinnosti. Osobní údaje můžeme mimo výše uvedeným Zpracovatelům předat třetím osobám, jestliže to vyžaduje zákon nebo v reakci na zákonné požadavky orgánů veřejné moci či na vyžádání soudu v soudních sporech.",
    privacy_section_8_title: "8. JAKÁ JSME PŘIJALI OPATŘENÍ K OCHRANĚ VAŠICH OSOBNÍCH ÚDAJŮ?",
    privacy_section_8_intro: "Rozsah zpracování v rámci poskytování Služby mohou naši zákazníci ovlivnit vlastním nastavením spolupráce s námi.",
    privacy_section_8_technical: "Technická opatření. Bezpečnost je pro nás velmi důležitá a proto soustavně pracujeme na tom, aby byly Vaše Osobní údaje chráněny. Při volbě opatření bereme v úvahu rozsah zpracování, rizikovost zpracování nebo stav naší techniky.",
    privacy_section_8_technical_list: "Pravidelné zálohujeme data;\naktualizujeme antivirové softwarové systémy;\nšifrujeme data pomocí SSL/TLS (secure sockets layer / transport layer security) pro veškeré předávání údajů;\npoužíváme zabezpečený https protokol;\ntechnologii vyvíjíme s ohledem na ochranu osobních údajů (privacy by design);\npřístupová hesla do informačních systémů (kde budou Osobní údaje zpracovány) a oprávnění k přístupu jsou kontrolované na úrovni jednotlivců.",
    privacy_section_8_organizational: "Organizační opatření. Přijali jsme a zavazujeme se dodržovat následující opatření:",
    privacy_section_8_organizational_list: "Naši zaměstnanci a naši dodavatelé služeb jsou zavázáni mlčenlivostí;\nNaši zaměstnanci jsou řádně proškoleni a také dále pravidelně školeni ohledně GDPR a seznámeni s pravidly bezpečné práce na pracovních zařízeních;\nPřístupy do všech systémů včetně informačního systému jsou personalizovány a kryty bezpečnými hesly.",
    privacy_section_9_title: "9. JAKÁ MÁTE PRÁVA?",
    privacy_section_9_contact: `Kam se na nás obrátit? Napište nám na ${site.email}, nebo na adresu našeho sídla.`,
    privacy_section_9_timing: "Kdy to vyřídíme? Odpovíme vám nejpozději do jednoho měsíce. Pokud by poskytnutí informací ohrozilo soukromí jiných osob, nebo by poskytnutí bylo nepřiměřené rizikům či nákladům na jejich poskytnutí, je možné, že vám nebudeme moci vyhovět. Abychom vaši žádost lépe vyřídili, je možné, že si od vás budeme potřebovat ověřit vaši totožnost. V případě opakované žádosti bude správce oprávněn za kopii Osobních údajů účtovat přiměřený poplatek.",
    privacy_right_access: "Právo na přístup",
    privacy_right_access_desc: "Potvrdíme, zda zpracováváme Vaše Osobní údaje. Máte právo na informace o účelech zpracování, kategoriích osobních údajů, příjemcích, kterým jsou zpřístupněny, době zpracování. Máte právo vědět, zda nějaké právo bylo již realizováno. Předpokladem je také to, že nebudou nepříznivě dotčena práva a svobody jiných osob i kopii Osobních údajů.",
    privacy_right_rectification: "Právo na opravu",
    privacy_right_rectification_desc: "Má právo na žádat o opravu nepřesných osobních údajů. Některé údaje můžete opravit ve svém uživatelském profilu.",
    privacy_right_erasure: "Právo na výmaz",
    privacy_right_erasure_desc: "Pokud neexistuje jiný důvod, proč tyto údaje dále zpracovávat, pak Vámi požadované údaje vymažeme či zanonymizujeme.",
    privacy_right_restriction: "Právo na omezení zpracování",
    privacy_right_restriction_desc: "Prosím kontaktujte nás, pokud máte za to, že údaje zpracováváme nesprávně. Ať už se jedná o důvody zpracování nebo jeho rozsah.",
    privacy_right_notification: "Právo na oznámení opravy, výmazu nebo omezení zpracování",
    privacy_right_notification_desc: "V případě, že nás kontaktujete s žádostí, budeme Vás informovat o výsledku. Někdy se může stát, že nebudeme moci vyhovět (např. e-mailová adresa, ze které jste nám napsali již nefunguje).",
    privacy_right_portability: "Právo na přenositelnost",
    privacy_right_portability_desc: "Vaše Osobní údaje, které jste nám poskytli ve strukturovaném a strojově čitelném formátu, na Vaši žádost poskytneme jinému správci.",
    privacy_right_objection: "Právo vznést námitku",
    privacy_right_objection_desc: "Pokud zpracováváme Vaše údaje na základě oprávněného zájmu (např. zasílání newsletteru Uživatelům). Je na nás, abychom náš oprávněný zájem prokázali. V případě, že bude Vaše námitka oprávněná, přestaneme Zpracování Osobních údajů provádět.",
    privacy_right_withdraw: "Právo na odvolání souhlasu",
    privacy_right_withdraw_desc: "Pokud jste změnili názor, prosím dejte nám vědět. Zpracování týkající se marketingového a obchodního účelu je možné odvolat kdykoliv.",
    privacy_right_automated: "Automatizované individuální rozhodování včetně profilování",
    privacy_right_automated_desc: "Nechcete, aby se o Vás rozhodovalo pomocí počítače? Respektujeme Vaše právo, proto profilování neprovádíme. Poskytujeme Službu, Vaše Osobní údaje mohou být zpracovávány automatizovaně.",
    privacy_section_10_title: "10. ZÁVĚR",
    privacy_section_10_text: "Tyto zásady Zpracování Osobních údajů mohou být změněny pouze písemně. O tom budete informováni prostřednictvím našich webových stránek. Kontrolujte proto prosím tyto zásady pravidelně. Tím, že naši Službu nadále používáte znamená, že se změnami těchto zásad souhlasíte.",
    privacy_section_10_contact: `V případě jakýchkoliv dotazů týkajících se našich zásad Zpracování Osobních údajů nás prosím kontaktujte na e-mailu ${site.email}.`,
    privacy_section_10_complaint: "Pokud budete nespokojeni, můžete kdykoliv podat podnět nebo stížnost k Úřadu pro ochranu Osobních údajů, se sídlem Pplk. Sochora 727/27, 170 00 Praha 7 – Holešovice (více na https://www.uoou.cz/), nebo jinému úřadu pro ochranu osobních údajů nacházejícím se v místě Vašeho obvyklého bydliště.",
    privacy_effective_date: "Tyto zásady ochrany Osobních údajů jsou účinné ode dne 20. 3. 2025.",
  },
  en: {
    // Cookie Consent
    cookie_title: "Cookie Settings",
    cookie_subtitle: "We respect your privacy",
    cookie_description: "We use cookies to ensure proper website functionality and to improve your experience.",
    cookie_necessary_title: "Necessary",
    cookie_necessary_desc: "These cookies are essential for the proper functioning of the website. Without them, the website would not work correctly. They include session management, language preferences, and basic security features.",
    cookie_functional_title: "Functional",
    cookie_functional_desc: "Functional cookies enable enhanced website features, such as content personalization, saving your preferences, and remembering your choices on the website.",
    cookie_analytics_title: "Analytics",
    cookie_analytics_desc: "Analytics cookies help us understand how visitors use the website. They collect anonymized information about visitor numbers, traffic sources, and behavior on the website.",
    cookie_marketing_title: "Marketing",
    cookie_marketing_desc: "Marketing cookies track your activity on the website and help display relevant advertisements. They may be used by third parties to create a profile of your interests.",
    cookie_always_active: "Always active",
    cookie_optional: "Optional",
    cookie_accept_all: "Accept all",
    cookie_accept_selected: "Save selection",
    cookie_reject_all: "Reject all",
    cookie_customize: "Customize",
    cookie_hide_details: "Hide details",
    cookie_privacy_policy: "Privacy Policy",
    cookie_policy: "Cookie Policy",
    cookie_settings: "Cookie settings",

    // Privacy Policy Page - Professional Legal English Translation
    privacy_title: `Personal Data Processing Policy | ${site.name}`,
    privacy_meta_description: `Personal data processing policy of ${site.legalName}. Information on personal data processing in accordance with GDPR.`,
    privacy_company_intro: `of ${site.legalName}${site.ico ? `, Company Registration No.: ${site.ico}` : ''}, with its registered office at ${site.address.street}, ${site.address.city}, ${site.address.postalCode} (hereinafter referred to as "we", "Controller" or "${site.name}").`,
    privacy_intro_text: "We take the protection of personal data seriously. In this policy, you will learn for what purpose, on what legal basis, and how we process your Personal Data. You will also find information about your rights in connection with personal data protection.",
    privacy_intro_contact: `If you have any further questions regarding the processing of your Personal Data, please contact us by email at ${site.email} or by post at our registered office address.`,
    privacy_section_1_title: "1. DEFINITIONS",
    privacy_section_1_intro: "To make this text clearer, we will simplify your reading with several terms used throughout this personal data processing policy:",
    privacy_def_ai_assistant: "AI Assistant",
    privacy_def_ai_assistant_desc: `means a software service focused on assisting with customer support, chatbot, voicebot, and other tasks that can be automated; its individual versions are listed on the website ${site.url};`,
    privacy_def_gdpr: "GDPR",
    privacy_def_gdpr_desc: "Regulation (EU) 2016/679 of the European Parliament and of the Council;",
    privacy_def_eea: "EEA",
    privacy_def_eea_desc: "European Economic Area;",
    privacy_def_commercial: "Commercial Communication",
    privacy_def_commercial_desc: "typically an email message or SMS sent for the purpose of promoting services and delivering news;",
    privacy_def_personal_data: "Personal Data",
    privacy_def_personal_data_desc: "any information about a natural person on the basis of which they can be directly or indirectly identified;",
    privacy_def_service: "Service",
    privacy_def_service_desc: "software service consisting of an AI assistant and other related services that we provide to our customers in connection with artificial intelligence;",
    privacy_def_contract: "Contract",
    privacy_def_contract_desc: "an agreement for the provision of Services concluded between us and our customer, or an agreement under individually negotiated terms;",
    privacy_def_user: "User / You",
    privacy_def_user_desc: "a natural person to whom Personal Data relates, most often a customer, i.e., a person who has concluded a Contract with us, or persons cooperating with them, a potential customer, or a user of our website who merely browses it, or a participant in our online or offline events;",
    privacy_def_controller: "Controller",
    privacy_def_controller_desc: "an entity (in relation to your data, this is us) that alone or jointly with others determines the purposes and means of Processing Personal Data;",
    privacy_def_processor: "Processor",
    privacy_def_processor_desc: "we use other entities to, for example, ensure secure data storage or to send you a newsletter. During this cooperation, they may process Personal Data that you have provided to us;",
    privacy_def_processing: "Processing of Personal Data",
    privacy_def_processing_desc: "in simple terms, this refers to any handling of Personal Data - whether it is storage, sharing, deletion, or modification;",
    privacy_def_special_category: "Special Category of Personal Data",
    privacy_def_special_category_desc: "data that we understand as more sensitive. This includes, for example, your ethnic origin, sexual orientation, trade union membership, health status, and religious beliefs. Genetic and biometric data are also considered a special category of data if processed for the purpose of uniquely identifying a natural person. We do not process this category of Personal Data.",
    privacy_section_2_title: "2. HOW DO WE APPROACH THE PROCESSING OF PERSONAL DATA?",
    privacy_section_2_text_1: "Your privacy is our priority, which is why we only require Personal Data that is necessary for the provision of our Services. Our Services comply with the standards required by GDPR. If you entrust us with your data, we undertake to handle it in accordance with the applicable legal regulations that apply to you (GDPR, etc.). Our Processing of Personal Data may also adapt to specific legal regulations in the countries of processing; however, the minimum standard for us is always GDPR. Information about your rights in connection with Personal Data is provided below.",
    privacy_section_2_text_2: "As part of the Processing of Personal Data, we also use artificial intelligence (AI) in justified cases. However, we do not use it for automated decision-making or profiling within the meaning of GDPR (particularly Article 22). All Processing of Personal Data is subject to human decision-making; the AI itself does not make any decisions about you. We use artificial intelligence primarily for providing AI chatbot Services, which is designed to inform you and advise you on your queries and issues.",
    privacy_section_3_title: "3. WHAT ROLE DO WE HAVE IN RELATION TO PERSONAL DATA",
    privacy_section_3_intro: "Given the Services we provide, we may find ourselves in relation to Personal Data in the position of both Controller and Processor.",
    privacy_section_3_when: "When do these policies apply? This Personal Data Processing Policy applies only to situations where we are in the position of Controller, unless otherwise stated in the text of the policy. Please note that this Personal Data Processing Policy applies to the Processing of Personal Data of our Users, not their customers and other data subjects.",
    privacy_section_3_controller_title: `1. ${site.name.toUpperCase()} AS CONTROLLER`,
    privacy_section_3_controller_when: `When is ${site.name} a Controller? In relation to Users, we are the Controller of Personal Data. You have entrusted us with certain information about yourself (e.g., your name and email). An overview of the Personal Data processed, including the reasons for their processing, can be found below. If anything is unclear, please do not hesitate to contact us by email at ${site.email}.`,
    privacy_section_3_controller_processors: "Additional Processors. In order to provide you with our Service at the highest quality, we use other entities for this purpose. We have concluded the necessary contracts with all of them and require the highest possible level of protection and security of Personal Data. You can find all our processors in Section 8 of this policy.",
    privacy_section_3_processor_title: `2. ${site.name.toUpperCase()} AS PROCESSOR`,
    privacy_section_3_processor_when: `When is ${site.name} in the position of a processor? We provide a Service whose purpose is communication with and assistance to your customers through an AI assistant. In relation to your customers, we may be in the position of a processor of Personal Data. If we process their Personal Data, we do so on your behalf only as a processor, in accordance with your instructions (i.e., the User's instructions). The protection of personal data and the rights and obligations arising therefrom are, in this case, governed by the Data Processing Agreement (DPA).`,
    privacy_section_3_processor_info: `If you are a customer or other data subject whose Personal Data is processed by one of our Users, we recommend that you carefully read their documentation regarding the Processing of Personal Data. There you should find out how this customer collects and uses information about you. If our User has provided us with your Personal Data and you wish to exercise all rights, please contact the relevant User directly. Our employees have limited access to your Personal Data. If you nevertheless wish to submit your request regarding the exercise of rights concerning your Personal Data directly to ${site.name}, please also include the name of our User. We will forward your request to this customer as soon as possible.`,
    privacy_section_3_subprocessors: "Sub-processors. As part of providing Services, we use other entities. If we find ourselves in the position of a processor of Personal Data, we may use additional sub-processors in accordance with the Data Processing Agreement (DPA). We and our sub-processors have very limited access to your data that you store in the system, i.e., your clients' data; nevertheless, we ensure that our sub-processors are bound to ensure the protection of Personal Data at the same level that we provide.",
    privacy_section_4_title: "4. WHAT PERSONAL DATA DO WE PROCESS ABOUT YOU?",
    privacy_section_4_how: "How do we process Personal Data? We process your Personal Data only to the extent necessary to achieve the purpose for which the data was collected, and we comply with security, technical, and organizational rules during their processing. The Processing of Personal Data is automated, but we do not carry out profiling. The specific purposes of data processing and the categories of personal data that we process for individual purposes are described in the following section.",
    privacy_section_4_data_list: "-> Name and surname, possibly date of birth (Company Registration No.) and address\n-> Contact details (especially email, phone number) and other data you voluntarily provide in your user interface\n-> Data in a query submitted by a customer or another person\n-> Use of AI assistant (especially data filled in by the User during trial use of AI assistant, registration time, date of last profile update)\n-> Billing data and bank details (data necessary for accounting and payment processing)\n-> Information you provide to us in the course of communication with us (especially your questions and answers to your inquiries, communication with you)\n-> Comments you add to our posts on social networks (especially Facebook, LinkedIn), as well as the name (nickname) of your profile on these social networks and publicly accessible information on your profiles\n-> Cookies and IP address, activity data (including information about your device or operating system)\n-> Operational data mainly indicating the occurrence of an AI Assistant error state (time and address of the error incident)",
    privacy_section_4_special: "Special Category of Personal Data. We do not process any Personal Data that constitutes a Special Category of Personal Data under GDPR, i.e., Personal Data of a sensitive nature about you.",
    privacy_section_5_title: "5. IN WHAT CASES DO WE PROCESS PERSONAL DATA AND HOW?",
    privacy_section_5_intro: "We process your Personal Data if you are a user of our website or our customer. We process your Personal Data only for the necessary period, but its length may vary depending on the applicable legal regulations in the place where we provide our Services to you. Information about the duration of processing is therefore only indicative.",
    privacy_section_5_website_title: "1. USERS OF OUR WEBSITE",
    privacy_section_5_website_intro: "If you visit our website, we process your Personal Data for the purposes stated in this table.",
    privacy_table_why: "Why?",
    privacy_table_what: "What data?",
    privacy_table_how: "How?",
    privacy_table_how_long: "How long?",
    privacy_website_visit_why: "Website visit. Ensuring the basic functions of our website, analytics, improving our services, and our promotion. You can set your preferences in the cookie bar. The legal basis for Processing Personal Data is consent (analytics, marketing cookies) or our legitimate interest (necessary cookies).",
    privacy_website_visit_what: "Information about when and how you visit and browse our website. If you visit our website via mobile phone, we may also process data about your phone.",
    privacy_website_visit_how: "Cookies or other technologies for tracking User behavior.",
    privacy_website_visit_duration: "The duration of processing varies according to the different types of cookies. Some process data only for the duration of the session (visit), some for a longer period.",
    privacy_inquiry_why: "Sending an inquiry. You can contact us at any time with your questions and we will answer them. You can contact us through the contact form on our website or by email. By sending an inquiry, you also express consent to the Processing of Personal Data.",
    privacy_inquiry_what: "Name, surname, email, phone, other Personal Data you provide to us.",
    privacy_inquiry_how: "In order to process your inquiry, we process the Personal Data that is necessary to handle it. Communication takes place by phone, email, or directly on our website.",
    privacy_inquiry_duration: "Closed inquiries are regularly deleted, but no later than 3.5 years from the date the inquiry was made.",
    privacy_newsletter_why: "Sending Commercial Communications (direct marketing). You have subscribed to our newsletter and thereby consented to processing. If you no longer wish to receive it, you can unsubscribe in the email footer.",
    privacy_newsletter_what: "Name, surname, phone number, and email.",
    privacy_newsletter_how: "We send a newsletter informing you about our Services and news.",
    privacy_newsletter_duration: "Data is processed for 2 years from the last active viewing of the newsletter, unless you unsubscribe earlier.",
    privacy_webinar_why: "Webinar or educational event. We organize webinars or educational events. We process your Personal Data that you fill in the order form or otherwise provide when registering.",
    privacy_webinar_what: "Email, name and surname. You may share some Personal Data with us during the webinar or event. Please note that we may record video or take photographs at some of these events.",
    privacy_webinar_how: "You register for the webinar or event by filling out a form or by email. We will then contact you with further necessary information.",
    privacy_webinar_duration: "Data is processed for 6 months from the webinar or event, unless you have given us consent to send Commercial Communications.",
    privacy_social_why: "Blog, social networks, competitions, and other promotional activities. Please note that any information you post in a comment on our blog can be viewed by anyone. On our website or through social networks, we may conduct surveys, organize competitions, or other promotional activities, including lottery-style competitions. By participating in a competition, you also consent to receiving commercial communications.",
    privacy_social_what: "Name and surname, address, date of birth, phone number, email address, username, and similar data.",
    privacy_social_how: "All information, communications, or materials provided through the social media platform are also provided in accordance with the privacy policies of these platforms.",
    privacy_social_duration: "We leave your comments on the post for as long as it is published on our profile, unless you ask us earlier to delete your comment on our blog. In the case of competitions, data is processed for 2 years from the end of the competition, unless you withdraw your consent earlier.",
    privacy_section_5_customers_title: "2. CUSTOMERS",
    privacy_section_5_customers_intro: "If you decide to use our Services, you will use one of the versions of our AI assistants under the Contract. In order for the cooperation to proceed, we process certain Personal Data about you.",
    privacy_contract_why: "Concluding a Contract. In order to start using the Service in full, you must first conclude a Contract with us. We process such data based on the data you provide for the performance of the Contract.",
    privacy_contract_what: "To conclude a Contract, we will need your name, surname, and email address, possibly other data.",
    privacy_contract_how: "You provide us with this data as part of our communication for the purpose of signing the Contract.",
    privacy_contract_duration: "Data is processed for the duration of the Contract and subsequently for 3.5 years from the termination of the Contract.",
    privacy_service_why: "AI Assistant Service. We may receive information about how and when you use the AI assistant; we also process data related to its security. We process Personal Data for the purpose of Contract performance and legitimate interest in improving Services.",
    privacy_service_what: "Name, surname, address, date of birth (Company Registration No.), phone number, email, job position, possibly IP address, and other data necessary for the provision.",
    privacy_service_how: "We may store the information obtained as part of the Contract and the provision of Services.",
    privacy_service_duration: "For the duration of the contractual relationship with us and subsequently 3.5 years after its termination.",
    privacy_accounting_why: "Accounting. We receive remuneration for providing Services and issue you accounting and tax documents, which we subsequently archive and further work with for the purposes of proper accounting and fulfilling legal obligations.",
    privacy_accounting_what: "Data on the invoice - name, surname, email address, billing address, or other User identification and details of performance under the Contract.",
    privacy_accounting_how: "After filling in the payment information in the profile, we will save this data to create an invoice.",
    privacy_accounting_duration: "We have a legal obligation to archive or retain the relevant document; the period depends on what the law requires (3-10 years).",
    privacy_customer_marketing_why: "Direct marketing, sending Commercial Communications. For our Users, we may send newsletters based on a legitimate interest in improving and promoting our Services or to those who have consented to sending.",
    privacy_customer_marketing_what: "Name, surname, phone number, and email.",
    privacy_customer_marketing_how: "We send a newsletter informing you about our Services and news.",
    privacy_customer_marketing_duration: "Data is processed for 2 years from the last active viewing of the newsletter, unless you unsubscribe earlier.",
    privacy_section_5_applicants_title: "3. JOB APPLICANTS",
    privacy_section_5_applicants_intro: `This section is relevant to you if you want to work directly at ${site.name}.`,
    privacy_job_why: "Job postings. On our website in the careers section, where you can find currently available positions.",
    privacy_job_what: "This is data you provide in your submitted CV. Name and surname, address, date of birth, phone number, email address, possibly a link to social networks, information about previous employment, education, interests, skills, certifications.",
    privacy_job_how: "We will review the materials you have submitted containing Personal Data and contact you based on them.",
    privacy_job_duration: "Based on the consent granted, we may retain the Personal Data of job applicants for a period of 2 years. The reason is that we may have an interesting job offer for you later.",
    privacy_section_6_title: "6. ON WHAT BASIS DO WE PROCESS YOUR PERSONAL DATA?",
    privacy_section_6_intro: "Lawfulness of processing. We obtain and process all Personal Data lawfully. We process Personal Data:",
    privacy_section_6_list: "on the basis of your consent (e.g., when you voluntarily subscribe to our newsletter),\nfor the purpose of performing a Contract (so that we can start providing you with our Services),\nfor the purpose of fulfilling a legal obligation (e.g., in the case of supervision by a regulatory authority), and\non the basis of our legitimate interest (e.g., if you are our customer, so that we can inform you about what is new with us).",
    privacy_section_6_note: "If we provide you with the Service outside the European Economic Area (EEA), the legal bases for Processing Personal Data may differ.",
    privacy_section_7_title: "7. WHO ARE OUR PROCESSORS?",
    privacy_section_7_intro: "Processors. We use only vetted Processors with whom we have a written contract and who provide us with at least the same guarantees as we provide to you. The data that Processors may process, including their purpose and legal basis for processing, are stated above. We use these Processors in the capacity of Controller, which means they do not process data that you enter into the system as part of using the Service.",
    privacy_processors_website: "Website operation",
    privacy_processors_analytics: "Standard website traffic analysis",
    privacy_processors_service: "Service provision",
    privacy_processors_payment: "Payment and accounting",
    privacy_processors_support: "Customer support communication, inquiry handling",
    privacy_processors_marketing: "Marketing",
    privacy_processors_social: "Social networks",
    privacy_section_7_legal: "Legal obligations. In addition to the above-mentioned Processors, we may transfer Personal Data to third parties if required by law or in response to legal requests from public authorities or at the request of a court in legal disputes.",
    privacy_section_8_title: "8. WHAT MEASURES HAVE WE TAKEN TO PROTECT YOUR PERSONAL DATA?",
    privacy_section_8_intro: "Our customers can influence the scope of processing within the provision of the Service through their own cooperation settings with us.",
    privacy_section_8_technical: "Technical measures. Security is very important to us, which is why we continuously work to ensure that your Personal Data is protected. When choosing measures, we take into account the scope of processing, the risk of processing, and the state of our technology.",
    privacy_section_8_technical_list: "We regularly back up data;\nwe update antivirus software systems;\nwe encrypt data using SSL/TLS (\"secure sockets layer / transport layer security\") for all data transfers;\nwe use a secure https protocol;\nwe develop technology with regard to personal data protection (privacy by design);\naccess passwords to information systems (where Personal Data will be processed) and access authorizations are controlled at the individual level.",
    privacy_section_8_organizational: "Organizational measures. We have adopted and undertake to comply with the following measures:",
    privacy_section_8_organizational_list: "Our employees and our service providers are bound by confidentiality;\nOur employees are properly trained and also regularly trained on GDPR and familiar with the rules of safe work on work devices;\nAccess to all systems, including the information system, is personalized and protected by secure passwords.",
    privacy_section_9_title: "9. WHAT ARE YOUR RIGHTS?",
    privacy_section_9_contact: `Where to contact us? Write to us at ${site.email}, or at our registered office address.`,
    privacy_section_9_timing: "When will we respond? We will respond to you within one month at the latest. If providing the information would endanger the privacy of other persons, or if providing it would be disproportionate to the risks or costs of providing it, we may not be able to comply with your request. In order to better process your request, we may need to verify your identity. In the case of a repeated request, the Controller will be entitled to charge a reasonable fee for a copy of the Personal Data.",
    privacy_right_access: "Right of access",
    privacy_right_access_desc: "We will confirm whether we process your Personal Data. You have the right to information about the purposes of processing, categories of personal data, recipients to whom they are disclosed, and the duration of processing. You have the right to know whether any right has already been exercised. The prerequisite is also that the rights and freedoms of other persons are not adversely affected, including a copy of the Personal Data.",
    privacy_right_rectification: "Right to rectification",
    privacy_right_rectification_desc: "You have the right to request the correction of inaccurate personal data. You can correct some data in your user profile.",
    privacy_right_erasure: "Right to erasure",
    privacy_right_erasure_desc: "If there is no other reason to continue processing this data, we will delete or anonymize the data you have requested.",
    privacy_right_restriction: "Right to restriction of processing",
    privacy_right_restriction_desc: "Please contact us if you believe we are processing your data incorrectly. Whether it concerns the reasons for processing or its scope.",
    privacy_right_notification: "Right to notification of rectification, erasure, or restriction of processing",
    privacy_right_notification_desc: "If you contact us with a request, we will inform you of the result. Sometimes it may happen that we will not be able to comply (e.g., the email address from which you wrote to us no longer works).",
    privacy_right_portability: "Right to data portability",
    privacy_right_portability_desc: "Your Personal Data that you have provided to us in a structured and machine-readable format, we will provide to another controller upon your request.",
    privacy_right_objection: "Right to object",
    privacy_right_objection_desc: "If we process your data on the basis of a legitimate interest (e.g., sending newsletters to Users). It is up to us to demonstrate our legitimate interest. If your objection is justified, we will stop Processing your Personal Data.",
    privacy_right_withdraw: "Right to withdraw consent",
    privacy_right_withdraw_desc: "If you have changed your mind, please let us know. Processing for marketing and commercial purposes can be withdrawn at any time.",
    privacy_right_automated: "Automated individual decision-making including profiling",
    privacy_right_automated_desc: "Do you not want decisions to be made about you by a computer? We respect your right, which is why we do not carry out profiling. We provide a Service; your Personal Data may be processed automatically.",
    privacy_section_10_title: "10. CONCLUSION",
    privacy_section_10_text: "This Personal Data Processing Policy may only be amended in writing. You will be informed of this through our website. Please check this policy regularly. By continuing to use our Service, you agree to changes to this policy.",
    privacy_section_10_contact: `If you have any questions regarding our Personal Data Processing Policy, please contact us by email at ${site.email}.`,
    privacy_section_10_complaint: "If you are dissatisfied, you may at any time file a complaint with the Office for Personal Data Protection, with its registered office at Pplk. Sochora 727/27, 170 00 Prague 7 - Holesovice (more at https://www.uoou.cz/), or another personal data protection authority located in your place of habitual residence.",
    privacy_effective_date: "This Personal Data Protection Policy is effective as of March 20, 2025.",
  },
};
