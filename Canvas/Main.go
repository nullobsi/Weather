package main

import (
	"bytes"
	"fmt"
	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"github.com/nfnt/resize"
	"image"
	"io/ioutil"
	"syscall/js"
)

var quitCh = make(chan bool)

func main() {
	// export functions
	fun1, fun2 := RenderDials()
	js.Global().Set("renderDials", fun1)
	js.Global().Set("copyDials", fun2)

	// quit
	select {
	case b := <-quitCh:
		if b {
			return
		}
	}
}

func RenderDials() (js.Func, js.Func) {
	// rendered final result png
	var finishedImage []byte

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
		//create drawing board
		dc := gg.NewContext(width, height)

		// decode background image
		imgBytes := args[2].Int()
		bgImageArr := make([]byte, imgBytes)

		js.CopyBytesToGo(bgImageArr, args[3])

		bgImage, _, err := image.Decode(bytes.NewReader(bgImageArr))

		fitType := options.Get("bgFit").String()
		if fitType == "width" {
			bgImage = resize.Resize(uint(width), 0, bgImage, resize.Lanczos3)
		} else {
			bgImage = resize.Resize(0, uint(height), bgImage, resize.Lanczos3)
		}

		if err != nil {
			fmt.Println("Error decoding image:\n", err)
			quitCh <- true
			return nil
		}

		dc.DrawImage(bgImage, 0, 0)

		//load font
		fontBytes, err := ioutil.ReadFile(fontName)
		if err != nil {
			fmt.Println("Error reading font:\n", err)
			quitCh <- true
			return nil
		}
		parsed, err := truetype.Parse(fontBytes)
		if err != nil {
			fmt.Println("Error parsing font:\n", err)
			quitCh <- true
			return nil
		}

		//draw panels
		for i := 0; i < numPanels; i++ {
			makePanel(dc, panels.Index(i), parsed, args[1])
		}

		//store into temporary buffer, return length (so memory can be allocated in JS)
		buf := new(bytes.Buffer)

		err = dc.EncodePNG(buf)
		if err != nil {
			fmt.Println("Error encoding:\n", err)
			quitCh <- true
			return nil
		}

		finishedImage = buf.Bytes()
		return len(finishedImage)
	})
	jsFunc2 := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		// copy buffer into JS buffer of proper length
		val := js.CopyBytesToJS(args[0], finishedImage)
		quitCh <- true
		return val
	})
	return jsFunc, jsFunc2
}
