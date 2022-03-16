# String Validation Action

[![Test](https://github.com/panbanda/string-validation-action/actions/workflows/test.yml/badge.svg)](https://github.com/panbanda/string-validation-action/actions/workflows/test.yml)
[![Release](https://github.com/panbanda/string-validation-action/actions/workflows/release.yml/badge.svg)](https://github.com/panbanda/string-validation-action/actions/workflows/release.yml)
![Version](https://img.shields.io/github/package-json/v/panbanda/string-validation-action)

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
      - uses: 8BitJonny/gh-get-current-pr@1.4.0
        id: PR
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          sha: ${{ github.event.pull_request.head.sha }}
          filterOutClosed: true

      - id: validations
        uses: panbanda/string-validation-action@v1.0.0
        with:
          validations: |
            [
              {
                "value": "${{ steps.PR.outputs.pr_title }}",
                "patterns": ["\\w+-\\d+"],
                "errorMessage": "Include the Jira ticket in your PR title"
              },
              {
                "value": "${{ steps.PR.outputs.pr_title }}",
                "patterns": [".{20,}"],
                "errorMessage": "Your Pull Request title is too short.  Please include more information about your request."
              },
              {
                "value": "${{ steps.PR.outputs.pr_title }}",
                "patterns": ["^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)"],
                "errorMessage": "Prefix the pull request with a [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) standard prefix (feat:, fix:, etc.)."
              }
            ]

      - name: Update Validation Messages
        uses: marocchino/sticky-pull-request-comment@v2
        if: steps.validations.outputs.status === 'fail'
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          number: ${{ github.event.issue.number }}
          header: validation
          message: |
            Please fix the following issues with this pull request:

            ${{ steps.validations.outputs.errorMessage }}

      - name: Delete Validation Messages
        uses: marocchino/sticky-pull-request-comment@v2
        if: steps.validations.outputs.status === 'pass'
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          number: ${{ github.event.issue.number }}
          header: validation
          message: |
            Your pull request is valid! 🎉
```
