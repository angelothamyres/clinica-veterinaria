<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Cadastro</h1>
      <p class="subtitle">Crie sua conta para acessar o sistema veterinário</p>

      <form @submit.prevent="handleRegister">
        <input v-model="name" placeholder="Nome completo" required />
        <input v-model="email" type="email" placeholder="E-mail" required />
        <input v-model="password" type="password" placeholder="Senha" required />

        <select v-model="role" required>
          <option value="paciente">Responsável pelo pet</option>
          <option value="secretario">Administrador</option>
        </select>

        <button type="submit">Cadastrar</button>
      </form>

      <p class="message">{{ message }}</p>
      <router-link to="/">Voltar ao login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('paciente')
const message = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value
    })

    message.value = 'Cadastro realizado com sucesso!'
    setTimeout(() => router.push('/'), 1200)
  } catch (error) {
    message.value = error.response?.data?.message || 'Erro ao cadastrar.'
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f3ff, #ecfdf5);
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 430px;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

h1 {
  color: #5b21b6;
  margin-bottom: 6px;
}

.subtitle {
  color: #666;
  margin-bottom: 18px;
}

input, select, button {
  width: 100%;
  margin: 10px 0;
  padding: 13px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  font-size: 15px;
}

input:focus, select:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124,58,237,0.12);
}

button {
  background: linear-gradient(90deg, #7c3aed, #16a34a);
  color: white;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.message {
  margin-top: 12px;
  color: #166534;
}
</style>