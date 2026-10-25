# UAT preview review 2 approach

- Run the exact preview only inside the controller-owned fixture at the corrected approved origin.
- Route fixture files and all API responses locally; abort any unrecognized host/API request and never use a tenant token.
- Exercise stable cases UAT-201–UAT-210, emphasizing the previously failed permit bridge path and cycle-2 SDK lifecycle remediation.
- Record browser-visible results, network/command effects, viewports/direction, console failures, and lifecycle transitions in this run folder only.
