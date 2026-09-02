.PHONY: install build test lint check

install:
	cd api && pnpm install --frozen-lockfile
	cd web && npm ci

build:
	cd api && pnpm build
	cd web && npm run build

test:
	cd api && pnpm test
	cd web && npm test

lint:
	cd api && pnpm lint
	cd web && npm run lint

check: build test lint
