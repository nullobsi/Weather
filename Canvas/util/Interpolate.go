package util

import "image/color"

func Interpolate(color1, color2 color.Color, w1 float64) color.Color {
	r1, g1, b1, a1 := color1.RGBA()
	r2, g2, b2, a2 := color2.RGBA()
	w2 := 1 - w1
	//println(r1,g1,b1,a1);
	return color.RGBA{
		R: uint8(float64(r1)/float64(a1)*255*w1 + float64(r2)/float64(a2)*255*w2),
		G: uint8(float64(g1)/float64(a1)*255*w1 + float64(g2)/float64(a2)*255*w2),
		B: uint8(float64(b1)/float64(a1)*255*w1 + float64(b2)/float64(a2)*255*w2),
		A: uint8(float64(a1)/float64(a1)*255*w1 + float64(a2)/float64(a1)*255*w2),
	}
}
