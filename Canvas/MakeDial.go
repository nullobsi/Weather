package main

import (
	"WeatherCanvas/util"
	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"github.com/icza/gox/imagex/colorx"
	"image/color"
	"math"
	"strconv"
	"strings"
	"syscall/js"
)

func makeDial(c *gg.Context, dial js.Value, parsed *truetype.Font, gradient js.Value, oy, ox float64) {

	// preserve state
	c.Push()

	// x and y pos
	x := dial.Get("cx").Float()
	y := dial.Get("cy").Float()

	// cutoff values
	startV := dial.Get("startV").Float()
	endV := dial.Get("endV").Float()

	// font sizes
	bfSize := dial.Get("bigFontSize").Float()
	sfSize := dial.Get("smallFontSize").Float()

	// dial sizes
	outerRadius := dial.Get("r").Float()
	innerRadius := outerRadius - (outerRadius * 0.5)
	thickness := (outerRadius - innerRadius) / 2
	radius := outerRadius - thickness

	// angles
	startAngle := dial.Get("start").Float()
	endAngle := dial.Get("end").Float()

	// create new gradient
	grad := NewTransArcGradient(x+ox, y+oy, startAngle, endAngle, radius, thickness, func(a float64) float64 { return a })

	// determine type
	// 0: normal
	// 1: wind style
	// 2: thermometer
	dialType := 0
	if !dial.Get("transform").IsUndefined() {
		transformStr := dial.Get("transform").String()
		if transformStr == "wind" {
			dialType = 1
		} else if transformStr == "rainrate" {
			grad.transform = func(a float64) float64 {
				if a <= 0.0253 {
					return rainRate(a) / 4
				} else {
					return rainRate(a) - 15
				}
			}
		} else if transformStr == "pm25" {
			grad.transform = pm25
		}
	}

	// casing gradient
	casing := getCasingGrad(x, ox, y, oy, radius)

	// draw casing
	c.SetStrokeStyle(casing)
	c.SetLineCap(gg.LineCapButt)
	c.DrawArc(x+ox, y+oy, radius, startAngle-math.Pi*0.01, endAngle+math.Pi*0.01)
	c.SetLineWidth(thickness * 1.3)
	c.Stroke()

	// gradient accesors
	numPoints := gradient.Length()
	getGrad := func(i int) (float64, color.Color) {
		p := gradient.Index(i)
		c, _ := colorx.ParseHexColor(p.Index(1).String())
		return p.Index(0).Float(), c
	}
	indexGrad := func(i int) float64 {
		v, _ := getGrad(i)
		return v
	}

	// find indexes
	startIndex := util.FindHiIndex(startV, indexGrad, numPoints)
	endIndex := util.FindLoIndex(endV, indexGrad, numPoints)

	// cut gradient down, add keypoints
	if startIndex != 0 {
		nColor := util.InterpolateValue(startIndex-1, startIndex, getGrad, startV)
		grad.AddColorStop(startV, nColor)
	}

	for i := startIndex; i <= endIndex; i++ {
		v, c := getGrad(i)
		grad.AddColorStop(v, c)
	}

	if endIndex != numPoints-1 {
		nColor := util.InterpolateValue(endIndex, endIndex+1, getGrad, endV)
		grad.AddColorStop(endV, nColor)
	}

	grad.Normalize()

	// draw gradient
	c.DrawArc(x+ox, y+oy, radius, startAngle, endAngle)
	c.SetLineWidth(thickness)
	c.SetStrokeStyle(grad)
	c.SetLineCap(gg.LineCapButt)
	c.Stroke()
	c.SetLineCap(gg.LineCapRound)

	//draw texts
	mult := 1.0
	if dialType == 1 {
		mult = 0.6
	}

	font := truetype.NewFace(parsed, &truetype.Options{Size: bfSize})

	c.SetColor(color.White)
	c.SetFontFace(font)

	if dialType != 1 {
		c.DrawStringAnchored(dial.Get("displayName").String(), x+ox, y+oy-outerRadius/3, 0.5, 0.5)
	} else if dialType == 1 {
		c.DrawStringAnchored(dial.Get("displayName").String(), x+ox, y+oy-radius*mult, 0.5, 1.2)
	}
	if dialType != 1 {
		font2 := truetype.NewFace(parsed, &truetype.Options{Size: sfSize})

		c.SetColor(color.White)
		c.SetFontFace(font2)
		c.DrawStringAnchored(strings.TrimSpace(dial.Get("unit").String()), x+ox, y+oy+radius/2, 0.5, -0.2)

		font2.Close()
	}
	c.SetFontFace(font)

	// check for value
	if !dial.Get("value").IsNull() {
		temp := dial.Get("value").Float()
		var valueColor = util.GetColor(temp, getGrad, numPoints)

		// get adjust value for angle calculations
		tempAdj := (grad.transform(temp) - grad.min) / (grad.max - grad.min)
		if tempAdj < 0 {
			tempAdj = 0
		} else if tempAdj > 1 {
			tempAdj = 1
		}
		valueAngle := startAngle + (endAngle-startAngle)*tempAdj

		// draw value count
		c.SetColor(valueColor)
		valueStr := strconv.FormatFloat(math.Abs(temp), 'f', dial.Get("presc").Int(), 64)
		if temp < 0 {
			valueStr = "−" + valueStr
		}
		if dialType == 1 {
			valueStr += dial.Get("unit").String()
		}

		c.DrawStringAnchored(valueStr, x+ox, y+oy+radius*mult, 0.5, -0.2)

		// draw indicator
		if dialType == 0 {
			drawNeedle(c, outerRadius/16, x+ox, y+oy, radius, valueAngle, valueColor)
		} else if dialType == 1 {
			drawTriangle(c, outerRadius/16, x+ox, y+oy, thickness*0.8, valueAngle, valueColor, math.Pi*0.1, radius)
		}

	} else {
		c.DrawStringAnchored("N/A", x+ox, y+oy+radius, 0.5, -0.2)
	}

	font.Close()

	c.Pop()

}

func getCasingGrad(x, ox, y, oy, r float64) gg.Pattern {
	grad := gg.NewLinearGradient(
		x+ox+math.Cos(math.Pi-math.Pi/4)*r,
		y+oy+math.Sin(math.Pi-math.Pi/4)*r,
		x+ox+math.Cos(math.Pi)*r,
		y+oy+math.Sin(math.Pi)*r,
	)
	grad.AddColorStop(0, color.Gray{0x66})
	grad.AddColorStop(1, color.Gray{0xbb})

	return grad
}

func drawNeedle(c *gg.Context, width, x, y, length, angle float64, bulbColor color.Color) {
	c.Push()
	//draw bulb outline
	c.SetLineWidth(width / 2)
	c.SetColor(color.Black)
	c.DrawArc(x, y, width, 0, math.Pi*2)
	c.Stroke()

	// draw needle outline
	c.MoveTo(math.Cos(angle)*length+x, math.Sin(angle)*length+y)
	c.LineTo(math.Cos(angle-math.Pi/2)*width/2+x, math.Sin(angle-math.Pi/2)*width/2+y)
	c.LineTo(math.Cos(angle+math.Pi/2)*width/2+x, math.Sin(angle+math.Pi/2)*width/2+y)
	c.ClosePath()
	c.Stroke()

	// draw white half of needle
	c.MoveTo(math.Cos(angle)*length+x, math.Sin(angle)*length+y)
	c.LineTo(x, y)
	c.LineTo(math.Cos(angle-math.Pi/2)*width/2+x, math.Sin(angle-math.Pi/2)*width/2+y)
	c.ClosePath()
	c.SetColor(color.White)
	c.Fill()

	c.DrawArc(x, y, width, angle, angle-math.Pi)
	c.Fill()

	// draw grey half of needle
	c.MoveTo(math.Cos(angle)*length+x, math.Sin(angle)*length+y)
	c.LineTo(x, y)
	c.LineTo(math.Cos(angle+math.Pi/2)*width/2+x, math.Sin(angle+math.Pi/2)*width/2+y)
	c.ClosePath()
	c.SetColor(color.Gray{180})
	c.Fill()

	c.DrawArc(x, y, width, angle, angle+math.Pi)
	c.Fill()

	// draw color bulb
	c.DrawArc(x, y, width*0.4, 0, math.Pi*2)
	c.SetColor(color.Black)
	c.StrokePreserve()
	c.SetColor(bulbColor)
	c.Fill()
	c.Pop()
}

func drawTriangle(c *gg.Context, width, x, y, length, valueAngle float64, bulbColor color.Color, angleWidth, radius float64) {
	//draw wind direction triangle needle
	c.Push()
	c.SetColor(color.Gray{0})
	c.SetLineWidth(width / 2)

	c.MoveTo(
		x+math.Cos(valueAngle)*(radius-length),
		y+math.Sin(valueAngle)*(radius-length),
	)
	c.LineTo(
		x+math.Cos(valueAngle+angleWidth/2)*(radius+length),
		y+math.Sin(valueAngle+angleWidth/2)*(radius+length),
	)
	c.LineTo(
		x+math.Cos(valueAngle)*(radius+length),
		y+math.Sin(valueAngle)*(radius+length),
	)
	c.LineTo(
		x+math.Cos(valueAngle-angleWidth/2)*(radius+length),
		y+math.Sin(valueAngle-angleWidth/2)*(radius+length),
	)
	c.ClosePath()
	c.StrokePreserve()
	c.SetColor(bulbColor)
	c.Fill()

	c.MoveTo(
		x+math.Cos(valueAngle)*(radius-length),
		y+math.Sin(valueAngle)*(radius-length),
	)
	c.LineTo(
		x+math.Cos(valueAngle)*(radius+length),
		y+math.Sin(valueAngle)*(radius+length),
	)
	c.LineTo(
		x+math.Cos(valueAngle-angleWidth/2)*(radius+length),
		y+math.Sin(valueAngle-angleWidth/2)*(radius+length),
	)
	c.ClosePath()
	c.SetColor(color.RGBA{0, 0, 0, 50})
	c.Fill()
	c.Pop()
}
