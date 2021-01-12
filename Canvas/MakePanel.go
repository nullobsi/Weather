package main

import (
	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"image/color"
	"syscall/js"
)

var panelColor = color.RGBA{panelC, panelC, panelC, panelA}

// create a glass "panel"
func makePanel(c *gg.Context, panel js.Value, parsed *truetype.Font, gradients js.Value) {
	// get values
	x := panel.Get("x").Float()
	y := panel.Get("y").Float()
	w := panel.Get("width").Float()
	h := panel.Get("height").Float()
	title := panel.Get("title").String()
	titleSize := panel.Get("fontSize").Float()

	// create new font
	font := truetype.NewFace(parsed, &truetype.Options{Size: titleSize})

	// save state
	c.Push()

	// draw
	c.SetFontFace(font)
	height := c.FontHeight()
	metrics := font.Metrics()
	padding := float64(metrics.Height-metrics.Ascent) / 64 * 4
	c.SetColor(panelColor)
	c.DrawRectangle(x, y+height+height*0.1+padding*2, w, h-height-height*0.1-padding*2)
	c.DrawRectangle(x, y, w, height+padding*2)
	c.Fill()
	c.SetColor(color.RGBA{255, 255, 255, 255})
	c.DrawStringAnchored(title, x+w/2, y+height/2, 0.5, 0.5)
	font.Close()

	// draw dials
	dials := panel.Get("dials")
	numDials := dials.Length()

	for i := 0; i < numDials; i++ {
		dial := dials.Index(i)
		gradient := dial.Get("gradient").String()
		makeDial(c, dial, parsed, gradients.Get(gradient), y+height+height*0.1+padding*2, x)
	}

	c.Pop()
}
