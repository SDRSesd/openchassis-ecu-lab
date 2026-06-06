/*
 * OpenChassis ECU Lab
 * Phase 2
 *
 * Driver inputs and a basic vehicle speed model.
 * ABS/EPS control logic is not added yet.
 */

const inputs = {
    throttle: 0,
    brake: 0,
    steeringAngle: 0,
    roadMode: "dry"
};

const vehicleState = {
    speedKph: 0,
    brakePressure: 0,
    wheelSpeed: {
        fl: 0,
        fr: 0,
        rl: 0,
        rr: 0
    }
};

const roadGrip = {
    dry: 1.0,
    wet: 0.72,
    ice: 0.38
};

const ui = {
    throttleInput: document.getElementById("throttle-input"),
    brakeInput: document.getElementById("brake-input"),
    steeringInput: document.getElementById("steering-input"),
    roadMode: document.getElementById("road-mode"),

    throttleValue: document.getElementById("throttle-value"),
    brakeValue: document.getElementById("brake-value"),
    steeringValue: document.getElementById("steering-value"),
    roadValue: document.getElementById("road-value"),

    vehicleSpeed: document.getElementById("vehicle-speed"),
    brakePressure: document.getElementById("brake-pressure"),
    steeringDisplay: document.getElementById("steering-display"),
    roadDisplay: document.getElementById("road-display"),

    wheelFl: document.getElementById("wheel-fl"),
    wheelFr: document.getElementById("wheel-fr"),
    wheelRl: document.getElementById("wheel-rl"),
    wheelRr: document.getElementById("wheel-rr")
};

function readInputs() {
    inputs.throttle = Number(ui.throttleInput.value);
    inputs.brake = Number(ui.brakeInput.value);
    inputs.steeringAngle = Number(ui.steeringInput.value);
    inputs.roadMode = ui.roadMode.value;
}

function updateVehicleModel() {
    const grip = roadGrip[inputs.roadMode];

    /*
     * This is only a simple speed model.
     * Brake input is given priority over throttle because in a real driver input case
     * the vehicle should not keep accelerating while heavy brake is applied.
     */
    const throttleRequest = inputs.brake > 5 ? inputs.throttle * 0.015 : inputs.throttle * 0.045;
    const brakeRequest = inputs.brake * 0.095 * grip;
    const rollingLoss = 0.02 + vehicleState.speedKph * 0.0008;

    vehicleState.speedKph += throttleRequest;
    vehicleState.speedKph -= brakeRequest;
    vehicleState.speedKph -= rollingLoss;

    if (vehicleState.speedKph < 0) {
        vehicleState.speedKph = 0;
    }

    if (vehicleState.speedKph > 180) {
        vehicleState.speedKph = 180;
    }

    vehicleState.brakePressure = inputs.brake;

    updateWheelSpeeds(grip);
}

function updateWheelSpeeds(grip) {
    let baseSpeed = vehicleState.speedKph;

    let steeringEffect = Math.abs(inputs.steeringAngle) / 540;
    let brakeEffect = inputs.brake / 100;

    let frontWheelDrop = brakeEffect * (1 - grip) * 18;
    let rearWheelDrop = brakeEffect * (1 - grip) * 12;

    let leftSteerOffset = steeringEffect * 2;
    let rightSteerOffset = steeringEffect * 2;

    if (inputs.steeringAngle > 0) {
        leftSteerOffset = 2;
        rightSteerOffset = -2;
    } else if (inputs.steeringAngle < 0) {
        leftSteerOffset = -2;
        rightSteerOffset = 2;
    }

    vehicleState.wheelSpeed.fl = limitSpeed(baseSpeed - frontWheelDrop + leftSteerOffset);
    vehicleState.wheelSpeed.fr = limitSpeed(baseSpeed - frontWheelDrop + rightSteerOffset);
    vehicleState.wheelSpeed.rl = limitSpeed(baseSpeed - rearWheelDrop + leftSteerOffset * 0.4);
    vehicleState.wheelSpeed.rr = limitSpeed(baseSpeed - rearWheelDrop + rightSteerOffset * 0.4);
}

function limitSpeed(value) {
    if (value < 0) {
        return 0;
    }

    return value;
}

function updateDisplay() {
    ui.throttleValue.textContent = `${inputs.throttle}%`;
    ui.brakeValue.textContent = `${inputs.brake}%`;
    ui.steeringValue.textContent = `${inputs.steeringAngle} deg`;

    ui.roadValue.textContent = getRoadLabel(inputs.roadMode);
    ui.roadDisplay.textContent = getRoadLabel(inputs.roadMode);

    ui.vehicleSpeed.textContent = `${vehicleState.speedKph.toFixed(1)} km/h`;
    ui.brakePressure.textContent = `${vehicleState.brakePressure}%`;
    ui.steeringDisplay.textContent = `${inputs.steeringAngle} deg`;

    ui.wheelFl.textContent = `${vehicleState.wheelSpeed.fl.toFixed(1)} km/h`;
    ui.wheelFr.textContent = `${vehicleState.wheelSpeed.fr.toFixed(1)} km/h`;
    ui.wheelRl.textContent = `${vehicleState.wheelSpeed.rl.toFixed(1)} km/h`;
    ui.wheelRr.textContent = `${vehicleState.wheelSpeed.rr.toFixed(1)} km/h`;
}

function getRoadLabel(mode) {
    if (mode === "wet") {
        return "Wet";
    }

    if (mode === "ice") {
        return "Ice";
    }

    return "Dry";
}

function simulatorStep() {
    readInputs();
    updateVehicleModel();
    updateDisplay();

    window.requestAnimationFrame(simulatorStep);
}

updateDisplay();
simulatorStep();