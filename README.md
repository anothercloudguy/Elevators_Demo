
-----

# 🏢 Elevators\_Demo: Simulating Request Management with the Elevator Algorithm

-----

## 🚀 Project Overview

Welcome to **Elevators\_Demo**, an interactive web-based simulation that visually demonstrates the **Elevator Algorithm (SCAN)** in action. While this project simulates the movement of elevators in a building, the underlying principles are far-reaching, applicable to diverse queuing and resource management challenges in computer science and real-world scenarios.

This demo allows you to:

  * Configure a virtual building with **1 to 20 floors** (including the ground level).
  * Operate with **1 to 3 elevators**.
  * **Visually observe** how elevators respond to calls from different floors.
  * **Understand the logic** behind efficient request handling in dynamic environments.

-----

## 🎯 The Elevator Algorithm (SCAN) Explained

At its core, the Elevator Algorithm (also known as SCAN) is a disk scheduling algorithm that minimizes the total head movement of a disk's read/write head. It derives its name from its similarity to how an elevator operates in a building:

  * **Directional Movement:** The "elevator" moves in one direction (up or down), servicing all requests (stops) it encounters along the way.
  * **Endpoint Reversal:** It continues in that direction until there are no more requests in its path or it reaches the end of its travel range (the highest or lowest floor/track).
  * **Direction Inversion:** Once it reaches an end or exhausts requests in one direction, it reverses its course to attend to requests in the opposite direction.

-----

## 💡 Beyond Elevators: Real-World Applications

The powerful logic of the Elevator Algorithm extends far beyond just managing building elevators. It's a fundamental concept used to optimize:

  * **Operating Systems:** Efficiently scheduling disk I/O (Input/Output) requests, minimizing seek time for hard drive read/write operations. This improves overall system responsiveness and data throughput.
  * **Public Services:** Managing waiting queues in high-traffic environments like banks or hospitals, ensuring a fair and relatively efficient flow of service.
  * **Network Protocols:** Optimizing data packet processing and routing.
  * **Manufacturing & Logistics:** Streamlining resource allocation and task execution in automated systems.

-----

## 📊 Key Performance Metrics Addressed by SCAN

In the context of disk scheduling, evaluating the Elevator Algorithm involves assessing several critical metrics, which this simulation visually represents through the elevator's efficiency:

  * **Seek Time:** The time taken for the disk head (or elevator) to move to the desired track (or floor). SCAN aims to minimize this by grouping requests.
  * **Rotational Latency:** The time for the desired sector to rotate under the read/write head. (While not directly simulated in the UI, it's a core concept in disk scheduling.)
  * **Transfer Time:** The time required to read or write the actual data once the location is reached.
  * **Throughput:** The total number of I/O requests (or passenger requests) completed per unit of time. A higher throughput indicates better efficiency.
  * **Average Response Time:** The average duration a request waits to be serviced from its generation.
  * **Variance of Response Time:** How consistent the response times are. Low variance indicates fairness, meaning no single request waits an excessively long time.

-----

## 🛠️ Development & Technology

This project is built using standard web technologies, making it accessible and easy to understand:

  * **HTML:** Provides the foundational structure of the building, floors, elevators, and control panels.
  * **CSS:** Styles the entire interface, ensuring a clear and intuitive visual representation. Crucially, CSS transitions are used to create smooth, realistic elevator movements.
  * **JavaScript:** The brain of the simulation. It dynamically generates the building based on user input, manages elevator states, implements the core SCAN algorithm logic for request prioritization and movement, and updates the visual display in real time.

The JavaScript implementation includes:

  * Dynamic creation of floors and elevator shafts.
  * Event handling for user calls (buttons on each floor).
  * A robust queuing system for managing pending requests.
  * Logic for assigning requests to the most suitable elevator, considering proximity and current direction.
  * Simulation of elevator movement speed and door open/close delays.
  * Visual indicators for current floor, direction (up/down/idle), and active calls.

-----

## 🚀 How to Run the Demo

1.  **Clone the Repository:**
    ```bash
    git clone [your-repository-url]
    cd elevator_simulator
    ```
2.  **Open `index.html`:** Simply open the `html/index.html` file in your preferred web browser.

-----

## 🤝 Contribution

Feel free to explore the code, suggest improvements, or contribute to this project. Your insights are welcome\!

-----