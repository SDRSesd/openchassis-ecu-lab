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

Next items:

- calculate slip ratio for each wheel
- add ABS active flag
- reduce brake pressure when wheel slip is high
- show basic ABS status on the dashboard