// =============================================================================
// NICHE EXAMPLES - Show-and-tell examples for LLM prompt personalization
// =============================================================================

export interface NicheExample {
  nicheId: string;
  nicheLabel: { cs: string; en: string };
  parentCategory: 'A' | 'B' | 'C' | 'D' | 'E';

  companyContextExample: {
    bad: { cs: string; en: string };
    good: { cs: string; en: string };
  };

  opportunityDescriptionExample: {
    bad: { cs: string; en: string };
    good: { cs: string; en: string };
  };

  introTextExample: {
    cs: string;
    en: string;
  };

  industryTerms: { cs: string[]; en: string[] };
  emotionalTriggers: { cs: string[]; en: string[] };
}

// =============================================================================
// NICHE EXAMPLES LIBRARY
// =============================================================================

export const NICHE_EXAMPLES: NicheExample[] = [
  // ==========================================================================
  // CATEGORY A: CLIENT ACQUISITION BUSINESSES
  // ==========================================================================
  {
    nicheId: 'community_membership',
    nicheLabel: { cs: 'Komunita / Membership klub', en: 'Community / Membership Club' },
    parentCategory: 'A',
    companyContextExample: {
      bad: {
        cs: 'Growth Club je podnikatelská komunita v Praze. Nabízí členství a networking.',
        en: 'Growth Club is a business community in Prague. It offers membership and networking.'
      },
      good: {
        cs: 'Growth Club Praha patří mezi dynamicky rostoucí podnikatelské komunity, která vsází na exkluzivitu a kvalitu členské základny. Z vašich aktivit na LinkedInu a referencí je zřejmé, že členové oceňují osobní přístup a kvalitu akcí. Právě tento osobní přístup lze s pomocí AI ještě posílit - automatizací rutinních úkolů získáte více času na to, co děláte nejlépe: budování vztahů.',
        en: 'Growth Club Prague is among the dynamically growing business communities, banking on exclusivity and quality of membership base. Your LinkedIn activities and references show that members appreciate the personal approach and quality of events. This personal approach can be further enhanced with AI - by automating routine tasks, you gain more time for what you do best: building relationships.'
      }
    },
    opportunityDescriptionExample: {
      bad: {
        cs: 'AI chatbot pro odpovídání na dotazy členů 24/7.',
        en: 'AI chatbot for answering member questions 24/7.'
      },
      good: {
        cs: 'Představte si, že je pátek večer a potenciální člen má dotaz ohledně členství v Growth Clubu. Dnes by musel čekat do pondělí na odpověď - a mezitím možná najde jinou komunitu. S AI asistentem natrénovaným na vašich FAQ, pravidlech a výhodách členství dostane odpověď okamžitě, může si rovnou zarezervovat úvodní schůzku a vy v pondělí ráno najdete nového zájemce v kalendáři. Pro Growth Club to znamená, že žádná příležitost neunikne jen proto, že byl víkend nebo svátek.',
        en: 'Imagine it\'s Friday evening and a potential member has a question about Growth Club membership. Today, they would have to wait until Monday for an answer - and in the meantime, they might find another community. With an AI assistant trained on your FAQs, rules, and membership benefits, they get an answer immediately, can book an intro meeting right away, and you find a new prospect in your calendar on Monday morning. For Growth Club, this means no opportunity slips away just because it was a weekend or holiday.'
      }
    },
    introTextExample: {
      cs: 'Implementace AI v Growth Clubu není o nahrazení lidského kontaktu, ale o jeho posílení. Odstraněním administrativní zátěže získáte více prostoru pro budování vztahů, zatímco chytré nástroje zajistí, že se členové budou cítit opečovávaní 24/7. Na základě naší analýzy vidíme příležitosti v automatizaci komunikace, získávání nových členů a zvýšení jejich zapojení.',
      en: 'Implementing AI at Growth Club isn\'t about replacing human contact, but enhancing it. By removing administrative burden, you\'ll gain more space for building relationships, while smart tools ensure members feel cared for 24/7. Based on our analysis, we see opportunities in communication automation, acquiring new members, and increasing their engagement.'
    },
    industryTerms: {
      cs: ['členství', 'členové', 'komunita', 'networking', 'akce', 'mastermindy', 'onboarding', 'retence'],
      en: ['membership', 'members', 'community', 'networking', 'events', 'masterminds', 'onboarding', 'retention']
    },
    emotionalTriggers: {
      cs: ['Váš čas patří členům, ne administrativě', 'Zatímco spíte, AI získává nové členy', 'Žádný dotaz nezůstane bez odpovědi'],
      en: ['Your time belongs to members, not admin', 'While you sleep, AI acquires new members', 'No question goes unanswered']
    }
  },

  // ==========================================================================
  // CATEGORY B: CUSTOMER SERVICE BUSINESSES
  // ==========================================================================
  {
    nicheId: 'fitness_studio',
    nicheLabel: { cs: 'Fitness studio / Posilovna', en: 'Fitness Studio / Gym' },
    parentCategory: 'B',
    companyContextExample: {
      bad: {
        cs: 'FitLife je fitness studio v Praze, které nabízí cvičení a lekce.',
        en: 'FitLife is a fitness studio in Prague that offers workouts and classes.'
      },
      good: {
        cs: 'FitLife Praha patří mezi dynamicky rostoucí fitness studia v Praze 5, která vsází na osobní přístup a komunitní atmosféru. Z vašich Google recenzí (4.8/5) je zřejmé, že klienti oceňují právě váš individuální přístup - to je silná konkurenční výhoda, kterou lze AI ještě posílit. Vaše nedávná expanze naznačuje, že řešíte kapacitní výzvy, kde AI rezervační systém může uvolnit ruce vašemu týmu.',
        en: 'FitLife Prague is among the dynamically growing fitness studios in Prague 5, banking on personal approach and community atmosphere. Your Google reviews (4.8/5) clearly show clients appreciate your individual approach - this is a strong competitive advantage that AI can amplify. Your recent expansion suggests you\'re tackling capacity challenges where an AI booking system can free your team\'s hands.'
      }
    },
    opportunityDescriptionExample: {
      bad: {
        cs: 'AI rezervační systém pro automatizaci rezervací.',
        en: 'AI booking system for automating reservations.'
      },
      good: {
        cs: 'Představte si, že o půlnoci si Jan z Facebooku chce zarezervovat svou první lekci CrossFit. Dnes napíše zprávu a čeká do rána. S AI recepční natrénovanou na vašich lekcích, trenérech a pravidlech studia si Jan zarezervuje termín ihned, dostane odkaz do kalendáře a třeba i tip, že před první lekcí je dobré přijít 15 minut předem. Ráno najdete v systému nového člena - bez jediné minuty vaší práce. Pro FitLife to znamená, že každý zájemce se stane členem v momentě, kdy má motivaci nejvyšší.',
        en: 'Imagine it\'s midnight and Jan from Facebook wants to book his first CrossFit class. Today, he sends a message and waits until morning. With an AI receptionist trained on your classes, trainers, and studio rules, Jan books a slot immediately, gets a calendar link, and maybe even a tip that it\'s good to arrive 15 minutes early for the first class. In the morning, you find a new member in the system - without a single minute of your work. For FitLife, this means every prospect becomes a member at the moment their motivation is highest.'
      }
    },
    introTextExample: {
      cs: 'AI může proměnit FitLife v studio, které nikdy nespí. Automatizace rezervací a odpovědí na dotazy vám ušetří hodiny týdně, zatímco personalizované připomínky a follow-upy zvýší účast na lekcích. Vidíme příležitosti v automatizaci recepce, získávání nových členů z sociálních sítí a snížení no-shows díky chytrým připomínkám.',
      en: 'AI can transform FitLife into a studio that never sleeps. Automating bookings and answering questions will save you hours weekly, while personalized reminders and follow-ups increase class attendance. We see opportunities in reception automation, acquiring new members from social media, and reducing no-shows through smart reminders.'
    },
    industryTerms: {
      cs: ['lekce', 'trenér', 'permanentka', 'rozvrh', 'kapacita', 'studio', 'recepce', 'členství'],
      en: ['classes', 'trainer', 'membership pass', 'schedule', 'capacity', 'studio', 'reception', 'membership']
    },
    emotionalTriggers: {
      cs: ['Váš čas patří klientům, ne telefonu', 'Žádný zájemce neunikne', 'Trenéři trénují, AI řeší admin'],
      en: ['Your time belongs to clients, not the phone', 'No prospect escapes', 'Trainers train, AI handles admin']
    }
  },
  {
    nicheId: 'beauty_salon',
    nicheLabel: { cs: 'Kadeřnictví / Kosmetický salon', en: 'Hair Salon / Beauty Salon' },
    parentCategory: 'B',
    companyContextExample: {
      bad: {
        cs: 'Beauty Studio je kosmetický salon nabízející služby péče o pleť a vlasy.',
        en: 'Beauty Studio is a beauty salon offering skin and hair care services.'
      },
      good: {
        cs: 'Beauty Studio Praha 2 si za 5 let vybudovalo věrnou klientelu díky kvalitě služeb a osobnímu přístupu. Vaše recenze na Googlu (4.9/5) a aktivní Instagram s 3000+ sledujícími ukazují, že klientky oceňují nejen výsledky, ale i atmosféru salonu. Právě tento osobní touch lze s AI posílit - automatizací rezervací a připomínek získáte více času na to, co děláte nejlépe.',
        en: 'Beauty Studio Prague 2 has built a loyal clientele over 5 years thanks to service quality and personal approach. Your Google reviews (4.9/5) and active Instagram with 3000+ followers show that clients appreciate not just results, but also the salon atmosphere. This personal touch can be enhanced with AI - by automating bookings and reminders, you gain more time for what you do best.'
      }
    },
    opportunityDescriptionExample: {
      bad: {
        cs: 'AI chatbot pro rezervace a dotazy klientek.',
        en: 'AI chatbot for bookings and client inquiries.'
      },
      good: {
        cs: 'Představte si, že Petra v 22:00 scrolluje Instagramem a uvidí váš post s novou technikou balayage. Dnes by musela čekat do rána, aby zavolala. S AI asistentem napíše na Instagram nebo WhatsApp, okamžitě vidí volné termíny, vybere si svou oblíbenou kadeřnici Lucii a zarezervuje si termín - vše za 2 minuty. Ráno najdete v kalendáři novou rezervaci. Pro Beauty Studio to znamená, že inspirace z Instagramu se okamžitě přemění na objednávku.',
        en: 'Imagine Petra at 10 PM scrolling Instagram and seeing your post with a new balayage technique. Today, she would have to wait until morning to call. With an AI assistant, she messages on Instagram or WhatsApp, immediately sees available slots, picks her favorite stylist Lucia, and books an appointment - all in 2 minutes. In the morning, you find a new booking in the calendar. For Beauty Studio, this means inspiration from Instagram instantly converts to a booking.'
      }
    },
    introTextExample: {
      cs: 'AI může z Beauty Studia udělat salon, který nikdy nespí a vždy má čas na klientky. Automatizace rezervací přes Instagram a WhatsApp, chytré připomínky termínů a personalizované nabídky na základě historie návštěv. Vidíme příležitosti v automatizaci komunikace, snížení zmeškaných termínů a zvýšení opakovaných návštěv.',
      en: 'AI can turn Beauty Studio into a salon that never sleeps and always has time for clients. Automating bookings via Instagram and WhatsApp, smart appointment reminders, and personalized offers based on visit history. We see opportunities in communication automation, reducing missed appointments, and increasing repeat visits.'
    },
    industryTerms: {
      cs: ['termín', 'kadeřnice', 'kosmetička', 'ošetření', 'balíček', 'dárková poukázka', 'recenze'],
      en: ['appointment', 'stylist', 'beautician', 'treatment', 'package', 'gift voucher', 'reviews']
    },
    emotionalTriggers: {
      cs: ['Každá klientka se cítí VIP', 'Žádný termín se nezapomene', 'Instagram lajky se mění na rezervace'],
      en: ['Every client feels VIP', 'No appointment is forgotten', 'Instagram likes turn into bookings']
    }
  },
  {
    nicheId: 'ecommerce',
    nicheLabel: { cs: 'E-shop / Online obchod', en: 'E-commerce / Online Store' },
    parentCategory: 'B',
    companyContextExample: {
      bad: {
        cs: 'TechGadgets.cz je e-shop s elektronikou a gadgety.',
        en: 'TechGadgets.com is an e-shop with electronics and gadgets.'
      },
      good: {
        cs: 'TechGadgets.cz patří mezi rychle rostoucí e-shopy na českém trhu s elektronikou. Vaše široké portfolio 2000+ produktů a aktivní přítomnost na Heureka.cz ukazují, že máte silnou pozici. Zároveň konkurence sílí a zákazníci očekávají okamžité odpovědi - AI může být klíčem k udržení náskoku. Vidíme příležitosti v personalizaci, automatizaci podpory a snížení opuštěných košíků.',
        en: 'TechGadgets.com is among the fast-growing e-shops in the Czech electronics market. Your wide portfolio of 2000+ products and active presence on comparison sites shows you have a strong position. At the same time, competition is intensifying and customers expect instant answers - AI can be the key to maintaining your lead. We see opportunities in personalization, support automation, and reducing abandoned carts.'
      }
    },
    opportunityDescriptionExample: {
      bad: {
        cs: 'AI chatbot pro zákaznickou podporu e-shopu.',
        en: 'AI chatbot for e-shop customer support.'
      },
      good: {
        cs: 'Představte si, že Martin v neděli večer vybírá dárek pro syna a nemůže se rozhodnout mezi dvěma sluchátky. Dnes by napsal email a čekal do pondělí - a možná by mezitím koupil jinde. S AI produktovým poradcem položí dotaz na chatu, AI porovná parametry obou sluchátek, zeptá se na účel použití a doporučí tu správnou variantu. Martin nakoupí okamžitě. Pro TechGadgets to znamená, že neztratíte zákazníka jen proto, že je víkend.',
        en: 'Imagine Martin on Sunday evening choosing a gift for his son and can\'t decide between two headphones. Today, he would email and wait until Monday - and might buy elsewhere in the meantime. With an AI product advisor, he asks on chat, AI compares parameters of both headphones, asks about intended use, and recommends the right option. Martin buys immediately. For TechGadgets, this means you won\'t lose a customer just because it\'s the weekend.'
      }
    },
    introTextExample: {
      cs: 'AI může z TechGadgets.cz udělat e-shop, který prodává i ve spánku. Automatizace zákaznické podpory, personalizované doporučení produktů a chytré follow-upy opuštěných košíků. Odhadujeme příležitosti ve zvýšení konverze, snížení počtu opuštěných košíků a automatizaci rutinních dotazů, které dnes zabírají hodiny času.',
        en: 'AI can turn TechGadgets.com into an e-shop that sells even while you sleep. Automated customer support, personalized product recommendations, and smart abandoned cart follow-ups. We estimate opportunities in increasing conversion, reducing abandoned carts, and automating routine questions that currently take hours of time.'
    },
    industryTerms: {
      cs: ['konverze', 'košík', 'objednávka', 'doprava', 'reklamace', 'hodnocení', 'srovnávač'],
      en: ['conversion', 'cart', 'order', 'shipping', 'returns', 'reviews', 'comparison site']
    },
    emotionalTriggers: {
      cs: ['Prodávejte i když spíte', 'Žádný košík nezůstane opuštěný', 'Každý návštěvník dostane osobního poradce'],
      en: ['Sell while you sleep', 'No cart stays abandoned', 'Every visitor gets a personal advisor']
    }
  },

  // ==========================================================================
  // CATEGORY C: DOCUMENT/DATA BUSINESSES
  // ==========================================================================
  {
    nicheId: 'legal_firm',
    nicheLabel: { cs: 'Právní kancelář / Advokátní kancelář', en: 'Law Firm / Legal Practice' },
    parentCategory: 'C',
    companyContextExample: {
      bad: {
        cs: 'AK Novák je advokátní kancelář poskytující právní služby.',
        en: 'Law Firm Novak is a legal practice providing legal services.'
      },
      good: {
        cs: 'AK Novák & Partners patří mezi respektované kanceláře v oblasti obchodního práva s 15letou historií. Vaše specializace na M&A a korporátní právo vyžaduje práci s velkým množstvím dokumentů a due diligence analýz. Právě zde vidíme největší příležitosti pro AI - automatizace analýzy smluv a vyhledávání v právních databázích může vašim právníkům ušetřit hodiny rutinní práce.',
        en: 'Law Firm Novak & Partners is among respected practices in commercial law with 15 years of history. Your specialization in M&A and corporate law requires working with large volumes of documents and due diligence analyses. This is where we see the biggest opportunities for AI - automating contract analysis and legal database searches can save your lawyers hours of routine work.'
      }
    },
    opportunityDescriptionExample: {
      bad: {
        cs: 'AI nástroj pro analýzu právních dokumentů.',
        en: 'AI tool for legal document analysis.'
      },
      good: {
        cs: 'Představte si due diligence projektu s 500 smlouvami k analýze. Dnes by junior právník strávil týdny čtením a hledáním rizikových klauzulí. S AI právním asistentem natrénovaným na vašich checklistech a standardech nahrajete dokumenty, AI za hodiny identifikuje všechny problematické pasáže, chybějící náležitosti a nestandartní podmínky. Váš tým pak věnuje čas pouze reálným rizikům. Pro AK Novák to znamená více projektů ve stejném čase bez náboru dalších juniorů.',
        en: 'Imagine a due diligence project with 500 contracts to analyze. Today, a junior lawyer would spend weeks reading and searching for risk clauses. With an AI legal assistant trained on your checklists and standards, you upload documents, AI identifies all problematic passages, missing requirements, and non-standard conditions within hours. Your team then spends time only on real risks. For Law Firm Novak, this means more projects in the same time without hiring more juniors.'
      }
    },
    introTextExample: {
      cs: 'AI může z AK Novák udělat kancelář, která zvládne více projektů bez kompromisů na kvalitě. Automatizace analýzy smluv, vyhledávání v judikatuře a generování prvních návrhů dokumentů. Vidíme příležitosti v úspoře času juniorních právníků, snížení rizika přehlédnutí a možnosti přijmout více klientů.',
      en: 'AI can turn Law Firm Novak into a practice that handles more projects without compromising quality. Automating contract analysis, case law research, and generating first document drafts. We see opportunities in saving junior lawyers\' time, reducing oversight risk, and the ability to take on more clients.'
    },
    industryTerms: {
      cs: ['smlouva', 'due diligence', 'klauzule', 'judikatura', 'podání', 'klient', 'spis'],
      en: ['contract', 'due diligence', 'clause', 'case law', 'filing', 'client', 'case file']
    },
    emotionalTriggers: {
      cs: ['Právníci řeší právo, ne papírování', 'Žádná riziková klauzule neunikne', 'Více klientů, stejný tým'],
      en: ['Lawyers practice law, not paperwork', 'No risk clause escapes', 'More clients, same team']
    }
  },
  {
    nicheId: 'accounting_firm',
    nicheLabel: { cs: 'Účetní firma / Daňová kancelář', en: 'Accounting Firm / Tax Office' },
    parentCategory: 'C',
    companyContextExample: {
      bad: {
        cs: 'Účetnictví Procházka poskytuje účetní a daňové služby pro firmy.',
        en: 'Accounting Prochazka provides accounting and tax services for businesses.'
      },
      good: {
        cs: 'Účetnictví Procházka obsluhuje 120+ klientů s různou velikostí od OSVČ po střední firmy. Vaše kvalita služeb je zřejmá z dlouhodobých vztahů s klienty - někteří s vámi spolupracují přes 10 let. Zároveň víme, že období uzávěrek a daňových přiznání znamená extrémní vytížení. AI může pomoci právě s rutinními úkoly a dát vám prostor pro poradenství s vyšší přidanou hodnotou.',
        en: 'Accounting Prochazka serves 120+ clients of various sizes from freelancers to medium businesses. Your service quality is evident from long-term client relationships - some have been working with you for over 10 years. At the same time, we know that closing periods and tax filing seasons mean extreme workload. AI can help precisely with routine tasks and give you space for higher value-added consulting.'
      }
    },
    opportunityDescriptionExample: {
      bad: {
        cs: 'AI pro automatizaci zpracování faktur a dokladů.',
        en: 'AI for automating invoice and document processing.'
      },
      good: {
        cs: 'Představte si pondělní ráno s 50 novými fakturami od klientů v emailu. Dnes by asistentka strávila hodiny přepisováním do systému a párováním s bankovními výpisy. S AI účetním asistentem se faktury automaticky načtou, OCR rozpozná všechny údaje, systém je spáruje s pohyby na účtu a připraví k zaúčtování. Vaše asistentka jen zkontroluje a schválí. Pro Účetnictví Procházka to znamená, že uzávěrka už nebude noční můrou.',
        en: 'Imagine Monday morning with 50 new invoices from clients in email. Today, your assistant would spend hours transcribing into the system and matching with bank statements. With an AI accounting assistant, invoices are automatically loaded, OCR recognizes all data, the system matches them with account movements and prepares for booking. Your assistant just reviews and approves. For Accounting Prochazka, this means closing won\'t be a nightmare anymore.'
      }
    },
    introTextExample: {
      cs: 'AI může z Účetnictví Procházka udělat kancelář, kde rutina neubírá čas poradenství. Automatizace zpracování dokladů, chytré připomínky termínů a generování reportů jedním kliknutím. Vidíme příležitosti v úspoře času na rutině, snížení chybovosti a možnosti obsloužit více klientů bez náboru.',
      en: 'AI can turn Accounting Prochazka into a firm where routine doesn\'t take time from consulting. Automating document processing, smart deadline reminders, and one-click report generation. We see opportunities in saving time on routine, reducing errors, and serving more clients without hiring.'
    },
    industryTerms: {
      cs: ['faktura', 'doklad', 'uzávěrka', 'přiznání', 'DPH', 'mzdy', 'reporting'],
      en: ['invoice', 'receipt', 'closing', 'tax return', 'VAT', 'payroll', 'reporting']
    },
    emotionalTriggers: {
      cs: ['Uzávěrka bez stresu', 'Žádná faktura se neztratí', 'Více času na poradenství'],
      en: ['Closing without stress', 'No invoice gets lost', 'More time for consulting']
    }
  },

  // ==========================================================================
  // CATEGORY D: MANUFACTURING/OPERATIONS
  // ==========================================================================
  {
    nicheId: 'manufacturing',
    nicheLabel: { cs: 'Výrobní firma', en: 'Manufacturing Company' },
    parentCategory: 'D',
    companyContextExample: {
      bad: {
        cs: 'Strojírny Horák je výrobní firma zaměřená na kovoobrábění.',
        en: 'Horak Engineering is a manufacturing company focused on metalworking.'
      },
      good: {
        cs: 'Strojírny Horák s.r.o. patří mezi kvalitní české dodavatele přesných CNC dílů pro automobilový průmysl. Vaše ISO certifikace a dlouhodobé kontrakty s nadnárodními firmami dokazují vysokou kvalitu. Zároveň víme, že tlak na snižování nákladů a zkracování dodacích lhůt neustále roste. AI může pomoci s optimalizací výroby a prediktivní údržbou strojů.',
        en: 'Horak Engineering Ltd. is among quality Czech suppliers of precision CNC parts for the automotive industry. Your ISO certification and long-term contracts with multinational companies prove high quality. At the same time, we know that pressure to reduce costs and shorten delivery times is constantly growing. AI can help with production optimization and predictive machine maintenance.'
      }
    },
    opportunityDescriptionExample: {
      bad: {
        cs: 'AI systém pro prediktivní údržbu strojů.',
        en: 'AI system for predictive machine maintenance.'
      },
      good: {
        cs: 'Představte si, že váš CNC stroj za 3 miliony začne vykazovat jemné vibrace, které lidské ucho nezachytí. Dnes se o problému dozvíte, až stroj selže uprostřed zakázky - prostoje, zpoždění, penále. S AI monitoringem senzory zachytí anomálie týdny předem, systém naplánuje údržbu na víkend a vy vyrobíte zakázku včas. Pro Strojírny Horák to znamená konec neplánovaných prostojů a jistotu dodání.',
        en: 'Imagine your 3-million CNC machine starts showing subtle vibrations that human ears can\'t catch. Today, you learn about the problem when the machine fails in the middle of an order - downtime, delays, penalties. With AI monitoring, sensors detect anomalies weeks in advance, the system schedules maintenance for the weekend, and you deliver the order on time. For Horak Engineering, this means an end to unplanned downtime and delivery certainty.'
      }
    },
    introTextExample: {
      cs: 'AI může ze Strojíren Horák udělat továrnu, kde se problémy řeší dříve, než nastanou. Prediktivní údržba strojů, optimalizace výrobního plánu a automatická kontrola kvality. Vidíme příležitosti ve snížení prostojů, zvýšení využití strojů a eliminaci zmetků díky včasné detekci problémů.',
      en: 'AI can turn Horak Engineering into a factory where problems are solved before they occur. Predictive machine maintenance, production plan optimization, and automatic quality control. We see opportunities in reducing downtime, increasing machine utilization, and eliminating defects through early problem detection.'
    },
    industryTerms: {
      cs: ['výroba', 'stroj', 'údržba', 'prostoje', 'kvalita', 'zakázka', 'dodací lhůta'],
      en: ['production', 'machine', 'maintenance', 'downtime', 'quality', 'order', 'delivery time']
    },
    emotionalTriggers: {
      cs: ['Stroje běží, zakázky jedou', 'Konec neplánovaných prostojů', 'Kvalita bez kompromisů'],
      en: ['Machines run, orders flow', 'End of unplanned downtime', 'Quality without compromise']
    }
  },

  // ==========================================================================
  // CATEGORY E: CREATIVE/MARKETING
  // ==========================================================================
  {
    nicheId: 'marketing_agency',
    nicheLabel: { cs: 'Marketingová agentura', en: 'Marketing Agency' },
    parentCategory: 'E',
    companyContextExample: {
      bad: {
        cs: 'Digital Storm je marketingová agentura nabízející digitální marketing.',
        en: 'Digital Storm is a marketing agency offering digital marketing.'
      },
      good: {
        cs: 'Digital Storm Agency patří mezi dynamické české agentury specializující se na performance marketing a obsahovou strategii. Vaše portfolio klientů z e-commerce a SaaS segmentu ukazuje, že rozumíte datům a výsledkům. Zároveň víme, že tvorba obsahu a reportování zabírá obrovské množství času. AI může uvolnit kapacity pro strategii a kreativu.',
        en: 'Digital Storm Agency is among dynamic Czech agencies specializing in performance marketing and content strategy. Your client portfolio from e-commerce and SaaS segments shows you understand data and results. At the same time, we know that content creation and reporting take enormous amounts of time. AI can free up capacity for strategy and creativity.'
      }
    },
    opportunityDescriptionExample: {
      bad: {
        cs: 'AI nástroj pro generování marketingového obsahu.',
        en: 'AI tool for generating marketing content.'
      },
      good: {
        cs: 'Představte si páteční odpoledne a klient potřebuje 20 variant PPC reklam do pondělí. Dnes by copywriter strávil celý víkend brainstormingem. S AI copywriting asistentem natrénovaným na vašich best practices a tone of voice klienta vygenerujete 50 variant za hodinu, vyberete nejlepší a víkend máte volný. Pro Digital Storm to znamená více projektů bez přesčasů a burnoutu týmu.',
        en: 'Imagine Friday afternoon and a client needs 20 PPC ad variants by Monday. Today, a copywriter would spend the whole weekend brainstorming. With an AI copywriting assistant trained on your best practices and the client\'s tone of voice, you generate 50 variants in an hour, pick the best ones, and your weekend is free. For Digital Storm, this means more projects without overtime and team burnout.'
      }
    },
    introTextExample: {
      cs: 'AI může z Digital Storm udělat agenturu, která dodává více za méně času. Automatizace tvorby obsahu, generování reportů jedním kliknutím a personalizované kampaně ve velkém měřítku. Vidíme příležitosti v úspoře času na rutině, škálování služeb a možnosti přijmout více klientů bez náboru.',
      en: 'AI can turn Digital Storm into an agency that delivers more in less time. Automating content creation, one-click report generation, and personalized campaigns at scale. We see opportunities in saving time on routine, scaling services, and taking on more clients without hiring.'
    },
    industryTerms: {
      cs: ['kampaň', 'obsah', 'report', 'klient', 'kreativa', 'brief', 'deadline'],
      en: ['campaign', 'content', 'report', 'client', 'creative', 'brief', 'deadline']
    },
    emotionalTriggers: {
      cs: ['Více kreativity, méně rutiny', 'Reporty za minutu, ne hodiny', 'Škálujte bez náboru'],
      en: ['More creativity, less routine', 'Reports in minutes, not hours', 'Scale without hiring']
    }
  }
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Find a niche example by ID
 */
export function getNicheExampleById(nicheId: string): NicheExample | undefined {
  return NICHE_EXAMPLES.find(example => example.nicheId === nicheId);
}

/**
 * Find niche examples by parent category
 */
export function getNicheExamplesByCategory(category: 'A' | 'B' | 'C' | 'D' | 'E'): NicheExample[] {
  return NICHE_EXAMPLES.filter(example => example.parentCategory === category);
}

/**
 * Get show-and-tell examples formatted for the LLM prompt
 */
export function getShowAndTellExamplesForPrompt(
  detectedNicheId: string | null,
  language: 'cs' | 'en'
): string {
  // If we have a specific niche, use that example
  let example = detectedNicheId ? getNicheExampleById(detectedNicheId) : null;

  // Fallback to community_membership as a general example
  if (!example) {
    example = getNicheExampleById('community_membership');
  }

  if (!example) {
    return '';
  }

  const lang = language;

  if (lang === 'cs') {
    return `
## SHOW-AND-TELL: PŘÍKLADY EXCELENTNÍ PERSONALIZACE

### Odvětví: ${example.nicheLabel.cs}

### PŘÍKLAD: companyContext (úvodní odstavec)

**ŠPATNĚ (generické, bez detailů):**
"${example.companyContextExample.bad.cs}"

**SPRÁVNĚ (personalizované, s konkrétními fakty):**
"${example.companyContextExample.good.cs}"

### PŘÍKLAD: popis AI řešení (aiOpportunities.description)

**ŠPATNĚ (krátké, technické):**
"${example.opportunityDescriptionExample.bad.cs}"

**SPRÁVNĚ (storytelling, personalizované, 4-5 vět):**
"${example.opportunityDescriptionExample.good.cs}"

### PŘÍKLAD: introText (úvodní shrnutí přínosů)

"${example.introTextExample.cs}"

### TERMINOLOGIE PRO TOTO ODVĚTVÍ:
Použij přirozeně tyto termíny: ${example.industryTerms.cs.join(', ')}

### EMOCIONÁLNÍ TRIGGERY:
${example.emotionalTriggers.cs.map(t => `- "${t}"`).join('\n')}

---

## ⚠️ DŮLEŽITÉ: PŘÍKLADY JSOU JEN INSPIRACE - NE ŠABLONA!

**Tyto příklady ukazují STYL a KVALITU, ale NE OBSAH, který máš kopírovat!**

### TVŮJ KREATIVNÍ ÚKOL:
1. **PRIMÁRNĚ VYCHÁZEJ Z UŽIVATELSKÝCH DAT:**
   - Název firmy a město z formuláře
   - Odvětví, které uživatel zadal
   - Pain point (bolest), kterou uživatel popsal - TO JE KLÍČOVÉ!
   - Nástroje, které uživatel aktuálně používá

2. **SEKUNDÁRNĚ VYUŽIJ VÝSLEDKY VYHLEDÁVÁNÍ:**
   - Skutečné fakty o firmě z Google
   - Jejich webové stránky, recenze, sociální sítě
   - Konkrétní produkty/služby, které nabízejí

3. **PŘÍKLADY VÝŠE TI UKAZUJÍ:**
   - Jakou DÉLKU a HLOUBKU mají mít popisy
   - Jaký STYL a TÓN použít (prodejní, přátelský, bez žargonu)
   - Jakou STRUKTURU dodržet (scénář → problém → řešení → benefit)

### ZAKÁZANÉ CHOVÁNÍ:
❌ NEKOPÍRUJ příklady doslovně nebo s drobnými úpravami
❌ NEPOUŽÍVEJ stejná čísla a metriky jako v příkladech
❌ NEPOUŽÍVEJ stejná jména osob (Jan, Petra, Martin)
❌ NERECYKLUJ fráze z příkladů

### POŽADOVANÉ CHOVÁNÍ:
✅ VYMYSLI originální scénáře relevantní pro TUTO KONKRÉTNÍ firmu
✅ ODHADNI realistické metriky na základě velikosti a typu podnikání
✅ REAGUJ na pain point, který uživatel uvedl ve formuláři
✅ BUĎ KREATIVNÍ - každý report musí být unikátní!

**TVŮJ OUTPUT MUSÍ BÝT 100% ORIGINÁLNÍ A PŘIZPŮSOBENÝ TÉTO FIRMĚ.**
`;
  }

  return `
## SHOW-AND-TELL: EXAMPLES OF EXCELLENT PERSONALIZATION

### Industry: ${example.nicheLabel.en}

### EXAMPLE: companyContext (intro paragraph)

**WRONG (generic, no details):**
"${example.companyContextExample.bad.en}"

**CORRECT (personalized, with specific facts):**
"${example.companyContextExample.good.en}"

### EXAMPLE: AI solution description (aiOpportunities.description)

**WRONG (short, technical):**
"${example.opportunityDescriptionExample.bad.en}"

**CORRECT (storytelling, personalized, 4-5 sentences):**
"${example.opportunityDescriptionExample.good.en}"

### EXAMPLE: introText (benefits summary)

"${example.introTextExample.en}"

### TERMINOLOGY FOR THIS INDUSTRY:
Use these terms naturally: ${example.industryTerms.en.join(', ')}

### EMOTIONAL TRIGGERS:
${example.emotionalTriggers.en.map(t => `- "${t}"`).join('\n')}

---

## ⚠️ IMPORTANT: EXAMPLES ARE INSPIRATION ONLY - NOT A TEMPLATE!

**These examples show STYLE and QUALITY, NOT content to copy!**

### YOUR CREATIVE TASK:
1. **PRIMARILY USE USER INPUT DATA:**
   - Company name and city from the form
   - Industry the user specified
   - Pain point the user described - THIS IS KEY!
   - Tools the user currently uses

2. **SECONDARILY USE SEARCH RESULTS:**
   - Real facts about the company from Google
   - Their website, reviews, social media presence
   - Specific products/services they offer

3. **EXAMPLES ABOVE SHOW YOU:**
   - What LENGTH and DEPTH descriptions should have
   - What STYLE and TONE to use (sales-focused, friendly, no jargon)
   - What STRUCTURE to follow (scenario → problem → solution → benefit)

### FORBIDDEN BEHAVIOR:
❌ DO NOT copy examples verbatim or with minor changes
❌ DO NOT use the same numbers and metrics as in examples
❌ DO NOT use the same person names (Jan, Petra, Martin)
❌ DO NOT recycle phrases from examples

### REQUIRED BEHAVIOR:
✅ CREATE original scenarios relevant to THIS SPECIFIC company
✅ ESTIMATE realistic metrics based on business size and type
✅ RESPOND to the pain point the user provided in the form
✅ BE CREATIVE - every report must be unique!

**YOUR OUTPUT MUST BE 100% ORIGINAL AND TAILORED TO THIS COMPANY.**
`;
}
