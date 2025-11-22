import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Play, Pause, RotateCcw, Settings2 } from "lucide-react"

interface ControlsProps {
    onPlay: () => void
    onPause: () => void
    onReset: () => void
    isPlaying: boolean
    speed: number
    setSpeed: (value: number) => void
    arraySize: number
    setArraySize: (value: number) => void
    isSorting: boolean
    algorithms: { type: string; label: string }[]
    currentAlgo: string
    onAlgoChange: (value: string) => void
    onCustomInput: (value: string) => void
}

export function Controls({
    onPlay,
    onPause,
    onReset,
    isPlaying,
    speed,
    setSpeed,
    arraySize,
    setArraySize,
    isSorting,
    algorithms,
    currentAlgo,
    onAlgoChange,
    onCustomInput
}: ControlsProps) {
    return (
        <div className="flex flex-col gap-6 p-6 bg-card border border-border rounded-xl shadow-lg glass">
            {/* Top Row: Playback & Algorithm Selection */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex gap-2">
                    {!isPlaying ? (
                        <Button
                            onClick={onPlay}
                            disabled={isSorting && isPlaying}
                            className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,242,255,0.5)]"
                        >
                            <Play className="w-6 h-6 fill-current" />
                        </Button>
                    ) : (
                        <Button
                            onClick={onPause}
                            variant="outline"
                            className="w-12 h-12 rounded-full border-primary text-primary hover:bg-primary/10"
                        >
                            <Pause className="w-6 h-6 fill-current" />
                        </Button>
                    )}

                    <Button
                        onClick={onReset}
                        variant="secondary"
                        className="w-12 h-12 rounded-full hover:bg-secondary/80"
                        disabled={isSorting && isPlaying}
                    >
                        <RotateCcw className="w-5 h-5" />
                    </Button>
                </div>

                <div className="w-full md:w-64">
                    <Select
                        value={currentAlgo}
                        onValueChange={onAlgoChange}
                        disabled={isSorting}
                    >
                        <SelectTrigger className="w-full bg-background/50 border-primary/20">
                            <SelectValue placeholder="Select Algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                            {algorithms.map((algo) => (
                                <SelectItem key={algo.type} value={algo.type}>
                                    {algo.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Middle Row: Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Settings2 className="w-4 h-4" /> Speed
                        </span>
                        <span className="font-mono text-primary">{speed}ms</span>
                    </div>
                    <Slider
                        value={[100 - speed]}
                        min={1}
                        max={99}
                        step={1}
                        onValueChange={(val) => setSpeed(100 - val[0])}
                        className="cursor-pointer"
                        disabled={isSorting}
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Array Size</span>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                value={arraySize}
                                onChange={(e) => setArraySize(Number(e.target.value))}
                                className="w-16 h-6 text-right font-mono text-xs bg-background/50 border-primary/20"
                                min={5}
                                max={100}
                                disabled={isSorting}
                            />
                        </div>
                    </div>
                    <Slider
                        value={[arraySize]}
                        min={5}
                        max={100}
                        step={1}
                        onValueChange={(val) => setArraySize(val[0])}
                        className="cursor-pointer"
                        disabled={isSorting}
                    />
                </div>
            </div>

            {/* Bottom Row: Custom Input */}
            <div className="space-y-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Custom Input</span>
                <Input
                    placeholder="Enter comma-separated numbers (e.g. 10, 45, 2, 99)"
                    onChange={(e) => onCustomInput(e.target.value)}
                    disabled={isSorting}
                    className="bg-background/50 border-primary/20 font-mono text-sm"
                />
            </div>
        </div>
    )
}
