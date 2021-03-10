package main

import (
	"WeatherCanvas/util"
	"image/color"
	"math"
)

type arcGradientTransform struct {
	transform func(float64) float64
	max, min  float64
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
	transMin := a.keypoints[foundI-1].value
	transMax := a.keypoints[foundI].value
	transVal := adj
	p := (transVal - transMin) / (transMax - transMin)
	//fmt.Println(a.min,a.max)

	return util.Interpolate(
		a.keypoints[foundI].color,
		a.keypoints[foundI-1].color,
		p,
	)
}

func NewTransArcGradient(x, y, theta0, theta1, r, width float64, f func(float64) float64) *arcGradientTransform {
	return &arcGradientTransform{
		transform: f,
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
	value = (a.transform(value) - a.min) / (a.max - a.min)
	return a.arcGradient.GetColor(value)
}

func (a *arcGradientTransform) Normalize() {
	var max float64 = a.transform(a.keypoints[len(a.keypoints)-1].value)
	var min float64 = a.transform(a.keypoints[0].value)
	a.min = min
	a.max = max
	max = max - min
	for i, key := range a.keypoints {
		a.keypoints[i] = Keypoint{
			value: (a.transform(key.value) - min) / max,
			color: key.color,
		}
	}
}
