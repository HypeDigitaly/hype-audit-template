import type { Language } from './types';
import { site } from '../../config/site';

export interface BlogKeys {
  // Blog
  blog_title: string;
  blog_headline_1: string;
  blog_headline_2: string;
  blog_desc: string;
  blog_all_posts: string;
  blog_category_all: string;
  blog_category_success_story: string;
  blog_category_tutorial: string;
  blog_read_more: string;
  blog_read_full_study: string;
  blog_back_to_blog: string;
  blog_published: string;
  blog_read_time: string;
  blog_minutes: string;
  blog_author: string;
  blog_tags: string;
  blog_related_clients: string;
  blog_share: string;
  blog_no_posts: string;
  blog_featured: string;

  // Testimonials
  testimonials_tag: string;
  testimonials_label: string;
  testimonials_headline_1: string;
  testimonials_headline_2: string;
  testimonial_1_quote: string;
  testimonial_1_role: string;
  testimonial_2_quote: string;
  testimonial_2_role: string;
  testimonial_2_impact: string;
  testimonial_3_quote: string;
  testimonial_3_role: string;
  testimonial_3_impact: string;
  testimonial_4_quote: string;
  testimonial_4_role: string;
  testimonial_4_impact: string;

  // Case Studies
  cases_tag: string;
  cases_label: string;
  cases_headline_1: string;
  cases_headline_2: string;
  cases_featured: string;
  cases_featured_title: string;
  cases_featured_desc: string;
  cases_metric_1: string;
  cases_metric_2: string;
  cases_metric_3: string;
  cases_metric_4: string;

  // About
  about_tag: string;
  about_label: string;
  about_headline_1: string;
  about_headline_2: string;
  about_badge: string;
  about_headline: string;
  about_desc_1: string;
  about_desc_2: string;
  about_cta: string;

  // Tech Stack
  tech_title: string;
  tech_subtitle: string;

  // YouTube
  youtube_label: string;
}

export const blogTranslations: Record<Language, BlogKeys> = {
  cs: {
    // Blog
    blog_title: `Blog | ${site.name}`,
    blog_headline_1: "Případové studie",
    blog_headline_2: "a návody",
    blog_desc: "Reálné výsledky z našich projektů a praktické návody pro práci s AI.",
    blog_all_posts: "Všechny články",
    blog_category_all: "Vše",
    blog_category_success_story: "Případové studie",
    blog_category_tutorial: "Návody",
    blog_read_more: "Číst více",
    blog_read_full_study: "Přečíst celou studii",
    blog_back_to_blog: "Zpět na blog",
    blog_published: "Publikováno",
    blog_read_time: "Doba čtení",
    blog_minutes: "min",
    blog_author: "Autor",
    blog_tags: "Štítky",
    blog_related_clients: "Spolupracující klienti",
    blog_share: "Sdílet",
    blog_no_posts: "Žádné články v této kategorii.",
    blog_featured: "Doporučený článek",

    // Testimonials
    testimonials_tag: "// REFERENCE",
    testimonials_label: "GOOGLE REVIEWS",
    testimonials_headline_1: "Co říkají",
    testimonials_headline_2: "vedoucí pracovníci krajů",
    testimonial_1_quote: "Chatbota používáme od června 2025 a musíme říci, že nás příjemně překvapil. Už zvládl zpracovat přes 9 500 zpráv. Nejvíc oceňujeme jeho interaktivní přístup — i když je dotaz položen nepřesně, chatbot se nezasekne.",
    testimonial_1_role: "Vedoucí odboru informatiky, Královéhradecký kraj",
    testimonial_2_quote: `S firmou ${site.name} jsem realizoval projekt AI ChatBot a musím ocenit hlavně vysokou profesionalitu, proaktivní přístup, nadstandardní pracovní nasazení a klientský přístup. Dále musím ocenit jejich know-how a rychlost nasazení.`,
    testimonial_2_role: "Vedoucí odboru digitalizace, Středočeský kraj",
    testimonial_2_impact: "Rychlé nasazení řešení",
    testimonial_3_quote: "Hledali jsme kvalitního, inovativního a zkušeného partnera pro implementaci AI chatbota. Vývoj probíhal na profesionální úrovni, výsledný produkt odpovídá našim požadavkům. Z avatara 'pan Jeřábek' se stal v naší organizaci pojem.",
    testimonial_3_role: "Vedoucí odboru informatiky, Kraj Vysočina",
    testimonial_3_impact: "Pan Jeřábek - stal se pojmem",
    testimonial_4_quote: `ÚK Bot od ${site.name} dokonale naplňuje vizi zefektivnění komunikace úřadu s veřejností. Nabízí 24/7 vícejazyčnou podporu s 91% přesností odpovědí. Služba se neustále zlepšuje, šetří čas i zdroje. Rozhodně doporučujeme.`,
    testimonial_4_role: "Vedoucí odboru informatiky, Ústecký kraj",
    testimonial_4_impact: "400+ ušetřených hodin/měsíc",

    // Case Studies
    cases_tag: "// PŘÍPADOVÉ STUDIE",
    cases_label: "REÁLNÉ VÝSLEDKY",
    cases_headline_1: "Měřitelné výsledky",
    cases_headline_2: "z 5 krajů ČR",
    cases_featured: "6měsíční komplexní analýza",
    cases_featured_title: "Případová studie: 5 krajů ČR (Leden - Červenec 2025)",
    cases_featured_desc: "Komplexní analýza výkonu AI chatbotů nasazených na webových stránkách 5 českých krajů. Data z reálného provozu ukazují konkrétní přínosy a ROI.",
    cases_metric_1: "AI odpovědí celkem",
    cases_metric_2: "Průměrná spokojenost",
    cases_metric_3: "Průměrná ROI",
    cases_metric_4: "Měsíců payback",

    // About
    about_tag: "// O NÁS",
    about_label: "PAVEL ČERMÁK",
    about_headline_1: "Postavíme váš AI projekt",
    about_headline_2: "na pevných základech",
    about_badge: "O nás",
    about_headline: `Za ${site.name} stojí tým expertů na AI`,
    about_desc_1: "Jsme první softwarová společnost v České republice, která úspěšně nasadila AI chatboty na webové stránky krajských úřadů. Naše řešení denně pomáhají tisícům občanů.",
    about_desc_2: "Věříme, že AI má potenciál transformovat způsob, jakým organizace komunikují se svými klienty. Proto jsme se zaměřili na vytváření řešení, která jsou nejen technologicky vyspělá, ale také praktická a snadno použitelná.",
    about_cta: "Bezplatná konzultace zdarma",

    // Tech Stack
    tech_title: "Technologie, které používáme",
    tech_subtitle: "Propojujeme špičkové AI modely, automatizační platformy a komunikační nástroje do jednotného ekosystému",

    // YouTube
    youtube_label: "Sledujte na YouTube",
  },
  en: {
    // Blog
    blog_title: `Blog | ${site.name}`,
    blog_headline_1: "Case Studies",
    blog_headline_2: "and Tutorials",
    blog_desc: "Real results from our projects and practical guides for working with AI.",
    blog_all_posts: "All articles",
    blog_category_all: "All",
    blog_category_success_story: "Case Studies",
    blog_category_tutorial: "Tutorials",
    blog_read_more: "Read more",
    blog_read_full_study: "Read full study",
    blog_back_to_blog: "Back to blog",
    blog_published: "Published",
    blog_read_time: "Read time",
    blog_minutes: "min",
    blog_author: "Author",
    blog_tags: "Tags",
    blog_related_clients: "Related clients",
    blog_share: "Share",
    blog_no_posts: "No articles in this category.",
    blog_featured: "Featured article",

    // Testimonials
    testimonials_tag: "// REFERENCES",
    testimonials_label: "GOOGLE REVIEWS",
    testimonials_headline_1: "What regional",
    testimonials_headline_2: "executives say",
    testimonial_1_quote: "We've been using the chatbot since June 2025 and we must say it pleasantly surprised us. It has already processed over 9,500 messages. We most appreciate its interactive approach — even when a question is asked imprecisely, the chatbot doesn't get stuck.",
    testimonial_1_role: "Head of IT Department, Hradec Králové Region",
    testimonial_2_quote: `I implemented the AI ChatBot project with ${site.name} and must appreciate their high professionalism, proactive approach, exceptional work commitment and client-oriented attitude. I also have to commend their know-how and deployment speed.`,
    testimonial_2_role: "Head of Digitalization, Central Bohemian Region",
    testimonial_2_impact: "Fast solution deployment",
    testimonial_3_quote: "We were looking for a quality, innovative and experienced partner for AI chatbot implementation. Development proceeded at a professional level, the final product meets our requirements. The avatar 'Mr. Jeřábek' has become a concept in our organization.",
    testimonial_3_role: "Head of IT Department, Vysočina Region",
    testimonial_3_impact: "Mr. Jeřábek - became a concept",
    testimonial_4_quote: `The ÚK Bot from ${site.name} perfectly fulfills the vision of streamlining communication between the office and the public. It offers 24/7 multilingual support with 91% response accuracy. The service is constantly improving, saving time and resources. We definitely recommend.`,
    testimonial_4_role: "Head of IT Department, Ústí Region",
    testimonial_4_impact: "400+ hours saved/month",

    // Case Studies
    cases_tag: "// CASE STUDIES",
    cases_label: "REAL RESULTS",
    cases_headline_1: "Measurable results",
    cases_headline_2: "from 5 Czech regions",
    cases_featured: "6-month comprehensive analysis",
    cases_featured_title: "Case Study: 5 Czech Regions (January - July 2025)",
    cases_featured_desc: "Comprehensive performance analysis of AI chatbots deployed on websites of 5 Czech regions. Real operational data showing concrete benefits and ROI.",
    cases_metric_1: "Total AI responses",
    cases_metric_2: "Average satisfaction",
    cases_metric_3: "Average ROI",
    cases_metric_4: "Months payback",

    // About
    about_tag: "// ABOUT US",
    about_label: "PAVEL ČERMÁK",
    about_headline_1: "We'll build your AI project",
    about_headline_2: "on solid foundations",
    about_badge: "About us",
    about_headline: `The team of AI experts behind ${site.name}`,
    about_desc_1: `I'm Pavel Čermák, founder of ${site.name} and a pioneer of AI chatbots in Czech public administration. Since 2022, I've been implementing AI solutions for businesses and government institutions.`,
    about_desc_2: "As the first in the Czech Republic, I deployed AI assistants on regional websites - today they help citizens of 5 regions with over 35,000 answered questions. My goal is to democratize access to AI technologies.",
    about_cta: "Free consultation",

    // Tech Stack
    tech_title: "Technologies we use",
    tech_subtitle: "We integrate cutting-edge AI models, automation platforms, and communication tools into a unified ecosystem",

    // YouTube
    youtube_label: "Watch on YouTube",
  },
};
