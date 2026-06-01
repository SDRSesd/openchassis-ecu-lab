/*
 * OpenChassis ECU Lab
 * Phase 1:
 * Basic page wiring only.
 *
 * Control models will be added in the next phase.
 */

const projectState = {
    vehicleSpeedKph: 0,
    absStatus: "Inactive",
    epsStatus: "Standby",
    dtcCount: 0
};

function updateStatusPanel() {
    document.getElementById("vehicle-speed").textContent =
        `${projectState.vehicleSpeedKph} km/h`;

    document.getElementById("abs-status").textContent =
        projectState.absStatus;

    document.getElementById("eps-status").textContent =
        projectState.epsStatus;

    document.getElementById("dtc-count").textContent =
        projectState.dtcCount;
}

updateStatusPanel();