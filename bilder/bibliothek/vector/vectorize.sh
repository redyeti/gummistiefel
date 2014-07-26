#!/bin/bash

mkdir -p inter
mkdir -p out

convert -background '#ff00ff' -flatten "$1" inter/"${1%.gif}".ppm
autotrace \
	--background-color 'ff00ff' \
	--filter-iterations 0 \
	--output-format svg \
	--error-threshold 1\
	--despeckle-level 20\
	--dpi 150 \
	inter/"${1%.gif}".ppm  > out/"${1%.gif}".svg
