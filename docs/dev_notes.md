# Development Notes

## Phase 1

Created the initial folder structure and first dashboard page.

No control logic was added in this commit.

I kept the first version small so that the base layout and file structure could be reviewed before adding the simulator logic.

## Phase 2

Added the first set of driver inputs and a simple vehicle speed model.

Current inputs:

- throttle
- brake pedal
- steering angle
- road surface mode

Current outputs:

- vehicle speed
- brake pressure
- four wheel speed values

The wheel speed model is still simple. It only gives enough signal variation to support the first ABS logic in the next phase.

## Phase 3

Added first pass ABS slip calculation.

Current ABS behavior:

- calculates slip for all four wheels
- checks highest wheel slip
- changes ABS state to active when slip is above limit
- reduces brake output when ABS is active

The ABS model is still very basic. It does not have a pressure increase, hold and decrease state machine yet.

Next items:

- tune slip thresholds
- add a better ABS pressure modulation step
- show ABS state more clearly in the dashboard
- later split ABS logic into a separate ECU file