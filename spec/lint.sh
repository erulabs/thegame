#!/bin/bash

iojs node_modules/jshint/bin/jshint -c .jshintrc \
`find . -name "*.js" -and -not -ipath "./node_modules*" \
-not -ipath "./doc*" -not -ipath "./client/vendor*" \
-not -ipath "./build*"`
