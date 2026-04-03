# Image Specs — První pozice Blog

Technické specifikace a AI prompty pro všechny fotorealistické assety.

## Workflow

1. Vygeneruj obrázky pomocí AI (DALL-E 3 nebo Midjourney) s prompty níže
2. Exportuj jako **PNG** s průhledným pozadím (tam, kde je uvedeno)
3. Konvertuj na **WebP** (kvalita 85), dodržet max. velikost
4. Ulož do správné cesty v projektu
5. Nahraď placeholder divy skutečnými `<img>` tagy v komponentách

---

## Hero assety — `src/assets/hero/`

### robot-body.webp

| | |
|---|---|
| **Cesta** | `src/assets/hero/robot-body.webp` |
| **Rozměry** | 800 × 1000 px |
| **Aspect ratio** | 4:5 |
| **Průhledné pozadí** | **ANO** (PNG → WebP s alpha) |
| **Max velikost** | 80 KB |

**Prompt (DALL-E 3 / Midjourney):**
```
Photorealistic humanoid robot torso and legs, Tesla Optimus style, NO branding or logos.
Dark metallic surface with subtle light reflections, matte gunmetal finish with polished edges.
The robot is facing slightly to the right (15° angle). Arms are slightly away from body.
Shot from waist up to feet. Studio lighting, dark background, deep shadows.
Isolated on pure black transparent background — suitable for compositing.
Cinematic product photography style, 4K quality, sharp focus.
--ar 4:5 --style raw --v 6
```

---

### robot-arms.webp

| | |
|---|---|
| **Cesta** | `src/assets/hero/robot-arms.webp` |
| **Rozměry** | 800 × 600 px |
| **Aspect ratio** | 4:3 |
| **Průhledné pozadí** | **ANO** |
| **Max velikost** | 50 KB |

**Workflow:** Vygeneruj celého robota (stejná session/seed jako robot-body) a vyřízni pouze oblast ramen a paží. Zachovej konzistentní styl osvětlení.

**Prompt:**
```
Photorealistic robot shoulders and arms, same design as main robot body (gunmetal metallic, no logos).
Horizontal composition, shoulders wide, arms hanging slightly outward.
Transparent background, studio lighting, dark ambient.
--ar 4:3 --style raw --v 6
```

---

### robot-head.webp

| | |
|---|---|
| **Cesta** | `src/assets/hero/robot-head.webp` |
| **Rozměry** | 400 × 500 px |
| **Aspect ratio** | 4:5 |
| **Průhledné pozadí** | **ANO** |
| **Max velikost** | 40 KB |

**Důležité:** Stejný styl jako tělo. Generuj celého robota a vyřízni hlavu pro konzistenci (`--sref` nebo inpainting).

**Prompt:**
```
Photorealistic humanoid robot head, Tesla Optimus inspired, NO branding.
Smooth dark gunmetal helmet-like head with a visor/face panel.
Two glowing eyes visible through the visor — subtle lime-green (#aed301) glow.
Facing slightly right (15° turn). Transparent background.
Cinematic product shot, sharp, 4K, dark studio lighting.
--ar 4:5 --style raw --v 6
```

---

### macbook.webp

| | |
|---|---|
| **Cesta** | `src/assets/hero/macbook.webp` |
| **Rozměry** | 1000 × 700 px |
| **Aspect ratio** | 10:7 |
| **Průhledné pozadí** | **ANO** |
| **Max velikost** | 80 KB |

**Důležité:** Obrazovka musí být **černá / tmavá** — screen content se přidá jako HTML overlay v CSS.

**Prompt:**
```
Photorealistic Apple MacBook Pro (M-series), silver/space grey color.
Open lid at approximately 120° angle. Screen is black/off — no content visible.
Slight perspective: viewed from slightly above and to the left (20° Y-axis rotation).
Metallic reflections on aluminium casing, subtle ambient light.
Transparent background, isolated product photography, 4K quality.
No text, no logos on screen, no Apple logo visible.
--ar 10:7 --style raw --v 6
```

---

## Footer assety — `src/assets/footer/`

**DŮLEŽITÉ:** Oba crowd obrázky musí být vizuálně konzistentní — stejní lidé, stejné osvětlení, stejná kompozice. Doporučený workflow:
1. Vygeneruj `crowd-away` s `--seed XXXXXX`
2. Použij Midjourney inpainting nebo `--sref` pro `crowd-looking` (změn pouze směr pohledu)

---

### crowd-away.webp

| | |
|---|---|
| **Cesta** | `src/assets/footer/crowd-away.webp` |
| **Rozměry** | 1920 × 600 px |
| **Aspect ratio** | 16:5 |
| **Průhledné pozadí** | **NE** |
| **Max velikost** | 150 KB |

**Prompt:**
```
Cinematic wide-angle shot of a cinema audience, 15-20 people visible in rows.
Upper body only (waist up). All wearing futuristic AR glasses or VR visors — sleek, not cartoony.
European diverse crowd: men and women, ages 25-55, various hair and clothing styles.
IMPORTANT: People are looking in different directions — some sideways, some at each other, some looking down.
Dramatic cinema lighting: faces lit from below/front by screen glow, rest in darkness.
Color grading: dark background (#08080d), accent highlights in lime-green and teal tones on glasses.
Cinematic, artistic, like a movie poster. NOT a stock photo.
Ultra-wide panoramic crop 1920x600, dark mood, 4K quality.
--ar 16:5 --style cinematic --v 6
```

---

### crowd-looking.webp

| | |
|---|---|
| **Cesta** | `src/assets/footer/crowd-looking.webp` |
| **Rozměry** | 1920 × 600 px |
| **Aspect ratio** | 16:5 |
| **Průhledné pozadí** | **NE** |
| **Max velikost** | 150 KB |

**Prompt:**
```
[SAME SCENE as crowd-away — same people, same lighting, same composition]
The ONLY difference: ALL people are now looking directly at the camera/viewer.
Slight smile or neutral expression, engaging eye contact.
AR glasses glowing slightly (teal #01d3ae / lime #aed301 reflections in lenses).
Same cinematic wide-angle shot, 1920x600 panoramic, same color grading.
--ar 16:5 --style cinematic --v 6 --sref [seed from crowd-away]
```

**Alternativní workflow (doporučeno):**
1. Vygeneruj `crowd-away` s parametrem `--seed 12345` (libovolné číslo)
2. V Midjourney použij `/describe` nebo inpainting — vezmi crowd-away, zamaskuj hlavy/obličeje a vygeneruj nové s pohledem "into camera"
3. Výsledek: maximální konzistence prostředí

---

## Shrnutí — celkový budget

| Asset | KB |
|---|---|
| robot-body.webp | 80 |
| robot-arms.webp | 50 |
| robot-head.webp | 40 |
| macbook.webp | 80 |
| **Hero celkem** | **≤ 250 KB** |
| crowd-away.webp | 150 |
| crowd-looking.webp | 150 |
| **Footer celkem** | **≤ 300 KB** |
| **Celkem stránka** | **≤ 550 KB** |

---

## Po vygenerování — implementace

### Hero (Hero.astro)

Nahraď každý placeholder div skutečným `<img>` tagem:

```astro
<!-- PŘED (placeholder): -->
<div class="robot-layer robot-body" id="robotBody">
  <div class="ph ph-robot-body"></div>
</div>

<!-- PO (reálný obrázek): -->
<div class="robot-layer robot-body" id="robotBody">
  <img
    src="/assets/hero/robot-body.webp"
    alt=""
    width="800"
    height="1000"
    loading="lazy"
    decoding="async"
    fetchpriority="high"
    style="width:100%;height:100%;object-fit:contain;"
  />
</div>
```

### Footer (FooterCrowd.astro)

Nahraď `.ph-crowd` divy reálnými `<img>` tagy:

```astro
<!-- PŘED (placeholder): -->
<div class="crowd-img crowd-away" role="presentation">
  <div class="ph-crowd ph-crowd-away" ...></div>
</div>

<!-- PO (reálný obrázek): -->
<div class="crowd-img crowd-away" role="presentation">
  <img
    src="/assets/footer/crowd-away.webp"
    alt=""
    width="1920"
    height="600"
    loading="lazy"
    decoding="async"
    style="width:100%;height:100%;object-fit:cover;"
  />
</div>
```
