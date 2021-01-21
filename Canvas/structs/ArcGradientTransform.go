package structs

import (
	"image/color"
	"math"
)

type arcGradientTransform struct {
	Transform func(float64) float64
	Max, Min  float64
	arcGradient
}

func (a arcGradientTransform) ColorAt(x, y int) color.Color {
	x = x - int(a.x)
	y = (y - int(a.y)) * -1

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

	l := len(a.keypoints)
	if adj <= a.keypoints[0].Value {
		return a.keypoints[0].Color
	}
	if adj >= a.keypoints[l-1].Value {
		return a.keypoints[l-1].Color
	}
	foundI := 0
	for l1, point := range a.keypoints {
		if point.Value >= adj {
			foundI = l1
			break
		}
	}
	transMin := a.keypoints[foundI-1].Value
	transMax := a.keypoints[foundI].Value
	transVal := adj
	p := (transVal - transMin) / (transMax - transMin)
	//fmt.Println(a.min,a.max)

	return interpolate(
		a.keypoints[foundI].Color,
		a.keypoints[foundI-1].Color,
		p,
	)
}

func NewTransArcGradient(x, y, theta0, theta1, r, width float64, f func(float64) float64) *arcGradientTransform {
	return &arcGradientTransform{
		Transform: f,
		arcGradient: arcGradient{
			x:      x,
			y:      y,
			theta0: theta0,
			theta1: theta1,
			r:      r,
			t:      width,
			iR:     r - (width / 2),
			oR:     r + (width / 2),
		},
	}
}

func (a *arcGradientTransform) GetColor(value float64) color.Color {
	value = (a.Transform(value) - a.Min) / (a.Max - a.Min)
	return a.arcGradient.GetColor(value)
}

func (a *arcGradientTransform) Normalize() {
	var max float64 = a.Transform(a.keypoints[len(a.keypoints)-1].Value)
	var min float64 = a.Transform(a.keypoints[0].Value)
	a.Min = min
	a.Max = max
	max = max - min
	for i, key := range a.keypoints {
		a.keypoints[i] = Keypoint{
			Value: (a.Transform(key.Value) - min) / max,
			Color: key.Color,
		}
	}
}
