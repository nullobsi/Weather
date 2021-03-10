package util

// returns the index with the lowest value closest
// find 2 : [0, 2, 3, 5, 7]
//              ^ index 1
// returns -1 if less than i0
// return last index if greater than last
// expects sorted array
func FindLoIndex(val float64, g func(int) float64, l int) int {
	if l == 0 {
		return -1
	}
	if val < g(0) {
		return -1
	}

	for i := l - 1; i >= 0; i-- {
		if g(i) <= val {
			return i
		}
	}
	return -1
}

// returns the index with the highest value closest
// find 2 : [0, 2, 3, 5, 7]
//                 ^ index 2
// returns 0 if less than i0
// return length if higher than last
// expects sorted array
func FindHiIndex(val float64, g func(int) float64, l int) int {
	if l == 0 {
		return 0
	}

	for i := 0; i < l; i++ {
		if val < g(i) {
			return i
		}
	}
	return l
}
