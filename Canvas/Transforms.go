package main

import "math"

func pm25(a float64) float64 {
	return math.Pow(a, 1/2.58496250072)
}
func rainRate(a float64) float64 {
	if a <= 0 {
		return a
	}
	a = math.Log(a * 25.4)
	a *= 8
	a += 5 * math.Log(200)
	a *= 2
	a /= math.Log(10)
	return a
}
