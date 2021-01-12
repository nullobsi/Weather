package structs

import (
	"WeatherCanvas/util"
	"github.com/icza/gox/imagex/colorx"
	"image/color"
	"math"
	"sort"
)

type keypoints []Keypoint

// ArcGradient represents a Pattern that draws a sweep gradient.
type ArcGradient struct {
	x, y, theta0, theta1, r, t float64
	iR, oR                     float64
	keypoints                  keypoints
}

// ColorAt satisfies the Pattern interface
func (a ArcGradient) ColorAt(x, y int) color.Color {

	// get theta
	theta := util.GetTheta(x, y, a.theta0)

	// normalize value to 0-1
	adj := theta / (a.theta1 - a.theta0)

	// find index
	low, high := findIndexesKeypoint(a.keypoints, adj)
	if low == -1 {
		return a.keypoints[0].Color
	} else if high == -1 {
		return a.keypoints[low].Color
	}

	// interpolate colors
	p := (adj - a.keypoints[low].Value) / (a.keypoints[high].Value - a.keypoints[low].Value)

	return util.Interpolate(
		a.keypoints[high].Color,
		a.keypoints[low].Color,
		p,
	)
}

// NewArcGradient creates a new, empty gradient
func NewArcGradient(x, y, theta0, theta1, r, width float64) *ArcGradient {
	return &ArcGradient{x: x, y: y, theta0: theta0, theta1: theta1, r: r, t: width,
		iR: r - (width / 2), oR: r + (width / 2)}
}

// AddColorStop from a standard image/color value
func (a *ArcGradient) AddColorStop(value float64, color color.Color) {
	a.keypoints = append(a.keypoints, Keypoint{
		Value: value,
		Color: color,
	})
	sort.Sort(a.keypoints)
}

// GetColor from internal gradient based on adjusted value
func (a *ArcGradient) GetColor(adj float64) color.Color {
	//fmt.Println(adj)
	l := len(a.keypoints)
	foundI := 0
	for ; foundI < l && a.keypoints[foundI].Value <= adj; foundI += 1 {
	}
	if foundI == 0 {
		return a.keypoints[foundI].Color
	}
	if foundI == l {
		return a.keypoints[l-1].Color
	}
	p := (adj - a.keypoints[foundI-1].Value) / (a.keypoints[foundI].Value - a.keypoints[foundI-1].Value)
	//v := uint8(255*p);
	//println(foundI)
	return util.Interpolate(
		a.keypoints[foundI].Color,
		a.keypoints[foundI-1].Color,
		p,
	)
}

// AddColorStopHex uses a hex code to add color a stop
func (a *ArcGradient) AddColorStopHex(value float64, color string) {
	col, _ := colorx.ParseHexColor(color)
	a.keypoints = append(a.keypoints, Keypoint{
		Value: value,
		Color: col,
	})
	sort.Sort(a.keypoints)
}

// Normalize the values in the internal array to 0 - 1
func (a *ArcGradient) Normalize() {
	var max float64 = math.Inf(-1)
	for _, key := range a.keypoints {
		if key.Value > max {
			max = key.Value
		}
	}
	var min float64 = a.keypoints[0].Value
	max = max - min
	for i, key := range a.keypoints {
		a.keypoints[i] = Keypoint{
			Value: (key.Value - min) / max,
			Color: key.Color,
		}
	}
}

// Len satisfies the Sort interface.
func (s keypoints) Len() int {
	return len(s)
}

// Less satisfies the Sort interface.
func (s keypoints) Less(i, j int) bool {
	return s[i].Value < s[j].Value
}

// Swap satisfies the Sort interface.
func (s keypoints) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}
