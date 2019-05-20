#!/usr/bin/env bash

MY_CONFIGURE_SCRIPT=cmake ./CMakeLists.txt

sudo docker run - rm -v $(pwd):/src trzeci/emscripten emconfigure ${MY_CONFIGURE_SCRIPT}