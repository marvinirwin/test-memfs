#!/usr/bin/env bash
PROJECT_LOWER=test
PROJECT_PASCAL=Test
HTML=$PROJECT_LOWER-react/src/${PROJECT_LOWER}.html
JS=${PROJECT_LOWER}-react/src/${PROJECT_LOWER}.js
WASM=${PROJECT_LOWER}-react/src/${PROJECT_LOWER}.wasm
WASM_PUBLIC=${PROJECT_LOWER}-react/public/${PROJECT_LOWER}.wasm
WASM_FILENAME=${PROJECT_LOWER}.wasm
WASM_LOOKUP='wasmBinaryFile = locateFile'

    # This will make the generated javascript file export a function which you can call at will
    # This is the name of your export
    # Your library may have some undefined symbols in it, mine did so I'll ignore them for now
    # If you specify the output as html, emscripten will generate the .wasm, .js and .html files ready for use
sudo docker run --rm -v $(pwd):/src trzeci/emscripten emcc \
    src/main.c \
    -s MODULARIZE=1 \
    --pre-js test-react/pre.js \
    -s EXPORT_NAME=${PROJECT_PASCAL} \
    -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
    -o ${HTML} \

# The .wasm will need to be put in the public directory, as create-react-app will not bundle it automatically
cp ${WASM} ${WASM_PUBLIC}
# disable eslint on the generated javascript
sed -i.old '1s;^;\/* eslint-disable *\/;' ${JS}
# Replace the relative path with an absolute one, necessary to access public files
sed -i.old "s|$WASM_FILENAME|/$WASM_FILENAME|" ${JS}
# The generated javascript will try to resolve the path relative to the website directory.  Comment out this line
sed -i.old "s|$WASM_LOOKUP|// $WASM_LOOKUP|" ${JS}