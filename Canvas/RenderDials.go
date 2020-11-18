package main

import (
	"bytes"
	"fmt"
	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"io/ioutil"
	"syscall/js"
)

var quitCh = make(chan bool)
func main() {
	//fmt.Println("Hello from GO! (now with gradients)");
	fun1, fun2 := RenderDials();
	js.Global().Set("renderDials", fun1);
	js.Global().Set("copyDials", fun2);
	select {
		case b := <- quitCh:
			if b {
				return
			}
	}
}

func RenderDials() (js.Func, js.Func) {
	var bytearr []byte;
	jsFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 2 {
			panic("Not enough params!");
		}
		//load options
		options := args[0]
		width := options.Get("width").Int()
		height := options.Get("height").Int()
		panels := options.Get("panels")
		numPanels := panels.Length()


		fmt.Println("Drawing dials, ");
		//create drawing board
		dc := gg.NewContext(width,height);
		image, err := gg.LoadPNG("./Canvas/image.png")
		if err != nil {
			fmt.Println("There was an error")
			return nil
		}
		dc.DrawImage(image, 0, 0)
		//load font
		fontBytes, err := ioutil.ReadFile(fontName)
		if err != nil {
			fmt.Println("There was an error")
			return nil
		}
		parsed, err := truetype.Parse(fontBytes)
		if err != nil {
			panic("Error loading font!")
		}

		//draw panels
		for i:=0; i < numPanels; i++ {
			makePanel(dc, panels.Index(i), parsed, args[1])
		}
		//ox := float64(width)/2
		//oy := float64(height)/2

		//makePanel(dc, 0, 0, float64(width), float64(height), 0, "Test", face);

		//oy += float64(face.Metrics().Height)/64 + (float64(face.Metrics().Height)/64)*0.1
		//create gradient

		//dc.DrawRectangle(ox,oy, ox/2,oy/2);
		//dc.Fill()
		//black background
		//dc.DrawArc(ox,oy, outerRadius, startAngle, endAngle)
		//dc.SetLineWidth(innerRadius/2 + 1);
		//dc.SetStrokeStyle(grad)
		//dc.SetColor(color.RGBA{0,0,0,255});
		//dc.Stroke();


		//dc.Stroke()
		//dc.Fill()



		/*// gradient dial
		dc.DrawArc(ox,oy, outerRadius, startAngle, endAngle);
		dc.SetFillStyle(grad);
		dc.Fill();

		//make it a dials instead of half circle
		dc.DrawArc(ox,oy, innerRadius, startAngle, endAngle)
		dc.SetColor(color.RGBA{0,0,0,255})
		dc.Fill()

		//trapezoidal structure to cover bottom part
		dc.MoveTo(innerRadius * math.Cos(startAngle) + ox, innerRadius * math.Sin(startAngle) + oy)
		dc.LineTo(outerRadius * math.Cos(startAngle) + ox, outerRadius * math.Sin(startAngle) + oy)
		dc.LineTo(outerRadius * math.Cos(endAngle) + ox, outerRadius * math.Sin(endAngle) + oy);
		dc.LineTo(innerRadius * math.Cos(endAngle) + ox, innerRadius * math.Sin(endAngle) + oy);
		dc.ClosePath()
		dc.Fill()*/

		//store into temporary buffer, return length (so memory can be allocated in JS)
		buf := new (bytes.Buffer);

		dc.EncodePNG(buf);
		bytearr = buf.Bytes();
		//buf.Reset()
		return len(bytearr);
	});
	jsFunc2 := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		// copy buffer into JS buffer of proper length
		val := js.CopyBytesToJS(args[0], bytearr)
		quitCh <- true
		return val
	})
	return jsFunc, jsFunc2;
}