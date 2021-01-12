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
	fun1, fun2 := RenderDials()
	js.Global().Set("renderDials", fun1)
	js.Global().Set("copyDials", fun2)
	select {
	case b := <-quitCh:
		if b {
			return
		}
	}
}

func RenderDials() (js.Func, js.Func) {
	var bytearr []byte
	jsFunc := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 2 {
			panic("Not enough params!")
		}
		//load options
		options := args[0]
		width := options.Get("width").Int()
		height := options.Get("height").Int()
		panels := options.Get("panels")
		numPanels := panels.Length()

		fmt.Println("Drawing dials, ")
		// create canvas
		dc := gg.NewContext(width, height)
		image, err := gg.LoadPNG("./Canvas/image.png")
		if err != nil {
			fmt.Println("There was an error")
			return nil
		}
		dc.DrawImage(image, 0, 0)

		// load font file
		fontBytes, err := ioutil.ReadFile(fontName)
		if err != nil {
			fmt.Println("There was an error")
			return nil
		}
		parsed, err := truetype.Parse(fontBytes)
		if err != nil {
			panic("Error loading font!")
		}

		// draw panels
		for i := 0; i < numPanels; i++ {
			makePanel(dc, panels.Index(i), parsed, args[1])
		}

		// store into temporary buffer, return length (so memory can be allocated in JS)
		buf := new(bytes.Buffer)

		dc.EncodePNG(buf)
		bytearr = buf.Bytes()

		return len(bytearr)
	})
	jsFunc2 := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		// copy buffer into JS buffer of proper length
		val := js.CopyBytesToJS(args[0], bytearr)
		quitCh <- true
		return val
	})
	return jsFunc, jsFunc2
}
