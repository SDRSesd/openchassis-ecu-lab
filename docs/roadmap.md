# Roadmap

## Version 0.1

Basic simulator screen.

Done:

- project structure
- landing section
- dashboard placeholder
- project notes

## Version 0.2

Driver inputs and vehicle model.

Done:

- throttle input
- brake input
- steering input
- road surface mode
- vehicle speed value
- four wheel speed values

## Version 0.3

ABS logic and visual demo.

Done:

- slip calculation
- ABS active flag
- first brake pressure reduction
- road surface based slip threshold
- ABS visibility hold
- simple chassis view
- wheel speed and slip display

Pending:

- tune pressure modulation
- split ABS code into a separate ECU module
- improve ABS pressure state handling

## Version 0.4

EPS logic.

Planned items:

- speed based assist
- steering torque value
- assist torque output
- EPS fault state

## Version 0.5

Steering angle sensor checks.

Planned items:

- dual sensor values
- mismatch check
- range check
- rate check

## Version 0.6

Diagnostics and CAN view.

Planned items:

- DTC list
- fault injection switches
- CAN style signal table

## Later

Possible hardware demo using a small microcontroller.

Possible parts:

- Raspberry Pi Pico W
- potentiometers
- OLED display
- small DC motor or encoder
- simple web dashboard link