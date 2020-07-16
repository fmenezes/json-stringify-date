npm run build 2>&1 1>/dev/null

if ! which git > /dev/null; then
  echo "No git found, skipping"
  exit 0
fi

if [ ! -d .git ]; then
  echo "Not a git repo, skipping"
  exit 0
fi

if ! git diff --exit-code -- browser.js > /dev/null ; then
  echo "You should run 'npm run build' before committing"
  exit 1
fi
