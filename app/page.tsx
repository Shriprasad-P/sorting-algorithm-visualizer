"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Controls } from "@/components/Controls"

type AlgorithmType = "bubble" | "selection" | "insertion" | "merge" | "quick" | "radix" | "bucket"

const ALGORITHMS: { type: AlgorithmType; label: string }[] = [
    { type: "bubble", label: "Bubble Sort" },
    { type: "selection", label: "Selection Sort" },
    { type: "insertion", label: "Insertion Sort" },
    { type: "merge", label: "Merge Sort" },
    { type: "quick", label: "Quick Sort" },
    { type: "radix", label: "Radix Sort" },
    { type: "bucket", label: "Bucket Sort" },
]

export default function AlgorithmVisualizer() {
    const [array, setArray] = useState<number[]>([])
    const [currentAlgo, setCurrentAlgo] = useState<AlgorithmType>("bubble")
    const [comparisons, setComparisons] = useState(0)
    const [swaps, setSwaps] = useState(0)
    const [activeIndices, setActiveIndices] = useState<number[]>([])
    const [sortedIndices, setSortedIndices] = useState<number[]>([])
    const [status, setStatus] = useState("Ready")
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(50)
    const [arraySize, setArraySize] = useState(40)
    const [isCustomMode, setIsCustomMode] = useState(false)

    // Refs for mutable state during async sorting
    const stopSorting = useRef(false)
    const isSorting = useRef(false)
    const paused = useRef(false)

    // Initialize array
    useEffect(() => {
        if (!isCustomMode) {
            resetArray()
        }
    }, [arraySize])

    const resetArray = () => {
        stopSorting.current = true
        isSorting.current = false
        paused.current = false
        setIsPlaying(false)
        setActiveIndices([])
        setSortedIndices([])
        setComparisons(0)
        setSwaps(0)
        setStatus("Ready")

        const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 5)
        setArray(newArray)
    }

    const handleCustomInput = (value: string) => {
        if (!value.trim()) {
            setIsCustomMode(false)
            resetArray()
            return
        }

        setIsCustomMode(true)
        stopSorting.current = true
        isSorting.current = false
        paused.current = false
        setIsPlaying(false)
        setActiveIndices([])
        setSortedIndices([])
        setComparisons(0)
        setSwaps(0)
        setStatus("Custom Input")

        const numbers = value.split(',')
            .map(s => parseInt(s.trim()))
            .filter(n => !isNaN(n))

        if (numbers.length > 0) {
            setArray(numbers)
            // Optional: Update arraySize to match input length, but don't trigger effect
            // setArraySize(numbers.length) 
        }
    }

    const handlePlay = async () => {
        if (isPlaying) {
            // Pause
            paused.current = true
            setIsPlaying(false)
            setStatus("Paused")
        } else {
            // Start or Resume
            paused.current = false
            setIsPlaying(true)
            setStatus("Sorting...")

            if (!isSorting.current) {
                isSorting.current = true
                stopSorting.current = false
                await runAlgorithm()
                isSorting.current = false
                setIsPlaying(false)
                if (!stopSorting.current) {
                    setStatus("Completed")
                    setSortedIndices(Array.from({ length: array.length }, (_, k) => k))
                }
            }
        }
    }

    const handleReset = () => {
        setIsCustomMode(false)
        resetArray()
    }

    const runAlgorithm = async () => {
        const delay = Math.max(1, speed)
        const currentArray = [...array]

        switch (currentAlgo) {
            case "bubble": await bubbleSort(currentArray); break
            case "selection": await selectionSort(currentArray); break
            case "insertion": await insertionSort(currentArray); break
            case "merge": await mergeSortWrapper(currentArray); break
            case "quick": await quickSortWrapper(currentArray); break
            case "radix": await radixSort(currentArray); break
            case "bucket": await bucketSort(currentArray); break
        }
    }

    const checkPause = async () => {
        while (paused.current) {
            await sleep(100)
            if (stopSorting.current) return
        }
    }

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    // --- Sorting Algorithms ---

    const bubbleSort = async (arr: number[]) => {
        const n = arr.length
        const localArr = [...arr]

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (stopSorting.current) return
                await checkPause()

                setActiveIndices([j, j + 1])
                setComparisons((prev) => prev + 1)

                if (localArr[j] > localArr[j + 1]) {
                    const temp = localArr[j]
                    localArr[j] = localArr[j + 1]
                    localArr[j + 1] = temp
                    setArray([...localArr])
                    setSwaps((prev) => prev + 1)
                }
                await sleep(speed)
            }
            if (!stopSorting.current) {
                setSortedIndices((prev) => [...prev, n - 1 - i])
            }
        }
        if (!stopSorting.current) {
            setSortedIndices((prev) => [...prev, 0])
        }
    }

    const selectionSort = async (arr: number[]) => {
        const n = arr.length
        const localArr = [...arr]

        for (let i = 0; i < n; i++) {
            let minIdx = i
            for (let j = i + 1; j < n; j++) {
                if (stopSorting.current) return
                await checkPause()

                setActiveIndices([minIdx, j])
                setComparisons((prev) => prev + 1)

                if (localArr[j] < localArr[minIdx]) {
                    minIdx = j
                }
                await sleep(speed)
            }

            if (minIdx !== i) {
                const temp = localArr[i]
                localArr[i] = localArr[minIdx]
                localArr[minIdx] = temp
                setArray([...localArr])
                setSwaps((prev) => prev + 1)
            }
            if (!stopSorting.current) {
                setSortedIndices((prev) => [...prev, i])
            }
        }
    }

    const insertionSort = async (arr: number[]) => {
        const n = arr.length
        const localArr = [...arr]

        for (let i = 1; i < n; i++) {
            let key = localArr[i]
            let j = i - 1

            while (j >= 0 && localArr[j] > key) {
                if (stopSorting.current) return
                await checkPause()

                setActiveIndices([j, j + 1])
                setComparisons((prev) => prev + 1)

                localArr[j + 1] = localArr[j]
                setArray([...localArr])
                setSwaps((prev) => prev + 1)
                await sleep(speed)
                j = j - 1
            }
            localArr[j + 1] = key
            setArray([...localArr])
        }
    }

    const mergeSortWrapper = async (arr: number[]) => {
        const localArr = [...arr]
        await mergeSort(localArr, 0, localArr.length - 1)
        setArray([...localArr])
    }

    const mergeSort = async (arr: number[], l: number, r: number) => {
        if (l >= r) return
        if (stopSorting.current) return

        const m = l + Math.floor((r - l) / 2)
        await mergeSort(arr, l, m)
        await mergeSort(arr, m + 1, r)
        await merge(arr, l, m, r)
    }

    const merge = async (arr: number[], l: number, m: number, r: number) => {
        const n1 = m - l + 1
        const n2 = r - m
        const L = new Array(n1)
        const R = new Array(n2)

        for (let i = 0; i < n1; i++) L[i] = arr[l + i]
        for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j]

        let i = 0, j = 0, k = l

        while (i < n1 && j < n2) {
            if (stopSorting.current) return
            await checkPause()

            setActiveIndices([l + i, m + 1 + j])
            setComparisons((prev) => prev + 1)

            if (L[i] <= R[j]) {
                arr[k] = L[i]
                i++
            } else {
                arr[k] = R[j]
                j++
            }
            setArray([...arr])
            setSwaps((prev) => prev + 1)
            await sleep(speed)
            k++
        }

        while (i < n1) {
            if (stopSorting.current) return
            await checkPause()
            arr[k] = L[i]
            setArray([...arr])
            await sleep(speed)
            i++
            k++
        }

        while (j < n2) {
            if (stopSorting.current) return
            await checkPause()
            arr[k] = R[j]
            setArray([...arr])
            await sleep(speed)
            j++
            k++
        }
    }

    const quickSortWrapper = async (arr: number[]) => {
        const localArr = [...arr]
        await quickSort(localArr, 0, localArr.length - 1)
        setArray([...localArr])
    }

    const quickSort = async (arr: number[], low: number, high: number) => {
        if (low < high) {
            if (stopSorting.current) return
            const pi = await partition(arr, low, high)
            if (stopSorting.current) return
            await quickSort(arr, low, pi - 1)
            if (stopSorting.current) return
            await quickSort(arr, pi + 1, high)
        }
    }

    const partition = async (arr: number[], low: number, high: number) => {
        const pivot = arr[high]
        let i = low - 1

        for (let j = low; j < high; j++) {
            if (stopSorting.current) return -1
            await checkPause()

            setActiveIndices([j, high])
            setComparisons((prev) => prev + 1)

            if (arr[j] < pivot) {
                i++
                const temp = arr[i]
                arr[i] = arr[j]
                arr[j] = temp
                setArray([...arr])
                setSwaps((prev) => prev + 1)
                await sleep(speed)
            }
        }
        if (stopSorting.current) return -1

        const temp = arr[i + 1]
        arr[i + 1] = arr[high]
        arr[high] = temp
        setArray([...arr])
        setSwaps((prev) => prev + 1)
        await sleep(speed)

        return i + 1
    }

    const radixSort = async (arr: number[]) => {
        const localArr = [...arr]
        const max = Math.max(...localArr)
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            if (stopSorting.current) return
            await countSort(localArr, exp)
        }
        setArray([...localArr])
    }

    const countSort = async (arr: number[], exp: number) => {
        const n = arr.length
        const output = new Array(n).fill(0)
        const count = new Array(10).fill(0)

        for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++
        for (let i = 1; i < 10; i++) count[i] += count[i - 1]

        for (let i = n - 1; i >= 0; i--) {
            if (stopSorting.current) return
            await checkPause()

            setActiveIndices([i])
            output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i]
            count[Math.floor(arr[i] / exp) % 10]--
        }

        for (let i = 0; i < n; i++) {
            if (stopSorting.current) return
            await checkPause()

            arr[i] = output[i]
            setArray([...arr])
            setSwaps((prev) => prev + 1)
            await sleep(speed)
        }
    }

    const bucketSort = async (arr: number[]) => {
        const localArr = [...arr]
        if (localArr.length <= 0) return
        const n = localArr.length
        const maxVal = Math.max(...localArr)
        const minVal = Math.min(...localArr)

        const bucketCount = Math.floor(Math.sqrt(n))
        const buckets: number[][] = Array.from({ length: bucketCount }, () => [])

        for (let i = 0; i < n; i++) {
            if (stopSorting.current) return
            await checkPause()

            setActiveIndices([i])
            const bucketIndex = Math.floor(((localArr[i] - minVal) / (maxVal - minVal + 1)) * bucketCount)
            buckets[bucketIndex].push(localArr[i])
            await sleep(speed / 2)
        }

        let k = 0
        for (let i = 0; i < buckets.length; i++) {
            buckets[i].sort((a, b) => {
                setComparisons(prev => prev + 1)
                return a - b
            })

            for (let j = 0; j < buckets[i].length; j++) {
                if (stopSorting.current) return
                await checkPause()

                localArr[k] = buckets[i][j]
                setActiveIndices([k])
                setArray([...localArr])
                setSwaps(prev => prev + 1)
                await sleep(speed)
                k++
            }
        }
        setArray([...localArr])
    }

    const maxVal = Math.max(...array, array.length > 0 ? 1 : 100)

    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-destructive">
                        Algorithm Visualizer
                    </h1>
                    <p className="text-muted-foreground">
                        Interactive visualization of sorting algorithms
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-border bg-card/50 backdrop-blur-md overflow-hidden relative min-h-[400px] flex flex-col">
                            <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <Badge variant="outline" className="text-sm px-3 py-1 border-primary/50 text-primary">
                                        {status}
                                    </Badge>
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-destructive"></span>
                                            <span>Comparisons: <span className="text-foreground font-mono">{comparisons}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                                            <span>Swaps: <span className="text-foreground font-mono">{swaps}</span></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex items-end justify-center gap-[2px] w-full h-full min-h-[300px]">
                                    <AnimatePresence>
                                        {array.map((value, index) => (
                                            <motion.div
                                                key={index}
                                                layout
                                                className={`flex-1 rounded-t-sm transition-colors duration-100 ${activeIndices.includes(index)
                                                    ? "bg-destructive glow-destructive z-10"
                                                    : sortedIndices.includes(index)
                                                        ? "bg-primary glow-primary"
                                                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                                                    }`}
                                                style={{
                                                    height: `${(value / maxVal) * 100}%`,
                                                    boxShadow: activeIndices.includes(index) ? "0 0 15px var(--destructive)" : "none"
                                                }}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </CardContent>
                        </Card>

                        <Controls
                            onPlay={handlePlay}
                            onPause={handlePlay}
                            onReset={handleReset}
                            isPlaying={isPlaying}
                            speed={speed}
                            setSpeed={setSpeed}
                            arraySize={arraySize}
                            setArraySize={setArraySize}
                            isSorting={isSorting.current}
                            algorithms={ALGORITHMS}
                            currentAlgo={currentAlgo}
                            onAlgoChange={(val) => {
                                if (!isSorting.current) {
                                    setCurrentAlgo(val as AlgorithmType)
                                    if (!isCustomMode) resetArray()
                                }
                            }}
                            onCustomInput={handleCustomInput}
                        />
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-card/50 backdrop-blur-md border-border">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-4 text-primary">Algorithm Details</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                    {ALGORITHMS.find(a => a.type === currentAlgo)?.label === "Bubble Sort" && "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."}
                                    {ALGORITHMS.find(a => a.type === currentAlgo)?.label === "Selection Sort" && "Divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items that occupy the rest of the list."}
                                    {ALGORITHMS.find(a => a.type === currentAlgo)?.label === "Insertion Sort" && "Builds the final sorted array (or list) one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort."}
                                    {ALGORITHMS.find(a => a.type === currentAlgo)?.label === "Merge Sort" && "Divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves."}
                                    {ALGORITHMS.find(a => a.type === currentAlgo)?.label === "Quick Sort" && "Divide and conquer algorithm that picks an element as pivot and partitions the given array around the picked pivot."}
                                    {ALGORITHMS.find(a => a.type === currentAlgo)?.label === "Radix Sort" && "Non-comparative sorting algorithm that avoids comparison by creating and distributing elements into buckets according to their radix."}
                                    {ALGORITHMS.find(a => a.type === currentAlgo)?.label === "Bucket Sort" && "Distribution sort algorithm that works by distributing the elements of an array into a number of buckets. Each bucket is then sorted individually."}
                                </p>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm text-foreground">Time Complexity</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between p-2 rounded bg-muted/30">
                                            <span className="text-muted-foreground">Best Case</span>
                                            <span className="font-mono text-primary">
                                                {currentAlgo === "bubble" || currentAlgo === "insertion" ? "O(n)" :
                                                    currentAlgo === "quick" || currentAlgo === "merge" || currentAlgo === "bucket" ? "O(n log n)" :
                                                        currentAlgo === "radix" ? "O(nk)" : "O(n²)"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between p-2 rounded bg-muted/30">
                                            <span className="text-muted-foreground">Average Case</span>
                                            <span className="font-mono text-primary">
                                                {currentAlgo === "quick" || currentAlgo === "merge" || currentAlgo === "bucket" ? "O(n log n)" :
                                                    currentAlgo === "radix" ? "O(nk)" : "O(n²)"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between p-2 rounded bg-muted/30">
                                            <span className="text-muted-foreground">Worst Case</span>
                                            <span className="font-mono text-destructive">
                                                {currentAlgo === "merge" ? "O(n log n)" :
                                                    currentAlgo === "radix" ? "O(nk)" : "O(n²)"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
