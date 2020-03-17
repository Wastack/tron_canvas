
import { Size } from "utils.js"

export class GameMap {
    canvas: HTMLCanvasElement
    map_size: Size = { width: 0, height: 0 }
    screen_size: Size = { width: 0, height: 0 }
    unit_size: number = 0
    h_padding: number = 0
    w_padding: number = 0

    constructor(screenSize: Size, mapSize: Size) {
        this.canvas = document.getElementById("mycanvas") as HTMLCanvasElement
        if (!this.canvas.getContext) {
            alert("HTML5 canvas is not supported by your browser!");
        }
        this.prepareMap(screenSize, mapSize)
    }

    /**
     * Prepares game map
     * @param screenSize Size of canvas excluding the wall
     * @param mapSize Size of map in game units
     */
    prepareMap(screenSize: Size, mapSize: Size) {
        console.assert(screenSize.width > 0 && screenSize.height > 0 && mapSize.width > 0 && mapSize.height > 0)
        // screen should be bigger than map
        console.assert(screenSize.width > mapSize.width && screenSize.height > mapSize.height)

        this.map_size = mapSize
        this.screen_size = screenSize
        // scale game rectangle units as much as possible
        let w_quotient = Math.floor(screenSize.width / mapSize.width)
        let h_quotient = Math.floor(screenSize.height / mapSize.height)
        this.unit_size = Math.min(w_quotient, h_quotient)

        // Set padding
        let w_required = this.unit_size * mapSize.width
        this.w_padding = Math.floor((screenSize.width - w_required) / 2) + 1
        let h_required = this.unit_size * mapSize.height
        this.h_padding = Math.floor((screenSize.height - h_required) / 2) + 1

        let ctx = this.canvas.getContext('2d')!!
        ctx.fillStyle = 'black'

        // Border is the first thing that is *outside* the map, hence the +1 unit
        ctx.strokeRect(this.w_padding, this.h_padding, w_required + this.unit_size, h_required + this.unit_size)
    }

    /**
     * Draws a block to the given position
     * @param x X coordinate of map in game units
     * @param y Y coordinate of map in game units
     * @param color Color of the block to be drawn in format e.g. "#FF00FF"
     * @returns Whether the drawing was successfull
     */
    drawBlock(x: number, y: number, color: string): boolean {
        console.assert(x > 0 && y > 0 && this.unit_size > 0)

        // check game map borders
        if (x > this.map_size.width || y > this.map_size.height)
            return false

        let ctx = this.canvas.getContext('2d')!!

        ctx.fillStyle = color
        // TODO drawing code here
        ctx.fillRect(x * this.unit_size + this.w_padding, y * this.unit_size + this.h_padding, this.unit_size, this.unit_size)
        return true
    }

    /**
     * Clears the entire map, including its borders (walls).
     */
    clearMap() {
        let ctx = this.canvas.getContext('2d')!!
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.prepareMap(this.screen_size, this.map_size)
    }
}


