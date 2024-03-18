import {Pane} from 'tweakpane'

class Properties {
    constructor() {
        this.pane = new Pane({
            title: 'Parameters',
            expanded: true
        })

        this.initDebug()
    }

    lightDirectionX = 0
    lightDirectionY = -1
    lightDirectionZ = -1
    lightDiffuse = 0.5
    translateZ = -1.5

   initDebug() {
        this.pane.addBinding(this, 'lightDirectionX', {
            min: -2,
            max: 2
        })
        this.pane.addBinding(this, 'lightDirectionY', {
            min: -2,
            max: 2
        })
        this.pane.addBinding(this, 'lightDirectionZ', {
            min: -2,
            max: 2
        })
        this.pane.addBinding(this, 'lightDiffuse', {
            min: 0,
            max: 1
        })
        this.pane.addBinding(this, 'translateZ', {
            min: -10,
            max: 2
        })
    }
}

export default new Properties()
