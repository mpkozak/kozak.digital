#!/bin/bash



# start timestamp
  t=`date +%s`

# import environment variables
  if [ -f sh/.env-sh ]; then
    . sh/.env-sh
  fi

# absolute path of repo
  TOPLEVEL=$(git rev-parse --show-toplevel)
  cd "$TOPLEVEL"

# build client
  npm run build

# push to remote
  rsync -avzPh --delete --exclude='*.DS_Store' "$TOPLEVEL/build/static/" "$SERVER:$DEST/static"
  rsync -avzPh --exclude={'*.DS_Store','*precache-manifest*','service-worker.js'} "$TOPLEVEL/build/" "$SERVER:$DEST"

# calculate runtime
  convertsecs() {
    ((h=${1}/3600))
    ((m=(${1}%3600)/60))
    ((s=${1}%60))
    printf "%02d:%02d:%02d" $h $m $s
  }

  s=$((`date +%s`-t))
  RT=$(convertsecs $s)

# report success
  printf "\n\nDeployment successful! --- $RT elapsed\n\n\n"
  exit 0
