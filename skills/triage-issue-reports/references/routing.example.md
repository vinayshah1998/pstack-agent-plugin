# Routing map example

Copy and replace every placeholder. Keep this file outside the installed plugin so updates cannot overwrite local routing.

```yaml
routes:
  - name: "billing-example"
    match:
      product_areas: ["billing-area-placeholder"]
      code_paths: ["billing-code-path-placeholder"]
      error_signatures: ["billing-error-placeholder"]
    destination:
      messaging_channel: "billing-channel-placeholder"
      tracker_team: "billing-team-placeholder"
    owners: ["billing-owner-placeholder"]
    allow_feature_owner_ping: false
fallback:
  destination: ""
  owners: []
  allow_feature_owner_ping: false
```

A visible symptom is not enough when cause tracing points elsewhere. Leave the fallback empty unless one team accepts every unmatched report. Never put credentials or private identifiers in a published example.
