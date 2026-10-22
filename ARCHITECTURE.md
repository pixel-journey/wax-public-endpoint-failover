# Architecture

A UI keeps one ordered list per API family: chain, Hyperion, Atomic, and Alcor. The user can reorder it and can type a custom origin. The client tries the next origin only after the previous one failed or returned the wrong `chain_id`. It does not call the whole list at once.

`src/failover.ts` does not open a socket. The demo marks a preset down in memory so the same function can be shown without a network.

Producer health is a directory (EOS Nation scorecard, Validationcore, `status.wax.io`). It is not this failover loop. Blokcrafters is named on the status page. This repo does not ship a guessed hostname for it.
