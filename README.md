# OpenChassis ECU Lab

This repo is a small browser based simulator for trying out basic chassis control logic.

The first target is to build a simple visual demo for:

- ABS wheel slip logic
- EPS assist calculation
- steering angle sensor checks
- basic DTC handling
- CAN style signal display

This is not production ECU software. It is only a learning and portfolio project.

## Current status

Initial project structure is added.

Current build has:

- landing page
- basic module cards
- placeholder dashboard values
- documentation folder

Control logic is not added yet.

## Why I am building this

Most real automotive ECU work cannot be shared publicly because of company IP and vehicle data restrictions.

This project is a way to show the control logic flow in a public repo without using any proprietary code.

The idea is to keep the models simple but still close to how ECU software is usually structured:

input signals -> signal processing -> control logic -> status output -> diagnostics

## Planned work

Short term:

- add throttle and brake inputs
- add steering angle input
- add simple vehicle speed model
- show four wheel speeds
- calculate wheel slip
- show ABS active status

Later:

- add EPS assist map
- add steering angle sensor mismatch fault
- add DTC list
- add CAN message table
- add fault injection switches

## Modules planned

### ABS

The ABS logic will use vehicle speed and wheel speed to estimate slip.

If the brake input is high and one wheel starts locking, the simulator will reduce brake pressure for that wheel.

### EPS

The EPS logic will calculate assist based on vehicle speed.

At low speed, steering assist will be high.  
At higher speed, assist will reduce.

### Steering angle sensor

The steering angle logic will use two simulated sensor channels.

It will check:

- sensor mismatch
- angle out of range
- sudden unrealistic angle change

### Diagnostics

The diagnostic block will keep simple fault states and DTC names.

This will not follow a full UDS stack in the first version.

## Notes

The simulator is intentionally simplified.

It does not include:

- real tire model
- hydraulic brake model
- steering rack model
- AUTOSAR stack
- real CAN driver

Those can be added later if needed.
## Ownership and usage notice

© 2026 SDRS Club. All rights reserved.

OpenChassis ECU Lab is shared as a demo and educational portfolio build. Unauthorized copying, redistribution, resale, rebranding, or commercial use of this demo, design, content, or source files is not permitted without written permission from SDRS Club.
