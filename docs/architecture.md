# Architecture Notes

The project will be kept as small independent blocks.

Current plan:

Driver inputs  
-> vehicle and sensor model  
-> ECU logic  
-> dashboard output  

## Driver inputs

Inputs will come from browser controls.

Planned inputs:

- throttle
- brake pedal
- steering angle
- road surface
- fault switches

## Vehicle and sensor model

This block will create the basic signals required by the ECU logic.

Initial signals:

- vehicle speed
- front left wheel speed
- front right wheel speed
- rear left wheel speed
- rear right wheel speed
- steering angle sensor 1
- steering angle sensor 2
- brake pressure

The model will be simple in the first version. I do not want to overcomplicate the vehicle dynamics before the ECU logic is visible.

## ECU logic

The ECU logic will be split by function.

Planned files:

- abs_ecu.js
- eps_ecu.js
- sas_ecu.js
- dtc_manager.js

Each ECU file should have clear inputs and outputs.

I want to avoid mixing UI code and control logic.

## Dashboard

The dashboard will only read the current simulator state and update the screen.

It should show:

- vehicle speed
- wheel speed
- brake input
- steering angle
- ABS state
- EPS assist
- active DTCs
- CAN style signals

## CAN simulation

The first CAN implementation will only be a software table.

No real CAN hardware is planned in the first version.

Example signals:

- ABS active
- wheel speeds
- steering angle
- EPS assist torque
- DTC status

## Note

This architecture may change during development.  
The first goal is to keep the code readable and easy to extend.