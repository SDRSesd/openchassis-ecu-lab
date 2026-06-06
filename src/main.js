/*
 * OpenChassis ECU Lab
 * Phase 3
 *
 * Improves ABS readability and adds quick speed presets.
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

const absState = {
    active: false,
    brakeOutput: 0,
    highestSlip: 0,
    interventionWheel: "None",
    holdUntil: 0,
    displayHoldUntil: 0,
    lastHighestSlip: 0,
    lastInterventionWheel: "None",
    slip: {
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
    wheelRr: document.getElementById("wheel-rr"),

    absState: document.getElementById("abs-state"),
    absBrakeOutput: document.getElementById("abs-brake-output"),
    highestSlip: document.getElementById("highest-slip"),
    absWheel: document.getElementById("abs-wheel"),

    slipFl: document.getElementById("slip-fl"),
    slipFr: document.getElementById("slip-fr"),
    slipRl: document.getElementById("slip-rl"),
    slipRr: document.getElementById("slip-rr"),

    absBanner: document.getElementById("abs-banner"),

    preset30: document.getElementById("preset-30"),
    preset60: document.getElementById("preset-60"),
    preset100: document.getElementById("preset-100"),
    presetReset: document.getElementById("preset-reset")
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
    * Slower values are used intentionally so that the demo can be understood
    * by looking at the dashboard. This is not a real vehicle dynamics model.
    */
    const throttleRequest = inputs.brake > 5 ? inputs.throttle * 0.004 : inputs.throttle * 0.018;
    const brakeRequest = inputs.brake * 0.018 * grip;
    const rollingLoss = 0.006 + vehicleState.speedKph * 0.00035;

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
    const baseSpeed = vehicleState.speedKph;
    const steeringEffect = Math.abs(inputs.steeringAngle) / 540;
    const brakeEffect = inputs.brake / 100;

    const frontWheelDrop = brakeEffect * (1 - grip) * 55;
    const rearWheelDrop = brakeEffect * (1 - grip) * 38;

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

function updateAbsLogic() {
    const now = Date.now();

    calculateWheelSlip();

    const slipLimit = getSlipLimit();
    const brakeRequest = inputs.brake;

    let activeThisCycle = false;
    absState.highestSlip = 0;
    absState.interventionWheel = "None";

    checkWheelSlip("fl", "FL");
    checkWheelSlip("fr", "FR");
    checkWheelSlip("rl", "RL");
    checkWheelSlip("rr", "RR");

    if (brakeRequest > 15 && vehicleState.speedKph > 8 && absState.highestSlip > slipLimit) {
        activeThisCycle = true;
        absState.holdUntil = now + 2500;
        absState.displayHoldUntil = now + 3500;
        absState.lastHighestSlip = absState.highestSlip;
        absState.lastInterventionWheel = absState.interventionWheel;
        absState.brakeOutput = Math.max(20, brakeRequest * 0.62);
    } else {
        absState.brakeOutput = brakeRequest;
    }

    absState.active = activeThisCycle || now < absState.holdUntil;

    if (!absState.active) {
        absState.interventionWheel = "None";
    }

    function checkWheelSlip(key, label) {
        const slipValue = absState.slip[key];

        if (slipValue > absState.highestSlip) {
            absState.highestSlip = slipValue;
            absState.interventionWheel = label;
        }
    }
}

function calculateWheelSlip() {
    absState.slip.fl = getSlip(vehicleState.wheelSpeed.fl);
    absState.slip.fr = getSlip(vehicleState.wheelSpeed.fr);
    absState.slip.rl = getSlip(vehicleState.wheelSpeed.rl);
    absState.slip.rr = getSlip(vehicleState.wheelSpeed.rr);
}

function getSlip(wheelSpeed) {
    if (vehicleState.speedKph < 5) {
        return 0;
    }

    const slip = (vehicleState.speedKph - wheelSpeed) / vehicleState.speedKph;

    if (slip < 0) {
        return 0;
    }

    return slip;
}

function getSlipLimit() {
    if (inputs.roadMode === "ice") {
        return 0.10;
    }

    if (inputs.roadMode === "wet") {
        return 0.14;
    }

    return 0.20;
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

    ui.absState.textContent = absState.active ? "ACTIVE" : "Inactive";
    ui.absState.className = absState.active ? "abs-active" : "abs-normal";

    ui.absBanner.className = absState.active
        ? "topbar-item abs-banner abs-card-active"
        : "topbar-item abs-banner abs-card-normal";

    ui.absBrakeOutput.textContent = `${absState.brakeOutput.toFixed(0)}%`;
    const now = Date.now();
    const displaySlip = now < absState.displayHoldUntil
        ? Math.max(absState.highestSlip, absState.lastHighestSlip)
        : absState.highestSlip;

    ui.highestSlip.textContent = `${(displaySlip * 100).toFixed(1)}%`;
    ui.absWheel.textContent = absState.active
        ? absState.interventionWheel
        : now < absState.displayHoldUntil
            ? absState.lastInterventionWheel
            : "None";

    ui.slipFl.textContent = `${(absState.slip.fl * 100).toFixed(1)}%`;
    ui.slipFr.textContent = `${(absState.slip.fr * 100).toFixed(1)}%`;
    ui.slipRl.textContent = `${(absState.slip.rl * 100).toFixed(1)}%`;
    ui.slipRr.textContent = `${(absState.slip.rr * 100).toFixed(1)}%`;
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

function setVehicleSpeed(value) {
    vehicleState.speedKph = value;
}

function resetSimulator() {
    vehicleState.speedKph = 0;
    vehicleState.brakePressure = 0;

    vehicleState.wheelSpeed.fl = 0;
    vehicleState.wheelSpeed.fr = 0;
    vehicleState.wheelSpeed.rl = 0;
    vehicleState.wheelSpeed.rr = 0;

    absState.active = false;
    absState.brakeOutput = 0;
    absState.highestSlip = 0;
    absState.interventionWheel = "None";
    absState.holdUntil = 0;

    ui.throttleInput.value = 0;
    ui.brakeInput.value = 0;
    ui.steeringInput.value = 0;
    ui.roadMode.value = "dry";
}

function bindEvents() {
    ui.preset30.addEventListener("click", () => setVehicleSpeed(30));
    ui.preset60.addEventListener("click", () => setVehicleSpeed(60));
    ui.preset100.addEventListener("click", () => setVehicleSpeed(100));
    ui.presetReset.addEventListener("click", resetSimulator);
}

function simulatorStep() {
    readInputs();
    updateVehicleModel();
    updateAbsLogic();
    updateDisplay();

    window.requestAnimationFrame(simulatorStep);
}

bindEvents();
updateDisplay();
simulatorStep();