<template>
  <nav class="nav">
    <h2>🐾 Bichos Amigos</h2>

    <div class="links">
      <router-link to="/schedule">Consultas</router-link>

      <router-link v-if="isAdmin" to="/admin">Painel Administrativo</router-link>

      <button @click="logout">Sair</button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const user = JSON.parse(localStorage.getItem('user') || '{}')

const isAdmin = computed(() => user.role === 'secretario')

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/'
}
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 28px;
  background: linear-gradient(90deg, #6d28d9, #16a34a);
  color: white;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}

.links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav a {
  color: white;
  text-decoration: none;
  font-weight: 600;
}

button {
  background: white;
  color: #6d28d9;
  border: none;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
}
</style>