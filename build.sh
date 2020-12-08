#! /bin/bash

source .env
git checkout --orphan build-artifacts
npm run build
git --work-tree dist add --all
git --work-tree dist commit -m "build-artifacts"
git push origin build-artifacts --force
rm -rf dist
git checkout -f main
git branch -D build-artifacts