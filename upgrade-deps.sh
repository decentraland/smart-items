#!/bin/bash

for D in *; do
    if [ -d "${D}" ]; then
        echo "${D}"
        pushd "${D}" && npm install decentraland-ecs@next decentraland-builder-scripts@latest && popd
    fi
done