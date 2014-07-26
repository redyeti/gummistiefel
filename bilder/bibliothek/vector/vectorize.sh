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
	inter/"${1%.gif}".ppm  > "${1%.gif}".svg
sed -i 's~<svg~<svg xmlns="http://www.w3.org/2000/svg"~' "${1%.gif}".svg
