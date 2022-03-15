# String Validation Action

[![Test](https://github.com/panbanda/string-validation-action/actions/workflows/test.yml/badge.svg)](https://github.com/panbanda/string-validation-action/actions/workflows/test.yml)

Use this action to validate an array of strings with various regex patterns and return error messages.  This action is designed to work with other actions to manipulate a pull request (for example).

```yaml
on:
  pull_request:
    branches:
      - main
    types: ['opened', 'edited', 'reopened', 'synchronize']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: panbanda/string-validation-action@main
        with:
          validations: |
            [
              {
                value: "${{ github.event.pull_request.title }}",
                patterns: ["PDG-\d+"]
                errorMessage: "Include the ticket number in your PR title"
              }
            ]
```
