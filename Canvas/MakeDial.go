package main

import (
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

	c.Push()
	x := dial.Get("cx").Float()
	y := dial.Get("cy").Float()
	startV := dial.Get("startV").Float()
	endV := dial.Get("endV").Float()

	bfSize := dial.Get("bigFontSize").Float()
	sfSize := dial.Get("smallFontSize").Float()
	//lfSize := dial.Get("smallFontSize").Float()

	outerRadius := dial.Get("r").Float()
	innerRadius := outerRadius - (outerRadius * 0.5)
	thickness := (outerRadius - innerRadius) / 2
	radius := outerRadius - thickness

	startAngle := dial.Get("start").Float()
	endAngle := dial.Get("end").Float()

	grad := NewTransArcGradient(x+ox, y+oy, startAngle, endAngle, radius, thickness, func(a float64) float64 { return a })
	transform := 0
	if !dial.Get("transform").IsUndefined() {
		transformStr := dial.Get("transform").String()
		if transformStr == "wind" {
			transform = 1
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

	numPoints := gradient.Length()

	casing := gg.NewLinearGradient(
		x+ox+math.Cos(math.Pi-math.Pi/4)*radius,
		y+oy+math.Sin(math.Pi-math.Pi/4)*radius,
		x+ox+math.Cos(math.Pi)*radius,
		y+oy+math.Sin(math.Pi)*radius,
	)
	casing.AddColorStop(0, color.Gray{0x66})
	casing.AddColorStop(1, color.Gray{0xbb})

	c.SetStrokeStyle(casing)
	c.SetLineCap(gg.LineCapButt)
	c.DrawArc(x+ox, y+oy, radius, startAngle-math.Pi*0.01, endAngle+math.Pi*0.01)
	c.SetLineWidth(thickness * 1.3)
	c.Stroke()

	startIndex := 0
	for ; gradient.Index(startIndex).Index(0).Float() < startV; startIndex++ {
	}

	endIndex := numPoints - 1
	for ; gradient.Index(endIndex).Index(0).Float() > endV; endIndex-- {
	}

	if startIndex != 0 {
		prevIndex := startIndex - 1
		prevPoint := gradient.Index(prevIndex)
		startPoint := gradient.Index(startIndex)

		color0, _ := colorx.ParseHexColor(prevPoint.Index(1).String())
		value0 := prevPoint.Index(0).Float()

		color1, _ := colorx.ParseHexColor(startPoint.Index(1).String())
		value1 := startPoint.Index(0).Float()

		p := (startV - value0) / (value1 - value0)

		nColor := interpolate(color1, color0, p)
		grad.AddColorStop(startV, nColor)

	}

	for i := startIndex; i <= endIndex; i++ {
		point := gradient.Index(i)
		value := point.Index(0).Float()
		hex := point.Index(1).String()
		grad.AddColorStopHex(value, hex)
	}

	if endIndex != numPoints-1 {
		prevPoint := gradient.Index(endIndex)
		endPoint := gradient.Index(endIndex + 1)

		color0, _ := colorx.ParseHexColor(prevPoint.Index(1).String())
		value0 := prevPoint.Index(0).Float()

		color1, _ := colorx.ParseHexColor(endPoint.Index(1).String())
		value1 := endPoint.Index(0).Float()

		p := (endV - value0) / (value1 - value0)

		nColor := interpolate(color1, color0, p)
		grad.AddColorStop(endV, nColor)
	}

	grad.Normalize()

	c.DrawArc(x+ox, y+oy, radius, startAngle, endAngle)
	c.SetLineWidth(thickness)
	c.SetStrokeStyle(grad)
	c.SetLineCap(gg.LineCapButt)
	c.Stroke()
	c.SetLineCap(gg.LineCapRound)
	//draw texts

	mult := 1.0
	if transform == 1 {
		mult = 0.6
	}

	font := truetype.NewFace(parsed, &truetype.Options{Size: bfSize})

	c.SetColor(color.White)
	c.SetFontFace(font)
	//above c.DrawStringAnchored(dial.Get("displayName").String(), x+ox, y + oy - outerRadius,0.5,0)
	if transform != 1 {
		c.DrawStringAnchored(dial.Get("displayName").String(), x+ox, y+oy-outerRadius/3, 0.5, 0.5)
	} else if transform == 1 {
		c.DrawStringAnchored(dial.Get("displayName").String(), x+ox, y+oy-radius*mult, 0.5, 1.2)
	}
	if transform != 1 {
		font2 := truetype.NewFace(parsed, &truetype.Options{Size: sfSize})

		c.SetColor(color.White)
		c.SetFontFace(font2)
		c.DrawStringAnchored(strings.TrimSpace(dial.Get("unit").String()), x+ox, y+oy+radius/2, 0.5, -0.2)

		font2.Close()
	}
	c.SetFontFace(font)

	//fmt.Println(dial.Get("unit").String())
	if !dial.Get("value").IsNull() {
		temp := dial.Get("value").Float()
		tempAdj := (grad.transform(temp) - grad.min) / (grad.max - grad.min)
		if tempAdj < 0 {
			tempAdj = 0
		} else if tempAdj > 1 {
			tempAdj = 1
		}
		valueAngle := startAngle + (endAngle-startAngle)*tempAdj
		valueColor := grad.GetColor(temp)
		c.SetColor(valueColor)
		valueStr := strconv.FormatFloat(math.Abs(temp), 'f', dial.Get("presc").Int(), 64)
		if temp < 0 {
			valueStr = "−" + valueStr
		}
		if transform == 1 {
			valueStr += dial.Get("unit").String()
		}
		c.DrawStringAnchored(valueStr, x+ox, y+oy+radius*mult, 0.5, -0.2)

		if transform == 0 {
			//draw needle
			needleWidth := outerRadius / 16
			c.SetLineWidth(needleWidth / 2)
			c.SetColor(color.Black)
			c.DrawArc(x+ox, y+oy, needleWidth, 0, math.Pi*2)
			c.Stroke()

			c.MoveTo(math.Cos(valueAngle)*radius+x+ox, math.Sin(valueAngle)*radius+y+oy)
			c.LineTo(math.Cos(valueAngle-math.Pi/2)*needleWidth/2+x+ox, math.Sin(valueAngle-math.Pi/2)*needleWidth/2+y+oy)
			c.LineTo(math.Cos(valueAngle+math.Pi/2)*needleWidth/2+x+ox, math.Sin(valueAngle+math.Pi/2)*needleWidth/2+y+oy)
			c.ClosePath()
			c.Stroke()

			c.MoveTo(math.Cos(valueAngle)*radius+x+ox, math.Sin(valueAngle)*radius+y+oy)
			c.LineTo(x+ox, y+oy)
			c.LineTo(math.Cos(valueAngle-math.Pi/2)*needleWidth/2+x+ox, math.Sin(valueAngle-math.Pi/2)*needleWidth/2+y+oy)
			c.ClosePath()
			c.SetColor(color.White)
			c.Fill()

			c.DrawArc(x+ox, y+oy, needleWidth, valueAngle, valueAngle-math.Pi)
			c.Fill()

			c.MoveTo(math.Cos(valueAngle)*radius+x+ox, math.Sin(valueAngle)*radius+y+oy)
			c.LineTo(x+ox, y+oy)
			c.LineTo(math.Cos(valueAngle+math.Pi/2)*needleWidth/2+x+ox, math.Sin(valueAngle+math.Pi/2)*needleWidth/2+y+oy)
			c.ClosePath()
			c.SetColor(color.Gray{180})
			c.Fill()

			c.DrawArc(x+ox, y+oy, needleWidth, valueAngle, valueAngle+math.Pi)
			c.Fill()

			c.DrawArc(x+ox, y+oy, needleWidth*0.4, 0, math.Pi*2)
			c.SetColor(color.Black)
			c.StrokePreserve()
			c.SetColor(valueColor)
			c.Fill()
		} else if transform == 1 {
			//draw wind direction triangle needle
			needleWidth := outerRadius / 16
			needleAngle := math.Pi * 0.1
			needleLength := thickness * 0.8
			c.SetColor(color.Gray{0})
			c.SetLineWidth(needleWidth / 2)

			c.MoveTo(
				x+ox+math.Cos(valueAngle)*(radius-needleLength),
				y+oy+math.Sin(valueAngle)*(radius-needleLength),
			)
			c.LineTo(
				x+ox+math.Cos(valueAngle+needleAngle/2)*(radius+needleLength),
				y+oy+math.Sin(valueAngle+needleAngle/2)*(radius+needleLength),
			)
			c.LineTo(
				x+ox+math.Cos(valueAngle)*(radius+needleLength),
				y+oy+math.Sin(valueAngle)*(radius+needleLength),
			)
			c.LineTo(
				x+ox+math.Cos(valueAngle-needleAngle/2)*(radius+needleLength),
				y+oy+math.Sin(valueAngle-needleAngle/2)*(radius+needleLength),
			)
			c.ClosePath()
			c.StrokePreserve()
			c.SetColor(valueColor)
			c.Fill()

			c.MoveTo(
				x+ox+math.Cos(valueAngle)*(radius-needleLength),
				y+oy+math.Sin(valueAngle)*(radius-needleLength),
			)
			c.LineTo(
				x+ox+math.Cos(valueAngle)*(radius+needleLength),
				y+oy+math.Sin(valueAngle)*(radius+needleLength),
			)
			c.LineTo(
				x+ox+math.Cos(valueAngle-needleAngle/2)*(radius+needleLength),
				y+oy+math.Sin(valueAngle-needleAngle/2)*(radius+needleLength),
			)
			c.ClosePath()
			c.SetColor(color.RGBA{0, 0, 0, 50})
			c.Fill()
		}

	} else {
		c.DrawStringAnchored("N/A", x+ox, y+oy+radius, 0.5, -0.2)
	}

	font.Close()

	c.Pop()

}
