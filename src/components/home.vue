<template>
  <div class="background-image" id="back">
    <img src="@/assets/cool-background.png" alt="背景图" class="background-image" />
    <div class="glass-container" id="glass">
      <h1>DataCopilot</h1>
      <p>自然语言查询，无需编写SQL，轻松分析数据</p>
    </div>
  </div>
</template>
<script setup>
</script>

<style scoped>
.glass-container{
    width: 700px;
    height: 375px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border-radius: 10px;
    backdrop-filter: blur(4px);
    background-color: rgba(0,191,255, 0.273);
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px rgba(255,255,255,0.4) solid;
    border-bottom: 1px rgba(40,40,40,0.35) solid;
    border-right: 1px rgba(40,40,40,0.35) solid;
    padding: 0;
}
.background-image {
    width: 100%; /* 设置图片宽度为 100% */
    height: 100%; /* 设置图片高度为 100% */
    object-fit: cover; /* 确保图片铺满容器，但可能会裁剪图片 */
    position: absolute; /* 确保图片不会从容器中溢出 */
    top: 0;
    left: 0;
}
</style>