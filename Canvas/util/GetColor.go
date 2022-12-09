package util

import (
	"image/color"
)

func InterpolateValue(i1, i2 int, g func(int) (float64, color.Color), v float64) color.Color {
	value0, color0 := g(i1)
	value1, color1 := g(i2)

	p := (v - value0) / (value1 - value0)

	return Interpolate(color1, color0, p)
}

func GetColor(v float64, g func(int) (float64, color.Color), l int) color.Color {
	loVal, loCol := g(0)
	hiVal, hiCol := g(l - 1)

	nOnly := func(i int) float64 {
		v, _ := g(i)
		return v
	}

	if v <= loVal {
		return loCol
	} else if v >= hiVal {
		return hiCol
	} else {
		lowI := FindLoIndex(v, nOnly, l)
		// Sanity check
		if lowI == l-1 {
		    return loCol
		}
		nColor := InterpolateValue(lowI, lowI+1, g, v)
		return nColor
	}
}
