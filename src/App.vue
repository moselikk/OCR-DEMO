<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { doOcr } from './utils/ocr.js'

const wrapper = ref<HTMLDivElement>()
const videoEl = ref<HTMLVideoElement>()
const facingMode = ref<any>('user')
const facingModeValue = ref<String>('前置')
const img = ref()

async function checkCamera() {
  const navigator = window.navigator.mediaDevices
  const devices = await navigator.enumerateDevices()
  if (devices) {
    const stream = await navigator.getUserMedia({
      audio: false,
      video: {
        width: 400,
        height: 600,
        // facingMode: { exact: "environment" }, //强制后置摄像头
        facingMode: facingMode.value //前置摄像头
      }
    })
    if (!videoEl.value) return

    videoEl.value.srcObject = stream
    videoEl.value.play()
    setRect()
  }
}

function setRect() {
  if (!wrapper.value) return
  const canvas = document.createElement('canvas')
  canvas.classList.add('mark-rect')
  canvas.width = 300
  canvas.height = 100

  //拿到 canvas 上下文对象
  const ctx = canvas.getContext('2d')
  // ctx?.arc(100, 100, 100, 0, Math.PI * 2, false);
  // ctx?.rect(0, 0, 300, 100);
  if (ctx) {
    ctx.strokeStyle = 'green'
    ctx.strokeRect(0, 0, 300, 100)
    wrapper.value.appendChild(canvas)
  }
}

function shoot() {
  if (!videoEl.value || !wrapper.value) return
  const canvas = document.createElement('canvas')
  canvas.classList.add('canvas-img')
  canvas.width = videoEl.value.videoWidth
  canvas.height = videoEl.value.videoHeight
  //拿到 canvas 上下文对象
  const ctx = canvas.getContext('2d')
  ctx?.rect(50, 400, 300, 100)
  ctx?.fill()
  // 将上面的区域作为剪辑区域
  ctx?.clip()
  ctx?.drawImage(videoEl.value, 0, 0, canvas.width, canvas.height)
  wrapper.value.appendChild(canvas)
  img.value = canvas.toDataURL('image/jpeg')
}

function selectCamera(flag: String) {
  switch (flag) {
    case 'font':
      facingMode.value = 'user'
      facingModeValue.value = '前置'
      break
    case 'back':
      facingMode.value = { exact: 'environment' }
      facingModeValue.value = '后置'
      break
    default:
      facingMode.value = 'user'
      facingModeValue.value = '前置'
  }
  checkCamera()
}

const ocrText = ref('')
const handleRecognition = async () => {
  ocrText.value = '识别中'
  ocrText.value = await doOcr(img.value)
  console.log(ocrText.value)
}

onMounted(() => {
  checkCamera()
})
</script>
<template>
  <button @click="selectCamera('font')">前置</button>
  <button @click="selectCamera('back')">后置</button>
  <span>当前为{{ facingModeValue }}摄像头</span>

  <div ref="wrapper" class="wrapper">
    <video ref="videoEl" />
    <div @click="shoot" class="">拍摄</div>
    <div @click="handleRecognition" class="">识别</div>
    <span>{{ ocrText }}</span>
  </div>
</template>
<style>
.wrapper {
  position: relative;
}
.mark-rect {
  position: absolute;
  top: 400px;
  right: 50px;
}
.canvas-img {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
