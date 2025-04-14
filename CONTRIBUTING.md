# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue before making a change. 

Please note we have a [code of conduct](/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Testing

Run the test suite before submitting any changes:

```bash
npm test
```

The project uses Jest for testing. You can find test files in the `test/` directory.

## Commit Message Guidelines

Please follow these guidelines for commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Pull Request Process

1. Ensure your code passes on all tests/checks.
2. Update the README.md with details of changes to the API interface.
3. Only admins will merge the Pull Request.

## Release Process

Releases are managed by project maintainers and follow semantic versioning (MAJOR.MINOR.PATCH).
