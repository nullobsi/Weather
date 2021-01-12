package util

import (
	"github.com/icza/gox/imagex/colorx"
	"image/color"
	"syscall/js"
)

func GetJSColor(gradient js.Value, lowI, highI int, val float64) color.Color {
	lowPoint := gradient.Index(lowI)
	highPoint := gradient.Index(highI)

	color0, _ := colorx.ParseHexColor(lowPoint.Index(1).String())
	value0 := lowPoint.Index(0).Float()

	color1, _ := colorx.ParseHexColor(highPoint.Index(1).String())
	value1 := highPoint.Index(0).Float()

	p := (val - value0) / (value1 - value0)

	return Interpolate(color1, color0, p)
}
