

<script setup>
import { onMounted, watch } from 'vue'

const props = defineProps({
  map: Object,
  points: Array, // array of { lat: number, lng: number }
})

let overlay = null

onMounted(() => {
  if (!props.map || !window.google) return

  class CanvasOverlay extends window.google.maps.OverlayView {
    constructor() {
      super()
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')
    }

    onAdd() {
      const panes = this.getPanes()
      panes.overlayLayer.appendChild(this.canvas)
    }

    draw() {
      const projection = this.getProjection()
    //   const bounds = this.map.getBounds()
    //   const ne = bounds.getNorthEast()
    //   const sw = bounds.getSouthWest()

      const div = this.canvas
      const mapDiv = this.map.getDiv()

      // Kích thước canvas bằng kích thước bản đồ
      div.style.position = 'absolute'
      div.width = mapDiv.offsetWidth
      div.height = mapDiv.offsetHeight

      this.ctx.clearRect(0, 0, div.width, div.height)

      props.points.forEach(point => {
        const latLng = new window.google.maps.LatLng(point.lat, point.lng)
        const pixel = projection.fromLatLngToDivPixel(latLng)
        this.ctx.beginPath()
        this.ctx.arc(pixel.x, pixel.y, 2, 0, 2 * Math.PI)
        this.ctx.fillStyle = 'red'
        this.ctx.fill()
      })
    }

    onRemove() {
      this.canvas.parentNode.removeChild(this.canvas)
    }
  }

  overlay = new CanvasOverlay()
  overlay.setMap(props.map)
})

watch(() => props.points, () => {
  if (overlay) overlay.draw()
})
</script>
