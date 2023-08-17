# Single - Spin Experiment from Quantum Mechanics

![Experiment 3](/assets/1.png)

## The Anatomy of a Single-Spin Experiment
The experimental setup he describes involves a single spin which can be in either an “up” or a “down” state. We also have a detector — a measuring device that gives a measurement of “+1” if it detected the spin in the up state, or “-1” if it detected the spin in the down state.

In the simplest scenario, we start with the spin in the up state and we do a measurement. In this case, we will always get a measurement of +1. Similarly, if we start with the spin in the down state, we will always get a measurement of -1.

We can extend the experiment by allowing both the spin and the detector to be in different directions in space (as opposed to being only up and down), while still only having two states for simplicity (up and down for the spin, +1 and -1 for the detector). The simplest scenario of this extension is when the detector is pointed in the opposite direction to the direction of spin. In this case, we will get a measurement of -1 every time. In this sense, what the detector is measuring is whether the spin is along the direction of measurement (+1) or opposite to the direction of measurement (-1).

Both the above scenarios produce deterministic results — no matter how many times you repeat the experiment — assuming you always start with the spin in the up state (or any fixed state)— you will always get the same measurement. Things become interesting when you point the detector at an angle to the spin vector. The detector cannot measure the angle, it can only produce a +1 or a -1. When you run this experiment multiple times — again, assuming you always start with the spin in the up state— you will find that you get a +1 sometimes and a -1 at other times. Once you do a measurement though, you will find that the spin vector is now parallel to the detector — along the measurement direction if you measured +1, and opposite to the direction if you measured a -1. So any subsequent measurements you do will always give the same answer. If you reset your experimental setup and start again with the spin in the up state, you will find a random answer again.

If this setup feels contrived to you, that’s because it is. It is a simple analogy meant to emulate quantum mechanics for a single particle with two states. The spin aligning parallel to the detector after measurement is equivalent to the collapse of the wave function that you may have come across before.


## Experiment #1

Experiment #1 allows you to take a spin in the up state and perform a measurement in any direction. If the measurement vector is at an angle to the spin vector, you will notice that you sometimes get a +1 or -1 (assuming you press “Reset Measurement” after each turn). If you use the default measurement direction of the +X-axis, you will notice that you get a +1 about half the time and -1 the other half time. 

### Why is that the case? 
The way the experiment is designed, if you take the seemingly random measurements (with fixed measurement and spin directions) and compute the average, the result will be approximately the cosine of the angle between the two directions. This is the equivalent of quantum operators having randomness but their expectation values being deterministic. Quantum mechanics reduces to classical mechanics when we look at things in an average sense.


## Experiment #2

Experiment #2 allows you to take multiple measurements in any direction. It shows you the number of +1 and -1 measurements. It also shows you both the expected and the actual average value obtained from the experiment. The experimental value will approach the theoretical value as you increase the number of simulation steps.

When you run this experiment, you will notice a histogram that shows the number of times a +1 or -1 was measured. You also see the average, both theoretical (computed from the cosine of the angle between the spin and measurement directions) and the experimental average (literally the average of all the +1s and -1s measured). The experimental value will approach the theoretical value as you increase the number of simulation steps. A value of 100 steps usually works well, but feel free to try 1000 or 10k, or even higher.


## Experiment #3

Experiment #3 shows how the spin vector and its measurements behave in a time-varying system. In this case, we have a uniform magnetic field pointing in the +z-direction. The spin vector precesses around the magnetic field axis but in an average sense — if you calculate the average measurement (like Experiment #2 but along each of the x, y, and z directions) at each instant and plot it against time, you will see that it moves in a circular orbit around the axis of the magnetic field. This is analogous to the precession of a gyroscope in classical mechanics. Also shown are the variations in the x and y components (the z-component is not shown because it is along the magnetic field direction and therefore does not change) and the radius of the precession orbit. The orbital radius changes (when measured experimentally) because we use discrete time steps; smaller time steps mean the experimental value is closer to the theoretical value.

The idea of quantum mechanics reducing to classical mechanics in an average sense is true not only for a static system but also for a system changing with time. To illustrate this, Lenny puts the spin in a magnetic field. To keep things simple, the magnetic field is taken to be uniform (not changing with time) and pointing in the +z direction. Lenny also introduces the concept of “components” of the spin, which we obtain by measuring the spin along the x, y, and z axes. If we do repeated measurements, we can calculate the average along each of the three directions à la Experiment #2. We can think of these averages as components of the “average spin” vector.


## Reference
* Professional Three.js Course - https://shop.codedolt.com/
* Quantum Mechanics Course - https://theoreticalminimum.com/courses/quantum-mechanics/2012/winter
* Vega Visualization - https://vega.github.io/
* Ref - https://math.stackexchange.com/questions/1385137/calculate-3d-vector-out-of-two-angles-and-vector-length
* Ref - https://stackoverflow.com/questions/30011741/3d-vector-defined-by-2-angles
* Spin measurement dot product - Lecture 2 https://www.youtube.com/watch?v=a6ANMKRBjA8&ab_channel=Stanford
* Spin in magnetic field - Lecture 5 https://www.youtube.com/watch?v=sgQafF7tLSo&ab_channel=Stanford
