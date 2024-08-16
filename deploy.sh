#!/usr/bin/env sh

set -e
rm -rf dist
npm run build

cd dist

git init
git add -A
git commit -m 'deploy'


git push -f git@github.com:mszhigachev/mortgage_loan_calc.git master:gh-pages

cd -