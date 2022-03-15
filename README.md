# String Validation Action

[![Test](https://github.com/panbanda/string-validation-action/actions/workflows/test.yml/badge.svg)](https://github.com/panbanda/string-validation-action/actions/workflows/test.yml)

Use this action to validate an array of strings with various regex patterns and return error messages.  This action is designed to work with other actions to manipulate a pull request (for example).

```yaml
on:
  pull_request:
    branches:
      - develop
    types: ['opened', 'edited', 'reopened', 'synchronize']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - id: validations
        uses: panbanda/string-validation-action@main
        with:
          validations: |
            [
              {
                "value": "${{ github.event.pull_request.title }}",
                "patterns": ["\\w+-\\d+"],
                "errorMessage": "Include the Jira ticket in your PR title"
              },
              {
                "value": "${{ github.event.pull_request.title }}",
                "patterns": [".{20,}"],
                "errorMessage": "Your Pull Request title is too short.  Please include more information about your request."
              },
              {
                "value": "${{ github.event.pull_request.title }}",
                "patterns": ["^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)"],
                "errorMessage": "Prefix the pull request with a [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) standard prefix (feat:, fix:, etc.)."
              }
            ]

      - name: Update Validation Messages
        uses: marocchino/sticky-pull-request-comment@v2
        if: failure()
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          number: ${{ github.event.issue.number }}
          header: validation
          message: |
            Please fix the following issues with this pull request:

            ${{ steps.validations.outputs.errorMessage }}

      - name: Delete Validation Messages
        uses: marocchino/sticky-pull-request-comment@v2
        if: success()
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          number: ${{ github.event.issue.number }}
          header: validation
          message: |
            Your pull request is valid! 🎉
```
