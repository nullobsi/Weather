package main

import (
	"WeatherCanvas/structs"
	"WeatherCanvas/transforms"
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
	// clear state
	c.Push()

	// get x and y offset of dial
	x := dial.Get("cx").Float()
	y := dial.Get("cy").Float()

	// get offset values
	startV := dial.Get("startV").Float()
	endV := dial.Get("endV").Float()

	// font sizes
	bfSize := dial.Get("bigFontSize").Float()
	sfSize := dial.Get("smallFontSize").Float()
	//lfSize := dial.Get("smallFontSize").Float()

	// calculate some useful values
	outerRadius := dial.Get("r").Float()
	innerRadius := outerRadius - (outerRadius * 0.5)
	thickness := (outerRadius - innerRadius) / 2
	radius := outerRadius - thickness

	startAngle := dial.Get("start").Float()
	endAngle := dial.Get("end").Float()

	// create new gradient
	grad := structs.NewTransArcGradient(x+ox, y+oy, startAngle, endAngle, radius, thickness, func(a float64) float64 { return a })

	// transform defines the dial mode, 0 is normal 1 is wind dir (Circular)
	transform := 0
	if !dial.Get("transform").IsUndefined() {
		transformStr := dial.Get("transform").String()
		if transformStr == "wind" {
			transform = 1
		} else if transformStr == "rainrate" {
			grad.Transform = func(a float64) float64 {
				if a <= 0.0253 {
					return transforms.RainRate(a) / 4
				} else {
					return transforms.RainRate(a) - 15
				}
			}
		} else if transformStr == "pm25" {
			grad.Transform = transforms.PM25
		}
	}

	// create a gradient for the outer casing of the dial
	casingGradient := gg.NewLinearGradient(
		x+ox+math.Cos(math.Pi-math.Pi/4)*radius,
		y+oy+math.Sin(math.Pi-math.Pi/4)*radius,
		x+ox+math.Cos(math.Pi)*radius,
		y+oy+math.Sin(math.Pi)*radius,
	)
	casingGradient.AddColorStop(0, color.Gray{0x66})
	casingGradient.AddColorStop(1, color.Gray{0xbb})

	// draw the outer casing
	c.SetStrokeStyle(casingGradient)
	c.SetLineCap(gg.LineCapButt)
	c.DrawArc(x+ox, y+oy, radius, startAngle-math.Pi*0.01, endAngle+math.Pi*0.01)
	c.SetLineWidth(thickness * 1.3)
	c.Stroke()

	// find the start and end indexes for the offset values
	startVlow, startVhigh := util.FindIndexesJS(gradient, startV)

	endVlow, endVhigh := util.FindIndexesJS(gradient, endV)

	// if the values are offset, calculate the new start/end and add it to the gradient
	if startVlow != -1 && startVhigh != -1 {
		nColor := util.GetJSColor(gradient, startVlow, startVhigh, startV)
		grad.AddColorStop(startV, nColor)
	}

	// add all intermediate points
	for i := startVlow + 1; i <= endVlow; i++ {
		point := gradient.Index(i)
		value := point.Index(0).Float()
		hex := point.Index(1).String()
		grad.AddColorStopHex(value, hex)
	}

	if endVhigh != -1 {
		nColor := util.GetJSColor(gradient, endVlow, endVhigh, startV)
		grad.AddColorStop(endV, nColor)
	}

	// normalize gradient
	grad.Normalize()

	// draw gradient
	c.DrawArc(x+ox, y+oy, radius, startAngle, endAngle)
	c.SetLineWidth(thickness)
	c.SetStrokeStyle(grad)
	c.SetLineCap(gg.LineCapButt)
	c.Stroke()
	c.SetLineCap(gg.LineCapRound)

	// draw texts

	// special funny value to make sure display name is drawn properly
	dispNameYmult := 1.0
	if transform == 1 {
		dispNameYmult = 0.6
	}

	// create new render fontface
	font := truetype.NewFace(parsed, &truetype.Options{Size: bfSize})

	c.SetColor(color.White)
	c.SetFontFace(font)

	// draw display name
	if transform != 1 {
		c.DrawStringAnchored(dial.Get("displayName").String(), x+ox, y+oy-outerRadius/3, 0.5, 0.5)
	} else if transform == 1 {
		c.DrawStringAnchored(dial.Get("displayName").String(), x+ox, y+oy-radius*dispNameYmult, 0.5, 1.2)
	}

	// draw unit
	if transform != 1 {
		font2 := truetype.NewFace(parsed, &truetype.Options{Size: sfSize})

		c.SetColor(color.White)
		c.SetFontFace(font2)
		c.DrawStringAnchored(strings.TrimSpace(dial.Get("unit").String()), x+ox, y+oy+radius/2, 0.5, -0.2)

		font2.Close()
	}

	c.SetFontFace(font)

	if !dial.Get("value").IsNull() {

		// obtain value color
		val := dial.Get("value").Float()
		var valueColor color.Color

		lowI, highI := util.FindIndexesJS(gradient, val)

		if lowI == -1 {
			valueColor, _ = colorx.ParseHexColor(gradient.Index(0).Index(1).String())
		} else if highI == -1 {
			valueColor, _ = colorx.ParseHexColor(gradient.Index(lowI).Index(1).String())
		} else {
			valueColor = util.GetJSColor(gradient, lowI, highI, val)
		}

		// calculate angle for needle
		valueAdj := (grad.Transform(val) - grad.Min) / (grad.Max - grad.Min)
		if valueAdj < 0 {
			valueAdj = 0
		} else if valueAdj > 1 {
			valueAdj = 1
		}
		valueAngle := startAngle + (endAngle-startAngle)*valueAdj

		// draw value text
		c.SetColor(valueColor)
		valueStr := strconv.FormatFloat(math.Abs(val), 'f', dial.Get("presc").Int(), 64)
		if val < 0 {
			valueStr = "−" + valueStr
		}
		if transform == 1 {
			valueStr += dial.Get("unit").String()
		}
		c.DrawStringAnchored(valueStr, x+ox, y+oy+radius*dispNameYmult, 0.5, -0.2)

		// draw needle
		if transform == 0 {
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
