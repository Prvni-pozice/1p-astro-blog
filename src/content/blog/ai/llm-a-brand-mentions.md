---
title: "Jak se dostat do odpovědí ChatGPT a Perplexity: průvodce brand mentions v LLM"
description: "Proč nestačí rankovat v Googlu a jak budovat přítomnost své značky v AI vyhledávačích. Konkrétní kroky, ne teorie."
pubDate: 2026-03-05
category: "ai"
tags: ["LLM", "brand mentions", "GEO", "ChatGPT", "Perplexity"]
readingTime: 6
---

Jeden z nejčastějších dotazů, který dostáváme od klientů: *"Jak se dostat do toho, co ChatGPT odpovídá na otázky z mého oboru?"*

Je to správná otázka. A odpověď je složitější, než by se mohlo zdát.

## Jak LLM "ví", co ví

Velké jazykové modely jako GPT-4, Claude nebo Llama jsou trénovány na obrovském množství textových dat z internetu. Training data mají cutoff datum — GPT-4 například ví o světě do určitého data a novější informace nemá.

Co to znamená pro váš brand?

1. **Pokud o vás na internetu není nic** (nebo málo), model o vás neví
2. **Pokud jsou informace o vás nepřesné nebo negativní**, model to může reflektovat
3. **Pokud jste citováni jako autorita** na mnoha místech, model vás tak může vnímat

Důležitý nuance: **RAG (Retrieval Augmented Generation)** mění pravidla hry. Perplexity a Google AI Overviews nevycházejí jen z training dat — aktivně prohledávají web v reálném čase a citují zdroje. To je jiná disciplína.

## Dvě fronty: training data vs. RAG systémy

### Fronta 1: Training data (ChatGPT bez web přístupu)

Tady jde o budování **celkové autority a přítomnosti na webu**. Čím více kvalitního obsahu o vašem tématu existuje a odkazuje na vás, tím větší šance, že se dostanete do training dat budoucích modelů.

Praktické kroky:
- **Wikipedia** — pokud splňujete notability criteria, mějte Wikipedia stránku (nebo aspoň zmínku)
- **Wikidata** — strukturovaná data o vaší firmě/osobě
- **Autoritativní publikace** — zmínky v Forbes, HN, odborných médiích
- **Citace od akademiků a odborníků** — papers, odborné články
- **Podcasty a video** — přepisy jsou indexovány

### Fronta 2: RAG systémy (Perplexity, Google AI Overview)

Tady jde o **aktuální web přítomnost a citovatelnost**. RAG systémy prohledávají web a vybírají nejrelevantější zdroje pro daný dotaz.

Faktory úspěchu:
1. **Rychlost a technická kvalita webu** — pomalý web RAG systémy odfiltrují
2. **Jasnost odpovědí** — obsah, který přímo a jasně odpovídá na otázku
3. **Struktura dat** — schema markup, FAQ, definice
4. **Frekvence aktualizace** — čerstvý obsah má výhodu
5. **Autorita domény** — stále platí

## Jak měřit brand mentions v AI

Monitoring je zatím v plenkách, ale máme praktické metody:

### Manuální audit
Jednou týdně zkuste dotazy, kde byste chtěli být citováni:
- *"Kdo jsou nejlepší SEO agentury v Česku?"*
- *"Jak funguje [vaše služba]?"*
- *"Co doporučujete pro [váš obor]?"*

Testujte v ChatGPT, Claude, Perplexity, Google AI Overview.

### Nástroje
- **Brandwatch** — social listening s možností sledovat AI citace
- **Mention** — zmínky online obecně
- **Perplexity API** — pro automatizovaný monitoring (pokročilé)

## Strategie pro zvýšení LLM přítomnosti

### 1. "Answer the question" content strategie
Vytvářejte obsah, který přímo odpovídá na konkrétní otázky. Titulek = otázka, obsah = jasná odpověď, pak detail. AI systémy tenhle formát milují.

### 2. Budujte citační síť
Snažte se, aby na vás odkazovaly autoritativní weby ve vašem oboru. Ne z důvodu PageRank (i když to pořád platí), ale protože výskyt ve více autoritativních zdrojích zvyšuje šanci na zmínku v AI.

### 3. Structured data a entity building
Mějte jasně definovanou "entitu" na webu:
- Schema.org Organization nebo Person markup
- Konzistentní NAP (jméno, adresa, telefon) napříč webbem
- Google Business Profile (pro lokální business)
- LinkedIn company page s aktuálními daty

### 4. Publikujte originální výzkum a data
Unikátní data jsou citovatelná. Průzkumy, studie, statistiky z vašeho trhu — AI ráda cituje primární zdroje.

### 5. PR a earned media
Zmínky v médiích, rozhovory, odborné komentáře — to vše buduje důvěryhodnost v očích AI systémů.

## Realistická očekávání

LLM brand visibility není rychlá hra. Training cutoff znamená, že výsledky vašeho snažení dnes se projeví možná za 1-2 roky v příštích modelech.

RAG systémy (Perplexity, Google AI) reagují rychleji — dny nebo týdny.

Začněte dnes, výsledky přijdou.
