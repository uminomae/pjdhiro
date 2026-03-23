---
title: "Engineering & Information Science - Structural Correspondence with the Five-Stage Model"
lang: en
version: "1.0"
date: "2026-03-21"
generator_model: "claude:claude-opus-4-6"
source: "domain-D07-engineering-academic-ja.md"
type: presentation
---

## Engineering & Information Science

Structural correspondence survey with the five-stage model (Field · Wave · Edge · Vortex · Bundle)

---

## Survey Overview

- **Survey targets**: Major theories in engineering and information science
- **Research question**: Do the theories of engineering and information science correspond structurally to the five-stage model?
- **Results**: Partial correspondence in 1 case, conditional correspondence in 1 case

---

## Overview of the Five-Stage Model

| Stage | Definition |
|-------|-----------|
| Field (ba) | An undifferentiated state. The initial condition in which no direction or structure has yet been established |
| Wave (nami) | The stage of exploration in which multiple directions diverge and compete |
| Edge (en) | A state of tension in which opposing elements coexist without converging toward either side. The place where elements meet at a boundary, influence each other, and relationships emerge |
| Vortex (uzu) | The stage in which a new coherence (order) arises spontaneously from within the tension |
| Bundle (taba) | The stage in which form is established and stabilizes as a reusable structure |

---

## Overview of Structural Correspondences

![Domain — Theory x 5-Stage Correspondence Matrix](https://uminomae.github.io/pjdhiro/assets/creation/img/svg/domains/ja/D07-02-theories-map-svg.svg)

| Confidence | Theory / Technology | Assessment |
|------------|---------------------|------------|
| Near-definitive | Feedback control, deep learning (backpropagation), reinforcement learning | Error-driven feedback loops correspond clearly to all five stages |
| Probable | TCP congestion control, evolutionary computation (genetic algorithms), PDCA improvement cycle | Correspondence is clear, but reservations remain regarding the character of the Edge and designer bias |
| Conditional | Information theory, compressed sensing, cryptographic protocols, software refactoring | Partial correspondence exists, but the Vortex is weak or the character of the Bundle is special |

---

## Key Entry 1: Feedback Control Systems (Wiener, Kalman)

- Feedback control is a closed-loop structure in which the output of a system is observed, and the deviation (error signal) from the target value is fed back to the input side for correction. Systematized by Wiener (1948) in cybernetics, it traces back to Maxwell's (1868) stability analysis of the governor. PID control is used in over 90% of industrial control applications (Astrom & Hagglund 2006), determining the correction amount through three components: proportional, integral, and derivative. The Kalman filter (1960) is a recursive Bayesian estimator that makes optimal state estimates from noisy observations.
- **As established fact**: Feedback control is organized around the error signal e(t) = r(t) - y(t). The difference between the target value r(t) and the system output y(t) is fed to the controller, which corrects the system through an actuator. The Nyquist stability criterion (1932) and Bode diagrams quantify the conditions under which this feedback loop converges stably. Phase margin and gain margin serve as stability indicators. The integral term of PID control retains accumulated past error to eliminate steady-state offset, and the derivative term detects the rate of change of error to apply anticipatory correction.
- **As a reading**: Here we read a structure in which the difference between target and reality drives the entire system through a closed loop. The level of analogy is **structure**. What we focus on is the arrangement of elements — sensor, controller, actuator, and plant forming a closed loop, with the error signal circulating through this loop to achieve self-correction. It is not the physical properties of individual elements, but the arrangement itself — "error fed back within a closed loop" — that supports the correspondence with the five stages.
- **As interpretation**: The model of the controlled object and the design specification correspond to the Field. The generation of the error signal e(t) is the Wave; disturbances and target value changes produce this wave. The connection points among sensor, controller, and actuator — the interface where information (measurement) and matter (control input) are coupled — are the Edge. At these connection points, output is not determined due to disturbances and model uncertainty, and the control loop closes to connect to the Vortex (self-sustaining iterative correction). The iterative error correction of PID control is the Vortex, and convergence to specified performance — a stable pattern quantified as overshoot, settling time, and steady-state error — is the Bundle.
- An important insight that control theory provides is the concept of "stability conditions." Feedback is not omnipotent; improper feedback causes oscillation (destabilization). Phase margin and gain margin are mathematical proofs that appropriate thresholds exist for the amount of feedback.

---

## Key Entry 2: Deep Learning — Backpropagation and Gradient Descent (Rumelhart, Hinton & Williams)

- Deep learning is a technique that iteratively adjusts the connection weights of multi-layer neural networks to reduce output error. Backpropagation was formulated as reverse-mode automatic differentiation by Linnainmaa (1970); application to neural networks was pioneered by Werbos (1974). Rumelhart, Hinton & Williams (1986) popularized it through experimental demonstrations in Nature. AlexNet (2012), Transformer (Vaswani et al. 2017), and the residual connections of ResNet (He et al. 2016) have enabled deep architectures.
- **As established fact**: Backpropagation efficiently computes gradients for each layer from the value of the output-layer loss function using the chain rule, and updates weights using stochastic gradient descent (SGD) or its variants (e.g., Adam). Research on loss landscapes shows that saddle points dominate in high-dimensional loss functions and local optima are rare (Dauphin et al. 2014). Batch normalization (Ioffe & Szegedy 2015) stabilizes training.
- **As a reading**: Here we read a structure in which output errors propagate back through all layers and internal representations are spontaneously formed. The level of analogy is **process**, with particular attention to the sequence "error passes through all layers, transforming representations even in layers close to the input." Whereas control theory (Section 5.1) manipulates a plant in the external world, deep learning transforms representations within the model — a key difference.
- **As interpretation**: The network structure (architecture) and weight space initialization constitute the Field. The loss function — the difference between the teaching signal and the model output — generates the Wave. The loss function is not merely a number but is the interface of a relationship that couples input data, network output, teaching signal, and loss computation; this corresponds to the Edge. Which solution is ultimately reached from the current position on the loss landscape is uncertain, and the iterative updates of SGD drive the system as the Vortex. The stochasticity of mini-batches aids exploration, and learning rate scheduling controls convergence. The learned internal representations — features and internal model quantified as task performance — constitute the Bundle.
- The fact that a high-dimensional loss landscape has multiple good solutions is a computational confirmation that "different Bundles can emerge from the same Field" in the five-stage model.

---

## Key Entry 3: Reinforcement Learning — Reward Signals and Exploration-Exploitation (Sutton & Barto)

- Reinforcement learning is a framework in which an agent interacts with an environment and learns a policy that maximizes a reward signal. The Markov decision process (MDP) is the mathematical foundation, and the textbook by Sutton & Barto (2018) is the standard reference. TD learning (temporal difference learning, Sutton 1988) uses prediction error (TD error: delta = r + gamma V(s') - V(s)) as the learning signal. This TD error connects to the reward prediction error hypothesis of dopamine in neuroscience (Schultz et al. 1997), serving as an important bridge between engineering and neuroscience.
- **As established fact**: At the core of reinforcement learning is the exploration-exploitation tradeoff. This is the choice between exploiting known high-reward actions or exploring unknown possibilities; epsilon-greedy, UCB, and Thompson sampling are representative strategies. AlphaGo/AlphaZero (Silver et al. 2016, 2017) are success cases of deep reinforcement learning, and RLHF (reinforcement learning from human feedback) is used for alignment of large language models.
- **As a reading**: Here we read a feedback structure in which reward prediction error drives policy improvement, and the branching structure of exploration-exploitation. The level of analogy is **mechanism**. In control theory (Section 5.1) and deep learning (Section 5.2), "where the error is" is given as a loss function or target value, but in reinforcement learning "where the error is itself is unknown" — a key difference. The value of unexplored areas is uncertain; without exploration, new reward sources cannot be found.
- **As interpretation**: The environment (MDP) and the agent's initial policy constitute the Field. The reward signal and TD error — the difference between predicted and realized values — drive the system as the Wave. The exploration-exploitation branch point corresponds to the Edge. Here, state, action, reward, and value estimates are coupled, and the optimal action is not determined due to the probabilistic nature of the environment and incomplete knowledge. The policy improvement loop (iterative updating of value function and policy based on TD error) is the Vortex, and the learned policy — action rules approximating the optimum — is the Bundle.
- The exploration-exploitation dilemma expresses most clearly in engineering the undecidedness that characterizes the Edge of the five stages. Relying only on known exploitation leads to local optima; without exploration, new structures cannot be reached.

---

## Cross-Cutting Patterns

![Domain — Cross-Cutting Patterns Diagram](https://uminomae.github.io/pjdhiro/assets/creation/img/svg/domains/ja/D07-03-cross-patterns-svg.svg)

- Four structural patterns were confirmed repeatedly across 10 theories and technologies in engineering and information science
- **First, "precise quantification of error" is the distinctive contribution of engineering**
- **Second, "two types of Vortex" become visible**
- **Third, the contrast between "designed creation" and "natural creation" is clear**

---

## Open Questions

- **The designer bias problem**: Whether the structural analogies in engineering are "the result of designers referencing the five stages" or "the result of independently arriving at the same structure" has not been systematized. PID control developed historically independently of the five-stage model, whereas genetic algorithms were explicitly designed with reference to natural selection. This distinction affects the weighting of structural analogy as evidence.
- **Absence of the Vortex**: In information theory (Shannon capacity) and parts of compressed sensing (when closed-form solutions exist), the iterative Vortex is weak or absent. Whether the five stages hold in non-iterative systems, or whether cases lacking a Vortex remain only partial correspondences, requires clarification.
- **Prior existence of the Bundle**: In information theory, the Bundle (channel capacity) is determined simultaneously with the definition of the Field. Ordinarily the five stages proceed sequentially from Field to Bundle, but how to situate systems where the Bundle exists first is an occasion to reconsider the ordering hypothesis of the five-stage model.
- **The dimension of safety as a Bundle**: Cryptographic protocols introduce a Bundle of a different dimension — "security" — distinct from the "efficiency" that information theory optimizes. If the Bundle of the five stages can have multiple evaluation axes, it may be necessary to extend the very definition of the Bundle.

---

## Conclusion

- This survey confirmed that engineering and information science is overall a domain with probable structural analogy to the five-stage model
- Near-definitive correspondence is found in feedback control, deep learning, and reinforcement learning
- The most significant meanings of the engineering survey results for the theory are two
