npm run build 2>&1 1>/dev/null
if ! git diff --exit-code -- browser.js > /dev/null ; then
  echo "You should run 'npm run build' before committing"
  exit 1
fi
