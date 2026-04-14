#!/usr/bin/env bash
set -euo pipefail

NAME="${1:-interview-$(date +%Y-%m-%d)}"

if [ -e "$NAME" ]; then
  echo "Error: '$NAME' already exists in $(pwd)" >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "Error: pnpm is not installed or not on PATH" >&2
  exit 1
fi

echo "==> Scaffolding Vite + React + TS into '$NAME'"
pnpm create vite@latest "$NAME" --template react-ts

cd "$NAME"

echo "==> Installing base dependencies"
pnpm install

echo "==> Installing Jest + RTL + Prettier dev dependencies"
pnpm add -D \
  jest \
  @types/jest \
  ts-jest \
  jest-environment-jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  identity-obj-proxy \
  prettier

echo "==> Writing jest.config.cjs"
cat > jest.config.cjs <<'EOF'
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp|avif)$': '<rootDir>/__mocks__/fileMock.cjs',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          isolatedModules: true,
          ignoreDeprecations: '6.0',
        },
      },
    ],
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx)',
    '**/?(*.)+(spec|test).+(ts|tsx)',
  ],
};
EOF

echo "==> Writing jest.setup.ts"
cat > jest.setup.ts <<'EOF'
import '@testing-library/jest-dom';
EOF

echo "==> Writing __mocks__/fileMock.cjs"
mkdir -p __mocks__
cat > __mocks__/fileMock.cjs <<'EOF'
module.exports = 'test-file-stub';
EOF

echo "==> Writing .prettierrc.json"
cat > .prettierrc.json <<'EOF'
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
EOF

echo "==> Writing .prettierignore"
cat > .prettierignore <<'EOF'
dist
coverage
node_modules
pnpm-lock.yaml
EOF

echo "==> Adding test + format scripts to package.json"
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.test = 'jest';
pkg.scripts.format = 'prettier --write .';
pkg.scripts['format:check'] = 'prettier --check .';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo "==> Writing sample test src/__tests__/App.test.tsx"
mkdir -p src/__tests__
cat > src/__tests__/App.test.tsx <<'EOF'
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders a top-level heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
EOF

echo "==> Formatting project with Prettier"
pnpm format

echo "==> Running sample test"
pnpm test

echo ""
echo "Project '$NAME' is ready."
echo "  cd $NAME"
echo "  pnpm dev            # start dev server"
echo "  pnpm test           # run Jest"
echo "  pnpm format         # format with Prettier"
echo "  pnpm format:check   # check formatting"
