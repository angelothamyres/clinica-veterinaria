<template>
  <div class="login-page">
    <div class="login-wrapper">
      <div class="login-brand">
        <div class="logo-circle">🐾</div>
        <h1>Bichos Amigos</h1>
        <p>
          Sistema inteligente para agendamento e gestão da clínica veterinária.
        </p>

        <div class="brand-cards">
          <div class="mini-card">
            <span>💜</span>
            <div>
              <strong>Atendimento rápido</strong>
              <p>Agende consultas com facilidade</p>
            </div>
          </div>

          <div class="mini-card">
            <span>💚</span>
            <div>
              <strong>Controle completo</strong>
              <p>Gerencie consultas e pacientes</p>
            </div>
          </div>
        </div>
      </div>

      <div class="login-card">
        <div class="login-header">
          <p class="welcome">Bem-vindo de volta</p>
          <h2>Conecte-se</h2>
          <span>Acesse sua conta para continuar</span>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <label>E-mail</label>
            <input v-model="email" type="email" placeholder="Digite seu e-mail" required />
          </div>

          <div class="input-group">
            <label>Senha</label>
            <input v-model="password" type="password" placeholder="Digite sua senha" required />
          </div>

          <button type="submit" class="login-btn">Entrar</button>
        </form>

        <p v-if="message" class="message">{{ message }}</p>

        <div class="divider">
          <span>ou</span>
        </div>

        <router-link to="/register" class="register-link">
          Criar conta
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const email = ref('')
const password = ref('')
const message = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))

    if (response.data.user.role === 'secretario') {
      router.push('/admin')
    } else {
      router.push('/schedule')
    }
  } catch (error) {
    message.value = error.response?.data?.message || 'Erro ao fazer login.'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(124, 58, 237, 0.18), transparent 30%),
    radial-gradient(circle at bottom right, rgba(22, 163, 74, 0.18), transparent 30%),
    linear-gradient(135deg, #f7f4ff 0%, #f0fdf4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
}

.login-wrapper {
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.10);
}

.login-brand {
  padding: 56px 46px;
  background: linear-gradient(160deg, #6d28d9 0%, #7c3aed 45%, #16a34a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-circle {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  margin-bottom: 20px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
}

.login-brand h1 {
  font-size: 42px;
  margin: 0 0 12px;
  line-height: 1.1;
}

.login-brand > p {
  font-size: 17px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.92);
  max-width: 420px;
  margin-bottom: 28px;
}

.brand-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
}

.mini-card {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.mini-card span {
  font-size: 22px;
}

.mini-card strong {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
}

.mini-card p {
  margin: 0;
  font-size: 14px;
  color: rgba(255,255,255,0.88);
}

.login-card {
  background: rgba(255, 255, 255, 0.92);
  padding: 56px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-header {
  margin-bottom: 24px;
}

.welcome {
  color: #16a34a;
  font-weight: 700;
  margin: 0 0 8px;
  font-size: 15px;
}

.login-header h2 {
  margin: 0;
  font-size: 42px;
  color: #4c1d95;
  line-height: 1.1;
}

.login-header span {
  display: inline-block;
  margin-top: 10px;
  color: #6b7280;
  font-size: 15px;
}

form {
  margin-top: 10px;
}

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #374151;
}

.input-group input {
  width: 100%;
  padding: 15px 16px;
  border-radius: 16px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 15px;
  transition: 0.2s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.12);
}

.login-btn {
  width: 100%;
  margin-top: 8px;
  padding: 15px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(90deg, #7c3aed 0%, #16a34a 100%);
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 10px 20px rgba(109, 40, 217, 0.22);
}

.login-btn:hover {
  transform: translateY(-1px);
}

.message {
  margin-top: 14px;
  color: #b91c1c;
  font-size: 14px;
  font-weight: 600;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0 16px;
  color: #9ca3af;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.register-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  padding: 14px;
  border-radius: 16px;
  border: 1.5px solid #d1d5db;
  color: #6d28d9;
  font-weight: 700;
  transition: 0.2s ease;
}

.register-link:hover {
  border-color: #7c3aed;
  background: #faf5ff;
}

@media (max-width: 900px) {
  .login-wrapper {
    grid-template-columns: 1fr;
  }

  .login-brand {
    padding: 36px 28px;
  }

  .login-card {
    padding: 36px 26px;
  }

  .login-brand h1,
  .login-header h2 {
    font-size: 32px;
  }
}
</style>