---
title: "Schema markup v GEO éře: proč je structured data vaše tajná zbraň"
description: "Strukturovaná data nejsou jen pro rich snippety v Googlu. V AI vyhledávání jsou přímou komunikací s AI systémy — a většina firem to ještě nepochopila."
pubDate: 2026-02-10
category: "geo"
tags: ["schema markup", "structured data", "technické SEO", "GEO"]
readingTime: 8
---

Schema markup byl vždy trochu v pozadí — technická záležitost, o které věděli vývojáři a SEO specialisté, ale málokdo jiný. V éře AI vyhledávání se to mění.

Structured data jsou jedním z nejsilnějších signálů pro AI systémy. A přitom je implementuje jen zlomek webů.

## Co je schema markup a proč ho teď potřebujete víc než kdy jindy

Schema markup (nebo schema.org markup) jsou strukturovaná data, která říkají vyhledávačům a AI systémům, **co váš obsah znamená** — nejen co říká.

Příklad: Bez schema markupu vidí AI text "1. 3. 2026" jako libovolný textový řetězec. S schema markupem ví, že jde o datum publikace článku.

Proč je to důležité pro GEO: AI systémy, které prohledávají web (RAG systémy), dávají přednost obsahu, který je sémanticky jasně definovaný. Schema markup je přímý komunikační kanál s AI.

## Nejdůležitější typy schema pro GEO

### 1. Article schema (nebo BlogPosting)

Pro každý blogový článek. Říká AI: kdo to napsal, kdy, pro koho, o čem to je.

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Název článku",
  "description": "Stručný popis",
  "author": {
    "@type": "Person",
    "name": "Jméno autora",
    "url": "https://vasestranka.cz/autor/jmeno"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Název firmy",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vasestranka.cz/logo.png"
    }
  },
  "datePublished": "2026-02-10",
  "dateModified": "2026-02-10",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://vasestranka.cz/clanek/url"
  }
}
```

### 2. FAQ schema

Nejpřímější způsob, jak komunikovat Q&A s AI. Každá otázka a odpověď jsou explicitně označeny.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Co je GEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GEO (Generative Engine Optimization) je optimalizace obsahu a digitální přítomnosti pro AI systémy, které generují odpovědi na uživatelské dotazy."
      }
    }
  ]
}
```

**Pro GEO je FAQ schema zlaté** — přesně říká AI, která otázka je a která odpověď k ní patří. Maximalizuje šanci na citaci.

### 3. Organization schema

Definuje vaši firmu jako entitu. Klíčové pro brand awareness v AI odpovědích.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "První pozice",
  "url": "https://www.prvni-pozice.com",
  "logo": "https://www.prvni-pozice.com/logo.png",
  "description": "Přední česká agentura pro SEO, GEO a digitální marketing",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CZ"
  },
  "sameAs": [
    "https://www.facebook.com/prvnipozice",
    "https://www.linkedin.com/company/prvni-pozice",
    "https://www.youtube.com/@prvnipozice"
  ]
}
```

Klíčové pole `sameAs`: Propojuje vaši entitu s profily na jiných platformách. AI systémy toto používají k ověření a rozšíření znalostí o vaší firmě.

### 4. BreadcrumbList schema

Pomáhá AI pochopit hierarchii vašeho webu a kontext stránky.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Domů",
      "item": "https://blog.prvni-pozice.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "GEO",
      "item": "https://blog.prvni-pozice.com/geo"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Schema markup pro GEO",
      "item": "https://blog.prvni-pozice.com/geo/schema-markup"
    }
  ]
}
```

## Jak implementovat schema markup správně

### Metoda 1: JSON-LD (doporučená)

JSON-LD (JavaScript Object Notation for Linked Data) je formát preferovaný Googlem i AI systémy. Vkládá se jako `<script>` tag do `<head>` nebo těla stránky.

```html
<script type="application/ld+json">
{
  // váš schema markup zde
}
</script>
```

Výhoda: Schema je oddělená od HTML obsahu, snadno se aktualizuje a testuje.

### Metoda 2: Microdata nebo RDFa

Starší přístupy, kde se schema atributy přidávají přímo do HTML elementů. Stále funkční, ale JSON-LD je výrazně snazší na správu.

### Nástroje pro implementaci

**Generátory:**
- Schema Markup Generator od Merkle
- Google Structured Data Markup Helper

**Validace:**
- Google Rich Results Test
- Schema.org Validator

**Monitoring:**
- Google Search Console (sekce Vylepšení)

## Nejčastější chyby v schema implementaci

1. **Schema neodpovídá obsahu stránky** — nejzávažnější chyba, může být penalizována
2. **Chybějící povinné vlastnosti** — každý type má required fields
3. **Zastaralé schema** — schema.org se vyvíjí, sledujte aktualizace
4. **Schema jen na homepage** — každá stránka by měla mít relevantní markup
5. **Duplicitní schema** — jedna stránka, jeden typ (nebo správně zanořené typy)

## GEO-specifické doporučení pro schema

Pro maximální GEO dopad kombinujte:

1. **Organization** na homepage — definujte entitu firmy
2. **Article/BlogPosting** na každém článku — s podrobným author schema
3. **FAQ** na klíčových stránkách a na konci článků
4. **BreadcrumbList** na celém webu — pomáhá s kontextem
5. **WebSite** s SearchAction — umožňuje site search i z externích zdrojů

Tato kombinace vytváří robustní sémantický základ, který AI systémy ocení.

## Měření dopadu schema markup

Přímý dopad schema na GEO je těžko měřitelný. Ale nepřímé signály:

- **Google Search Console:** Sledujte rich result impressions (FAQ, Article...)
- **Google Rich Results Test:** Ověřujte, že schema je korektní
- **Manuální monitoring:** Testujte v Perplexity a Google AI Overview dotazy z vašeho oboru

Schema markup je investice do fundamentu. Výsledky přicházejí postupně, ale jsou trvalé.
