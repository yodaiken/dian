#!/usr/bin/env bash
set -e
set -u

cd res/xcprj
make install > /dev/null
echo "Install complete."
