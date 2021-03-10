package util

import (
	"image/color"
)

func GetColor(i1, i2 int, g func(int) (float64, color.Color), v float64) color.Color {
	value0, color0 := g(i1)
	value1, color1 := g(i2)

	p := (v - value0) / (value1 - value0)

	return Interpolate(color1, color0, p)
}
