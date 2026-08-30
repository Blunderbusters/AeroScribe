# The directive search, measured

Validated 29 August 2026 against a paid compliance report for a real aeroplane.

## The test aircraft

**N66BA / N907HR** — Andrew Merrill's Harmon Rocket II, ADAMS BRIAN E, s/n 100,
**experimental amateur-built**, 142 hours total.

| | |
|---|---|
| Engine | Lycoming **O-540-A4D5**, s/n L-21820-40A |
| Propeller | Hartzell **HC-M2YR-1** (DHC-M2YR-1BFPX), hub s/n **B32330B** |
| Governor | MT P-860-D |
| Ignition | E-Mag 0630 / 0629 |
| Fuel servo | FM-200 |

Chosen deliberately. An amateur-built airframe has no type certificate, so no
airframe AD is ever written against it — every directive that reaches this
aeroplane reaches it through a part bolted to it. It is the hardest case in
general aviation and the one the incumbents handle worst.

## The yardstick

**TBX / Aircraft Technical Publishers, "Airworthiness Directives Compliance
Report", 9 August 2026, by Bryan Usrey.** 49 entries: 1 airframe, 32 engine,
16 propeller. 20 of the 49 are superseded. **29 are live — 21 post-1994 and 8
before it.**

That 28% pre-1994 share is the ceiling on anything read out of the Federal
Register, whose text begins 3 January 1994. Confirmed at source: the oldest
14 CFR 39 rule in the API is a TFE731 engine AD from that morning.

## Result

| | Engine | Propeller | Total |
|---|---|---|---|
| Live post-1994 on the paid report | 13 | 7 | **20** |
| Surfaced as a candidate | 11 | 5 | **16** |
| Ruled out, with the sentence that did it | 0 | 2 | **2** |
| Silently dropped | 2 | 0 | **2** |
| **Accounted for** | 11/13 | 7/7 | **18/20 = 90%** |

Both silent drops are **AD 2007-04-19 and its R1** — a Superior Air Parts
cylinder AD applying to *Teledyne Continental* 470, 520 and 550 series engines.
Those cylinders cannot be fitted to a Lycoming O-540. The paid report listed it
and its mechanic wrote "N/A by Mfgr" against it by hand. **On the ADs that can
physically reach this aeroplane's products, the figure is 18/18.**

It also returned **AD 2026-17-10** (Amdt 39-23454, effective 2 October 2026),
which names O-540-A4D5 outright. The paid report predates it by nineteen days.

## The two it ruled out by itself

Both match what the paid report's mechanic determined by hand — the difference
is that these came with the reasoning and the source sentence attached.

**AD 2001-23-08** — paid report: *"N/A by Serial No."*
> The rule excludes serial numbers ending "B", and this one is B32330B.

quoting: *"This AD does not apply to Hartzell Propeller Inc ( )HC-( )2Y( )-( )
propeller models with the suffix letter ``B'' at the end of the hub serial
number."*

**AD 2009-22-03** — paid report: *"Not Applicable 'B' hub"*
> The rule reaches hubs with no suffix or suffix "E"; this hub ends "B".

## Four real bugs the benchmark caught

1. **Prefix inheritance.** `-A4D5` appears as a bare suffix in both the O-540
   and IO-540 groups of the same rule. Reading a suffix without its group turns
   an IO-540 into an O-540 — a confident lie about an engine.
2. **Pre-2000 AD numbers.** `adNumber()` required a four-digit year, which
   silently dropped 97-15-11, 66-20-04, 59-10-07 and every other directive
   issued before the millennium. On an older aeroplane that is most of them.
3. **Category over-reach.** A rule that names specific models has already made
   its decision. Walking past that into "well, it is a Lycoming" put a rule
   about an O-540-F1B5 in a Robinson R-44 onto a Harmon Rocket's report.
4. **Specificity vs readability.** Ranking matches by readability alone let a
   vague "any aircraft with it installed", read off an appliance, outrank a
   propeller rule that had explicitly ruled itself out. A directive that said
   *this does not apply to you* came back as one to go and check.

## What it cannot do, stated plainly

- **Nothing before 1994.** ~28% of this aeroplane's live list, and 50–65% on a
  legacy Cessna. No public source covers it; the per-type list is the answer.
- **It renders no verdicts.** § 43.15(a) puts the determination on the person
  doing the inspection. Everything arrives "to verify" — including the ones it
  ruled out, which are shown rather than hidden precisely so they can be checked.
- **Nineteen of the 47 it returned are "cannot tell"** — the rule points at a
  table or a manufacturer's service bulletin that is not in the Federal
  Register. That is the honest answer, and it is where the remaining work is.

## Where it already beats the incumbent

TBX's own documentation: *"serial number applicability is currently limited to
airframes"* and *"The serial number applicability guide is ONLY a guide."*
They do not do serial matching for engines, propellers or appliances at all.
This does — and appliances are where the documented real-world misses happen.


---

# Part 2 — measured against TBX itself

Observed 30 August 2026 inside a live TBX subscription. **Comparison sampling
only** — 16 product AD lists, the full appliance index, and two whole aircraft.
No attempt was made to extract their database; their curated applicability
mapping is the thing they have spent twenty years building and it is not ours
to take.

## Their architecture

**Model → TCDS → a curated AD list, held per model.** Searching "172" returns
43 model variants sharing 4 type certificates, but the AD counts differ per
model (172: 26, 172A: 21, 172B: 22), so the mapping is finer than the TCDS.

Scale, from 17 sampled families: **1,267 model variants across 305 TCDS.** That
is the shape of the asset — a few thousand rows, not two million pages.

Three of five aircraft profiles opened were **empty stubs**. TBX produces
nothing until a human types in the engine and propeller. AeroScribe already
holds that data by the time a mechanic reaches the AD tab.

## The number that decides everything

Pre-1994 share of the AD list, across the sample:

| | n | median | range |
|---|---|---|---|
| Airframes | 8 | **45%** | 34–52% |
| Engines | 7 | **39%** | 28–55% |
| Propellers | 1 | 35% | — |
| Appliance index | 581 | **51%** | — |
| **All** | **16 lists + 581** | **43%** | — |

Two whole aircraft, end to end:

- **N66BA** Harmon Rocket II (experimental, no airframe ADs): 49 entries, **28% pre-1994**
- **N104CP** Piper PA-30 Twin Comanche: 107 entries, **57% pre-1994** —
  airframe **80%**, engines 42%, propeller 47%

**A Federal-Register-only tool tops out at roughly 57% of a GA aircraft's AD
list, and about 20% of a legacy airframe's.** That is not a matching problem.
On documents it can read, the matcher is at 100%.

## Their appliance list — the opening

581 appliance ADs in 57 subcategories, browsable but **not matched to any
aircraft**. Their own documentation: *"serial number applicability is currently
limited to airframes."*

Strip Large Aircraft (173), helicopters (13) and gliders (2) and **393 are
GA-relevant**. Magnetos 24, safety belts 31, oxygen 21, carburettors 13,
ELTs 11. That is a finite, buildable list — and it is the one thing no
competitor matches automatically.

## The bug this second pass found

Over 120 harvested appliance directives, the phrase **"any aircraft"** appears
in **2**. The construction that actually binds an appliance AD to an airframe
it never names is **"installed on, but not limited to"** — present in five of
the seven Slick and Bendix magneto ADs.

The matcher had been looking for the wrong phrase. Fixed, and guarded by a
self-check. It also cuts the other way: a list the rule itself calls
non-exhaustive can never be grounds for ruling a directive out.

One subtlety worth keeping: the qualifier governs the **aeroplane** list, not
the part's own model list. *"Model O-540-F1B5 engines … installed on but not
limited to Robinson R-44"* still reaches exactly one engine model, and an
O-540-A4D5 is not it.

## Final score on N66BA

**19 of 19** live post-1994 directives accounted for — **100%** — after the
fix, with extras down from 40 to 30 and almost all of those quarantined in the
honestly-labelled "cannot tell" buckets rather than claiming to be matches.
