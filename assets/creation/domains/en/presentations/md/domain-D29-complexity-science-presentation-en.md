---
title: "Complexity Science - Structural Correspondence with the 5-Stage Model"
lang: en
version: "1.0"
date: "2026-03-21"
generator_model: "claude:claude-opus-4-6"
source: "domain-D29-complexity-science-academic-ja.md"
type: presentation
---

## Complexity Science

Structural correspondence survey with the 5-stage model (Ba / Wave / En / Uzu / Taba)

---

## Survey Overview

![Domain — Research Overview Infographic](https://uminomae.github.io/pjdhiro/assets/creation/img/svg/domains/ja/D29-01-overview-svg.svg)

- **Survey target**: 10 major theories in complexity science
- **Research question**: Do the various theories of complexity science correspond structurally to the 5-stage model?
- **Results**: Strong correspondence in 9 cases, conditional correspondence in 1 case

---

## Overview of the 5-Stage Model

| Stage | Definition |
|-------|------------|
| Ba (Field) | An undifferentiated state. The initial condition in which no direction or structure has yet been established |
| Wave | The exploratory stage in which multiple directions diverge and compete |
| En (Edge) | A state of tension in which opposing elements coexist without converging on either side. The place where they meet at the boundary, influence each other, and relationships emerge |
| Uzu (Vortex) | The stage in which a new coherence (order) arises spontaneously from within the tension |
| Taba (Bundle) | The stage in which the form is fixed and stabilizes as a reusable structure |

---

## Overview of Structural Correspondences

![Domain — Theory x 5-Stage Correspondence Matrix](https://uminomae.github.io/pjdhiro/assets/creation/img/svg/domains/ja/D29-02-theories-map-svg.svg)

| Conditional correspondence | Conceptually connects, but difficulties in hypothesis verification and risk of tautology remain |
|---|---|---|
|---|----------|--------|------------|------|
| 1 | Dissipative structures | Prigogine | Ba→Wave→En→Uzu→Taba | Strong correspondence |
| 2 | Self-organized criticality (SOC) | Bak, Tang & Wiesenfeld | Ba→Wave→En→Uzu→Taba (cyclic) | Strong correspondence |
| 3 | Reflexively autocatalytic and food-generated sets (RAF) | Kauffman / Hordijk & Steel | En→Uzu particularly strong | Strong correspondence |
| 4 | Synergetics | Haken | Wave→En→Uzu particularly strong | Strong correspondence |
| 5 | Critical phenomena and universality | Wilson | En and Taba particularly strong | Strong correspondence |
| 6 | Percolation | Broadbent & Hammersley | Ba→Wave→En→Uzu | Strong correspondence |
| 7 | Autopoiesis | Maturana & Varela | En⇔Uzu cycle | Strong correspondence |
| 8 | Reaction-diffusion (Turing mechanism) | Turing | Ba→Wave→Uzu→Taba | Strong correspondence |
| 9 | Edge of chaos | Langton / Kauffman | Specialized in En | Conditional correspondence |
| 10 | Network science | Watts-Strogatz / Barabasi-Albert | Structural theory of En | Strong correspondence |

---

## Key Entry 1: Dissipative Structures and Order from Fluctuation (Prigogine)

- Prigogine's theory of dissipative structures describes the process by which open systems, under the influx of energy and matter, transition to a new steady-state structure through amplification of fluctuations. The research that became the subject of the 1977 Nobel Prize in Chemistry provided a physicochemical formulation of the counter-intuitive phenomenon of "order from chaos."
- The Benard convection cell is a representative example that visually demonstrates this process. A layer of liquid uniformly heated from below remains uniformly at rest while the temperature gradient is small. But when the temperature gradient exceeds a critical value, the liquid spontaneously forms a hexagonal convection pattern. A qualitative transition occurs from a uniform state to a state with structure.
- **As a matter of fact**: In open systems far from equilibrium, a transition to a new steady-state structure (dissipative structure) occurs through amplification of fluctuations and bifurcation. Bifurcation points occur when a control parameter (temperature gradient, etc.) exceeds a critical value, and the post-bifurcation path is selected through symmetry breaking (Prigogine 1977).
- **As an interpretation of structure**: Here we focus on the sequence in which fluctuations are amplified from a homogeneous state near equilibrium, and a new structure arises after passing through a bifurcation point. The level of similarity is process. In particular, the structural feature is read that the bifurcation point functions as a threshold structure that "occurs only in the nonlinear domain and in which path selection takes place."
- **As an interpretive reading**: A homogeneous Ba near equilibrium → amplification of fluctuations (Wave) → the moment of symmetry breaking at the bifurcation point (En) → a pattern spontaneously arising as a dissipative structure (Uzu) → the structure is maintained under flux (Taba). The intensity with which the bifurcation point corresponds to En is high — as a qualitative transition point occurring only in the nonlinear domain, it is structurally isomorphic with the 5-stage model's "state of tension in which opposing elements coexist without converging on either side."
- However, Taba in dissipative structures has its own distinctive property. If the influx of energy stops, the structure disappears. The maintenance conditions differ from the "repetition and stabilization" implied by Taba in the 5 stages, which suggests that "there are different types of Taba as well." Also, dissipative structures have been confirmed in chemical and biological systems, but direct application to social systems requires verification of whether thermodynamic strict conditions are guaranteed.

---

## Key Entry 2: Self-Organized Criticality (SOC) and Scale-Invariant Avalanches (Bak)

- Self-organized criticality (SOC) is a theory in which systems spontaneously approach a critical state under slow external driving, and avalanche events of various scales occur. The sandpile model proposed by Bak, Tang & Wiesenfeld in 1987 is its prototype. When grains of sand are dropped one by one, the sandpile spontaneously reaches a critical state, and avalanches of various sizes occur. The size distribution of avalanches follows a power law.
- **As a matter of fact**: Under slow external driving, systems self-organize to a critical state and events (avalanches) occur at various scales (Bak, Tang & Wiesenfeld 1987, 1988). However, detection of power-law distributions itself is statistically difficult and requires the combined use of likelihood-based comparison and goodness-of-fit tests (Clauset et al. 2009).
- **As an interpretation of structure**: Here we focus on the dynamics of the system spontaneously approaching criticality and the process in which groups of events arising from the critical state accumulate as a statistical structure. The level of similarity is structure. In particular, the structural feature is read that correspondence with all phases of the 5 stages is visible, and that the cycle from Taba back to Ba is built into the theory.
- **As an interpretive reading**: From the background near criticality (Ba), local threshold-crossing (Wave) occurs, propagates through local interactions (En), avalanche events arise as coherence (Uzu), and numerous events remain as a power-law statistical structure (Taba). What is decisive is that after the avalanche, the system is again subjected to slow driving toward the next criticality — a cycle that is naturally inherent. The theory itself describes the cyclic nature of Taba → Ba in the 5 stages.
- Taba in SOC is qualitatively different from the maintained-structure type of dissipative structures. A power law is "the statistical footprint of numerous generation events" — even if individual events disappear, the statistical structure remains. This can be called a statistical-structure type of Taba. However, facile claims of power-law distributions risk falling into "can explain anything = explains nothing," and strict statistical testing procedures are indispensable.

---

## Key Entry 3: Critical Phenomena and Universality (Wilson)

- Critical phenomena are the rigorous physical theory of phase transitions. With Wilson's renormalization group theory (1971, Nobel Prize in Physics 1982), the behavior of systems at critical points came to be described in a unified manner.
- Singular phenomena occur at critical points. Correlations between the constituent elements of a system reach infinitely far, and the system as a whole becomes scale-invariant. Imagine the moment water reaches its boiling point, or the moment a ferromagnet passes through its Curie temperature. At that single point, microscopic fluctuations determine macroscopic behavior.
- **As a matter of fact**: At the critical point, the correlation length diverges and the whole system becomes scale-invariant. Systems that share the same critical exponents exist across different substances (water and ferromagnets, etc.). This is universality. The renormalization group is a mathematical method for tracing the behavior of systems under scale transformation, and the flow to a fixed point characterizes critical phenomena (Wilson 1971, 1983).
- **As an interpretation of structure**: Here we focus on two structural features. First, that the critical point functions as "the threshold where all scales couple." Second, that universality classes function as "common structures beyond microscopic details." The level of similarity is structure, reading both the mathematically formulated threshold structure and the common pattern beyond details.
- **As an interpretive reading**: A steady state staying in one phase (Ba) → fluctuations growing near criticality (Wave) → the critical point, the "threshold" where all scales couple (En) → the new phase being established (Uzu) → the structure beyond microscopic details remaining as a universality class (Taba). The critical point is the most rigorous physical description of En. There, all elements of the system are connected, the outcome is undetermined, and passing through directly gives birth to a new phase.
- The concept of universality is suggestive for the survey as a whole. The question "why do different systems show the same behavior" is structurally congruent with the fundamental question of the survey "why does the same 5-stage structure appear in different academic domains." However, this analogy itself is at the hypothesis stage, and whether the concept of universality in physics can be directly applied to creative processes remains unresolved.

---

## Cross-Cutting Patterns

![Domain — Cross-Cutting Patterns Diagram](https://uminomae.github.io/pjdhiro/assets/creation/img/svg/domains/ja/D29-03-cross-patterns-svg.svg)

- The following patterns were repeatedly confirmed across the 10 theories of complexity science
- All 10 theories have some aspect of the "threshold" as their central theme
- Particularly strong correspondence is confirmed in 4 theories (autocatalytic sets, critical phenomena, percolation, autopoiesis), and complexity science can be said to be the domain in which En of the 5-stage model is most thickly illuminated
- Across the 10 theories, it is confirmed that En is realized in at least 5 different forms

---

## Unresolved Questions

- Whether the 3 types of Taba (maintained-structure type, statistical-structure type, topological type) should be reflected in the definition of Taba in the 5-stage model. The current definition encompasses all of these, but explicitly distinguishing them may improve precision.
- Whether the "universality classes of creation" suggested by the universality of critical phenomena can become a verifiable hypothesis. While it is attractive as a physical explanation for why the same 5-stage pattern appears across different scales and domains, it remains at the hypothesis stage.
- There is a gap between the conceptual insight and mathematical formulation of autopoiesis. The finding of "self-production of boundaries" is structurally important, but in terms of formal verifiability it does not match other theories.
- The edge of chaos is the most directly connected conceptually to "remaining at the threshold" in the 5-stage model, but the operational definition of the hypothesis itself has not been established, and the risk of tautology that "the interesting thing about interesting places is that they are interesting" has been pointed out (Mitchell et al. 1993).

---

## Conclusion

- This survey examined the structural similarity of 10 theories in complexity science to the 5-stage model
- The most established finding is that complexity science is "the study of En"
- As compelling findings: that En has at least 5 realization types, that Taba has at least 3 types, and that multiple different mechanism descriptions exist for the En→Uzu transition
- Remaining at the hypothesis stage are the question of whether the universality concept from critical phenomena can explain structural similarities across 30 domains, and whether the operational definition of the edge of chaos will be established
