package structs

import (
	"image/color"
)

// ArcGradientTransform represents a Pattern that draws a sweep gradient, applying a transformation function as well.
type ArcGradientTransform struct {
	Transform func(float64) float64
	Max, Min  float64
	ArcGradient
}

// NewTransArcGradient creates a new, empty gradient
func NewTransArcGradient(x, y, theta0, theta1, r, width float64, f func(float64) float64) *ArcGradientTransform {
	return &ArcGradientTransform{
		Transform: f,
		ArcGradient: ArcGradient{
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

// GetColor from internal gradient based on adjusted value
func (a *ArcGradientTransform) GetColor(value float64) color.Color {
	value = (a.Transform(value) - a.Min) / (a.Max - a.Min)
	return a.ArcGradient.GetColor(value)
}

// Normalize the values in the internal array to 0 - 1
func (a *ArcGradientTransform) Normalize() {
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
