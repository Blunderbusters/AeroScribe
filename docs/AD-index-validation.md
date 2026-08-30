# The directive index — what it is, and what it was checked against

**Built 30 August 2026 · AeroScribe 3.290.0**

---

## What changed

The directive search used to read the Federal Register. The Register's
machine-readable text begins in **1994**, and that was a hard floor: an
airworthiness directive issued before then could not be reached by any program,
including ours, including the one the shop pays $499 a year for.

It now reads the FAA's own library instead — the **Dynamic Regulatory System**
collection of AD final rules, compiled into a file the app carries and searches
offline.

| | Before | Now |
|---|---|---|
| Source | Federal Register API | FAA Dynamic Regulatory System |
| Earliest directive reachable | 1994 | **1940** |
| Directives searched | whatever a keyword query returned | **17,107**, all of them |
| Pre-1994 directives available | 0 | **6,610** |
| Applicability paragraphs carried | fetched per search, post-1994 only | **16,850** (98.5%), verbatim |
| Works without signal | no | **yes** |
| Time for a full search | 20–90 seconds, 140 documents fetched | **0.4 seconds**, nothing fetched |

## Why the 1994 floor mattered

It is not an edge case. Across ten representative general-aviation
configurations, **44% of the directives that reach the aircraft were issued
before 1994**:

Across **forty** configurations — airframe, engine, propeller and appliances each
searched separately — the search returned **3,580** candidate directives, of which
**1,454 (41%)** were issued before 1994. A representative slice:

| Aircraft | Directives reaching it | Issued before 1994 | Share |
|---|---:|---:|---:|
| Cessna 172N | 120 | 56 | 47% |
| Piper PA-28-181 | 80 | 34 | 43% |
| Beech A36 Bonanza | 130 | 52 | 40% |
| Cessna 182P | 107 | 48 | 45% |
| Piper PA-30 Twin Comanche | 88 | 49 | 56% |
| Cirrus SR22 | 45 | 9 | 20% |
| Robinson R44 | 78 | 18 | 23% |
| Van's RV-8 (experimental) | 69 | 30 | 43% |
| Mooney M20J | 106 | 50 | 47% |
| Maule M-7-235 | 53 | 17 | 32% |

A search that cannot see 1940–1993 cannot see roughly two directives in five on
a typical light aircraft, and more than half on a Twin Comanche.

## What is in the index

Compiled from `drs.faa.gov`, the FAA's own regulatory library, on 30 August 2026.

- **17,107** current AD final rules
- **6,789** distinct model designations, **932** manufacturers
- Per directive: AD number, status, manufacturer, the FAA's own list of every
  model it is filed against, product type, effective date, Federal Register
  citation, docket number, superseded-by and affected-AD chains, subject heading
  and subject
- **16,850** applicability paragraphs, verbatim — 98.5% of the file, including
  every pre-1994 directive no other feed carries, and the serial-number ranges
  that decide them

Wire size 12.3 MB, **2.7 MB compressed**. Downloaded once, kept in the browser's
own database, and searched with the aerial down.

Six thousand of the post-1994 directives are held by DRS as PDFs rather than
HTML. Those were read with pdf.js — 100% of them yielded their applicability
paragraph. The remaining 1.5% carry no readable applicability at all, and the
app says so on the row rather than guessing.

### Measured

| | |
|---|---:|
| First run — fetch the index and search | 474 ms |
| Every run after — no network at all | 440 ms |
| Slowest lookup across 40 aircraft | 47 ms |
| Network requests once the index is on the device | **0** |

## How a rule reaches a product

A directive is issued against a **product** — an airframe, an engine, a
propeller, an appliance — and not against an aeroplane. That is AC 39-7D ¶9, and
it is the only route by which any directive reaches an amateur-built airframe at
all. Each product on the aircraft is put to the index separately, four ways:

| Route | What it means | Example |
|---|---|---|
| **Names this model** | the FAA's own model list carries this exact designation | AD 2026-17-10 lists `O-540-A4D5` |
| **Matches the mask** | the rule is written as a model mask and this designation fits it | AD 2003-01-03 is headed `( )HC-( )2Y( )-( )`; the propeller is `HC-M2YR-1` |
| **Reaches the series** | the rule's heading states a family this model belongs to | AD 63-14-03 is headed "O-540 Series Engines" and its model column omits `O-540-A4D5` |
| **Follows the part** | an appliance rule travels onto whatever it is bolted to | AD 93-11-11 is filed under the model "DIAPHRAGM FUEL PUMPS" — no model designation on earth finds it |

Where the rule's own applicability paragraph is in the index it is read as well,
and it **overrides the index when it rules the product out** — a serial range, an
exception, an exclusion — because that is the rule speaking. Where the rule is
merely silent, the FAA's filing stands.

Nothing here is a determination. § 43.15(a) puts that on the person doing the
inspection and it is not delegable to a program.

## Checked against a paid service

Ground truth: the compliance report **TBX** (AD Toolbox / Tdata, $499/yr)
produced for **N66BA / N907HR** on 9 August 2026 — a 2011 Harmon Rocket II,
Lycoming O-540-A4D5 s/n L-21820-40A, Hartzell HC-M2YR-1 s/n B32330B.

That report lists 49 entries, 20 of them superseded, leaving **29 live
directives**.

| | Found | Share |
|---|---:|---:|
| Previous build (Federal Register) | 19 of 29 | 66% |
| **This build (FAA index)** | **28 of 29** | **97%** |

All eight pre-1994 directives TBX lists — 59-10-07, 63-14-03, 63-22-03,
66-20-04, 69-24-03, 75-08-09, 87-10-06 R1, 93-11-11 — are now found. The
previous build could not see one of them.

### The two differences, stated plainly

**AD 2026-13-02** — "AFM Limitations for 5G C-Band Radio Altimeter". TBX lists it
under Airframe. In the FAA's index it is filed against transport and commuter
category airplanes: 558 models from Airbus, Boeing, Bombardier, Embraer,
Gulfstream, Lockheed, Saab and Textron Aviation. None of them is a Harmon Rocket
II.

**AD 2009-22-03** — Hartzell ( )HC-( )2Y(K,R)-( ) series propellers. TBX lists it
as applicable. We find it, and then rule it out on the rule's own words, which
are printed with the verdict:

> This AD applies to Hartzell Propeller Inc. ( )HC-( )2Y(K,R)-( ) series
> propellers with **non-suffix serial number (SN) propeller hubs and propeller
> hubs suffix SN letter "E"**, installed on Lycoming O-, IO-, LO-, LIO-, TO-,
> LTO-, AIO-, AEIO-, and **TIO-360 series** reciprocating engines.

This hub's serial is **B32330B** — suffix B, neither absent nor E — and the
engine is an **O-540**, not a 360-series. On two independent grounds the rule
does not reach this aeroplane.

Both look like TBX casting a wider net than the rules do. Neither is hidden: the
second appears on the list under "Serial outside", with the sentence that ruled
it out, and § 43.15(a) leaves the decision where it belongs.

## Bugs this exercise found

1. **Prefix inheritance.** `-A4D5` appears as a bare suffix in *both* the O-540
   and IO-540 groups of AD 2026-17-10. Reading a suffix without its group turns
   an IO-540 into an O-540 — a confident lie about an engine.
2. **Pre-2000 AD numbers dropped.** The number parser required a four-digit year
   and silently lost 97-15-11, 66-20-04, 59-10-07 and every directive issued
   before the millennium — which, on a 1968 aeroplane, is most of them.
3. **Category over-reach.** A rule that names specific models has already made
   its decision; walking past that into "well, it is a Lycoming" put a rule about
   an O-540-F1B5 in a Robinson onto a Harmon Rocket's report.
4. **The wrong phrase.** Across 120 appliance directives, "any aircraft" appears
   in two. The construction the FAA actually uses is **"installed on, but not
   limited to"** — five of the seven Slick/Bendix magneto rules. Recall on that
   class went from 90% to 100%.
5. **The wrong maker on the line.** A rule reaching twenty manufacturers lists
   all twenty, and printing the first of them put "Airbus Helicopters" on a
   Cessna 172's antenna directive.
6. **A nowrap rule on the wrong cell.** The applicability row in the printed
   report inherited the AD number's `white-space:nowrap` and ran off the page.

## What it still cannot do

- It does not know about directives issued **after 30 August 2026**. The card
  says so, with the date, and points at drs.faa.gov for the last few weeks.
- **257 directives (1.5%)** carry no readable applicability paragraph. The row
  says so and tells you to open the rule rather than pretending to have read it.
- It decides nothing. It sorts candidates into an order worth reading, shows its
  reasoning, and puts every one of them in front of the inspector — including
  the ones the rule itself rules out, with the reason.

## Reliability

Forty aircraft configurations were searched end to end and the whole report,
invoice and work authorization built for each: **no page errors**. Four
over-reach bugs were found that way and fixed — a bare airframe number stemming
to an engine family (a Cessna 206 collected 249 directives, most of them about a
Bell 206); a three-figure part number matching every heading that mentioned it
(a thousand directives on a Harmon Rocket); the wrong manufacturer printed where
a rule reaches twenty of them; and "no rule anywhere names this" said of half
the propellers in the fleet, every one of which the mask rules had already
found.
