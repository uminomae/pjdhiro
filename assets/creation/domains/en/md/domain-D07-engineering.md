# Investigation of Structural Similarity Between the Five-Stage Model and Engineering / Information Science

![Investigation of Structural Similarity Between the Five-Stage Model and Engineering / Information Science — Structural correspondence diagram](https://uminomae.github.io/pjdhiro/assets/creation/img/svg/domains/en/domain-D07-engineering.svg)

## 1. Purpose and Question of the Investigation

This report was prepared to answer the following question.

> Do theories in engineering and information science correspond structurally to the five-stage model (Field, Wave, Edge, Vortex, Bundle)?

What this report addresses is the presence and degree of such structural correspondence. It does not answer other questions. The purpose of the report is not to justify any particular idea or theory, but only to communicate the results of an investigation into structural similarity accurately.

Engineering and information science occupy a distinctive position among the thirty domains investigated. The theories and systems in this domain do not describe natural phenomena; they are intentionally designed by human beings. Accordingly, any structural correspondence found here should be taken not as evidence that "the five stages are a structure of nature," but as evidence of a different kind, namely that "the five stages function as useful design principles." This distinction is important for interpreting the findings.

## 2. Method of Investigation

### Objects and Selection Criteria

Ten theories and technologies were selected from engineering and information science that have structures in which "error or deviation functions as a driving force for generating or maintaining order." The aim of selection was to cover the major subfields of engineering and information science, including control engineering, machine learning, information theory, software engineering, and cryptography.

### Evaluation Procedure

For each theory, structural correspondence was examined from multiple independent perspectives. More concretely, we checked whether elements corresponding to each stage of the five-stage model, Field, Wave, Edge, Vortex, and Bundle, were present within the theory, and then judged the strength of correspondence. For the stage of Edge in particular, the following three conditions were used as criteria.

- **Relational network**: Is there a structure in which multiple elements are coupled and affect one another?
- **Indeterminacy**: Is there a state in which the outcome is not yet fixed in either direction?
- **Connection to Vortex**: Does that state lead into a self-sustaining loop or repeated process?

### Criteria of Judgment

- **Strong structural correspondence**: Clear counterparts exist for all five stages, and the three conditions of Edge are satisfied
- **Partial correspondence**: Correspondence is recognized for most of the five stages, but one or more stages, especially Vortex, are weakly represented
- **Conditional correspondence**: Correspondence is present, but the special character of the theory requires an interpretation different from the standard application of the five stages

### Limits of the Investigation

This investigation has the following limits.

- It does not cover every field of engineering and information science. Robotics, materials engineering, and civil engineering are not included
- Structural correspondence in "designed systems" may differ in character from independent structural similarity, because it may result from designers referring to similar principles
- For the professional details of each theory, verification by specialists in the relevant fields would be desirable

## 3. Overview of the Model

To make the findings intelligible, the stages of the five-stage model are defined below.

| Stage | Definition |
|------|------|
| **Field** | An undifferentiated state. Initial conditions in which neither direction nor structure has yet been determined |
| **Wave** | A stage of exploration in which multiple directions diverge and compete |
| **Edge** | A state of tension in which opposing elements coexist without converging on either side |
| **Vortex** | A stage in which a new coherence or order spontaneously arises from within that tension |
| **Bundle** | A stage in which form becomes determinate and stabilizes as a reusable structure |

This model has been proposed as a description of a structure common to creative processes. The present investigation tests the extent to which these five stages correspond structurally to theories in engineering and information science.

If these definitions already generate discomfort, that itself is an important perspective for the investigation. Retaining that discomfort while reading may make it possible to assess the findings more critically.

## 4. Findings: Overall Picture

After evaluating ten theories and technologies from engineering and information science, the investigation confirmed strong structural correspondence overall.

| Theory / Technology | Strength of Correspondence | Special Note |
|-----------|-----------|---------|
| Feedback control (PID control) | Strong | Clear correspondence for all five stages. Mathematically testable |
| PDCA improvement cycle | Partial | Correspondence at organizational scale. Edge has a strongly analytical character |
| TCP congestion control (AIMD) | Partial | Distributed correspondence without central control. Mathematical convergence already proven |
| Deep learning (backpropagation) | Strong | The loss function satisfies the three conditions of Edge |
| Information theory (Shannon capacity) | Conditional | A special structure in which Bundle is defined first. Vortex is weak |
| Compressed sensing | Conditional | Vortex depends on whether an iterative algorithm is adopted |
| Reinforcement learning (TD learning) | Strong | The exploration-exploitation dilemma satisfies the three conditions of Edge |
| Evolutionary computation (genetic algorithms) | Partial | An engineering reimplementation of natural selection. Possible designer bias |
| Software refactoring | Partial | Correspondence is mainly metaphorical. Edge is a matter of continuous judgment |
| Cryptographic protocols (key exchange) | Partial | Authentication branching corresponds to Edge. Vortex is weak |

Of the ten cases, three showed strong structural correspondence, five showed partial correspondence, and two showed conditional correspondence. No theory failed to show correspondence altogether, but the strictness of correspondence varies.

## 5. Findings: Domain-Specific Insights

### 5.1 Feedback Control: The Most Direct Structural Correspondence

Feedback control is a closed-loop structure in which the output of a system is observed, the difference from a target value (the error signal) is detected, and the input side is corrected accordingly. It was systematized in Wiener’s cybernetics (1948), with Maxwell’s stability analysis of the governor (1868) as an important precursor.

This theory shows the most direct structural correspondence with the five-stage model.

- **Field**: The setting of the plant model and target value corresponds to the "stage" on which creation occurs
- **Wave**: Disturbances or changes in the target value generate an error signal between target and reality, `e(t) = r(t) - y(t)`. This error becomes the force that drives the system
- **Edge**: The point at which sensor, controller, and actuator are connected corresponds to Edge. Measured values (information) and control inputs (material operations) are coupled there, and disturbances and model uncertainty place the output in an indeterminate state
- **Vortex**: The iterative error-correction loop of PID control operates in a self-sustaining way. Its continued autonomous response to disturbances matches the defining feature of Vortex
- **Bundle**: Convergence to prescribed performance, a stable point or trajectory. Stable patterns quantified as control specifications, such as overshoot, settling time, and steady-state error, correspond to Bundle

What deserves particular attention is the precise correspondence between the three components of PID control and the elements of the five-stage model. In PID control, the P term (proportional term) reacts immediately to present error, the I term (integral term) accumulates and retains past error, and the D term (derivative term) uses the rate of change of error for prediction. The structure of these three components has a mathematically testable correspondence.

Furthermore, the stability conditions shown by the Nyquist stability criterion and the Bode plot mathematically prove that "the amount of feedback has an appropriate range." If feedback is excessive, the system oscillates and destabilizes; if it is insufficient, the target is not reached. Phase margin and gain margin provide quantitative indicators of this appropriate range.

The Kalman filter (1960) is a method of recursive Bayesian estimation that optimally estimates state from noisy observations, and in integrating process noise and observation noise while retaining their covariance structure, it is an extremely precise mathematical model of the structure of "retaining and using error information."

Feedback control repeatedly appears across multiple scales, from the component level (feedback circuits in op-amps) to the organizational level (the PDCA cycle), and even to the social level (market equilibrium mechanisms), as the structure of detecting error, feeding it back, and correcting it.

### 5.2 Deep Learning: The Spontaneous Formation of Internal Representation

Deep learning is a method for iteratively adjusting connection weights in multilayer neural networks so as to reduce output error. Backpropagation was proposed by Linnainmaa (1970) as reverse-mode automatic differentiation, by Werbos (1974) as an application to neural networks, and was experimentally demonstrated and popularized by Rumelhart, Hinton, and Williams (1986) in *Nature*.

Its correspondence with the five-stage model is as follows.

- **Field**: The network structure (architecture) and initialization of weight space form the "stage" of learning
- **Wave**: Error gradients backpropagate through the layers by way of the chain rule. Error information at the output layer flows back to layers close to the input
- **Edge**: The loss function corresponds to Edge. By quantifying the difference between teacher signal and model output, it drives the entire learning process. Because the loss landscape is high-dimensional, the final point of convergence is indeterminate, and multiple good solutions exist. The loss function also connects directly to the gradient-descent loop. The property that "learning stops when loss is zero" corresponds with precision to the core of the five-stage model: if there is no error, nothing happens
- **Vortex**: Iterative weight updates by SGD (stochastic gradient descent) or Adam. The stochasticity of minibatches supports exploration, while learning-rate scheduling controls convergence
- **Bundle**: Learned internal representations, features, and internal models. Stable patterns quantified as task performance correspond to Bundle

What is unique about deep learning is the spontaneous formation of internal representation. Feedback control operates on an external plant, whereas deep learning transforms representations inside the model. Error at the output layer, through backpropagation, changes "the way the world is seen" by layers closer to the input. Structurally, this is isomorphic to predictive-processing theories in neuroscience (D08), where prediction error updates higher-level models.

Residual connections in ResNet (He et al. 2016) also prevented vanishing gradients and made it possible for error information to reach deep layers. The finding that "deeper learning becomes possible by not processing error at the surface alone, but by carrying it into deeper layers" carries an important engineering implication.

### 5.3 Reinforcement Learning: Branching Between Exploration and Exploitation

Reinforcement learning is a framework in which an agent learns a policy that maximizes reward signals through interaction with an environment (Sutton & Barto 2018). The mathematical basis is the Markov decision process (MDP).

What is especially important in this theory is the exploration-exploitation tradeoff. The branching between exploiting already known high-reward actions and exploring unknown possibilities satisfies the three conditions of Edge.

- **Relational network**: State knowledge, reward experience, and uncertainty are coupled
- **Indeterminacy**: The value of unexplored regions remains uncertain
- **Connection to Vortex**: The results of exploration connect through TD error to the policy-improvement loop

In TD learning (temporal difference learning, Sutton 1988), prediction error (`TD error: δ = r + γV(s') - V(s)`) functions as the learning signal. This structure, which quantifies the discrepancy between prediction and reality, corresponds to Wave in the five-stage model. Its connection to the dopamine reward-prediction-error hypothesis of Schultz et al. (1997) provides a direct bridge to neuroscience (D08).

The dilemma in reinforcement learning, that "new reward sources cannot be found without exploration, but exploration has costs," can be interpreted as an engineering quantification of the tension structure characteristic of Edge in the five-stage model. The optimal balance between exploitation, taking the currently known best action immediately, and exploration, retaining unknown possibilities and investigating them, has been treated mathematically through strategies such as epsilon-greedy, UCB, and Thompson sampling.

### 5.4 Information Theory: A Special Structure in Which Bundle Is Defined First

Information theory, founded by Shannon (1948), abstracted communication under noise mathematically and defined information quantity (entropy, `H = -Σp log p`) and channel capacity, `C = max I(X;Y)`. The coding theorem, according to which there exist codes whose error probability can be made arbitrarily small when the transmission rate is below channel capacity, is one of the most basic achievements in information science.

In correspondence with the five-stage model, Shannon capacity is the purest formulation of Bundle. As a limit concept, "up to here is possible, beyond here is impossible," it represents a stable structure that is reachable but cannot be exceeded.

At the same time, information theory has a special feature that differs from the standard application of the five stages. Ordinarily, the five stages progress temporally from Field to Bundle. Shannon capacity, however, is mathematically fixed the moment the channel model (Field) is defined. In other words, "Bundle exists first." This is an interesting case showing that Bundle in the five-stage model is not always the endpoint of a process; it can also exist structurally in advance.

Moreover, the element corresponding to Vortex depends on the coding system. In systems with iterative decoding, such as LDPC codes and turbo codes, iterative convergence of belief propagation forms a clear Vortex. In non-iterative decoding, such as Hamming codes, the Vortex element becomes weak.

### 5.5 Compressed Sensing: Reconstruction from Incomplete Observation

Compressed sensing is a method for exactly reconstructing signals from fewer observations than would ordinarily be required by exploiting sparsity in the signal (Donoho 2006; Candes, Romberg, and Tao 2006). It has been put into practice in fast MRI imaging (Lustig et al. 2007), astronomical observation, radar, and other areas.

In correspondence with the five-stage model, the situation of "having only partial observations" corresponds to Wave; the coupling of data-consistency constraints and `l1` regularization corresponds to Edge; iterative optimization algorithms such as ISTA and ADMM correspond to Vortex; and the reconstructed signal corresponds to Bundle.

What is unique about this theory is exact reconstruction from an underdetermined system. Ordinarily, when the number of equations is smaller than the number of unknowns, the solution is indeterminate. But by adding the structural assumption of sparsity, a unique solution can be obtained. This paradoxical principle, that "it is precisely because something is lacking that structure becomes visible," sharply illuminates the role of Field in the five-stage model as structural assumption. The richer the Field, the fewer observations are needed to arrive at Bundle.

However, the correspondence of Vortex depends on whether an iterative algorithm is adopted. When `l1` optimization has a closed-form solution, the process corresponding to Vortex is absent. For that reason, the correspondence here is judged to be conditional.

## 6. Cross-Cutting Patterns

Across the ten cases investigated, the following patterns were repeatedly confirmed.

### 6.1 The Shared Structure That Error Is the Driving Force

All ten cases possess a structure in which "the difference between prediction and reality" functions as the driving force. The error signal `e(t)` in feedback control, the loss function in deep learning, TD error in reinforcement learning, noise in information theory, incomplete observation in compressed sensing: although their forms differ, the structure in which a state of "not enough" or "being different" drives the behavior of the system is consistent across them.

This commonality shows that error-driven design occupies a central place as a design principle in engineering and information science. The fact that Wave, understood as the occurrence and propagation of error, is independently established in engineering design is strong circumstantial support for structural similarity with the five-stage model.

### 6.2 Designed Creation and Natural Creation

The distinctive feature of engineering and information science is that the five-stage structure is intentionally built in by designers. This stands at the opposite pole from the "unconscious creation" of astronomy (D06).

Genetic algorithms are an engineering reimplementation of natural selection (D04), constructed by designers with explicit reference to natural processes. PID control, by contrast, developed independently before the concept of the five-stage model, and so cannot be reduced to designer bias. This distinction is important. Structural correspondence in designed systems is strong practical evidence that the five stages function as useful design principles, but it is different in character from evidence that the five stages are structures of nature.

### 6.3 Cross-Scale Structure as a Hierarchy of Abstraction

All ten cases are applicable across multiple levels of abstraction. Feedback control scales from components to society; PDCA scales from tasks to organizations; deep learning scales from neurons to networks. Whereas astronomy (D06) traverses physical spatial and temporal scales, engineering and information science exhibit cross-scale structure as a hierarchy of abstraction.

### 6.4 Variation in the Correspondence of Vortex

There is variation in how clearly Vortex, self-sustaining repeated process, is represented. In theories with explicit iterative loops, such as PID control and SGD, Vortex appears strongly. In information theory, the existence proof of Shannon capacity, and in compressed sensing where closed-form solutions exist, Vortex is weak. Whether the five stages can also hold in non-iterative systems remains an unresolved question.

## 7. Unresolved Questions

The investigation leaves the following questions unresolved.

1. **Systematizing designer bias**: Is there a systematic way to distinguish, theory by theory, whether structural correspondence in engineering is the result of designers referring to similar principles or the result of arriving independently at the same structure?

2. **Bridging quantitative and qualitative error**: In engineering, "error" is numerically measurable, as in `e(t)` or the value of a loss function. In human creative processes, by contrast, "error" is qualitative, experienced as a sense of discomfort or mismatch. Is there a model that can bridge the two? Code smell in software refactoring, an instance in which qualitative discomfort has been systematically classified, may offer a clue.

3. **Whether the five stages hold in non-iterative systems**: In systems such as information theory and some forms of compressed sensing, where no iterative process corresponding to Vortex exists, do the five stages still hold? Or does the five-stage model essentially presuppose iterative process?

4. **The diversity of Bundle**: Shannon capacity in information theory defines a limit of communication efficiency, whereas cryptographic protocols define a limit of security. The fact that different kinds of Bundle can arise from the same mathematical foundation suggests that Bundle in the five-stage model may admit multiple evaluative axes

5. **The boundary between metaphorical correspondence and structural isomorphism**: The correspondence between the three components of PID control and the five-stage model is mathematically testable and close to structural isomorphism, whereas the correspondence between code smell and felt discomfort is metaphorical. Even within a single domain, the strictness of correspondence varies, and that boundary needs to be systematized

## 8. Conclusion

The investigation of ten theories and technologies in engineering and information science confirms structural correspondence with the five-stage model in every case, though to different degrees. In feedback control, deep learning, and reinforcement learning in particular, clear counterparts can be identified for all five stages, and the three conditions of Edge, relational network, indeterminacy, and connection to Vortex, are satisfied as well.

What these findings mean for the theory can be summarized in three points.

**First, "error-driven" structure is independently established as a central design principle of engineering, and the structural correspondence with the five-stage model is unlikely to be a mere coincidence.** PID control is a theory that developed before the concept of the five-stage model, and its structural correspondence with that model was reached independently. This is strong circumstantial support for structural similarity.

**Second, structural correspondence in engineering is evidence of usefulness as a design principle, and is different in character from evidence of natural structure.** In theories such as genetic algorithms, which were designed with explicit reference to natural processes, the independence of the correspondence is not guaranteed. Preserving this distinction is indispensable for an accurate interpretation of the findings.

**Third, the strictness of correspondence varies.** The correspondence of the three components of PID control is mathematically testable, whereas the relation between code smell and felt discomfort is metaphorical. Once this range is recognized, the correspondence between the five stages and each theory must be evaluated individually.

To state the degree of confidence honestly: the structural correspondence with feedback control, deep learning, and reinforcement learning is close to determinate. The correspondence with information theory and compressed sensing is compelling but conditional. The correspondence with software refactoring remains at the level of hypothesis. The findings should be assessed with those differences in evidential temperature in mind.
