<template>
  <div class="notfound">
    <img
      src="@/assets/img/notfound.png"
      width="100%"
      height="100%"
      alt="ss_logo"
    />
    <button @click="goHome">홈으로 돌아가기</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/home');
}
</script>
<style lang="scss" scoped>
.notfound {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
  img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 600px;
    height: 600px;
  }
  button {
    display: flex;
    padding: 0.75rem 1.5rem;
    color: white;
    background: rgb(66, 16, 218);
    border-radius: 1rem;
  }
}
</style>
