package structs

import (
	"WeatherCanvas/util"
	"image/color"
)

type Keypoint struct {
	Value float64
	Color color.Color
}

func findIndexesKeypoint(arr []Keypoint, toFind float64) (int, int) {
	alen := len(arr)

	getV := func(i int) float64 {
		return arr[i].Value
	}

	return util.FindIndexes(getV, alen, toFind)
}
