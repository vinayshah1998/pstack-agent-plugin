# Control-adapter contract

The configured adapter must bring up a requested revision in a safe test environment, drive the real user interface, inspect state without mutation, capture screenshots and recordings, reset between attempts, and clean up what it created.

## Required operations

- **Bring up.** Return a session identifier, stable app markers, environment proof, and missing capabilities.
- **Drive.** Perform real clicks, typing, keys, scrolling, drag, resize, or navigation. Do not inject internal state or DOM changes to manufacture the symptom.
- **Inspect.** Read accessibility, process, log, network, or app-exposed debug state without changing it.
- **Capture.** Save a screenshot and recording that include enough app identity and the discriminating final state.
- **Reset.** Produce an independent second attempt using supported user or fixture controls.
- **Cleanup.** Stop created processes, profiles, tunnels, captures past retention, and disposable fixtures without deleting user work.

Read the relevant completed feature-map section before driving. Missing or ambiguous capabilities block the workflow. Never translate a production action into a test action unless the configured adapter proves the test environment is safe.
