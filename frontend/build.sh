#!/bin/bash

source $HOME/.bash_profile || true >/dev/null 2>&1
source $HOME/.zshrc || true >/dev/null 2>&1

set -e
FRONTDIR=$(pwd)

cd $FRONTDIR

function usage() {
  echo -e "Usage: $0 [-n] [-m] [-t] [-z] [-l default_lang] [-h]
      -n: install nvm
      -m: input manuals url
      -t: Unit test
      -l: setup the default lang, 'cn' by default, options 'cn'/'en'
      -h: show usage" 1>&2;
  exit 0;
}

pushd . > /dev/null
OPTIND=1         # Reset in case getopts has been used previously in the shell.

installNVM=0
unitTest=0
# manualBase="//127.0.0.1/"
while getopts "l:nm:thz" o; do
  case "${o}" in
    n)
      installNVM=1
      ;;
    t)
      unitTest=1
      ;;
    m)
      manualBase=$OPTARG
      ;;
    l)
      defaultLang=$OPTARG
      ;;
    h | *)
      usage
      ;;
  esac
done
shift $((OPTIND-1))
[ "$1" = "--" ] && shift
if [[ "$@" != "" ]]; then
    echo "Unrecognized parameters: $@"
fi

if [[ $installNVM -ne 0 ]]; then
  cd $FRONTDIR
  echo "===Install nvm==="
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
fi

echo "===Use node of stable version==="
nvm install

echo "===Linting==="
npm i && npm run lint

if [[ $unitTest -ne 0 ]]; then
  echo "===Unit Testing==="
  cd $FRONTDIR
  npm run unit
fi

echo "===Build Frontend==="
cd "$FRONTDIR"
MANUAL_BASE=${manualBase} DEFAULT_LANG=${defaultLang} npm run build

# reset previous node version
nvm use
