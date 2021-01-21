package util

import "math"

func GetTheta(x, y int, offset float64) float64 {
	// map x and y to an offset coordinate space
	x = x - int(x)
	y = (y - int(y)) * -1

	// calculate angle of x,y pos
	var theta float64
	theta = math.Atan2(float64(y), float64(x))

	// don't even ask what this does, funny magic to handle values over pi*2/less than pi*2
	if theta < 0 {
		theta = (math.Pi * 2) + theta
	}
	theta = math.Pi*2 - theta
	theta = theta - offset
	if theta < 0 {
		theta = (math.Pi * 2) + theta
	} else if theta > math.Pi*2 {
		theta = theta - math.Pi*2
	}

	return theta
}
