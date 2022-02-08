package util

import "image/color"
import "github.com/nullobsi/go-colorful"

func Interpolate(color1, color2 color.Color, w1 float64) color.Color {
    c1, _ := colorful.MakeColor(color1)
    c2, _ := colorful.MakeColor(color2)


    return c1.BlendHcl(c2, 1 - w1).Clamped()
}
