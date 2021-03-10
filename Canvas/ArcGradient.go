package main

import (
	"WeatherCanvas/util"
	"github.com/icza/gox/imagex/colorx"
	"image/color"
	"math"
	"sort"
)

type keypoints []Keypoint
type arcGradient struct {
	x, y, theta0, theta1, r, t float64
	iR, oR                     float64
	keypoints                  keypoints
}

func (a arcGradient) ColorAt(x, y int) color.Color {
	x = x - int(a.x)
	y = (y - int(a.y)) * -1
	//calcR := math.Hypot(float64(x),float64(y))
	//if calcR > a.oR || calcR < a.iR {
	//	return color.Transparent
	//}
	var theta float64
	theta = math.Atan2(float64(y), float64(x))
	if theta < 0 {
		theta = (math.Pi * 2) + theta
	}
	theta = math.Pi*2 - theta
	theta = theta - a.theta0
	if theta < 0 {
		theta = (math.Pi * 2) + theta
	} else if theta > math.Pi*2 {
		theta = theta - math.Pi*2
	}

	adj := theta / (a.theta1 - a.theta0)
	//if adj < 0 || adj > 1 {
	//	return color.Transparent
	//}
	//adj = 1  -adj;
	l := len(a.keypoints)
	if adj <= a.keypoints[0].value {
		return a.keypoints[0].color
	}
	if adj >= a.keypoints[l-1].value {
		return a.keypoints[l-1].color
	}
	foundI := 0
	for l1, point := range a.keypoints {
		if point.value >= adj {
			foundI = l1
			break
		}
	}
	p := (adj - a.keypoints[foundI-1].value) / (a.keypoints[foundI].value - a.keypoints[foundI-1].value)
	//v := uint8(255*p);
	//println(foundI)
	return util.Interpolate(
		a.keypoints[foundI].color,
		a.keypoints[foundI-1].color,
		p,
	)
}

type Keypoint struct {
	value float64
	color color.Color
}

func NewArcGradient(x, y, theta0, theta1, r, width float64) *arcGradient {
	return &arcGradient{x: x, y: y, theta0: theta0, theta1: theta1, r: r, t: width,
		iR: r - (width / 2), oR: r + (width / 2)}
}

func (a *arcGradient) AddColorStop(value float64, color color.Color) {
	a.keypoints = append(a.keypoints, Keypoint{
		value: value,
		color: color,
	})
	sort.Sort(a.keypoints)
}

func (a *arcGradient) GetColor(adj float64) color.Color {
	//fmt.Println(adj)
	l := len(a.keypoints)
	foundI := 0
	for ; foundI < l && a.keypoints[foundI].value <= adj; foundI += 1 {
	}
	if foundI == 0 {
		return a.keypoints[foundI].color
	}
	if foundI == l {
		return a.keypoints[l-1].color
	}
	p := (adj - a.keypoints[foundI-1].value) / (a.keypoints[foundI].value - a.keypoints[foundI-1].value)
	//v := uint8(255*p);
	//println(foundI)
	return util.Interpolate(
		a.keypoints[foundI].color,
		a.keypoints[foundI-1].color,
		p,
	)
}

func (a *arcGradient) AddColorStopHex(value float64, color string) {
	col, _ := colorx.ParseHexColor(color)
	a.keypoints = append(a.keypoints, Keypoint{
		value: value,
		color: col,
	})
	sort.Sort(a.keypoints)
}

func (a *arcGradient) Normalize() {
	var max float64 = math.Inf(-1)
	for _, key := range a.keypoints {
		if key.value > max {
			max = key.value
		}
	}
	var min float64 = a.keypoints[0].value
	max = max - min
	for i, key := range a.keypoints {
		a.keypoints[i] = Keypoint{
			value: (key.value - min) / max,
			color: key.color,
		}
	}
}

// Len satisfies the Sort interface.
func (s keypoints) Len() int {
	return len(s)
}

// Less satisfies the Sort interface.
func (s keypoints) Less(i, j int) bool {
	return s[i].value < s[j].value
}

// Swap satisfies the Sort interface.
func (s keypoints) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
