document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const startButton = document.getElementById('start-simulation');
    const buildingDiv = document.getElementById('building');
    const elevatorCountInput = document.getElementById('elevator-count');
    const floorCountInput = document.getElementById('floor-count');
    const allInternalPanelsContainer = document.getElementById('all-internal-panels-container');

    // Simulation State
    let elevators = [];
    let callQueue = [];
    let simulationInterval;
    let numFloors = 0;

    // Simulation Constants
    const FLOOR_HEIGHT = 100; // px
    const TIME_PER_FLOOR = 1000; // ms
    const TIME_DOORS_OPEN = 2000; // ms

    class Elevator {
        constructor(id) {
            this.id = id;
            this.currentFloor = 0;
            this.direction = 'stopped'; // 'up', 'down', 'stopped'
            this.state = 'idle'; // 'idle', 'moving', 'doors_open', 'emergency_stop'
            this.destinationQueue = [];
            this.element = null;
            this.infoElement = null;
            this.directionIndicator = null;
            this.internalPanel = null;
        }

        openDoorsAtCurrentFloor() {
            this.state = 'doors_open';
            this.direction = 'stopped';
            this.element.classList.add('doors-open');
            this.updateVisual();

            // Reset call buttons for the current floor
            const callButton = document.querySelector(`.call-buttons button[data-floor='${this.currentFloor}']`);
            if (callButton) callButton.classList.remove('active');
            const internalButton = this.internalPanel.querySelector(`.internal-buttons button[data-floor='${this.currentFloor}']`);
            if (internalButton) internalButton.classList.remove('active');

            setTimeout(() => {
                if (this.state !== 'emergency_stop') {
                    this.state = 'idle';
                    this.element.classList.remove('doors-open');
                    this.updateVisual();
                }
            }, TIME_DOORS_OPEN);
        }

        moveTo(floor) {
            if (this.state === 'emergency_stop') return;

            // *** BUG FIX: If called to the same floor, just open doors ***
            if (this.currentFloor === floor) {
                this.destinationQueue = this.destinationQueue.filter(d => d !== floor);
                this.openDoorsAtCurrentFloor();
                return;
            }

            this.state = 'moving';
            this.direction = floor > this.currentFloor ? 'up' : 'down';
            this.updateVisual();

            const travelTime = Math.abs(floor - this.currentFloor) * TIME_PER_FLOOR;
            this.element.style.transition = `bottom ${travelTime / 1000}s linear, background-color 0.5s`;
            this.element.style.bottom = `${floor * FLOOR_HEIGHT}px`;

            setTimeout(() => {
                if (this.state === 'emergency_stop') return;
                this.currentFloor = floor;
                this.destinationQueue = this.destinationQueue.filter(d => d !== floor);
                this.openDoorsAtCurrentFloor();
            }, travelTime);
        }

        updateVisual() {
            this.infoElement.textContent = `Piso: ${this.currentFloor}`;
            this.directionIndicator.className = 'direction-indicator';
            if (this.direction === 'up') this.directionIndicator.classList.add('up');
            else if (this.direction === 'down') this.directionIndicator.classList.add('down');
            else this.directionIndicator.classList.add('stopped');

            if (this.state === 'emergency_stop') this.element.classList.add('emergency-stop');
            else this.element.classList.remove('emergency-stop');
        }

        addInternalDestination(floor) {
            if (!this.destinationQueue.includes(floor)) {
                this.destinationQueue.push(floor);
                this.destinationQueue.sort((a, b) => {
                    if (this.direction === 'up') return a - b;
                    if (this.direction === 'down') return b - a;
                    return Math.abs(a - this.currentFloor) - Math.abs(b - this.currentFloor);
                });
            }
        }

        getNextDestination() {
            return this.destinationQueue.length > 0 ? this.destinationQueue[0] : null;
        }

        stop() {
            this.state = 'emergency_stop';
            const computedStyle = window.getComputedStyle(this.element);
            this.element.style.transition = 'none';
            this.element.style.bottom = computedStyle.getPropertyValue('bottom');
            this.updateVisual();
        }

        go() {
            this.state = 'idle';
            this.updateVisual();
        }
    }

    function initializeSimulation() {
        clearInterval(simulationInterval);
        buildingDiv.innerHTML = '';
        allInternalPanelsContainer.innerHTML = '';
        elevators = [];
        callQueue = [];

        const numElevators = parseInt(elevatorCountInput.value);
        numFloors = parseInt(floorCountInput.value);

        if (isNaN(numElevators) || isNaN(numFloors) || numElevators < 1 || numFloors < 1) {
            alert('Por favor, introduce un número válido de ascensores y pisos.');
            return;
        }

        const floorContainer = document.createElement('div');
        floorContainer.className = 'floor-container';
        for (let i = 0; i < numFloors; i++) {
            const floorDiv = document.createElement('div');
            floorDiv.className = 'floor';
            floorDiv.innerHTML = `
                <div class="floor-label">Piso ${i}</div>
                <div class="call-buttons">
                    ${i < numFloors - 1 ? `<button data-floor="${i}" data-direction="up">▲</button>` : ''}
                    ${i > 0 ? `<button data-floor="${i}" data-direction="down">▼</button>` : ''}
                </div>
            `;
            floorContainer.appendChild(floorDiv);
        }
        buildingDiv.appendChild(floorContainer);

        for (let i = 0; i < numElevators; i++) {
            const elevator = new Elevator(i);
            const shaftDiv = document.createElement('div');
            shaftDiv.className = 'elevator-shaft';
            const elevatorDiv = document.createElement('div');
            elevatorDiv.className = 'elevator';
            elevatorDiv.id = `elevator-${i}`;
            elevatorDiv.innerHTML = `
                <div class="elevator-info">Piso: 0</div>
                <div class="direction-indicator stopped"></div>
            `;
            shaftDiv.appendChild(elevatorDiv);
            buildingDiv.appendChild(shaftDiv);

            elevator.element = elevatorDiv;
            elevator.infoElement = elevatorDiv.querySelector('.elevator-info');
            elevator.directionIndicator = elevatorDiv.querySelector('.direction-indicator');
            
            // Create individual internal control panel
            const panel = document.createElement('div');
            panel.className = 'internal-panel-container';
            panel.innerHTML = `<h2>Ascensor ${i}</h2><div class="internal-buttons"></div><div class="action-buttons"><button class="stop">STOP</button><button class="go">GO</button></div>`;
            const internalButtonsDiv = panel.querySelector('.internal-buttons');
            for (let j = 0; j < numFloors; j++) {
                const button = document.createElement('button');
                button.textContent = j;
                button.dataset.floor = j;
                button.addEventListener('click', () => {
                    elevator.addInternalDestination(j);
                    button.classList.add('active');
                });
                internalButtonsDiv.appendChild(button);
            }
            panel.querySelector('.stop').addEventListener('click', () => elevator.stop());
            panel.querySelector('.go').addEventListener('click', () => elevator.go());
            elevator.internalPanel = panel;
            allInternalPanelsContainer.appendChild(panel);

            elevators.push(elevator);
        }

        document.querySelectorAll('.call-buttons button').forEach(button => {
            button.addEventListener('click', () => {
                const floor = parseInt(button.dataset.floor);
                const direction = button.dataset.direction;
                if (!callQueue.some(call => call.floor === floor && call.direction === direction)) {
                    callQueue.push({ floor, direction });
                }
                if (!button.classList.contains('active')) {
                    button.classList.add('active');
                    setTimeout(() => button.classList.remove('active'), 300);
                }
            });
        });

        simulationInterval = setInterval(runElevatorLogic, 500);
    }

    function findBestElevator(call) {
        let bestElevator = null;
        let minDistance = Infinity;

        elevators.forEach(elevator => {
            if (elevator.state === 'emergency_stop') return;
            if (elevator.state === 'idle') {
                const distance = Math.abs(elevator.currentFloor - call.floor);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestElevator = elevator;
                }
            } else if (elevator.state === 'moving' && elevator.direction === call.direction) {
                if ((call.direction === 'up' && call.floor >= elevator.currentFloor) || (call.direction === 'down' && call.floor <= elevator.currentFloor)) {
                    const distance = Math.abs(elevator.currentFloor - call.floor);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestElevator = elevator;
                    }
                }
            }
        });
        return bestElevator;
    }

    function runElevatorLogic() {
        if (callQueue.length > 0) {
            const call = callQueue[0];
            const bestElevator = findBestElevator(call);
            if (bestElevator) {
                bestElevator.addInternalDestination(call.floor);
                callQueue.shift();
            }
        }

        elevators.forEach(elevator => {
            if (elevator.state === 'idle' && elevator.destinationQueue.length > 0) {
                const nextDestination = elevator.getNextDestination();
                if (nextDestination !== null) {
                    elevator.moveTo(nextDestination);
                }
            }
        });
    }

    startButton.addEventListener('click', initializeSimulation);
    initializeSimulation();
});