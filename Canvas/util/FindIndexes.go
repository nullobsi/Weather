package util

import (
	"fmt"
	"syscall/js"
)

var logV = false

// Returns -1 on 1st if low and -1 on 2nd if high
func FindIndexes(getV func(int) float64, alen int, toFind float64) (int, int) {
	//high/low
	if logV {
		fmt.Print("Find", toFind, "in a", alen, "long array with lowest value", getV(0), "and highest value", getV(alen-1))
	}
	if toFind <= getV(0) {
		if logV {
			fmt.Println(" and value is lowest")
		}
		return -1, 0
	} else if toFind >= getV(alen-1) {
		if logV {
			fmt.Println(" and value is highest")
		}
		return alen - 1, -1
	}
	if logV {
		fmt.Println(" and value is in between")
	}
	// find the low index; that is, one which has a value less than the number to find
	lowI := alen - 1
	for ; getV(lowI) > toFind; lowI-- {
	}
	highI := lowI + 1

	return lowI, highI
}

func FindIndexesArray(arr []float64, toFind float64) (int, int) {
	alen := len(arr)

	getV := func(i int) float64 {
		return arr[i]
	}

	return FindIndexes(getV, alen, toFind)
}

func FindIndexesJS(arr js.Value, toFind float64) (int, int) {
	alen := arr.Length()

	getV := func(i int) float64 {
		return arr.Index(i).Index(0).Float()
	}
	logV = true
	one, two := FindIndexes(getV, alen, toFind)
	logV = false
	return one, two
}
